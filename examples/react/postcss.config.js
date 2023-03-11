module.exports = {
  plugins: [
    ["postcss-bud", {
      rootSelector: "#root",
      comment: {
        ignorePrev: "忽视本行",
      },
    }],
  ],
};