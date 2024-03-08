"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/functions.ts
var functions_exports = {};
__export(functions_exports, {
  executeFile: () => executeFile
});
module.exports = __toCommonJS(functions_exports);
var import_fs = require("fs");
var import_path = require("path");
var executeFile = async (path, func) => {
  const files = (0, import_fs.readdirSync)(__dirname + path);
  for (const file of files) {
    const filePath = (0, import_path.join)(__dirname + path, file);
    if ((0, import_fs.statSync)(filePath).isDirectory()) {
      await executeFile(`${path}/${file}`, func);
    } else if (file.endsWith(".js") && !file.startsWith("__")) {
      const file2 = await require(filePath);
      func(file2);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  executeFile
});
