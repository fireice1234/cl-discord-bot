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

// src/commands/thread/thread-delete.ts
var thread_delete_exports = {};
__export(thread_delete_exports, {
  command: () => command
});
module.exports = __toCommonJS(thread_delete_exports);
var import_discord = require("discord.js");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/commands/thread/thread-delete.ts
var command = {
  command: new import_discord.SlashCommandBuilder().setName("thread-delete").setDescription("create private channel").addChannelOption((option) => option.setName("thread").setDescription("thread").setRequired(true)),
  execute: async (interaction) => {
    const thread = interaction.options.getChannel("thread");
    const threadData = await prisma.thread.findFirst({
      where: {
        name: thread.name
      }
    });
    const role = interaction.member?.roles;
    if (threadData && (interaction.user.id === threadData?.adminId || role.cache.has(process.env.OBSERVER_ID))) {
      await interaction.deferReply({ ephemeral: true });
      const channel = await interaction.client.channels.fetch(process.env.THREAD_ID);
      const threadChannel = channel.threads.cache.find((x) => x.id === thread?.id);
      await prisma.thread.delete({
        where: {
          id: threadData?.id
        }
      });
      await interaction.editReply(`${thread?.name} \uC774\uAC00 \uC131\uACF5\uC801\uC73C\uB85C \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`);
      await threadChannel?.delete();
    } else {
      interaction.reply({ content: `${thread?.name} \uC774\uAC00 \uC4F0\uB808\uB4DC\uAC00 \uC544\uB2C8\uAC70\uB098 \uB2F9\uC2E0\uC758 \uC18C\uC720\uAC00 \uC544\uB2D9\uB2C8\uB2E4`, ephemeral: true });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  command
});
