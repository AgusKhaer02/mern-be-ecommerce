import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
// import Product from "../models/productModel.js";


const createOrder = asyncHandler(async (req, res) => {
    const {email, firstName, lastName, phone, cartItem} = req.body

    if (!cartItem || cartItem.length < 1) {
        res.status(400)
        throw new Error("Cart is empty")
    }

    let orderItem = []
    let total = 0

    for (const cart of cartItem) {
        const productData = await Product.findOne({ _id: cart.product})
        if (!productData) {
            res.status(404)
            throw new Error("ID Product tidak ditemukan");
        }


        const {name, price, _id} = productData;
        const singleProduct = {
            quantity: cart.quantity,
            name,
            price,
            product: _id
        }
        // cara menambahkan item product ke array orderItem
        orderItem = [...orderItem, singleProduct]

        total += cart.quantity * price
    }

    const order = await Order.create({
        itemsDetail: orderItem,
        total,
        firstName,
        lastName, 
        email,
        phone,
        user: req.user.id
    })
    return res.status(201).json({
        total,
        order,
        message: "Berhasil buat order product"
    })
})
const allOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find()
    return res.status(201).json({
        data: orders,
        message: "Berhasil buat order product"
    })
})
const detaliOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    return res.status(201).json({
        data:order,
        message: "Berhasil buat order product"
    })
})
const currentUserOrder = asyncHandler(async (req, res) => {
    const order = await Order.find({'user' : req.user.id})

    return res.status(201).json({
        data : order, 
        message: "Berhasil buat order product"
    })
})


export {createOrder, allOrder, detaliOrder, currentUserOrder}