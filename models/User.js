const crypto = require('crypto')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserShema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "Please provide a username"]
    },
    email: {
        type: String,
        require: [true, "Please provide a email"],
        unique: true,
        match: [
            /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlenght: 6,
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

UserShema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

UserShema.methods.matchPasswords = async function(password) {
    return await bcrypt.compare(password, this.password);
}

UserShema.methods.getSignedToken = function() {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

UserShema.methods.getResertPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetToken = crypto.createHash("sha256").update(resatToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

    return resetToken
}

const User = mongoose.model('User', UserShema);

module.exports = User;