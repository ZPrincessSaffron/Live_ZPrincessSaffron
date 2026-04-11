import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import chatRoute from "./routes/chatRoutes.js";
connectDB();


app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);

