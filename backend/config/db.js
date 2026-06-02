import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
    if (isConnected) {
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL);
        isConnected = db.connections[0].readyState === 1;
        console.log("DB connected");
    } catch (error) {
        console.log("db error:", error);
        throw error;
    }
}
export default connectDb;