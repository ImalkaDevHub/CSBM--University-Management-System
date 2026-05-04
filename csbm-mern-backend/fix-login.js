const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete existing user if any to avoid unique index issues
        await User.deleteOne({ email: 'imalkam32@gmail.com' });

        // Create fresh user with plain text password
        const user = new User({
            fullName: 'Imalka Madushan',
            email: 'imalkam32@gmail.com',
            password: 'ima123',
            role: 'STUDENT'
        });

        await user.save();
        console.log('✅ User "imalkam32@gmail.com" has been RESET to password "ima123"');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error resetting user:', err);
        process.exit(1);
    }
};

run();
