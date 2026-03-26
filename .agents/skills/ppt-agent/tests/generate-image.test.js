"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  buildImageRequestBody,
  extractImagePayload,
  generateImageWithRetry,
  saveImagePayload,
  saveBase64Image
} = require("../scripts/generate-image");

test("buildImageRequestBody applies prompt and image overrides", () => {
  const body = buildImageRequestBody(
    {
      model: "provider/image-model",
      modalities: ["image"],
      imageConfig: { aspect_ratio: "4:3", image_size: "0.5K" }
    },
    "hello",
    "16:9",
    "1K"
  );

  assert.equal(body.model, "provider/image-model");
  assert.deepEqual(body.messages, [{ role: "user", content: "hello" }]);
  assert.deepEqual(body.modalities, ["image"]);
  assert.deepEqual(body.image_config, { aspect_ratio: "16:9", image_size: "1K" });
});

test("extractImagePayload returns the first provider image url", () => {
  const payload = extractImagePayload({
    model: "provider/image-model",
    choices: [
      {
        message: {
          images: [
            { image_url: { url: "data:image/png;base64,Zm9v" } }
          ]
        }
      }
    ]
  });

  assert.equal(payload, "data:image/png;base64,Zm9v");
});

test("generateImageWithRetry retries provider failures", async () => {
  let calls = 0;
  const fakeFetch = async () => {
    calls += 1;
    if (calls < 3) {
      return {
        ok: false,
        status: 500,
        text: async () => JSON.stringify({ error: "temporary" })
      };
    }
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        model: "provider/image-model",
        choices: [
          {
            message: {
              images: [
                { image_url: { url: "data:image/png;base64,Zm9v" } }
              ]
            }
          }
        ]
      })
    };
  };

  const payload = await generateImageWithRetry(
    {
      baseUrl: "https://provider.example/v1",
      model: "provider/image-model",
      apiKey: "secret",
      modalities: ["image"],
      imageConfig: {}
    },
    "hello",
    "16:9",
    "1K",
    3,
    fakeFetch
  );

  assert.equal(calls, 3);
  assert.equal(payload, "data:image/png;base64,Zm9v");
});

test("saveBase64Image writes decoded binary data", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-image-"));
  const output = path.join(dir, "image.png");

  saveBase64Image("data:image/png;base64,Zm9v", output);

  assert.equal(fs.readFileSync(output).toString("utf8"), "foo");
});

test("saveImagePayload downloads provider-hosted image URLs before writing output", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-image-url-"));
  const output = path.join(dir, "image.png");
  let requestedUrl = null;

  await saveImagePayload(
    "https://provider.example/generated/image.png",
    output,
    async (url) => {
      requestedUrl = url;
      return {
        ok: true,
        arrayBuffer: async () => Buffer.from("hosted-image")
      };
    }
  );

  assert.equal(requestedUrl, "https://provider.example/generated/image.png");
  assert.equal(fs.readFileSync(output, "utf8"), "hosted-image");
});
