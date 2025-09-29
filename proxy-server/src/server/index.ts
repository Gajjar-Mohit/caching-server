import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
const app = express();

app.use(cors());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const startServer = async (port: number, targetServer: string) => {
  try {
    app.listen(port, () => {
      console.log(`HTTP Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    app.use(
      "/",
      proxy(targetServer, {
        userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
          userRes.setHeader("X-Cache", "MISS");
          return proxyResData;
        },
      })
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

export function startCachingServer(
  port: number,
  targetServer: string,
  clearCache: boolean
) {
  startServer(port, targetServer);
}
