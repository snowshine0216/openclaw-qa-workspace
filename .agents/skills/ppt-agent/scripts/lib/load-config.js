"use strict";

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const yaml = require("js-yaml");

const SKILL_DIR = path.resolve(__dirname, "..", "..");
const ALLOWED_SLOTS = new Set(["t2i_model"]);
const FORBIDDEN_SLOTS = [
  "vision_model",
  "long_context_model",
  "eval_model",
  "research_agent",
  "design_agent"
];

function loadEnv(skillDir, env = process.env) {
  const envPath = path.join(skillDir, ".env");
  if (!fs.existsSync(envPath)) {
    return env;
  }

  const parsed = dotenv.parse(fs.readFileSync(envPath, "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (env[key] === undefined) {
      env[key] = value;
    }
  }
  return env;
}

function loadRawConfig({ skillDir = SKILL_DIR, env = process.env } = {}) {
  loadEnv(skillDir, env);
  const configPath = path.join(skillDir, "config.yaml");
  if (!fs.existsSync(configPath)) {
    return {};
  }

  const raw = yaml.load(fs.readFileSync(configPath, "utf8")) || {};
  for (const key of Object.keys(raw)) {
    if (!ALLOWED_SLOTS.has(key)) {
      throw new Error(
        `[ppt-agent] Unsupported config slot "${key}". Only "t2i_model" is allowed in Phase 1.`
      );
    }
  }
  return raw;
}

function resolveApiKey(slotConfig, env = process.env) {
  const envVar = slotConfig.api_key_env || "T2I_API_KEY";
  if (env[envVar]) {
    return env[envVar];
  }
  if (slotConfig.api_key) {
    return slotConfig.api_key;
  }
  throw new Error(
    `[ppt-agent] Missing API key for t2i_model. Set ${envVar} in .env or provide api_key in config.yaml.`
  );
}

function getT2IModelConfig({ skillDir = SKILL_DIR, env = process.env } = {}) {
  const rawConfig = loadRawConfig({ skillDir, env });
  const slotConfig = rawConfig.t2i_model;
  if (!slotConfig) {
    return null;
  }

  for (const forbidden of FORBIDDEN_SLOTS) {
    if (rawConfig[forbidden]) {
      throw new Error(
        `[ppt-agent] Unsupported config slot "${forbidden}". Only t2i_model is supported in Phase 1.`
      );
    }
  }

  const missing = [];
  if (!slotConfig.base_url) missing.push("base_url");
  if (!slotConfig.model) missing.push("model");
  if (missing.length > 0) {
    throw new Error(
      `[ppt-agent] Invalid t2i_model config. Missing required field(s): ${missing.join(", ")}.`
    );
  }

  return {
    baseUrl: slotConfig.base_url,
    model: slotConfig.model,
    apiKey: resolveApiKey(slotConfig, env),
    modalities: slotConfig.modalities || ["image"],
    imageConfig: slotConfig.image_config || {},
    apiKeyEnv: slotConfig.api_key_env || "T2I_API_KEY"
  };
}

module.exports = {
  SKILL_DIR,
  loadRawConfig,
  getT2IModelConfig
};
