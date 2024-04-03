const path = require("path");

module.exports = {
  entry: "./dist/ts/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "usher.js",
    globalObject: "this",
    library: {
      name: "Usher",
      type: "umd",
    },
  },
  mode: "production",
};
