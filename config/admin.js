const crypto = require("crypto");

module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "4689a05bb9fd2b60a2a6d60e7149de34"),
    apiToken: { salt: crypto.randomBytes(16).toString("base64") },
  },
});
