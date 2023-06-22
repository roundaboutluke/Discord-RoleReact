//Settings!
const yourID = ""; //Instructions on how to get this: https://redd.it/40zgse
const storageFile = './roleMessages.json'; // Path to the storage file
const setupCMD = "!createrolemessage"
let initialMessage = `**React to the messages below to receive the associated role. If you would like to remove the role, simply remove your reaction!**`;
const roles = ["Hacker", "Artist", "Public Relations", "Intern"]
const reactions = ["💻", "🖌", "😃", "🆕"];
const botToken = ""; /*You'll have to set this yourself; read more
                     here https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token*/

// Load up the bot...
const fs = require('fs');
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
  // After the bot starts, load the stored messages from the file
  loadRoleMessages();
});

// Function to load the stored role messages from the file
function loadRoleMessages() {
  fs.readFile(storageFile, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log(`Storage file (${storageFile}) not found. Creating a new file.`);
        saveRoleMessages([]); // Create an empty storage file
        return;
      } else {
        console.error('Error reading role messages from storage:', err);
        return;
      }
    }

    try {
      const roleMessages = JSON.parse(data);
      for (const roleMessage of roleMessages) {
        const { messageId, reactions } = roleMessage;
        const channel = bot.channels.cache.get(roleMessage.channelId);
        if (channel && reactions) {
          channel.messages.fetch(messageId).then((message) => {
            for (const reaction of reactions) {
              message.react(reaction);
            }
          }).catch((error) => {
            console.error('Error fetching message:', error);
          });
        }
      }
    } catch (error) {
      console.error('Error parsing role messages:', error);
    }
  });
}

// Function to save the role messages to the file
function saveRoleMessages(roleMessages) {
  fs.writeFile(storageFile, JSON.stringify(roleMessages), 'utf8', (err) => {
    if (err) {
      console.error('Error saving role messages to storage:', err);
    }
  });
}

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
  for (let role of roles) messages.push(`React below to get the **"${role}"** role!`); //reaction message string can be edited but must contain "${role}"!
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
    var roleMessages = [];

    for (let mapObj of mappedArray) {
      try {
        const sent = await message.channel.send({ content: mapObj[0] });
        if (mapObj[1]) {
          await sent.react(mapObj[1]);
        }

        roleMessages.push({
          channelId: message.channel.id,
          messageId: sent.id,
          reactions: mapObj[1] ? [mapObj[1]] : []
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }

    // Save the role messages to the file
    saveRoleMessages(roleMessages);
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

