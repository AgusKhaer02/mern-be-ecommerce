import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const protectedMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    // mengambil jwt dari cookiesnya
    token = req.cookies.jwt

    if (token) {
        try {
            // cek dan verifikasi apakah jwt masih valid atau tidak
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // cari user berdasarkan ID (ini dari payload JWT nya.....)
            req.user = await User.findById(decoded.id).select('-password')
            next()

        } catch (error) {
            res.status(401)
            throw new Error('Your token is invalid, please log in')
        }
    }else{
        res.status(401)
        throw new Error("No Token Found")
    }
})


// pengecekan apakah user yang sedang login itu owner atau tidak
// langkah pengecekan : protectedMiddleware(cek ada jwt/valid jwt) -> ownerMiddleware(cek role admin/tidak)
const ownerMiddleware = asyncHandler(async (req, res, next) => {

    // untuk data usernya itu sudah dari protectedMiddleware
    // yang mana data sudah di next dari protectedMiddleware
    if (req.user && req.user.role === 'owner') {
        next()
    }else{
        res.status(401)
        throw new Error("You are not an owner")
    }
})

export {protectedMiddleware , ownerMiddleware}