# DISCORD LEVELS

<center>
    <a href="https://npmjs.com/discord-levels/"><img src="https://nodei.co/npm/discord-levels.png"></a>
</center>

> **This easy-to-use package allows you to make a complete and modern experience and levels system on your server**

<center>
    <p>Package written with TypeScript</p>
    <br/>
    <img src="https://ostrowski.ninja/static/1482fb398d82ef51cfcfdbcd55e1ec03/a26eb/ts.png" alt="TypeScript">
</center>

## Installation
Enter the following command to install the package, and to use it later:
```bash
npm install --save discord-levels
```

## Documentation
> You will find the complete documentation [here](https://google.com) (*Soon*)

## Méthods
* addXP
* leaderboard

### addXP
**Allows you to add experience to a given user**

*Parameters:*
| Name          | Type      | Required  |
|:-------------:|:---------:|:---------:|
| **message**   | `any`     | true      |
| **userID**    | `string`  | true      |
| **XP**        | `number`  | true      |

*Matches :*
**message** ➔ Parameter of your event message
**userID** ➔ ID of the user
**XP** ➔ The experience that will be added

### leaderboard
**Generates a server ranking, sorted by experience**

*Parameters:*
| Name          | Type      | Required  |
|:-------------:|:---------:|:---------:|
| **client**    | `any`     | true      |
| **message**   | `any`     | true      |

*Matches :*
**client** ➔ Discord.js Client
**message** ➔ Parameter of your event message

## Example of use
```js
const { Client } = require('discord.js');
const Levels = require('discord-levels');

const client = new Client();

const settings = {
    token: "YOUR_DISCORD_BOT_TOKEN",
    prefix: "!" // You can change it
};

client.on('ready', () => console.log("Connected!"));

client.on('message', async (message) => {
    if(!message.content.startsWith(settings.prefix)) return;
    if(message.author.bot || !message.guild) return;

    if(message.content === "!give") {
        await Levels.addXP(message, message.author.id, 5) // Will add 5 XPs to the author of the message
    } else if(message.content === "!leaderboard") {
        await Levels.leaderboard(client, message);
    };
});

client.login(settings.token);
```

## Contributing
If you have any bug, feell free to open an issue [here](https://github.com/Octavia0509/discord-levels/issues)


## Questions
> Any question should be asked on the available support server [here](https://discord.gg/WmxCKvRnKh)

## Author

* Name: `Lucas D.`
* A.K.A **Oϲτανια#5573** (`638474353842978816`)
* GitHub: [Click here](https://github.com/Octavia0509)
