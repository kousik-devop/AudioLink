import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import config from '../config/config.js';


const authMiddleware = async (req, res, next) => {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user; // ✅ REAL USER DOCUMENT
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
