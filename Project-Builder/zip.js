/* ============================================================
   LearnJS — zip.js (Project-Builder)
   Dependency-free ZIP writer.

   Produces a valid ZIP archive using the STORE method (no
   compression) with UTF-8 file names — exactly what the Project
   Builder needs to export its small text-file workspaces, and
   readable by every OS unzip tool (Windows Explorer, macOS
   Archive Utility, Python zipfile, 7-Zip, ...).

   Pure functions only — no DOM, no fetch — so this module can
   also be exercised directly in Node for correctness testing.
   ============================================================ */

let CRC_TABLE = null;

function ensureTable() {
  if (CRC_TABLE) return;
  CRC_TABLE = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    CRC_TABLE[i] = c >>> 0;
  }
}

/** CRC-32 (IEEE) of a byte array, returned as an unsigned 32-bit int. */
export function crc32(data) {
  ensureTable();
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** Pack a Date into the MS-DOS time/date fields used by ZIP. */
function dosDateTime(d) {
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const date =
    ((Math.max(d.getFullYear(), 1980) - 1980) << 9) |
    ((d.getMonth() + 1) << 5) |
    d.getDate();
  return { time: time & 0xffff, date: date & 0xffff };
}

/**
 * Build a ZIP archive from a flat virtual-file-system map.
 *
 * @param {Object<string, string|Uint8Array>} fileMap
 *        "path/to/file.ext" -> content. String values are UTF-8 encoded;
 *        Uint8Array values are written verbatim (used for binary assets
 *        exported from data URIs). Keys ending in "/" are treated as
 *        directory entries (so empty folders survive the round trip);
 *        parent directories of files are added automatically.
 * @returns {Uint8Array} the complete ZIP archive bytes.
 */
export function createZip(fileMap) {
  const encoder = new TextEncoder();
  const now = new Date();
  const { time, date } = dosDateTime(now);

  // ---- Collect entries: explicit dirs + files + implied parent dirs ----
  const dirs = new Set();
  const files = [];
  for (const path of Object.keys(fileMap || {})) {
    if (path.charAt(path.length - 1) === "/") {
      dirs.add(path.replace(/\/+$/, "") + "/");
      continue;
    }
    const raw = fileMap[path];
    files.push({
      name: path,
      data: raw instanceof Uint8Array ? raw : encoder.encode(String(raw == null ? "" : raw))
    });
    let parent = path.indexOf("/") === -1 ? "" : path.slice(0, path.lastIndexOf("/"));
    while (parent) {
      dirs.add(parent + "/");
      const idx = parent.lastIndexOf("/");
      parent = idx === -1 ? "" : parent.slice(0, idx);
    }
  }

  const entries = [];
  for (const dir of dirs) entries.push({ name: dir, data: null });
  for (const f of files) entries.push(f);
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  // ---- Pre-encode names + sizes so we can size the buffer exactly ----
  const prepared = entries.map((e) => {
    const name = encoder.encode(e.name);
    const data = e.data;
    return {
      name,
      data,
      crc: data ? crc32(data) : 0,
      size: data ? data.length : 0
    };
  });

  const localBytes = prepared.reduce((sum, e) => sum + 30 + e.name.length + e.size, 0);
  const centralBytes = prepared.reduce((sum, e) => sum + 46 + e.name.length, 0);
  const out = new Uint8Array(localBytes + centralBytes + 22);

  const view = new DataView(out.buffer);
  let offset = 0;
  const u16 = (v) => {
    view.setUint16(offset, v, true);
    offset += 2;
  };
  const u32 = (v) => {
    view.setUint32(offset, v, true);
    offset += 4;
  };
  const bytes = (b) => {
    out.set(b, offset);
    offset += b.length;
  };

  // ---- Local file headers + data ----
  const centralOffsets = [];
  for (const e of prepared) {
    centralOffsets.push(offset);
    u32(0x04034b50); // local file header signature
    u16(20); // version needed to extract
    u16(0x0800); // general purpose bit 11: UTF-8 names
    u16(0); // compression method: store
    u16(time);
    u16(date);
    u32(e.crc);
    u32(e.size); // compressed size
    u32(e.size); // uncompressed size
    u16(e.name.length);
    u16(0); // extra field length
    bytes(e.name);
    if (e.data) bytes(e.data);
  }

  // ---- Central directory ----
  const centralStart = offset;
  prepared.forEach((e, i) => {
    u32(0x02014b50); // central directory signature
    u16(0x0014); // version made by (MS-DOS, 2.0)
    u16(20); // version needed to extract
    u16(0x0800); // UTF-8 names
    u16(0); // store
    u16(time);
    u16(date);
    u32(e.crc);
    u32(e.size);
    u32(e.size);
    u16(e.name.length);
    u16(0); // extra length
    u16(0); // comment length
    u16(0); // disk number start
    u16(0); // internal attributes
    u32(e.data ? 0 : 0x10); // external attrs: DOS directory bit for folders
    u32(centralOffsets[i]);
    bytes(e.name);
  });
  const centralSize = offset - centralStart;

  // ---- End of central directory ----
  u32(0x06054b50); // EOCD signature
  u16(0); // disk number
  u16(0); // disk with central directory
  u16(prepared.length); // entries on this disk
  u16(prepared.length); // total entries
  u32(centralSize);
  u32(centralStart);
  u16(0); // comment length

  return out;
}
// end of zip.js
