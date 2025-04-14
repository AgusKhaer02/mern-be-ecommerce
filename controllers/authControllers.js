import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendResToken = (user, statusCode, res) => {
    // ini bisa mengambil id dari hasil auth (login/register)
    const token = signToken(user._id)

    const isDev = process.env.NODE_ENV === 'development' ? false : true
    const cookieOption = {
        // ini artinya jadi 6 hari
        expire: new Date(
            Date.now() + 6 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        security: isDev
    }

    // res.cookie(nama keynya apa, apa yang mau dimasukin, pengaturannya gimana)
    // res.cookie(key, values, options)
    res.cookie('jwt', token, cookieOption)

    user.password = undefined

    res.status(statusCode).json({
        data: user
    })
}

const registerUser = asyncHandler(async (req, res) => {

    // countDocuments untuk menghitung berapa jumlah data di collection User
    const isOwner = (await User.countDocuments()) === 0

    // jadi, jika tidak ada data user, maka data pertama akan menjadi owner
    const role = isOwner ? 'owner' : "user"

    // mongoose query : CREATE
    const createUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: role,
    })

    createSendResToken(createUser, 201, res)
})

const loginUser = asyncHandler(async (req, res) => {

    // apakan input email || password itu kosong?
    if (!req.body.email || !req.body.password) {
        res.status(400)
        throw new Error("Inputan email/password tidak boleh kosong")
    }

    // mongoose query : FIND
    // cek apakah email yang dimasukan ada di db / tidak
    const userData = await User.findOne({
        email: req.body.email
    })

    // cek password
    // comparePassword berasal dari userModel, jadi untuk cara mengaksesnya, melalui userData, hasil dari mongoose.model("User", userSchema) adalah dari classnya itu sendiri, selengkapnya lihat di userModel
    if (userData && (await userData.comparePassword(req.body.password))) {
        createSendResToken(userData, 200, res)
    } else {
        res.status(400)
        throw new Error("Invalid User")
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password")

    if (user) {
        return res.status(200).json({ user })
    } else {
        res.status(404)

        throw new Error("User not found");

    }
})
const logoutUser = async (req, res) => {
    res.cookie('jwt', "", {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(200).json({
        message: "Logout Berhasil"
    })
}

export {registerUser, loginUser, getCurrentUser, logoutUser}