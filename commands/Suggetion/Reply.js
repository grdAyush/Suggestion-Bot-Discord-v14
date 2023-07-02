const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ButtonStyle, StringSelectMenuOptionBuilder
  } = require("discord.js");
  const Schema = require("../../Models/Suggetion")
  module.exports = {
    name: ["suggetion", "reply"],
    description: "accept or reject the suggestion",
    category: "Suggetion",
    options: [
        {
            name: "id",
            required: true,
            description: "message id of the suggestion",
            type: ApplicationCommandOptionType.String
        },
        {
            name: "option",
            required: true,
            type: ApplicationCommandOptionType.String,
            description: "Choose Option Accept or reject the suggestion",
            choices: [
                {
                    name: "Accept",
                    value: "accept"
                },
                {
                    name: "Decline",
                    value: "decline"
                }
            ]
        },
        {
            name: "reason",
            description: "any response or you can say reason",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    permissions: {
      channel: [],
      bot: [],
      user: ["ManageGuild"],
    },
    settings: {
      isPremium: false,
      isOwner: false,
      inVoice: false,
      isNSFW: false,
    },
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: true });
        const msgId = interaction.options.getString("id");
        const option = interaction.options.getString("option");
        const response = interaction.options.getString("reason");
        const sug = await Schema.findOne({ message: msgId })

        if (!sug) return interaction.editReply({ content: `Invalid Message Id`})

        const msg = await interaction.guild.channels.cache.get(sug.channel)?.messages?.fetch(sug.message);

        
        if (!msg) return interaction.editReply({
            embeds: [{
                title: "Suggestion Message  Might Be Deleted",
                description: "This suggestion can no longer be replied"
            }]
        });

        const row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
            .setDisabled(true)
            .setEmoji("⬆")
            .setCustomId("endejnje")
            .setStyle(ButtonStyle.Secondary),
             new ButtonBuilder()
             .setDisabled(true)
             .setEmoji("⬇")
             .setCustomId("endejhghjnje")
             .setStyle(ButtonStyle.Secondary)
        ]);

        const row2 = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder()
            .setPlaceholder("⍣ Actions")
            .setDisabled(true)
            .setCustomId("sdfnjdf")
            .addOptions(
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
            
        ])

        msg.embeds[0].fields[2].value = option === "accept" ? "✅ Accepted" : "❌ Declined";
        msg.embeds[0].fields.push({
            name: "Reason",
            value: `${response}`,
            inline: false
        })

        msg.edit({
            embeds: msg.embeds,
            components: [row, row2]
        });

        interaction.editReply({ content: "😉 The Suggetion Has Been Edited"})


    },
  };
  