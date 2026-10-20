import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  { ignores: [".next*/**", "node_modules/**", "out/**", "build/**", "dist/**", ".vercel/**", "public/**", "next-env.d.ts", "admin-dashboard/**", "scratch/**", "notus/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { files: ["scripts/**/*.cjs", "scripts/**/*.js", "tests/**/*.mjs"], rules: { "@typescript-eslint/no-require-imports": "off" } },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "react/jsx-no-comment-textnodes": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "error",
    }
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "admin-dashboard/**",
      "scratch/**",
      "notus/**",
    ]
  }
];

export default eslintConfig;
