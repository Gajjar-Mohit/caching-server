import express from "express";
import cors from "cors";
const app = express();

app.use(cors());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const startServer = async (port: number) => {
  try {
    app.listen(port, () => {
      console.log(`HTTP Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

export function startCachingServer(port: number, targetServer: string, clearCache: boolean) {
  startServer(port);
}
