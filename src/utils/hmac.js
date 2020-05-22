const Crypto = require('./crypto.js');

(function () {
  // Shortcut
  const { util } = Crypto;

  Crypto.HMAC = function (hasher, message, key, options) {
    // Allow arbitrary length keys
    key = key.length > hasher._blocksize * 4
      ? hasher(key, { asBytes: true })
      : util.stringToBytes(key);

    // XOR keys with pad constants
    const okey = key;
    const ikey = key.slice(0);
    for (let i = 0; i < hasher._blocksize * 4; i++) {
      okey[i] ^= 0x5C;
      ikey[i] ^= 0x36;
    }

    const hmacbytes = hasher(util.bytesToString(okey)
      + hasher(util.bytesToString(ikey) + message, { asString: true }),
    { asBytes: true });
    return options && options.asBytes ? hmacbytes
      : options && options.asString ? util.bytesToString(hmacbytes)
        : util.bytesToHex(hmacbytes);
  };
}());

module.exports = Crypto;
