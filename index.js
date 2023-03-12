const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { EditPhotoHandler } = require('./services/remove_image_background_ai');
const { ChatAIHandler } = require('./services/chat_ai');



const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    const number = "6281310424252";
    const message = "Hello, im ready!";
    const chatId = number + "@c.us";

    //sending message;
    client.sendMessage(chatId, message);
    console.log('Client is ready!');
});

client.sendMessage

client.on('message', async msg => {
    const commands = [
        "#hello",
        "#ask:",
        "#edit:",
    ];

    console.log("Message Object => ", msg);
    const contact = await msg.getContact();

    console.log("Contact => ", contact);

    const text = msg.body.toLowerCase() || '';

    var isValid = commands.find((item) => text.includes(item));

    // console.log(isValid);

    if (isValid != undefined) {

        //greetings
        if (text === '#hello') {
            msg.reply('Hello '+ msg._data.notifyName +', u can ask me something :)\n\nCommands:\n- *#ask:Your Question Here...*');
        }

        // #edit
        if (text.includes("#edit:")) {
            await EditPhotoHandler(text, msg);
        }

        // #ask/question?
        if (text.includes("#ask:")) {
            await ChatAIHandler(text, msg);
        }

    } else {
        if (msg.author == undefined) {
            msg.reply('Hello ' + msg._data.notifyName +', u can ask me something :)\n\nCommands:\n- *#hello*\n- *#ask:Your Question Here...*');
        }
    }

});

client.initialize();



