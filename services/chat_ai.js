const axios = require('axios');
const { API_KEY_OPEN_AI } = require('../config');

const ChatAIHandler = async (text, msg, userID, userChats) => {
    console.log("User ID => ", userID);
    console.log("User Chats => ", userChats);

    if (text.length < 2) {
        return msg.reply('Wrong format, commands:\n- *#ask:Your Question...*');
    }

    msg.reply('I got you, your answer is on process...');

    const question = text;

    const response = await ChatGPTRequest(text, userChats)

    if (!response.success) {
        return msg.reply(response.message);
    }  

    console.log("Result => ", response.data);
    var message = response.data.content.replace("\n\n", "");
    message += "\n\n- GarpuBOT";

    msg.reply(message);

    return response;
}


const ChatGPTRequest = async (text, userChats) => {

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
            messages: userChats,
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
                    result.data = choices[0].message;
                }

            } else {
                result.message = "Failed response";
            }

            return result;
        })
        .catch((error) => {
            console.log("Error  : ", error);
            result.message = "Error : " + error.message;
            return result;
        });
}

module.exports = {
    ChatAIHandler
}