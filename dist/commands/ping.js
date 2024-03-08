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

// src/commands/ping.ts
var ping_exports = {};
__export(ping_exports, {
  command: () => command
});
module.exports = __toCommonJS(ping_exports);
var import_discord = require("discord.js");
var command = {
  command: new import_discord.SlashCommandBuilder().setName("ping").setDescription("show ping xzz"),
  execute: async (interaction) => {
    interaction.reply({
      embeds: [
        new import_discord.EmbedBuilder().setAuthor({ name: "ME" }).setDescription(`\u{1F3D3} Pong! 
 \u{1F4E1} Ping: ${interaction.client.ws.ping}`)
      ]
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  command
});
