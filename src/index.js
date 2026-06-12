import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

console.log("INDEX CLOUD:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("INDEX KEY:", process.env.CLOUDINARY_API_KEY);
console.log("INDEX SECRET:", process.env.CLOUDINARY_API_SECRET);

import connectDB from "./db/index.js";
import app from "./app.js";

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port : ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("mongo db connection failed!!!", err);
});