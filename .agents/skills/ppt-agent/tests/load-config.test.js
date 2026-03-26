"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { loadRawConfig, getT2IModelConfig } = require("../scripts/lib/load-config");

function makeTempSkillDir(files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-agent-config-"));
  for (const [name, content] of Object.entries(files)) {
    const filePath = path.join(dir, name);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }
  return dir;
}

test("loadRawConfig returns empty object when config.yaml is missing", () => {
  const dir = makeTempSkillDir();
  assert.deepEqual(loadRawConfig({ skillDir: dir, env: {} }), {});
});

test("getT2IModelConfig returns null when t2i_model is absent", () => {
  const dir = makeTempSkillDir({
    "config.yaml": "{}",
    ".env": ""
  });
  assert.equal(getT2IModelConfig({ skillDir: dir, env: {} }), null);
});

test("getT2IModelConfig parses a valid t2i_model config", () => {
  const dir = makeTempSkillDir({
    "config.yaml": [
      "t2i_model:",
      "  base_url: \"https://provider.example/v1\"",
      "  model: \"provider/image-model\"",
      "  api_key_env: \"T2I_API_KEY\"",
      "  modalities: [\"image\"]",
      "  image_config:",
      "    aspect_ratio: \"16:9\"",
      "    image_size: \"1K\""
    ].join("\n")
  });

  const cfg = getT2IModelConfig({
    skillDir: dir,
    env: { T2I_API_KEY: "test-key" }
  });

  assert.equal(cfg.baseUrl, "https://provider.example/v1");
  assert.equal(cfg.model, "provider/image-model");
  assert.equal(cfg.apiKey, "test-key");
  assert.deepEqual(cfg.modalities, ["image"]);
  assert.deepEqual(cfg.imageConfig, { aspect_ratio: "16:9", image_size: "1K" });
});

test("getT2IModelConfig rejects unsupported non-t2i slots", () => {
  const dir = makeTempSkillDir({
    "config.yaml": [
      "t2i_model:",
      "  base_url: \"https://provider.example/v1\"",
      "  model: \"provider/image-model\"",
      "vision_model:",
      "  base_url: \"https://bad.example/v1\"",
      "  model: \"bad/model\""
    ].join("\n")
  });

  assert.throws(
    () => loadRawConfig({ skillDir: dir, env: { T2I_API_KEY: "test-key" } }),
    /Unsupported config slot "vision_model"/
  );
});

test("getT2IModelConfig rejects malformed t2i_model config", () => {
  const dir = makeTempSkillDir({
    "config.yaml": [
      "t2i_model:",
      "  base_url: \"https://provider.example/v1\""
    ].join("\n")
  });

  assert.throws(
    () => getT2IModelConfig({ skillDir: dir, env: { T2I_API_KEY: "test-key" } }),
    /Missing required field\(s\): model/
  );
});
