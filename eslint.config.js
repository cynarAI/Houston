import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", ".cursor/**"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Blob: "readonly",
        Buffer: "readonly",
        Intl: "readonly",
        fetch: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: react,
      "react-hooks": reactHooks,
    },
    rules: {
      // Basic JS/TS rules
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,

      // React specific
      "react/react-in-jsx-scope": "off",

      // TypeScript specific
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-undef": "off",

      // Relaxed rules for legacy code / quick deployment
      "no-unreachable": "warn",
      "no-constant-binary-expression": "warn",

      // React Hooks - Downgraded to Warn
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",

      // Disable specific annoying rules if necessary
      "no-empty": "warn",
      "no-case-declarations": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
