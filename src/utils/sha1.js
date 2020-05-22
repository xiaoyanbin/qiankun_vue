const Crypto = require('./crypto.js');

(function () {
  // Shortcut
  const { util } = Crypto;

  // Public API
  var SHA1 = Crypto.SHA1 = function (message, options) {
    const digestbytes = util.wordsToBytes(SHA1._sha1(message));
    return options && options.asBytes ? digestbytes
      : options && options.asString ? util.bytesToString(digestbytes)
        : util.bytesToHex(digestbytes);
  };

  // The core
  SHA1._sha1 = function (message) {
    const m = util.stringToWords(message);
    const l = message.length * 8;
    const w = [];
    let H0 = 1732584193;
    let H1 = -271733879;
    let H2 = -1732584194;
    let H3 = 271733878;
    let H4 = -1009589776;

    // Padding
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >>> 9) << 4) + 15] = l;

    for (let i = 0; i < m.length; i += 16) {
      const a = H0;
      const b = H1;
      const c = H2;
      const d = H3;
      const e = H4;

      for (let j = 0; j < 80; j++) {
        if (j < 16) w[j] = m[i + j];
        else {
          const n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
          w[j] = (n << 1) | (n >>> 31);
        }

        const t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
          j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249
            : j < 40 ? (H1 ^ H2 ^ H3) + 1859775393
              : j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588
                : (H1 ^ H2 ^ H3) - 899497514);

        H4 = H3;
        H3 = H2;
        H2 = (H1 << 30) | (H1 >>> 2);
        H1 = H0;
        H0 = t;
      }

      H0 += a;
      H1 += b;
      H2 += c;
      H3 += d;
      H4 += e;
    }

    return [H0, H1, H2, H3, H4];
  };

  // Package private blocksize
  SHA1._blocksize = 16;
}());

module.exports = Crypto;
