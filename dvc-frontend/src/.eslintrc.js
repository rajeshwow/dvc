module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "import", "unused-imports"],
  rules: {
    "no-unused-vars": "warn",
    "react/prop-types": "off",
    "react/jsx-no-undef": "error",
    "react/jsx-uses-react": "off", // Turn off since React 17+ doesn't need it
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-vars": "error",
    "unused-imports/no-unused-imports": "warn",
    "react/no-unescaped-entities": "off",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "import/no-unresolved": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
