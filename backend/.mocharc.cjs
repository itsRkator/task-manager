module.exports = {
  require: ["@babel/register"], // Enable Babel transpiling
  spec: "src/tests/**/*.test.js", // Specify test files
  timeout: 5000, // Test timeout
};
