// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
  },
  optimize: {
    bundle: false,
    minify: true,
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    polyfillNode: true,
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
