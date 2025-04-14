import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        // type data
        type: String,
        // rules untuk masing masing field, dengan pesan error di setelah true (kalo kosong datanya)
        required: [true, "Nama Produk harus diisi"],
        // tidak ada username yang sama, mirip seperti primary key
        unique: [true, "Nama Produk sudah ada"],
    },
    price: {
        type: Number,
        required: [true, "Harga produk harus diisi"],
    },
    description: {
        type: String,
        required: [true, "Description harus diisi"],
    },
    image: {
        type: String,
        default: null
    },
    category: {
        type: String,
        required: [true, "Category harus diisi"],
        enum: ["Sepatu", "Kemeja", "Baju", "Celana"]
    },
    stock: {
        type: Number,
        required: [true, "Stock harus diisi"],
        default: 0
    },
})
const Product = mongoose.model("Product", productSchema)

export default Product