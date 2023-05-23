//Settings!
const yourID = ""; //Instructions on how to get this: https://redd.it/40zgse
const setupCMD = "!createroleressage"
let initialMessage = `**React to the messages below to receive the associated role. If you would like to remove the role, simply remove your reaction!**`;
const roles = ["Hacker", "Artist", "Public Relations", "Intern"];
const reactions = ["💻", "🖌", "😃", "🆕"];
const botToken = ""; /*You'll have to set this yourself; read more
                     here https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token*/

// Load up the bot...
const { Client, MessageReaction, Intents } = require('discord.js');
const bot = new Client({ 
  intents: [
    "GUILDS",
    "GUILD_MESSAGES", 
    "GUILD_MEMBERS", 
    "GUILD_MESSAGE_REACTIONS"
  ] 
});
//output to confirm bot is running...
bot.once('ready', () => {
        console.log('Ready!');
});

bot.login(botToken);

// If there isn't a reaction for every role, scold the user!
if (roles.length !== reactions.length) {
  console.error("Roles list and reactions list are not the same length!");
  process.exit(1); // Exit the process to prevent further execution
}

// Function to generate the role messages, based on your settings
function generateMessages() {
  var messages = [];
  messages.push(initialMessage);
  for (let role of roles) messages.push(`React below to get the **"${role}"** role!`); // DONT CHANGE THIS
  return messages;
}

bot.on('messageCreate', (message) => {
  if (message.content === '$printRoles') {
    const guild = message.guild;
    const roleList = guild.roles.cache.map((role) => `${role.name}: ${role.id}`);
    console.log(roleList.join('\n'));
  }
});

bot.on("messageCreate", async (message) => {
  if (message.author.id === yourID && message.content.toLowerCase() === setupCMD) {
    var toSend = generateMessages();
    let mappedArray = [[toSend[0], false], ...toSend.slice(1).map((message, idx) => [message, reactions[idx]])];
    for (let mapObj of mappedArray) {
      try {
        const sent = await message.channel.send({ content: mapObj[0] });
        if (mapObj[1]) {
          await sent.react(mapObj[1]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }
});

bot.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.author.id === bot.user.id && reaction.message.content !== initialMessage) {
    var re = `\\*\\*"(.+)?(?="\\*\\*)`;
    var role = reaction.message.content.match(re)[1];

    if (user.id !== bot.user.id) {
      try {
        var roleObj = reaction.message.guild.roles.cache.find((r) => r.name === role);
        var memberObj = reaction.message.guild.members.cache.get(user.id);

        await memberObj.roles.add(roleObj);
      } catch (error) {
        console.error("Error adding role:", error);
      }
    }
  }
});

bot.on('messageReactionRemove', async (reaction, user) => {
  if (reaction.message.author.id === bot.user.id && reaction.message.content !== initialMessage) {
    var re = `\\*\\*"(.+)?(?="\\*\\*)`;
    var role = reaction.message.content.match(re)[1];

    if (user.id !== bot.user.id) {
      try {
        var roleObj = reaction.message.guild.roles.cache.find((r) => r.name === role);
        var memberObj = reaction.message.guild.members.cache.get(user.id);

        await memberObj.roles.remove(roleObj);
      } catch (error) {
        console.error("Error removing role:", error);
      }
    }
  }
});

