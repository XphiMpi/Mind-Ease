// scripts/generate_icons.js
import fs from "fs";
import path from "path";
import zlib from "zlib";

function createPNG(width, height, pixelFn) {
  const rowSize = width * 4;
  const rawData = Buffer.alloc(height * (rowSize + 1));

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);

    // Compute CRC32
    let crc = 0 ^ -1;
    const combined = Buffer.concat([typeBuf, data]);
    for (let i = 0; i < combined.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ combined[i]) & 0xff];
    }
    crc = (crc ^ -1) >>> 0;
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Precompute CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c >>> 0;
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflated),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Function to draw purple water droplet icon
function drawDroplet(x, y, w, h, isRound = false) {
  const cx = w / 2;
  const cy = h / 2;

  // Normalized coordinates (-1 to 1)
  const nx = (x - cx) / (w * 0.44);
  const ny = (y - cy) / (h * 0.44);
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Background circle for launcher icon
  let bgR = 250,
    bgG = 248,
    bgB = 254,
    bgA = 255; // #FAF8FE

  // Check if inside app rounded background
  if (isRound) {
    if (dist > 1.0) return [0, 0, 0, 0];
  } else {
    // Squircle / rounded rect border radius
    const absX = Math.abs((x - cx) / (w * 0.46));
    const absY = Math.abs((y - cy) / (h * 0.46));
    const rad = Math.pow(absX, 4) + Math.pow(absY, 4);
    if (rad > 1.0) return [0, 0, 0, 0];
  }

  // Droplet shape:
  // Center of bottom bulb at (0, 0.22) with radius 0.46
  // Top tip at (0, -0.68)
  const bulbY = 0.18;
  const dx = nx;
  const dy = ny - bulbY;
  const bulbDist = Math.sqrt(dx * dx + dy * dy);

  // Cone section from tip to bulb
  const tipY = -0.65;
  const inBulb = bulbDist <= 0.48;
  const inCone =
    ny < bulbY &&
    ny >= tipY &&
    Math.abs(nx) <= (0.44 * (ny - tipY)) / (bulbY - tipY);

  if (inBulb || inCone) {
    // Purple Water Droplet Gradient (#9B7BDC to #6A4EA7)
    const t = (ny + 0.6) / 1.3;
    const r = Math.round(155 * (1 - t) + 106 * t);
    const g = Math.round(123 * (1 - t) + 78 * t);
    const b = Math.round(220 * (1 - t) + 167 * t);

    // Inner shine reflection
    const shineX = nx - -0.16;
    const shineY = ny - 0.05;
    const shineDist = Math.sqrt(shineX * shineX + shineY * shineY);
    if (shineDist < 0.22 && nx < -0.04) {
      return [255, 255, 255, 230];
    }

    return [r, g, b, 255];
  }

  return [bgR, bgG, bgB, bgA];
}

// Sizes for Android mipmaps
const targets = [
  { folder: "mipmap-mdpi", size: 48 },
  { folder: "mipmap-hdpi", size: 72 },
  { folder: "mipmap-xhdpi", size: 96 },
  { folder: "mipmap-xxhdpi", size: 144 },
  { folder: "mipmap-xxxhdpi", size: 192 },
];

const resDir = path.resolve("android/app/src/main/res");

targets.forEach(({ folder, size }) => {
  const dir = path.join(resDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Standard icon
  const standardBuf = createPNG(size, size, (x, y, w, h) =>
    drawDroplet(x, y, w, h, false),
  );
  fs.writeFileSync(path.join(dir, "ic_launcher.png"), standardBuf);

  // Round icon
  const roundBuf = createPNG(size, size, (x, y, w, h) =>
    drawDroplet(x, y, w, h, true),
  );
  fs.writeFileSync(path.join(dir, "ic_launcher_round.png"), roundBuf);

  // Foreground icon (transparent background)
  const fgBuf = createPNG(size, size, (x, y, w, h) => {
    const cx = w / 2,
      cy = h / 2;
    const nx = (x - cx) / (w * 0.44);
    const ny = (y - cy) / (h * 0.44);
    const bulbY = 0.18;
    const dx = nx;
    const dy = ny - bulbY;
    const bulbDist = Math.sqrt(dx * dx + dy * dy);
    const tipY = -0.65;
    const inBulb = bulbDist <= 0.48;
    const inCone =
      ny < bulbY &&
      ny >= tipY &&
      Math.abs(nx) <= (0.44 * (ny - tipY)) / (bulbY - tipY);

    if (inBulb || inCone) {
      const t = (ny + 0.6) / 1.3;
      const r = Math.round(155 * (1 - t) + 106 * t);
      const g = Math.round(123 * (1 - t) + 78 * t);
      const b = Math.round(220 * (1 - t) + 167 * t);
      const shineX = nx - -0.16;
      const shineY = ny - 0.05;
      const shineDist = Math.sqrt(shineX * shineX + shineY * shineY);
      if (shineDist < 0.22 && nx < -0.04) {
        return [255, 255, 255, 230];
      }
      return [r, g, b, 255];
    }
    return [0, 0, 0, 0];
  });
  fs.writeFileSync(path.join(dir, "ic_launcher_foreground.png"), fgBuf);
});

// Also create web public favicon/icon
const publicDir = path.resolve("public");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
const webIconBuf = createPNG(192, 192, (x, y, w, h) =>
  drawDroplet(x, y, w, h, true),
);
fs.writeFileSync(path.join(publicDir, "logo.png"), webIconBuf);

console.log("Successfully generated all MindEase purple water droplet icons!");
