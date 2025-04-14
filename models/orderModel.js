import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const singleProduct = Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    product: {
        // buat id product yang berelasi dengan collection Product, maka wajib menggunakan ObjectID
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
})

const orderSchema = new Schema({
    total: {
        type: Number,
        required: [true, "Total harga harus diisi"]
    },
    itemsDetail: [singleProduct],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ["pending","failed","success"],
        default: "pending"
    },
    firstName: {
        type: String,
        required: [true, "Nama depan harus diisi"]
    },
    lastName: {
        type: String,
        required: [true, "Nama belakang harus diisi"]
    },
    phone: {
        type: String,
        required: [true, "Nomor telepon harus diisi"]
    },
    email: {
        type: String,
        required: [true, "Email harus diisi"]
    },
})
const Order = mongoose.model("Order", orderSchema)

export default Order