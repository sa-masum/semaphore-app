import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { User } from './models/userSchema.js';
import { Customer } from './models/customerSchema.js';

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);


const app = express();
const port = 8000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
    origin: '*', 
    credentials: false,
  }));

app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB.")
}).catch((error) => {
    console.log("Error connecting to MongoDB-", error)
})


app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});


// Signup
app.post('/api/v1/user/signup', async (req, res) => {
    try {
        console.log('Received signup request:', req.body);
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({ error: 'Signup failed' });
    }
});

// Signin
app.post('/api/v1/user/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Signin failed', details: error.message });
    }
});

// Profile
app.get('/api/v1/user/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            profile: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Edit profile
app.put('/api/v1/user/edit-profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const { username, email } = req.body;
        
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { username, email },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            profile: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(400).json({ message: 'Failed to update profile' });
    }
});

// Change password
app.put('/api/v1/user/change-password', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(decoded.userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(400).json({ message: 'Failed to change password' });
    }
});

app.get('/api/v1/user/customer-count', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const count = await Customer.countDocuments({ userId: decoded.userId });
        
        res.json({
            success: true,
            count: count
        });
    } catch (error) {
        console.error('Customer count error:', error);
        res.status(400).json({ message: 'Failed to get customer count' });
    }
});

// Add customer
app.post('/api/v1/customers/add', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Validate required fields
        if (!req.body.name || !req.body.phone1) {
            return res.status(400).json({
                success: false,
                message: 'Name and primary phone are required'
            });
        }

        // Clean up empty strings in optional fields
        const customerData = Object.entries(req.body).reduce((acc, [key, value]) => {
            if (value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const customer = new Customer({
            ...customerData,
            userId: decoded.userId
        });

        await customer.save();

        res.status(201).json({
            success: true,
            message: 'Customer added successfully',
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone1: customer.phone1
            }
        });
    } catch (error) {
        console.error('Customer creation error:', error);
        res.status(400).json({ 
            success: false,
            message: error.name === 'ValidationError' 
                ? 'Invalid customer data' 
                : 'Failed to add customer',
            error: error.message 
        });
    }
});

// Get customers list
app.get('/api/v1/user/customers', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const customers = await Customer.find({ userId: decoded.userId });
        
        res.json({
            success: true,
            customers: customers
        });
    } catch (error) {
        console.error('Customers fetch error:', error);
        res.status(400).json({ message: 'Failed to fetch customers' });
    }
});