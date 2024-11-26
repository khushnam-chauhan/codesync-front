module.exports = {
    extends: [
      "react-app",
      "react-app/jest"
    ],
    rules: {
      "react-hooks/exhaustive-deps": "warn", // Change to warn instead of error
      "jsx-a11y/anchor-is-valid": "warn" // Change to warn
    }
  };