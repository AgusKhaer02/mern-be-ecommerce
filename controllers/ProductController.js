import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const createProduct = asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body)
    return res.status(201).json({
        message: "Berhasil tambah product",
        data: newProduct
    })
})

const allProduct = asyncHandler(async (req, res) => {
    const queryObj = {
        ...req.query
    }

    // fungsi untuk mengabaikan jika ada req page dan limit
    const excludeFields = ["page", "limit", "name"]
    excludeFields.forEach((element) => delete queryObj[element])

    let query

    // mencari kata kata name berdasarkan yang ada di regex, untuk posisi dari kata katanya bisa bebas, yang penting terdapat name yang tercantum
    if (req.query.name) {
        query = Product.find({
            name: { $regex: req.query.name, $options: 'i' }
        })
    } else {
        // jika selain name, maka cari dengan kriteria yang lain
        query = Product.find(queryObj)
    }
    // || untuk mencegah nilai negatif seperti 0, false, ''(string kosong), null, undefined
    // pagination 
    const page = req.query.page * 1 || 1
    // membatasi berapa data yang akan ditampilkan
    const limitData = req.query.limit * 1 || 30
    // untuk skip beberapa data
    const skipData = (page - 1) * limitData

    query = query.skip(skipData).limit(limitData)

    // hitung data produknya
    const numProduct = await Product.countDocuments()
    if (req.query.page) {

        // jika angka skipdata lebih besar dari jumlah produk
        if (skipData >= numProduct) {
            res.status(404)
            throw new Error("This page doesn't exist");
        }
    }
    const data = await query

    return res.status(200).json({
        message: "Berhasil tampil semua product",
        data,
        count: numProduct
    })
})

const detailProduct = asyncHandler(async (req, res) => {
    const paramsID = req.params.id
    const productData = await Product.findById(paramsID)

    return res.status(200).json({
        message: "Berhasil tampil detail product",
        data: productData
    })
})

const updateProduct = asyncHandler(async (req, res) => {
    const paramsID = req.params.id
    const updateProduct = await Product.findByIdAndUpdate(paramsID, req.body, {
        runValidators: false,
        new: true
    })

    return res.status(201).json({
        message: "Update berhasil",
        data: updateProduct
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const paramsID = req.params.id
    const deleteProduct = await Product.findByIdAndDelete(paramsID)

    return res.status(201).json({
        message: "Delete berhasil",
        data: deleteProduct
    })
})

const fileUpload = asyncHandler(async (req, res) => {
    const file = req.file;
    const paramsID = req.params.id
    if (!file) {
        res.status(400)
        throw new Error("Tidak ada file yang diinput");
    }

    const imageFileName = file.filename
    const pathImageFile = `/uploads/${imageFileName}`

    await Product.findByIdAndUpdate(paramsID, {
        image: pathImageFile
    }, {
        runValidators: false,
        new: true
    })

    res.status(200).json({
        message: "Image berhasil diupload",
        image: pathImageFile
    })
})

export { createProduct, allProduct, detailProduct, updateProduct, deleteProduct, fileUpload }