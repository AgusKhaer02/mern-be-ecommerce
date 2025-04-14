import express from 'express'
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/OrderRouter.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { notFound, errorHandler } from './middlewares/errorMiddlewares.js';
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import mongoSanitize from './utils/sanitize.js';

const app = express()
const port = 3000
// untuk mengambil isi dari file .env
dotenv.config()

// middlewares
// gunakan json untuk melakukan req dan res
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(helmet())
app.use(mongoSanitize); // Use the custom middleware
// ERROR : TypeError: Cannot set property query of #<IncomingMessage> which has only a getter
// app.use(ExpressMongoSanitize())
// app.use(
//   ExpressMongoSanitize({
//     allowDots: true,
//     replaceWith: '_',
//   }),
// );

app.use(cookieParser())


// jadi ini supaya folder public bisa diakses oleh browser
// ini cara mengaksesnya : http://localhost:3000/uploads/image-1744253953241.png
app.use(express.static('./public'))

mongoose.connect(process.env.DATABASE, {}).then(() => {
    console.log("Connected to MongoDB")
})

// Parent Router
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/order', orderRouter)
app.use(notFound)
app.use(errorHandler)

// server
app.listen(port, () => {
  console.log(`Aplikasi berjalan di port : ${port}`)
})