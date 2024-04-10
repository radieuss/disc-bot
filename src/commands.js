require("dotenv").config();
const {
  REST,
  Routes,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");

const commands = [
  {
    name: "lol",
    description: "not funny",
  },
  {
    name: "anthea",
    description: "anthea stpid",
  },
  {
    name: "hi",
    description: "wont say hi",
  },
  {
    name: "add",
    description: "add two numbers",
    options: [
      {
        name: "first-number",
        description: "The first number to add",
        type: ApplicationCommandOptionType.Number,
        required: true,
        choices: [
          {
            name: "1",
            value: 1,
          },
          {
            name: "2",
            value: 2,
          },
          {
            name: "3",
            value: 3,
          },
        ],
      },
      {
        name: "second-number",
        description: "The second number to add",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  {
    name: "embed",
    description: "embed",
  },
];

const rest = new REST().setToken(process.env.TOKEN);

const slashRegister = async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log("Slash commands were registered");
  } catch (error) {
    console.log(error);
  }
};
slashRegister();
