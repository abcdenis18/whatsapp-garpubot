const qrcode = require('qrcode-terminal');
const fs = require('fs');
var mime = require('mime-types');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { EditPhotoHandler } = require('./services/remove_image_background_ai');
const { ChatAIHandler } = require('./services/chat_ai');
const { execArgv } = require('process');
const { fileURLToPath } = require('url');
const { isMainThread } = require('worker_threads');

const userChats = new Map();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // executablePath: '/path/to/Chrome',
        executablePath: '/usr/bin/google-chrome-stable',
        // executablePath: './node_modules/puppeteer/.local-chromium/linux-599821/chrome-linux/chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // channel: "chrome",
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    const number = "6281310424252";
    const message = "Hi boss, im ready now!:)";
    const chatId = number + "@c.us";

    //TODO: send message to the boss if BOT is ready to use
    client.sendMessage(chatId, message);
    console.log('GarpuBOT is ready!');
});

client.sendMessage

client.on('message', async msg => {

    console.log("Message => ", msg);

    const contact = await msg.getContact();

    var userID = contact.number.toString();

    console.log("Contact => ", contact);

    const commands = [
        "#hello",
        "#ask:",
        "#edit:",
        "#about",
        "#clearchat",
        "#sticker",
    ];

    // const text = msg.body.toLowerCase() || '';

    const text = msg.body;

    var isValid = commands.find((item) => text.includes(item));

    // console.log(isValid);

    if (isValid != undefined) {
        console.log("isValid item => ", isValid);

        //TODO: clear user chats
        if (text.includes("#clearchat")) {
            console.log("Clearing chats => ", userChats[userID]);
            if (userChats[userID] != undefined && userChats[userID].length > 0) {
                userChats[userID] = [];

                return msg.reply("Your chats has been cleared.");
            } else {
                return msg.reply("You haven't even asked me, ask me something :)\n\nCommands:\n- *#ask:Your Question Here...*")
            }
        }

        //TODO: check chat is coming from group chat or personal chat
        if (msg.author == undefined) {

            //* first ini user chats
            if (userChats[userID] == undefined) {
                userChats[userID] = [];
            }

            //* add item chat to user chats
            userChats[userID].push({
                "role": "user",
                "content": text,
            });
        }

        //TODO: reply '#ask:' command (greetings)
        if (text == '#hello') {
            msg.reply('Hello ' + contact.pushname + ', u can ask me something :)\n\nCommands:\n- *#ask:Your Question Here...*');
        }

        // #edit
        // if (text.includes("#edit:")) {
        //     await EditPhotoHandler(text, msg);
        // }

        //TODO: reply '#ask:' command
        if (text.includes("#ask:")) {
            // console.log(text = text.split("#ask:")[1]);
            const response = await ChatAIHandler(text.split("#ask:")[1], msg, userID, userChats[userID]);

            //* check if the result is not null/undefined
            if (response.data != undefined) {
                //* append response chat item to user chats
                userChats[userID].push(response.data);
            }
        }

        //TODO: reply '#ask:' command
        if (text.includes("#about")) {
            msg.reply("Hello " + contact.pushname + ", im a BOT that might be able to help u.\nMy boss call me Garpu, what a weirdo name. But he made me with ♥\n\nMy boss :\nIG: @abcdenis");
        }

        if (text.includes("#sticker") && msg.hasMedia) {

            // const base64 = msg._data.body;
            // const mimeType = msg._data.mimetype;
            // const tempPath = './downloaded-media/';
            // const extension = mime.extension(mimeType);
            // const filename = new Date().getTime();
            // const fullPath = tempPath + filename + '.' + extension;


            // WAPI.getMediaDownloadLink(messageId).then((downloadLink) => {
            //     fetch(downloadLink)
            //       .then((response) => response.arrayBuffer())
            //       .then((buffer) => {
            //         const file = new File([buffer], 'file_name_here');
            //         // Do something with the downloaded file
            //       });
            //   });

            // let media = await msg.downloadMedia();
            // if (media) {
            //     client.sendMessage(msg.from, base64image, { sendMediaAsSticker: true, stickerAuthor: "Generated by GarpuBOT", stickerName: "Stickers" });
            // }else{
            //     console.log("Failed to download image");
            // }

            // const file = convertBase64ToFile(base64, filename + extension, mimeType);
            // if (!fs.existsSync(tempPath)) {
            //     fs.mkdirSync(tempPath);
            // }

            // fs.writeFileSync(fullPath, base64, { encoding: 'base64' });
            // client.sendMessage(msg.from, MessageMedia.fromFilePath(fullPath), { sendMediaAsSticker: true, stickerAuthor: "Generated by GarpuBOT", stickerName: "Stickers" });
            // fs.unlinkSync(fullPath);
            // const canvas = document.createElement('canvas');
            // const context = canvas.getContent("2d");
            // const image = new Image();
            // image.onload = () => {
            //     canvas.width = image.width;
            //     canvas.height = image.height;
            //     context.drawImage(image, 0, 0);
            //     const base64image = canvas.toDataURL(mimeType);

            //     client.sendMessage(msg.from, base64image, { sendMediaAsSticker: true, stickerAuthor: "Generated by GarpuBOT", stickerName: "Stickers" });
            // };

            // if (!fs.existsSync(tempPath)) {
            //     fs.mkdirSync(tempPath);
            // }

            // // fs.writeFileSync(fullPath, base64, { encoding: 'base64' });
            // fs.writeFileSync(file);

            // const downloadBase64Data = (base64, fileName) => {

            //     // let file = convertBase64ToFile(base64, fileName);

            // }
            //TODO: download the image

            // const image = new MessageMedia("image/*", base64, "image.jpg");

            // msg.reply(MessageMedia.fromFilePath(fullPath), msg.from, { sendMediaAsSticker: true, stickerAuthor: "Generated by GarpuBOT", stickerName: "Stickers" });

            // fs.unlinkSync(fullPath);
            // client.sendMessage(msg.from, image, { sendMediaAsSticker: true, stickerAuthor: "Generated by GarpuBOT", stickerName: "Stickers" })

            // const media = await msg.downloadMedia();
            // msg.
            // msg.media

            // if (media) {
            //     console.log("Image downloaded!");
            // }

            msg.downloadMedia().then(media => {

                if (media) {

                    const tempPath = './downloaded-media/';

                    if (!fs.existsSync(tempPath)) {
                        fs.mkdirSync(tempPath);
                    }

                    const extension = mime.extension(media.mimetype);

                    const filename = new Date().getTime();

                    const fullPath = tempPath + filename + '.' + extension;

                    // Save to file
                    try {
                        fs.writeFileSync(fullPath, media.data, { encoding: 'base64' });
                        console.log('File downloaded successfully!', fullPath);
                        console.log(fullPath);
                        MessageMedia.fromFilePath(filePath = fullPath)
                        client.sendMessage(msg.from, media, { sendMediaAsSticker: true, stickerAuthor: "Generated by GarpuBOT", stickerName: "Stickers" })
                        fs.unlinkSync(fullPath)
                        console.log(`Sticker sent successfully!`,);
                    } catch (err) {
                        console.log('Failed to save the file:', err);
                        console.log(`File Deleted successfully!`,);
                    }
                }
            });
        }


    } else {
        if (msg.author == undefined) {
            msg.reply('Hello ' + contact.pushname + ', u can ask me something :)\n\nCommands:\n- *#about*\n- *#hello*\n- *#ask:Your Question Here...*\n- *#clearchat*\n- *#sticker* (with Image)');
        }
    }

});

const convertBase64ToFile = (base64String, fileName, mimeType) => {
    let arr = base64String.split(',');
    let mime = mimeType;
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let uint8Array = new Uint8Array(n);
    while (n--) {
        uint8Array[n] = bstr.charCodeAt(n);
    }
    let file = new File([uint8Array], fileName, { type: mime });
    return file;
}

client.initialize();



