import User from "../models/userModel.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    console.time(`[DB] User.findById (profile:${req.user._id})`);
    const user = await User.findById(req.user._id).lean();
    console.timeEnd(`[DB] User.findById (profile:${req.user._id})`);

    if (user) {
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            isAdmin: user.isAdmin,
            avatar_url: user.avatar_url,
            phone: user.phone,
            alternate_phone: user.alternate_phone,
            shipping_address: user.shipping_address,
            shipping_area: user.shipping_area,
            shipping_city: user.shipping_city,
            shipping_state: user.shipping_state,
            shipping_pincode: user.shipping_pincode,
            shipping_country: user.shipping_country,
            addresses: user.addresses || [],
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.avatar_url = req.body.avatar_url || user.avatar_url;
        user.phone = req.body.phone || user.phone;
        user.alternate_phone = req.body.alternate_phone || user.alternate_phone;
        user.shipping_address = req.body.shipping_address || user.shipping_address;
        user.shipping_area = req.body.shipping_area || user.shipping_area;
        user.shipping_city = req.body.shipping_city || user.shipping_city;
        user.shipping_state = req.body.shipping_state || user.shipping_state;
        user.shipping_pincode = req.body.shipping_pincode || user.shipping_pincode;
        user.shipping_country = req.body.shipping_country || user.shipping_country;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            avatar_url: updatedUser.avatar_url,
            phone: updatedUser.phone,
            alternate_phone: updatedUser.alternate_phone,
            shipping_address: updatedUser.shipping_address,
            shipping_area: updatedUser.shipping_area,
            shipping_city: updatedUser.shipping_city,
            shipping_state: updatedUser.shipping_state,
            shipping_pincode: updatedUser.shipping_pincode,
            shipping_country: updatedUser.shipping_country,
            addresses: updatedUser.addresses || [],
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};
// @desc    Add new address
// @route   POST /api/users/profile/addresses
// @access  Private
export const addUserAddress = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const {
            shipping_address,
            shipping_area,
            shipping_city,
            shipping_state,
            shipping_pincode,
            shipping_country,
            isDefault,
        } = req.body;

        const newAddress = {
            shipping_address,
            shipping_area,
            shipping_city,
            shipping_state,
            shipping_pincode,
            shipping_country,
            isDefault: isDefault || false,
        };

        // If this is the first address, make it default
        if (user.addresses.length === 0) {
            newAddress.isDefault = true;
        }

        // If new address is default, unset other defaults
        if (newAddress.isDefault) {
            user.addresses.forEach((addr) => (addr.isDefault = false));
            // Also update top-level shipping fields for compatibility
            user.shipping_address = shipping_address;
            user.shipping_area = shipping_area;
            user.shipping_city = shipping_city;
            user.shipping_state = shipping_state;
            user.shipping_pincode = shipping_pincode;
            user.shipping_country = shipping_country;
        }

        user.addresses.push(newAddress);
        await user.save();
        res.status(201).json(user.addresses);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Update address
// @route   PUT /api/users/profile/addresses/:addressId
// @access  Private
export const updateUserAddress = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const address = user.addresses.id(req.params.addressId);

        if (address) {
            address.shipping_address = req.body.shipping_address || address.shipping_address;
            address.shipping_area = req.body.shipping_area || address.shipping_area;
            address.shipping_city = req.body.shipping_city || address.shipping_city;
            address.shipping_state = req.body.shipping_state || address.shipping_state;
            address.shipping_pincode = req.body.shipping_pincode || address.shipping_pincode;
            address.shipping_country = req.body.shipping_country || address.shipping_country;
            
            if (req.body.isDefault !== undefined) {
                address.isDefault = req.body.isDefault;
                if (address.isDefault) {
                    user.addresses.forEach((addr) => {
                        if (addr._id.toString() !== req.params.addressId) {
                            addr.isDefault = false;
                        }
                    });
                    // Sync top-level fields
                    user.shipping_address = address.shipping_address;
                    user.shipping_area = address.shipping_area;
                    user.shipping_city = address.shipping_city;
                    user.shipping_state = address.shipping_state;
                    user.shipping_pincode = address.shipping_pincode;
                    user.shipping_country = address.shipping_country;
                }
            }

            await user.save();
            res.json(user.addresses);
        } else {
            res.status(404).json({ message: "Address not found" });
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Delete address
// @route   DELETE /api/users/profile/addresses/:addressId
// @access  Private
export const deleteUserAddress = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.addresses = user.addresses.filter(
            (addr) => addr._id.toString() !== req.params.addressId
        );
        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Set default address
// @route   PUT /api/users/profile/addresses/:addressId/default
// @access  Private
export const setDefaultAddress = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.addresses.forEach((addr) => {
            if (addr._id.toString() === req.params.addressId) {
                addr.isDefault = true;
                // Sync top-level fields
                user.shipping_address = addr.shipping_address;
                user.shipping_area = addr.shipping_area;
                user.shipping_city = addr.shipping_city;
                user.shipping_state = addr.shipping_state;
                user.shipping_pincode = addr.shipping_pincode;
                user.shipping_country = addr.shipping_country;
            } else {
                addr.isDefault = false;
            }
        });
        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Update FCM token
// @route   PUT /api/users/fcm-token
// @access  Private
export const updateFCMToken = async (req, res) => {
    try {
        const { fcmToken } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.fcmToken = fcmToken;
            await user.save();
            res.json({ message: "FCM token updated successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

