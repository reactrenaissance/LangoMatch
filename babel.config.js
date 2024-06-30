module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@frontend": "./src/frontend",
            "@backend": "./src/backend",
            "@assets": "./assets",
          },
        },
      ],
    ],
  };
};
