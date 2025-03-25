import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    
    const args = message.content.split(" ");
    const command = args[0];
    
    if (command === "!shorten" && args[1]) {
        try {
            // Update the API endpoint to point to the production URL
            const response = await axios.post("https://url-shortner-wine-seven.vercel.app/url", {
                url: args[1],
            });
    
            if(response.data.miniId) {
                message.reply(`Shortened URL: https://url-shortner-wine-seven.vercel.app/${response.data.miniId}`);
            }
            else {
                message.reply("Error: No miniId returned");
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            message.reply("Error generating shortened URL.");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
