import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        avatar_url: String,
        phone: String,
        alternate_phone: String,
        shipping_address: String,
        shipping_area: String,
        shipping_city: String,
        shipping_state: String,
        shipping_pincode: String,
        shipping_country: String,
        addresses: [
            {
                shipping_address: String,
                shipping_area: String,
                shipping_city: String,
                shipping_state: String,
                shipping_pincode: String,
                shipping_country: String,
                isDefault: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        likedProducts: [{ type: Number }],
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        fcmToken: String,
    },
    { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

