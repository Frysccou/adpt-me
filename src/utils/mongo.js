import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error('Error conectando a la base de datos:', error);
        process.exit(1);
    }
};

export default connectDB;