import express from "express";
import cors from "cors";
import morgan from "morgan";
import colors from "colors";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import routes from "./routes/routes";
import db from "./config/db";

// Env config
require("dotenv").config({ path: `${__dirname}/config/config.env` });

db.connectDB(); // Database

// Init Express
const app = express();

// 304 Status code
app.disable("etag");

// Init CORS
app.use(cors());

// Body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(xss()); // XSS Prevent

app.use(hpp()); // HPP Security

app.use(helmet()); // Helmet Security Utilities

// Request limiter
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, // 10 min
  max: 100,
  message: "Too many requests. Try again later",
});
app.use(limiter);

// Morgan Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
routes(app);

app.use((req, res, next) => {
  console.log("\nError 404 - Not found".red.bold);
  res.status(404).json({
    success: false,
    error: "404 - Not found",
  });
});

// Server port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`\nListen on: http://localhost:${port}/shelter/v1/`.cyan.bold);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Async err: ${err}`.red.bold);
});
