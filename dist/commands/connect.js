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

// src/commands/connect.ts
var connect_exports = {};
__export(connect_exports, {
  command: () => command
});
module.exports = __toCommonJS(connect_exports);
var import_discord = require("discord.js");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/commands/connect.ts
var command = {
  command: new import_discord.SlashCommandBuilder().setName("connect").setDescription("connect discord to vercel").addStringOption((option) => option.setName("email").setDescription("user email").setRequired(true)),
  execute: async (interaction) => {
    const token = Math.random().toString().replace("0.", "");
    const id = interaction.user.id;
    const email = interaction.options.getString("email");
    await interaction.deferReply({ ephemeral: true });
    const user = await prisma.connect.findFirst({
      where: {
        email
      }
    });
    interaction.editReply({ content: process.env.API_URL });
    if (user) {
      interaction.editReply({ content: "\uC774\uBBF8 \uC5F0\uACB0\uB418\uC5C8\uC2B5\uB2C8\uB2E4" });
    } else {
      await prisma.provid.create({
        data: {
          token,
          email,
          discordId: id
        }
      });
      const res = await fetch(`${process.env.API_URL}/api/discord/provid`, {
        method: "POST",
        body: JSON.stringify({
          token,
          id,
          email
        })
      }).then(async (res2) => await res2.json());
      if ("error" in res) {
        await prisma.provid.delete({
          where: {
            token
          }
        });
        interaction.editReply({ content: res.error });
      } else {
        interaction.editReply({ content: "\uC774\uBA54\uC77C\uC774 \uC804\uC1A1\uB418 \uC5C8\uC2B5\uB2C8\uB2E4" });
      }
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  command
});
