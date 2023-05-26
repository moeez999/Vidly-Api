const config = require("config");
module.exports = function (process) {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwt private key not found");
  }
};
