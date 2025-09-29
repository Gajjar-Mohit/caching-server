import express from "express";
import cors from "cors";

const app = express();

const PORT = parseInt(process.env.PORT || "3000", 10);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/hello", (req, res) => {
  console.log(res.getHeaders());
  res.status(200).json({
    status: "Success",
    data: {
      hello: "World",
    },
  });
});

// app.use(errorHandler);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`HTTP Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export { app };
