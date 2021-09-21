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
    '@snowpack/plugin-react-refresh',
  ],
  alias: {
    client: "./client",
    game: "./client/game",
    input: "./client/game/input/input.js",
    ui: "./client/ui",
    shared: "./shared",
  },
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
    "**/stress-test.js",
    "**/index.js",
    "**/server/**",
    "**/build/**",
    "**/node_modules/**"
  ]
};
