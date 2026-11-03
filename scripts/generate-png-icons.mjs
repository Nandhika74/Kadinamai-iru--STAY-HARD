import fs from 'node:fs';
import zlib from 'node:zlib';

// Function to generate a standard PNG using built-in Node zlib
function createGradientPNG(width, height, isMaskable = false) {
  // RGBA buffer
  // Format for PNG raw scanlines: each line starts with 1 filter byte (0 = None), followed by width * 4 bytes
  const bytesPerPixel = 4;
  const lineLength = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(height * lineLength);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.32 : 0.36);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * lineLength;
    rawData[rowOffset] = 0; // Filter type: None

    const ny = y / height;

    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;

      // Base gradient: Blush Pink (#FCE7F0) to Lavender (#DCD6F7)
      let r = Math.round(252 + (220 - 252) * (nx * 0.5 + ny * 0.5));
      let g = Math.round(231 + (214 - 231) * (nx * 0.5 + ny * 0.5));
      let b = Math.round(240 + (247 - 240) * (nx * 0.5 + ny * 0.5));
      let a = 255;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Inner circular emblem
      if (dist < radius) {
        // Inner white circle
        r = 255;
        g = 255;
        b = 255;

        // Draw "K" letter / glyph
        const kx = (x - cx) / radius; // -1 to 1
        const ky = (y - cy) / radius; // -1 to 1

        // Stem: kx between -0.42 and -0.22, ky between -0.55 and 0.55
        const isStem = kx >= -0.42 && kx <= -0.22 && ky >= -0.55 && ky <= 0.55;

        // Top arm: diagonal from (-0.22, -0.05) to (0.42, -0.55)
        const d1 = Math.abs((ky - (-0.05)) - (-1.1) * (kx - (-0.22)));
        const isTopArm = d1 < 0.18 && kx >= -0.25 && kx <= 0.42 && ky <= 0.05 && ky >= -0.58;

        // Bottom arm: diagonal from (-0.15, -0.05) to (0.42, 0.55)
        const d2 = Math.abs((ky - (-0.05)) - 1.1 * (kx - (-0.15)));
        const isBottomArm = d2 < 0.18 && kx >= -0.18 && kx <= 0.42 && ky >= -0.1 && ky <= 0.58;

        if (isStem || isTopArm || isBottomArm) {
          // Deep purple: #7663B8
          r = 118;
          g = 99;
          b = 184;
        }

        // Top right sparkle accent
        const sdx = x - (cx + radius * 0.42);
        const sdy = y - (cy - radius * 0.55);
        if (Math.sqrt(sdx * sdx + sdy * sdy) < radius * 0.1) {
          r = 255; // Pink accent #FF7597
          g = 117;
          b = 151;
        }
      } else if (dist < radius + 3) {
        // Subtle border around circle
        r = 220;
        g = 214;
        b = 247;
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Deflate raw scanlines
  const compressedData = zlib.deflateSync(rawData, { level: 9 });

  // Build PNG chunks
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = calcCrc(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function calcCrc(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Generate all required PWA icons
fs.mkdirSync('public', { recursive: true });

fs.writeFileSync('public/pwa-192x192.png', createGradientPNG(192, 192, false));
fs.writeFileSync('public/pwa-512x512.png', createGradientPNG(512, 512, false));
fs.writeFileSync('public/pwa-maskable-512x512.png', createGradientPNG(512, 512, true));
fs.writeFileSync('public/apple-touch-icon.png', createGradientPNG(180, 180, false));

console.log('All PWA PNG icons generated successfully in public/');
