import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import userRouter from "./routes/user.route.js"
import listingRouter from "./routes/listing.route.js"
import bookingRouter from "./routes/booking.route.js"
let port = process.env.PORT || 6000

let app = express()

// Database connection middleware to ensure connection is established before processing requests in serverless environment
app.use(async (req, res, next) => {
    try {
        await connectDb();
        next();
    } catch (err) {
        return res.status(500).json({ message: "Database connection failed", error: err.message });
    }
});
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRouter )
app.use("/api/user", userRouter )
app.use("/api/listing",listingRouter )
app.use("/api/booking",bookingRouter )

app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({
        message: "Internal Server Error caught by global handler",
        error: err.message,
        stack: err.stack
    });
});

if (process.env.NODE_ENV !== "production") {
    app.listen(port,()=>{
        console.log(`server started on port ${port}`)
    })
}

export default app