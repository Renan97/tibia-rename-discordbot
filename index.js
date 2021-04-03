const Discord = require("discord.js");
const config = require("./config.json");
const fetch = require("node-fetch");

const client = new Discord.Client();

const prefix = "!";

client.on("message", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();
  if (command === "rename") {
    let name = args.join("+");
    fetch(`https://api.tibiadata.com/v2/characters/${name}.json`)
      .then((response) => response.json())
      .then((data) => {
        if (data.characters.error) {
          message.reply(data.characters.error);
          return;
        }
        let charName = data.characters.data.name;
        let charLevel = data.characters.data.level;
        let fullVocation = data.characters.data.vocation.match(/\b(\w)/g);
        let acronymVocation = fullVocation.join("");
        let newNickname = `[${acronymVocation}] ${charName} - lvl ${charLevel}`;
        let member = message.guild.members.cache.get(message.author.id);
        member.setNickname(newNickname);
        let roles = member.guild.roles.cache;
        member.roles.add(getNewRole(acronymVocation, roles, member));
      });
  }

  if (command === "renameuser") {
    const target = message.mentions.users.first();
    args.shift();
    let name = args.join("+");
    fetch(`https://api.tibiadata.com/v2/characters/${name}.json`)
      .then((response) => response.json())
      .then((data) => {
        if (data.characters.error) {
          message.reply(data.characters.error);
          return;
        }

        let charName = data.characters.data.name;
        let charLevel = data.characters.data.level;
        let fullVocation = data.characters.data.vocation.match(/\b(\w)/g);
        let acronymVocation = fullVocation.join("");
        let newNickname = `[${acronymVocation}] ${charName} - lvl ${charLevel}`;
        let member = message.guild.members.cache.get(target.id);
        member.setNickname(newNickname);
        let roles = member.guild.roles.cache;
        member.roles.add(getNewRole(acronymVocation, roles, member));
      });
  }
});

client.login(config.BOT_TOKEN);
[];

const getNewRole = (acronym, roles, member) => {
  member.roles.cache.forEach((element) => {
    if (
      element.name === "RP" ||
      element.name === "EK" ||
      element.name === "ED" ||
      element.name === "MS"
    )
      member.roles.remove(element);
  });
  if (acronym === "P" || acronym === "RP") {
    var role = roles.find((role) => role.name === "RP");
    return role;
  }
  if (acronym === "K" || acronym === "EK") {
    var role = roles.find((role) => role.name === "EK");
    return role;
  }
  if (acronym === "D" || acronym === "ED") {
    var role = roles.find((role) => role.name === "ED");
    return role;
  }
  if (acronym === "S" || acronym === "MS") {
    var role = roles.find((role) => role.name === "MS");
    return role;
  }
};
