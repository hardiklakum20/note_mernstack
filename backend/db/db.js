const mongoose = require('mongoose');

const ConnectDB = async () => {
    const url = process.env.MONGO_URL;
    try {
        await mongoose.connect(url);
        console.log('Database connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = ConnectDB;