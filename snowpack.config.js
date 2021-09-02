// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
  },
  optimize: {
    minify: true,
    bundle: true,
    sourcemap: false,
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
  exclude: [ 
    "**/client/network/stress-test.js",
    "**/build/**",
    "**/node_modules/**"
  ]
};
