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

// src/commands/thread/thread-create.ts
var thread_create_exports = {};
__export(thread_create_exports, {
  command: () => command
});
module.exports = __toCommonJS(thread_create_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/commands/thread/thread-create.ts
var import_discord = require("discord.js");
var command = {
  command: new import_discord.SlashCommandBuilder().setName("thread-create").setDescription("create private channel").addStringOption((option) => option.setName("channel").setDescription("channel name").setRequired(true)),
  execute: async (interaction) => {
    const name = interaction.options.getString("channel");
    await interaction.deferReply({ ephemeral: true });
    const role = await interaction.guild?.roles.fetch(process.env.MEMBER_ID);
    if (role?.members.find((m) => m.id == interaction.user.id)) {
      const channel = await interaction.client.channels.fetch(process.env.THREAD_ID);
      const thread = await channel.threads.create({
        name,
        type: import_discord.ChannelType.PrivateThread
      });
      await thread.members.add(interaction.user.id);
      await prisma.thread.create({
        data: {
          adminId: interaction.user.id,
          name,
          discordId: thread.id
        }
      });
      await interaction.editReply({ content: `${name} \uC774 \uC0DD\uC131 \uB418\uC5C8\uC2B5\uB2C8\uB2E4` });
    } else {
      await interaction.editReply({ content: "\uB2F9\uC2E0\uC740 \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4!" });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  command
});
