
const suggestion = require("../../Models/Suggetion");
const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuOptionBuilder,
  TextInputStyle,
  PermissionsBitField,
  ThreadAutoArchiveDuration,
} = require("discord.js");


module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      //Suggetion Buttons Setup
      const sug = await suggestion.findOne({
        message: interaction.message?.id,
      });
      if (sug) {
        
        await interaction.deferReply({ ephemeral: true });
        if (interaction.customId === "sug-up") {
          if (sug.votes.down.includes(interaction.user.id))
            return interaction.followUp({
              content: "You Have Already Down Voted The Suggestion",
            });
          if (sug.votes.up.includes(interaction.user.id)) {
            sug.votes.up.remove(interaction.user.id);
            sug.save();
            interaction.followUp({ content: `Your Vote Is Removed` });
            const msg = await interaction.channel.messages.fetch(sug.message);
            if (!msg) return;
            msg.embeds[0].fields[0].value = sug.votes.up.length.toString();
            msg.embeds[0].fields[1].value = sug.votes.down.length.toString();

            msg?.edit({
              embeds: msg.embeds,
            });
          } else {
            sug.votes.up.push(interaction.user.id);
            sug.save();

            interaction.followUp({ content: `Voted Successfully` });
            const msg = await interaction.channel.messages.fetch(sug.message);
            if (!msg) return;
            msg.embeds[0].fields[0].value = sug.votes.up.length.toString();
            msg.embeds[0].fields[1].value = sug.votes.down.length.toString();

            msg?.edit({
              embeds: msg.embeds,
            });
          }
        } else if (interaction.customId === "sug-down") {
          if (sug.votes.up.includes(interaction.user.id))
            return interaction.followUp({
              content: "You Already Up Voted The Suggestion",
            });
          if (sug.votes.down.includes(interaction.user.id)) {
            sug.votes.down.remove(interaction.user.id);
            sug.save();
            interaction.followUp({ content: `Your Vote Is Removed` });
            const msg = await interaction.channel.messages.fetch(sug.message);
            if (!msg) return;
            msg.embeds[0].fields[0].value = sug.votes.up.length.toString();
            msg.embeds[0].fields[1].value = sug.votes.down.length.toString();

            msg?.edit({
              embeds: msg.embeds,
            });
          } else {
            sug.votes.down.push(interaction.user.id);
            sug.save();

            interaction.followUp({ content: "Voted Successfully" });

            const msg = await interaction.channel.messages.fetch(sug.message);
            if (!msg) return;
            msg.embeds[0].fields[0].value = sug.votes.up.length.toString();
            msg.embeds[0].fields[1].value = sug.votes.down.length.toString();

            msg?.edit({
              embeds: msg.embeds,
            });
          }
        }
      }
    }
    if (interaction.isStringSelectMenu()) {
      const value = interaction.values[0];
      const sug = await suggestion.findOne({
        message: interaction.message?.id,
      });

      //Suggestion Menu
      if (sug) {
        
        const msg = await interaction.channel.messages.fetch(sug.message);
        if (!msg) return;
        if (value === "sug-accept") {
          if (
            !interaction.member.permissions.has(
              PermissionsBitField.Flags.ManageGuild
            )
          )
            return interaction.reply({
              content: "You Don't have permission to use this button", ephemeral: true
            });

    
            const reason = new TextInputBuilder()
            .setCustomId("sug-accept-input")
            .setLabel("Reason")
            .setPlaceholder("What Interesting You Found In This Suggetion")
            .setMinLength(4)
            .setMaxLength(2048)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)


            const Modal = new ModalBuilder()
            .setTitle("Suggestion System")
            .setCustomId("suggestion-system0")
            .setComponents(
              new ActionRowBuilder().addComponents(reason)
            )

            interaction.showModal(Modal)
          
        } else if (value === "sug-decline") {
          if (
            !interaction.member.permissions.has(
              PermissionsBitField.Flags.ManageGuild
            )
          )
            return interaction.reply({
              content: "You Don't have permission to use this button", ephemeral: true
            });

            const reason = new TextInputBuilder()
            .setCustomId("sug-decline-input")
            .setLabel("Reason")
            .setPlaceholder("Why You Are Declining This Suggetion")
            .setMinLength(4)
            .setMaxLength(2048)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)


            const Modal = new ModalBuilder()
            .setTitle("Suggestion System")
            .setCustomId("suggestion-system1")
            .setComponents(
              new ActionRowBuilder().addComponents(reason)
            )

            interaction.showModal(Modal)


        } else if(value === "sug-update") {
          if(interaction.user.id !== sug.user) return interaction.reply({content: "This Is Not Your Suggestion", ephemeral: true})

          const updated = new TextInputBuilder()
            .setCustomId("sug-update-input")
            .setLabel("Suggetion")
            .setStyle(TextInputStyle.Paragraph)
            .setValue(`${sug.suggestion}`)
            .setMinLength(4)
            .setMaxLength(2048)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)


            const Modal = new ModalBuilder()
            .setTitle("Suggestion System")
            .setCustomId("suggestion-system2")
            .setComponents(
              new ActionRowBuilder().addComponents(updated)
            )

            interaction.showModal(Modal)

        } else if(value === "sug-create-thread") {

          if (
            !interaction.member.permissions.has(
              PermissionsBitField.Flags.ManageGuild
            )
          )
            return interaction.reply({
              content: "You Don't have permission to use this button", ephemeral: true
            });

          await interaction.message.startThread(
              {
                name: "Suggetion Thread",
                autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
                reason: `${sug.suggetion}`
              }
            )

           interaction.reply({content: "Thread Created", ephemeral: true})

        }
      }
    } else if(interaction.isModalSubmit()) {

      const sug = await suggestion.findOne({
        message: interaction.message?.id,
      });

      if(sug) {
        if(interaction.customId === "suggestion-system0") {
          const reason = interaction.fields.getTextInputValue("sug-accept-input")
          const msg = await interaction.channel.messages.fetch(sug.message);
            if (!msg) return;


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

            msg.embeds[0].fields[2].value = "✅ Accepted";
            msg.embeds[0].fields.push({
                name: "Reason",
                value: `${reason}`,
                inline: false
            })


            
        msg.edit({
          embeds: msg.embeds,
          components: [row, row2]
      });

      interaction.reply({ content: "Suggettion Accepted", ephemeral: true });
        } 






     else if(interaction.customId === "suggestion-system1") {
          const reason = interaction.fields.getTextInputValue("sug-decline-input")
          const msg = await interaction.channel.messages.fetch(sug.message);
            if (!msg) return;


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

            msg.embeds[0].fields[2].value = "❌ Declined";
            msg.embeds[0].fields.push({
                name: "Reason",
                value: `${reason}`,
                inline: false
            })


            
        msg.edit({
          embeds: msg.embeds,
          components: [row, row2]
      });

      interaction.reply({ content: "Suggestion Declined ", ephemeral: true });
        }
        else if(interaction.customId === "suggestion-system2"){
          const text = interaction.fields.getTextInputValue("sug-update-input")
          const msg = await interaction.channel.messages.fetch(sug.message);
           if (!msg) return;

        
      
          sug.suggestion = text
          sug.save()
          const embed = new EmbedBuilder()
          .setTitle("New Suggestion!")
          .setColor("Blue")
          .setDescription(`${text}`)
          .addFields([
            {
              name: "Up Votes",
              value: sug.votes.up.length.toString(),
              inline: true
          }, {
              name: "Down Votes",
              value: sug.votes.down.length.toString(),
              inline: true
          }, {
              name: "Status",
              value: "pending",
              inline: true
          },
          {
            name: "Suggestion ID",
            value: `\`\`\`\n${sug.message}\n\`\`\``,
            inline: true
          }
          ])

            msg.edit({
              embeds: [embed],

            });
              interaction.reply({ content: "Suggestion Updated", ephemeral: true });

        }      }

    }
  });
}; 
