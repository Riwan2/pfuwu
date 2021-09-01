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
    "**/src/client/stress-test.js",
    "**/build/**",
    "**/node_modules/**"
  ]
};
