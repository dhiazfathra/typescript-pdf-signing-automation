import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["dist/*"],
  },
  ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ),
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2019,
      sourceType: "module",
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
