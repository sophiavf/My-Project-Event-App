import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: './.env' });

const MONGODB_URI: string = process.env.MONGODB_URI!;

async function connectToMongoDB() {
	try {
		// Connect to MongoDB
		await mongoose.connect(MONGODB_URI);
		console.log("Connected to MongoDB");
	} catch (err) {
		if (err instanceof Error) {
			console.error(`Error connecting to MongoDB: ${err.message}`);
		} else if (typeof err === "string") {
			err.toUpperCase();
		}
	}
}

async function disconnectFromMongoDB() {
	await mongoose.disconnect();
}

export { connectToMongoDB, disconnectFromMongoDB };
