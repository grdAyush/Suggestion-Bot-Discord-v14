const {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  Colors
} = require("discord.js");
const Schema = require("../../Models/Suggetion");
const Schema2 = require("../../Models/Suggetion2");
module.exports = {
  name: ["suggetion", "suggest"],
  description: "send a suggestion to guild suggetion channel",
  category: "Suggetion",
  options: [
    {
      name: "suggestion",
      type: ApplicationCommandOptionType.String,
      required: true,
      description: "suggetion you want to send",
    },
  ],
  permissions: {
    channel: [],
    bot: [],
    user: [],
  },
  settings: {
    isPremium: false,
    isOwner: false,
    inVoice: false,
    isNSFW: false,
  },
  run: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });
    const suggestion = interaction.options.getString("suggestion");
    const data =
      (await Schema2.findOne({ id: interaction.guild.id })) ||
      (await Schema2.create({ id: interaction.guild.id }));
    const c = interaction.guild.channels.cache.get(data.suggestion)
    if (!c)
      return interaction.editReply({
        embeds: [
          {
            title: "Suggetion Channel Not Found or Not Been Setuped",
          },
        ],
      });

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder()

        .setEmoji("⬆")
        .setCustomId("sug-up")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setEmoji("⬇")
        .setCustomId("sug-down")
        .setStyle(ButtonStyle.Secondary),
    ]);

    const row2 = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
      .setPlaceholder("⍣ Actions")
      .setCustomId("suggestion").addOptions(
        new StringSelectMenuOptionBuilder()
        .setLabel("Update")
        .setValue("sug-update")
        .setDescription("Update Your suggestion"),
        
        new StringSelectMenuOptionBuilder()
        .setLabel("Create Thread")
        .setValue("sug-create-thread")
        .setDescription("Create a new thread to this suggestion"),

        new StringSelectMenuOptionBuilder()
        .setLabel("Accept")
        .setValue("sug-accept")
        .setDescription("Accept this suggestion"),

        new StringSelectMenuOptionBuilder()
        .setLabel("Decline")
        .setValue("sug-decline")
        .setDescription("Decline this suggestion")
    )


    ]);


    const msg = await c.send({
      components: [row, row2],
      embeds: [{
          color: Colors.Blue,
          title: "New Suggestion!",
          description: `${suggestion}`,
          fields: [{
              name: "Up Votes",
              value: "0",
              inline: true
          }, {
              name: "Down Votes",
              value: "0",
              inline: true
          }, {
              name: "Status",
              value: "pending",
              inline: true
          }],
          footer: {
              text: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL()
          }
      }]
  });

  await Schema.create({
      suggestion,
      user: interaction.user.id,
      message: msg.id,
      channel: c.id,
      guild: interaction.guildId,
      votes: {
          up: [], down: []
      },
      createdAt: Date.now(),
  });

  msg.embeds[0].fields.push({
      name: "Suggestion ID",
      value: `\`\`\`\n${msg.id}\n\`\`\``,
      inline: true
  });

  msg.edit({
      embeds: msg.embeds
  });

  interaction.editReply({
      embeds: [{
          color: Colors.Green,
          title: "Suggestion Has Been Sent"
      }]
  })



  },
};
