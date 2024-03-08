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

// src/deploy-commands.ts
var deploy_commands_exports = {};
__export(deploy_commands_exports, {
  deploy: () => deploy
});
module.exports = __toCommonJS(deploy_commands_exports);
var import_discord = require("discord.js");

// src/functions.ts
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

// src/deploy-commands.ts
var import_dotenv = require("dotenv");
(0, import_dotenv.config)();
async function deploy() {
  const {
    TOKEN,
    CLIENT_ID
  } = process.env;
  if (typeof TOKEN != "string")
    throw Error("token is not defined");
  if (typeof CLIENT_ID != "string")
    throw Error("client id is not defined");
  const rest = new import_discord.REST().setToken(TOKEN);
  const commands = [];
  await (async () => {
    await executeFile("/commands", (file) => {
      const command = file.command;
      if ("command" in command && typeof command.execute == "function") {
        commands.push(command.command.toJSON());
      } else {
        throw Error(" not include command or execute");
      }
    });
  })();
  await (async () => {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(
      import_discord.Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  })();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deploy
});
