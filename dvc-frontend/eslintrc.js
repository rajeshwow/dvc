module.exports = {
  extends: ["react-app", "plugin:react-hooks/recommended"],
  rules: {
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off", // if using TypeScript or not using prop-types
    "import/no-anonymous-default-export": "off", // optional, if it bothers you
  },
};
