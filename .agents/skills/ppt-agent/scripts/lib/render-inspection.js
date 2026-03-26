"use strict";

const fs = require("fs");
const path = require("path");

function inspectRenderedSlides(renderDir, renderedSlides = []) {
  const validSlides = [];
  const recoverableErrors = [];
  for (const name of renderedSlides) {
    const filePath = path.join(renderDir, name);
    try {
      const metadata = readImageMetadata(filePath);
      validateImageMetadata(metadata, name);
      validSlides.push({
        name,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      });
    } catch (error) {
      recoverableErrors.push({
        slide: slideNumberFromName(name),
        file: name,
        dimension: "render_inspection",
        reason: error.message
      });
    }
  }

  return {
    valid_count: validSlides.length,
    invalid_count: recoverableErrors.length,
    valid_slides: validSlides,
    recoverable_errors: recoverableErrors
  };
}

function readImageMetadata(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (isPng(buffer)) {
    return {
      format: "png",
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  }
  if (isJpeg(buffer)) {
    return { format: "jpeg", ...readJpegDimensions(buffer) };
  }
  throw new Error(`Unsupported render image format in ${path.basename(filePath)}`);
}

function validateImageMetadata(metadata, name) {
  if (!metadata.width || !metadata.height) {
    throw new Error(`Render ${name} is missing image dimensions.`);
  }
  if (metadata.width < 16 || metadata.height < 9) {
    throw new Error(`Render ${name} is too small to inspect reliably.`);
  }
  const ratio = Number((metadata.width / metadata.height).toFixed(2));
  if (Math.abs(ratio - 1.78) > 0.2) {
    throw new Error(`Render ${name} does not match the expected widescreen aspect ratio.`);
  }
}

function isPng(buffer) {
  return buffer.length > 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
}

function isJpeg(buffer) {
  return buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8;
}

function readJpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const size = buffer.readUInt16BE(offset + 2);
    if (isStartOfFrame(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      };
    }
    offset += 2 + size;
  }
  throw new Error("JPEG render is missing a readable frame header.");
}

function isStartOfFrame(marker) {
  return marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
}

function slideNumberFromName(name) {
  const match = String(name).match(/slide-(\d+)/i);
  return match ? Number(match[1]) : null;
}

module.exports = {
  inspectRenderedSlides
};
