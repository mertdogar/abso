const { Abso } = require("./abso")

const abso = new Abso()

module.exports = {
  abso,
  ...require("./abso"),
  ...require("./types"),
  ...require("./providers/openai"),
}

// For backwards compatibility with ESM
module.exports.default = module.exports
