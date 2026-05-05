import express from "express";
import {
    submitReturnRequest,
    getMyReturns,
    getAllReturns,
    approveReturn,
    rejectReturn,
    processRefund
} from "../controllers/returnController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.route("/")
    .post(protect, submitReturnRequest);
router.route("/my")
    .get(protect, getMyReturns);

// Admin routes
router.route("/admin/all")
    .get(protect, admin, getAllReturns);
router.route("/admin/:id/approve")
    .put(protect, admin, approveReturn);
router.route("/admin/:id/reject")
    .put(protect, admin, rejectReturn);
router.route("/admin/:id/refund")
    .put(protect, admin, processRefund);

export default router;
