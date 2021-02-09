const fs = require("fs-extra");
const concat = require("concat");

(async function build() {
  const files = [
    "./dist/mc-api-widgets/polyfills.js",
    "./dist/mc-api-widgets/main.js",
  ];

  await fs.ensureDir("elements");
  await concat(files, "./elements/marketcheck-widgets.v1.0.js");
})();
