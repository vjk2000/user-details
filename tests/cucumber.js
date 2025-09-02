module.exports = {
  default: {
    require: [
      "tests/steps/**/*.js",   // load step definitions
      "tests/support/**/*.js"  // hooks
    ],
    paths: ["tests/features/**/*.feature"], // location of .feature files
    publishQuiet: true
  }
};
