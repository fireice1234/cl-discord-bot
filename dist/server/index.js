"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/index.ts
var server_exports = {};
__export(server_exports, {
  run: () => run
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"));

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/index.ts
var import_discord = require("discord.js");
var import_dotenv = require("dotenv");

// src/functions.ts
var import_fs = require("fs");
var import_path = require("path");
var executeFile = async (path2, func) => {
  const files = (0, import_fs.readdirSync)(__dirname + path2);
  for (const file of files) {
    const filePath = (0, import_path.join)(__dirname + path2, file);
    if ((0, import_fs.statSync)(filePath).isDirectory()) {
      await executeFile(`${path2}/${file}`, func);
    } else if (file.endsWith(".js") && !file.startsWith("__")) {
      const file2 = await require(filePath);
      func(file2);
    }
  }
};

// src/index.ts
(0, import_dotenv.config)();
var client = new import_discord.Client({
  intents: []
});
client.commands = new import_discord.Collection();
var login = async (token) => {
  if (typeof token != "string") {
    throw Error("env not include TOKEN or TOKEN type is not string now type is : " + typeof token);
  }
  await executeFile("/commands", (file) => {
    const command = file.command;
    if ("command" in command && "execute" in command) {
      client.commands.set(command.command.name, command);
    } else {
      throw Error("requred command and execute");
    }
  });
  await executeFile("/events", (file) => {
    const event = file.event;
    if (typeof event?.once == "boolean" && event?.once) {
      client.once(event.name, event.execute);
    } else {
      client.on(event.name, event.execute);
    }
  });
  client.login(token);
};
login(process.env.TOKEN).then(() => {
  run();
});

// src/server/index.ts
var import_path2 = __toESM(require("path"));
var app = (0, import_express.default)();
var port = 3030;
var dirPath = __dirname.replace("/dist", "");
app.use(import_express.default.json());
app.get("/", (req, res) => {
  res.send("discord api endpoint!");
});
app.use("/api/connect", async (req, res) => {
  const { token, userId } = req.query;
  const provid = await prisma.provid.findFirst({
    where: {
      token: String(token)
    }
  });
  if (provid) {
    const { email, discordId } = provid;
    await prisma.connect.create({
      data: {
        userId: String(userId),
        email,
        discordId
      }
    });
    await prisma.provid.delete({
      where: {
        token: String(token)
      }
    });
    const message = await fetch(`${process.env.SERVER_URL}/api/rankup?email=${email}`, { method: "PATCH" }).then(async (res2) => await res2.json());
    if ("error" in message) {
      client.users.send(discordId, message.error);
      res.sendFile(import_path2.default.join(dirPath, "/html/server/fail.html"));
    } else {
      client.users.send(discordId, message.message);
      res.sendFile(import_path2.default.join(dirPath, "/html/server/success.html"));
    }
  } else {
    res.sendFile(import_path2.default.join(dirPath, "/html/server/fail.html"));
  }
});
app.patch("/api/rankup", async (req, res) => {
  const { email } = req.query;
  const user = await fetch(`${process.env.API_URL}/api/users?email=${email}`).then(async (r) => await r.json());
  if (!("error" in user)) {
    const connect = await prisma.connect.findFirst({
      where: {
        email: user.email
      }
    });
    if (connect) {
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      const member = await guild.members.fetch(connect.discordId);
      const channel = await guild.channels.fetch(process.env.THREAD_ID);
      let roleName = "cl";
      if (user.rank == "person") {
        res.json({
          error: "\uBBF8\uAD6C\uD604 \uAE30\uB2A5"
        });
      } else if (user.rank === "member") {
        const memberRole = await guild.roles.fetch(process.env.MEMBER_ID);
        await member.roles.add(memberRole);
        console.log("member");
        roleName = memberRole?.name;
      } else if (user.rank === "observer") {
        const observerRole = await guild.roles.fetch(process.env.OBSERVER_ID);
        await member.roles.add(observerRole);
        roleName = observerRole?.name;
      } else if (user.rank === "admin") {
        res.json({
          error: "\uAD00\uB9AC\uC790\uB294 \uC9C1\uC811 \uD560\uB2F9\uD574\uC57C \uD569\uB2C8\uB2E4"
        });
      }
      if (roleName === "cl") {
        res.json({
          error: "\uC720\uC800\uC758 \uB7AD\uD06C\uAC00 \uC870\uAE08 \uC774\uC0C1\uD55C\uB370\uC694..?"
        });
      } else {
        await channel.send(`${member.user.username}\uB2D8\uC774 ${roleName}\uC5ED\uD560\uC744 \uBD80\uC5EC\uBC1B\uC558\uC2B5\uB2C8\uB2E4.`);
        res.json({
          message: `\uC720\uC800\uAC00 \uB514\uC2A4\uCF54\uB4DC\uC5D0\uC11C ${roleName} \uC5ED\uD560\uC744 \uBD80\uC5EC\uBC1B\uC558\uC2B5\uB2C8\uB2E4!`
        });
      }
    } else {
      res.json({
        error: "\uC720\uC800\uAC00 \uB514\uC2A4\uCF54\uB4DC\uC640 \uC5F0\uACB0\uC744 \uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4!"
      });
    }
  } else {
    res.json({
      error: "\uC720\uC800\uAC00 \uD68C\uC6D0\uAC00\uC785\uC744 \uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uD639\uC2DC \uCCA0\uC790\uAC00 \uD2C0\uB9AC\uC168\uB294\uC9C0?"
    });
  }
});
async function run() {
  app.listen(port, () => {
    console.log(`start express server port = ${port}`);
    console.log(`url http://localhost:${port}`);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  run
});
