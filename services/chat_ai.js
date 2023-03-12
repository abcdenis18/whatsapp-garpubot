const axios = require('axios');
const { API_KEY_OPEN_AI } = require('../config');

const ChatAIHandler = async (text, msg) => {
    const cmd = text.split(':');

    if (cmd.length < 2) {
        return msg.reply('Wrong format, commands:\n- *#ask:Your Question...*');
    }

    msg.reply('I got you, your message is on process!');

    const question = cmd[1];
    const response = await ChatGPTRequest(question)

    if (!response.success) {
        return msg.reply(response.message);
    }

    return msg.reply(response.data);
}


const ChatGPTRequest = async (text) => {

    const result = {
        success: false,
        data: "Sorry, i can't find the best answer for that question",
        message: "",
    }

    return await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        data: {
            model: "gpt-3.5-turbo",
            // model: "text-davinci-003",
            messages: [{
                role: "user",
                content: text,
            }],
            // prompt: text,
            // max_tokens: 1000,
            // temperature: 0
        },
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY_OPEN_AI}`,
        },
    })
        .then((response) => {
            if (response.status == 200) {

                const { choices } = response.data;

                if (choices && choices.length) {
                    result.success = true;
                    // result.data = choices[0].text;
                    result.data = choices[0].message.content.replace("\n\n", "");
                    result.data +=  "\n\n- GarpuBOT";
                }

            } else {
                result.message = "Failed response";
            }

            return result;
        })
        .catch((error) => {
            result.message = "Error : " + error.message;
            return result;
        });
}

module.exports = {
    ChatAIHandler
}