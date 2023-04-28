import injectProcessEnv from "rollup-plugin-inject-process-env";

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

import builtins from "builtin-modules";

import dotenv from "dotenv";

dotenv.config({ path: "./.envrc" });

const { CHAIN_ID } = process.env;

export default {
  input: "src/handler.ts",
  output: {
    file: "lib/handler.js",
    format: "cjs",
    exports: "auto",
  },
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    json({ compact: true }),
    typescript(),
    injectProcessEnv({
      CHAIN_ID,
    }),
  ],
  external: [...builtins],
};
