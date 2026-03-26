#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { getT2IModelConfig } = require("./lib/load-config");

/**
 * generate-image.js
 *
 * This script generates images from text prompts using a configured T2I model.
 *
 * Note: For generate_new image decisions, the prompt should be derived from
 * an image meta prompt artifact (artifacts/image-prompts/slide-XX.md) created
 * by the image-meta-prompt.js module. This script receives the final prompt
 * string and does not generate meta prompts itself.
 */

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i++;
  }
  return args;
}

function buildImageRequestBody(cfg, prompt, aspectOverride, sizeOverride) {
  const imageConfig = {
    ...cfg.imageConfig,
    ...(aspectOverride ? { aspect_ratio: aspectOverride } : {}),
    ...(sizeOverride ? { image_size: sizeOverride } : {})
  };

  return {
    model: cfg.model,
    messages: [{ role: "user", content: prompt }],
    modalities: cfg.modalities || ["image"],
    ...(Object.keys(imageConfig).length > 0 ? { image_config: imageConfig } : {}),
    stream: false
  };
}

async function postJson(url, apiKey, body, fetchImpl = fetch) {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const rawText = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new Error(`Non-JSON response from image provider: ${rawText}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${rawText}`);
  }

  return parsed;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function extractImagePayload(result) {
  const images = result?.choices?.[0]?.message?.images || [];
  if (images.length === 0) {
    throw new Error(
      `No images in response. Ensure model "${result?.model || "unknown"}" supports image output.`
    );
  }
  const first = images[0];
  const imageUrl = first?.image_url?.url || first?.imageUrl?.url;
  if (!imageUrl) {
    throw new Error(`Cannot extract image payload from provider response.`);
  }
  return imageUrl;
}

async function generateImageWithRetry(cfg, prompt, aspectOverride, sizeOverride, maxRetries, fetchImpl = fetch) {
  const body = buildImageRequestBody(cfg, prompt, aspectOverride, sizeOverride);
  const url = `${cfg.baseUrl.replace(/\/$/, "")}/chat/completions`;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await postJson(url, cfg.apiKey, body, fetchImpl);
      return extractImagePayload(result);
    } catch (err) {
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 500;
        process.stderr.write(`[generate-image] Attempt ${attempt} failed: ${err.message}. Retrying in ${delay}ms...\n`);
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
}

function saveBase64Image(dataUrl, outputPath) {
  const base64Match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
  if (base64Match) {
    const buffer = Buffer.from(base64Match[1], "base64");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    return;
  }
  // Plain base64 without data URL prefix
  const buffer = Buffer.from(dataUrl, "base64");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);
}

async function saveImagePayload(payload, outputPath, fetchImpl = fetch) {
  if (/^https?:\/\//i.test(String(payload || ""))) {
    const response = await fetchImpl(payload);
    if (!response.ok) {
      throw new Error(`Image download failed: HTTP ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    return;
  }

  saveBase64Image(payload, outputPath);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.prompt || !args.output) {
    process.stderr.write(
      "Usage: node generate-image.js --prompt \"...\" --output path.png [--aspect \"16:9\"] [--size \"1K\"] [--retries 3]\n"
    );
    process.exit(1);
  }

  const maxRetries = parseInt(args.retries || "3", 10);
  const cfg = getT2IModelConfig();
  if (!cfg) {
    throw new Error(
      "t2i_model is not configured. Phase 1 create mode can run without image generation, but generate-image.js requires config.yaml with t2i_model."
    );
  }

  process.stderr.write(`[generate-image] Generating image with model: ${cfg.model}\n`);
  process.stderr.write(`[generate-image] Prompt: ${args.prompt.slice(0, 80)}${args.prompt.length > 80 ? "..." : ""}\n`);

  const imageUrl = await generateImageWithRetry(cfg, args.prompt, args.aspect, args.size, maxRetries);
  await saveImagePayload(imageUrl, args.output);

  process.stderr.write(`[generate-image] Saved to: ${args.output}\n`);
  process.stdout.write(args.output + "\n");
}

module.exports = {
  parseArgs,
  buildImageRequestBody,
  extractImagePayload,
  generateImageWithRetry,
  saveImagePayload,
  saveBase64Image,
  main
};

if (require.main === module) {
  main().catch((err) => {
    process.stderr.write(`[generate-image] Error: ${err.message}\n`);
    process.exit(1);
  });
}
