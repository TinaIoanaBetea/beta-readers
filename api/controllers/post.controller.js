import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
    const query = req.query;

    try {
        const posts = await prisma.post.findMany({
            where: {
                title: query.title || undefined,
                author: query.author || undefined,
                title: query.title || undefined,
                genre: query.genre || undefined,
                age: query.age || undefined,
                words: {
                    lte: parseInt(query.maxWords) || 1000000000,
                }
            }
        })

        setTimeout(() => {
            res.status(200).json(posts)
        }, 500);


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-au putut lua cărțile" })
    }
};

export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                },
            }
        })

        res.status(200).json(post)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-a putut lua cartea" })
    }
};

export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,
                },
            }
        })
        res.status(200).json(newPost)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-a putut adăuga cartea" })
    }
}

export const updatePost = async (req, res) => {

    try {

        res.status(200).json()

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-au putut șterge cartea" })
    }
};


export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    try {

        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Neautorizat" })
        }

        await prisma.post.delete({
            where: { id },
        });

        res.status(200).json({ message: "Carte ștearsă" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Nu s-a putut șterge cartea" })
    }
}