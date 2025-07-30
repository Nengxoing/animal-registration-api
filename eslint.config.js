module.exports = [
  {
    files: ["src/**/*.ts"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/logs/**",
      "**/.trunk/**",
      "**/swagger-output.json",
      "src/api/**/swagger.ts",
    ],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      indent: ["error", 2, { SwitchCase: 1 }],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "linebreak-style": ["error", "unix"],
      "prefer-const": "error",
      "key-spacing": [
        "error",
        {
          beforeColon: false,
          afterColon: true,
        },
      ],
      "object-curly-spacing": ["error", "always"],
      "arrow-parens": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "no-unused-vars": "error",
      "block-spacing": ["error", "always"],
      "no-else-return": "error",
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 1,
        },
      ],
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
      "one-var-declaration-per-line": ["error", "always"],
      "operator-assignment": ["error", "always"],
      "max-lines-per-function": [
        "error",
        {
          max: 150,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-depth": ["error", 2],
      "max-lines": ["error", 350],
      "max-nested-callbacks": ["error", 1],
      "max-params": ["error", { max: 3 }],
      "max-statements-per-line": [
        "error",
        {
          max: 1,
        },
      ],
      "no-magic-numbers": [
        "error",
        {
          detectObjects: false,
          enforceConst: true,
          ignore: [-1, 0, 1, 2, 10, 100],
          ignoreArrayIndexes: true,
        },
      ],
      complexity: [
        "error",
        {
          max: 20,
        },
      ],
      curly: ["error", "all"],
      "no-console": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/comma-dangle": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "space-before-function-paren": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "no-public",
          overrides: {
            parameterProperties: "explicit",
          },
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          format: ["camelCase", "PascalCase"],
          selector: "default",
          filter: {
            regex: "^(Accept-Language|Content-Type)$",
            match: false,
          },
        },
        {
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "forbid",
          selector: "variable",
        },
        {
          selector: "property",
          format: null,
          leadingUnderscore: "allow",
        },
        {
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          selector: "variable",
          modifiers: ["const"],
        },
        {
          format: ["camelCase"],
          leadingUnderscore: "allow",
          selector: "parameter",
        },
        {
          format: ["PascalCase"],
          selector: "typeLike",
        },
        {
          selector: "function",
          format: ["PascalCase", "camelCase"],
        },
        {
          format: ["PascalCase"],
          prefix: ["T", "K"],
          selector: "typeParameter",
        },
        {
          format: ["UPPER_CASE"],
          selector: "enumMember",
        },
      ],
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-useless-constructor": "error",
    },
  },
];
