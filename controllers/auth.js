const crypto = require('crypto')
const User = require('../models/User');
const ErrorResponse = require("../utils/errorResponse")
const sendEmail = require('../utils/sendEmail')

exports.register = async (req, res, next) => {
   const {username, email, password} = req.body;

   try {
    const user = await User.create({
        username, 
        email, 
        password,
    });

   sendToken(user, 201, res);
   } catch (error) {
    next(error);
   }
};

exports.login = async (req, res, next) => {     
    const { email, password} = req.body;

    if(!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400))
    }
    
    try {
        const user = await User.findOne({ email }).select("+password");

        if(!user) {
            return next(new ErrorResponse("Invalid Credentials", 401))
        }

        const isMatch = await user.matchPasswords(password);

        if(!isMatch) {
            return next(new ErrorResponse("Invalid Credentials", 401))
        }

        sendToken(user, 200, res);

    } catch {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.forgotpassword = async (req, res, next) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
            return next(new ErrorResponse("Email could not be send", 404))
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:3000/passwordreset/${reserToken}`;

        const message = `
        <h1>You gave request a password reset</h1>
        <p>Please go to this link to reste your password</p>
        <a href=${resetUrl} clicktraking = off>${resetUrl} </a>
        `

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Resert Request",
                text: message
            });

            res.status(200).json({ success: true, data: "Email Send"})
        } catch (error) {
            user.reserPasswordToken = undefined;
            user.reserPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email cloud not be send", 500))
        }
        
    } catch (error) {
        next(error);
    }
};

exports.resetpassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req,params.resetToken).digest
    ("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            reserPasswordExpire: { $gt: Date.now()}
        })

        if(!user) {
            return next(new ErrorResponse("Invalid Reset Token", 400))
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        
        res.status(201).json({
            success: true,
            data: "Password Reset Success"
        })
        } catch (error) {
            next(error);
        }
    }


const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token })
}