const express = require("express");
const userRouter = require("./routes/userRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const AppError = require("./util/AppError");

const app = express();

// Connect to the database
require("./config/db")();

app.use(express.json());

app.use("/", userRouter);

// Unhandled route error handling
app.all("*", (req, res, next) => {
  next(
    new AppError(`The request ${req.originalUrl} not found on this server`, 404)
  );
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
