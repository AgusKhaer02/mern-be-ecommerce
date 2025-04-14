import express from "express";
import { protectedMiddleware, ownerMiddleware } from "../middlewares/authMiddleware.js";
import { createOrder, allOrder, detaliOrder, currentUserOrder } from "../controllers/OrderController.js";
const router = express.Router()

router.post('/', protectedMiddleware, createOrder)
router.get('/', protectedMiddleware, ownerMiddleware, allOrder)
router.get('/:id', protectedMiddleware, ownerMiddleware, detaliOrder)
router.get('/current/user', protectedMiddleware, currentUserOrder)

export default router