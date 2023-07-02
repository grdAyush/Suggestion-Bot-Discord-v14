const {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");

  const Schema = require("../../Models/Suggetion")
  const Schema2 = require("../../Models/Suggetion2")
  module.exports = {
    name: ["suggestion", "setup"],
    description: "setup suggestion channel",
    category: "Suggetion",
    options: [
        {
            name: "channel",
            type: ApplicationCommandOptionType.Channel,
            description: "channel in which you want to setup suggestion",
            required: true,
            channel_types: [ChannelType.GuildText],
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageChannels", "ManageGuild"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: true });
        const channel = interaction.options.getChannel("channel");
        const data = await Schema2.findOne({ id: interaction.guild.id })
        if(!data)  await Schema2.create({ id: interaction.guild.id });

        await Schema2.findOneAndUpdate({ id: interaction.guildId }, { suggestion: channel.id });

        interaction.editReply({ content: `${channel} Is Now Set To Be New Suggestion Channel Now All Suggestions Wil Sent there`})

    },
  };
  