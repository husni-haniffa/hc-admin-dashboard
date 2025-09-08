import mongoose from "mongoose";

export async function connectDatabase () {
    try {
        const MONGODB_URI = process.env.MONGODB_URI
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI: Missing!")
        }
        if (mongoose.connections[0].readyState) {
            console.log("INFO: MongoDB already connected")
            return;
        }
        await mongoose.connect(MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        })
        mongoose.connection.on("connected", () => {
            console.log("Sucess: MongoDB connected");
        });
        mongoose.connection.on("error", (err) => {
            console.error("ERROR: MongoDB connection", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("INFO: MongoDB: disconnected");
        });
    } catch (_error) {
        console.error("ERROR: Failed to connect MongoDB", _error)
        process.exit(1)
    }
}