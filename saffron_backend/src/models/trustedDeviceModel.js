import mongoose from "mongoose";

const trustedDeviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    deviceId: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
    },
}, { timestamps: true });

// Ensure unique combination of userId and deviceId
trustedDeviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

const TrustedDevice = mongoose.model("TrustedDevice", trustedDeviceSchema);
export default TrustedDevice;
