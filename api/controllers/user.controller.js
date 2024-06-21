import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
    try {

        const users = await prisma.user.findMany();
        res.status(200).json(users)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-au putut lua utilizatorii." })
    }
};



export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-au putut lua utilizatorul." })
    }
};



export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Neautorizat!" })
    }

    let updatedPassword = null;

    try {

        if (password) {
            updatedPassword = await bcrypt.hash(password, 10)

        }

        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && { avatar }),
            },
        });


        const { password: userPassword, ...rest } = updateUser;

        res.status(200).json(rest)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-au putut actualiza utilizatorul." })
    }
};


export const deleteUser = async (req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Neautorizat!" })
    }

    try {
        await prisma.user.delete({
            where: { id }
        })
        res.status(200).json({ message: "Utilizator șters." })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-au putut șterge utilizatorul." })
    }
};




export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;

    console.log(tokenUserId)

    try {
        const number = await prisma.chat.count({
            where: {
                userIDs: {
                    hasSome: [tokenUserId],
                },
                NOT: {
                    seenBy: {
                        hasSome: [tokenUserId]
                    },
                },
            },
        });
        console.log(number)
        res.status(200).json(number);

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-au putut lua notificările." })
    }
};
