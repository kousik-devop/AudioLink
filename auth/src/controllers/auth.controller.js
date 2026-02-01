import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { publishToQueue } from '../broker/cloudmq.js';

export async function register(req, res) {

    const { email, password, fullname: { firstName, lastName }, role = "user" } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email })

    if (isUserAlreadyExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);


    const user = await userModel.create({
        email,
        password: hash,
        fullname: {
            firstName,
            lastName
        },
        role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role,
        fullname: user.fullname
    }, config.JWT_SECRET, { expiresIn: "2d" })

    await publishToQueue("user_created", {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role
    })

    res.cookie("token", token)

    res.status(201).json({
        message: "User created successfully",
        user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            role: user.role
        }
    })

}

export async function login(req, res) {
    
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
        fullname: user.fullname
    }, config.JWT_SECRET, { expiresIn: "2d" })

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            role: user.role
        }
    })
}

export async function getCurrentUser(req, res) {
    return res.status(200).json({
        message: 'Current user fetched successfully',
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            fullname: `${req.user.firstname} ${req.user.lastname}`,
            role: req.user.role,
            address: req.user.address
        }
    });
}

export async function logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}


export async function googleAuthCallback(req, res) {

    const user = req.user;

    const existUser = await userModel.findOne({
        $or: [
            { email: user.emails[0].value },
            { googleId: user.id }
        ]
    })

    if (existUser) {
        const token = jwt.sign({
            id: existUser._id,
            role: existUser.role,
            fullname: existUser.fullname
        }, config.JWT_SECRET, { expiresIn: "2d" })

        res.cookie("token", token)

        // res.status(200).json({
        //     message: "User logged in successfully",
        //     user: {
        //         id: existUser._id,
        //         email: existUser.email,
        //         fullname: existUser.fullname,
        //         role: existUser.role
        //     }
        // })

        if (existUser.role === 'artist') {
            return res.redirect('http://localhost:5173/artist/dashboard'); // Redirect to your frontend URL
        }

        return res.redirect('http://localhost:5173'); // Redirect to your frontend URL
    }

    const newUser = await userModel.create({
        googleId: user.id,
        email: user.emails[0].value,
        fullname: {
            firstName: user.name.givenName,
            lastName: user.name.familyName
        }
    })

    await publishToQueue("user_created", {
        id: newUser._id,
        email: newUser.email,
        fullname: newUser.fullname,
        role: newUser.role
    })

    const token = jwt.sign({
        id: newUser._id,
        role: newUser.role,
        fullname: newUser.fullname
    }, config.JWT_SECRET, { expiresIn: "2d" })

    res.cookie("token", token)

    // res.status(200).json({
    //     message: "User registered successfully",
    //     user: {
    //         id: newUser._id,
    //         email: newUser.email,
    //         fullname: newUser.fullname,
    //         role: newUser.role
    //     }
    // })

    return res.redirect('http://localhost:5173'); // Redirect to your frontend URL
}

