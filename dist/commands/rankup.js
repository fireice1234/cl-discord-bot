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

// src/commands/rankup.ts
var rankup_exports = {};
__export(rankup_exports, {
  command: () => command
});
module.exports = __toCommonJS(rankup_exports);
var import_discord = require("discord.js");
var command = {
  command: new import_discord.SlashCommandBuilder().setName("rankup").setDescription("rankup").addStringOption((option) => option.setName("email").setDescription("user email").setRequired(true)),
  execute: async (interaction) => {
    const email = interaction.options.getString("email");
    const user = await fetch(`${process.env.SERVER_URL}/api/rankup?email=${email}`).then(async (res) => await res.json());
    if ("error" in user) {
      interaction.reply({
        content: "[Error] " + user.error
      });
    } else {
      interaction.reply({
        content: "[Message] " + user.message
      });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  command
});
