require('dotenv').config();
const express = require("express");
const app = express();

app.listen(() => console.log("Server started"));

// --- Keepalive: ping the express endpoint every 5 minutes ---
setInterval(() => {
  fetch('http://localhost:3000/ping').catch(() => {});
}, 5 * 60 * 1000);

app.use('/ping', (req, res) => {
  res.send(new Date());
});

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const ms  = require('ms');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
});

const prefix = "-";

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if(command === "help") {
    return message.channel.send({ embeds: [
      new EmbedBuilder()
        .setColor('#FFFFFF')
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setTitle('Online Bot Commands:')
        .setDescription(`**${prefix}set (url)** : *to add link to database.* \n **${prefix}my-urls** : *to get all the links added by you.* \n**${prefix}remove (url)** : *to remove a link was added by you.* \n **${prefix}clear-all** : *delete your all urls in the database.* \n **${prefix}ping** : *bot replies with \"pong\".* \n **${prefix}ms** : *check out bot's speed.* \n **${prefix}all-urls** : *to get all urls in the database.*`)
        //.setThumbnail('https://media.discordapp.net/attachments/1166077191575048245/1166090586906955847/Picsart_23-10-23_22-03-41-276.jpg?ex=6549397c&is=6536c47c&hm=f6098c894dd1e11c5d2b6310&=&width=671&height=671')
        .addFields({ name: 'Admin Commands:', value: `**${prefix}all-urls** : *to get all urls in the database.*` })
        .setTimestamp()
        .setFooter({ text: 'Uptime Bot Help List' })
    ] });
  }

  if(command === "set") {
    let added = args[0];
    if(!added || !added.startsWith("https://")) return message.channel.send(`**Please, provide a valid link!**`);
    // Save URL to quick.db
    let userUrls = await db.get(`urls_${message.author.id}`) || [];
    if (!userUrls.includes(added)) {
      userUrls.push(added);
      await db.set(`urls_${message.author.id}`, userUrls);
    }
    message.channel.send({ embeds: [
      new EmbedBuilder()
        .setColor('#00FF00')
        .setDescription(`**Added:** ${added}`)
    ] });
  }

  if (command === "my-urls") {
    let auser = message.author.id;
    message.channel.send(`**Check your dm** <@${auser}> **.**`);
    let urls = await db.get(`urls_${auser}`) || [];
    message.author.send({ embeds: [
      new EmbedBuilder()
        .setColor('#080808')
        .setTitle('Your URLs')
        .setDescription(urls.length ? urls.join("\n") : "No URLs found.")
    ] });
  }

  if(command === "remove") {
    let removed = args[0];
    let userUrls = await db.get(`urls_${message.author.id}`) || [];
    userUrls = userUrls.filter(url => url !== removed);
    await db.set(`urls_${message.author.id}`, userUrls);
    message.channel.send({ embeds: [
      new EmbedBuilder()
        .setColor('#D22B2B')
        .setDescription(`**Removed:** ${removed}`)
    ] });
  }

  if(command === "all-urls" && message.author.id === '1202830963034296360') {
    let allUrls = [];
    let users = await client.users.fetch();
    for (const [id, user] of users) {
      let urls = await db.get(`urls_${id}`) || [];
      urls.forEach(url => allUrls.push(`${user.tag}: ${url}`));
    }
    message.channel.send({ embeds: [
      new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('All URLs in Database')
        .setDescription(allUrls.length ? allUrls.join("\n") : "No URLs found.")
    ] });
  }

  if(command === 'clear-all') {
    await db.set(`urls_${message.author.id}`, []);
    message.channel.send('**Cleanned all the links!**');
  }

  if(command === 'ping') {
    message.channel.send('pong');
  }

  if(command === 'ms') {
    const sent = await message.channel.send('Pinging...');
    sent.edit(`Pong! Latency is ${sent.createdTimestamp - message.createdTimestamp}ms.`);
  }

  // Add any other commands here
});

client.on("ready", () => {
  client.user.setPresence({ activities: [{ name: "-help" }] });
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.token);
