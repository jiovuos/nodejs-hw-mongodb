import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    plugins: {},
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"]
  }
]);
