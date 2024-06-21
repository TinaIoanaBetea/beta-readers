import jwt from "jsonwebtoken"


export const shouldBeLoggedIn = async (req, res) => {
 
    console.log(req.userId)

    res.status(200).json({ message: "Autentificat!" })

}
export const shouldBeAdmin = async (req, res) => {
    const token = req.cookies.token

    if (!token) return res.status(401).json({ message: "Neautentificat!" })

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(403).json({ message: "Invalid!" });
        if(!payload.isAdmin){
            return res.status(403).json({ message: "Neautorizat!" })
        }
    })

    res.status(200).json({ message: "Autentificat!" })
}