# Discord-RoleReact

A bot that automatically assigns roles based on message reactions.

Updated to discord.js v13 API (npm i discord.js@^13) with output when running, error logging and a new $printRoles command to output a list of roles/role IDs in the console from the server the message is sent in as long as the bot can see the channel.

![Demo of Bot](https://i.imgur.com/5vxxCDw.gif)

## Features

- Customizable messages, reactions, commands, and roles

- Auto-removes role when user removes a reaction

- Retains channel/message/reaction on restart

## Installation

Clone this repository to your local machine.

Open `roleReact.js`, you will need to change most of the settings at the top of the file. The relevant lines look like this: 

```JavaScript
//Settings!
const yourID = ""; //Instructions on how to get this: https://redd.it/40zgse
const storageFile = './roleMessages.json';
const setupCMD = "!createrolemessage"
let initialMessage = `**React to the messages below to receive the associated role. If you would like to remove the role, simply remove your reaction!**`;
const roles = ["Hacker", "Artist", "Public Relations", "Intern"];
const reactions = ["💻", "🖌", "😃", "🆕"];
const botToken = ""; /*You'll have to set this yourself; read more
                     here https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token*/
```

For the bot to work properly, you must:

- Fill in the yourID variable; you can get it in any discord channel by typing "\@YOUR_NAME". For me, it would be \@Night.

- Adjust the setup command, if you do not like the default one

- Adjust the initial message, if you do not like the default one

- Adjust the JSON storage file location, if you do not like the default one

- Adjust the roles to ones that are actually in your server ($roles will print these in the bots console/pm2 logs); **make sure the bot's role is high enough on the list in your server's settings that it can assign the them properly**.

- Replace the reactions with the ones of your choosing. **Note:** to get the value for the reaction, do NOT simply type `:my_reaction:` and copy the result. You must type `\:my_reaction` with the backslash and copy that result after pressening enter. If done correctly, the reaction should appear smaller than usual.

- Set up the bot and get the token. This [Github Wiki Page](here https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) does a better job of expaining it than I ever could. An image of the permissions the bot needs can be [found here](https://i.imgur.com/PFDm3pH.png).

## Starting the bot

in the console run ```//node roleReact.js```

## Auto Start (Optional)

This will quickly add ReactMap to your PM2 processes

If you don't have PM2 installed already
```sudo npm install -g pm2```

While in the roleReact root foler
```pm2 node ReactMap.js```

## Conclusion 

I hope you find this bot useful. If you need any help, or find any bugs, use the appropriate forums in this repository to contact me.
