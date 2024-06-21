import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;


    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId],
                },
            },
        });
        console.log(chat);

        if (!chat) return res.status(404).json({ message: "Chatul nu a fost găsit." })

        const message = await prisma.message.create({
            data: {
                text,
                chatId,
                userId: tokenUserId,
            }
        });

        await prisma.chat.update({
            where: {
                id: chatId,
            },
            data: {
                seenBy: [tokenUserId],
                lastMessage: text,
            },
        });


        res.status(200).json(message);

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-a putut adăuga mesajul." })
    }
};


