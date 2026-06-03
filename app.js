import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import 'dotenv/config';
import { startYouTubePoller } from './youtube.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,   // required for member events
  ],
});

client.on('guildMemberAdd', async (member) => {
  const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
  if (!channel) return;
    await channel.send(
    `Hey there! I'm the Hero O.R.B and I would like to personally welcome you, ${member}, to the official Hero Mania Server!\n` +
    `Here you will be able to follow updates for the project, talk with other HeroManiacs, or even compete in our offical Hero Mania game lobbies! (Using steam remote play)\n` +
    `Before you run off though I just have a few things I NEED you to do, or don't. I have no control over you but I will get sad if you ignore me 😔\n` +
    `Anyways be sure to do the following!\n` +
    `🎮 Wishlist Hero Mania: <https://store.steampowered.com/app/1933520/Hero_Mania/>\n` +
    `📋 Read the rules: <#${process.env.RULES_CHANNEL_ID}>\n` +
    `📺 Subscribe on YouTube: <https://www.youtube.com/@cosmictonic9736>\n` +
    `🎵 Follow on Tik Tok: <https://www.tiktok.com/@cosmic_tonic>\n` +
    `Follow our other social medias if you want but we don't really care about those ones as much tbh lol\n` +
    `Alright now have fun, get chatting with the other HeroManiacs and have a great day!\n`
    );
});

client.once('ready', (c) => {
  console.log(`Logged in as ${c.user.tag}`);
  startYouTubePoller(client);
});

client.login(process.env.DISCORD_TOKEN);