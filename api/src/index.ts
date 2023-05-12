import { connectToMongoDB } from "./dataBase/db";
import expressApp from "./routes/expressApp";

import dotenv from "dotenv";
dotenv.config();

async function startServer() {
	const PORT = process.env.PORT || 3000;
	try {
		await connectToMongoDB();
		expressApp.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	} catch (error) {
		console.error(`Error starting the server: ${PORT}`);
	}
}

startServer();
