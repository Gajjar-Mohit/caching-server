import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import { createClient } from "redis";
import zlib from "zlib";
import { promisify } from "util";

const app = express();
app.use(cors());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const config = {
  redis: {
    host: "127.0.0.1",
    port: 6379,
    db: 0,
  },
};

async function createRedisClient() {
  const client = createClient({
    socket: {
      host: config.redis.host,
      port: config.redis.port,
    },

    database: config.redis.db,
  });
  await client.connect();
  return client;
}

const redisClient = await createRedisClient();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const startServer = async (port: number, targetServer: string) => {
  try {
    app.listen(port, () => {
      console.log(`HTTP Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    const brotliDecompress = promisify(zlib.brotliDecompress);
    const gunzip = promisify(zlib.gunzip);
    const inflate = promisify(zlib.inflate);

    app.use(
      "/",
      proxy(targetServer, {
        userResDecorator: async function (
          proxyRes,
          proxyResData,
          userReq,
          userRes
        ) {
          const key = userReq.path.replace(/\//g, ":").substring(1);
          const cachedData = await redisClient.get(key);

          if (cachedData) {
            console.log("Cache HIT");
            userRes.setHeader("X-Cache", "HIT");
            userRes.removeHeader("Content-Encoding");
            return cachedData;
          } else {
            console.log("Cache MISS");
            userRes.setHeader("X-Cache", "MISS");

            let decompressedData;
            const encoding = proxyRes.headers["content-encoding"];

            try {
              if (encoding === "br") {
                decompressedData = await brotliDecompress(
                  Buffer.from(proxyResData)
                );
              } else if (encoding === "gzip") {
                decompressedData = await gunzip(Buffer.from(proxyResData));
              } else if (encoding === "deflate") {
                decompressedData = await inflate(Buffer.from(proxyResData));
              } else {
                decompressedData = proxyResData;
              }

              const dataString = decompressedData.toString("utf-8");
              await redisClient.setEx(key, 300, dataString);
              userRes.removeHeader("Content-Encoding");

              return dataString;
            } catch (error) {
              console.error("Decompression error:", error);
              return proxyResData;
            }
          }
        },
      })
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

export async function startCachingServer(
  port: number,
  targetServer: string,
  clearCache: boolean
) {
  startServer(port, targetServer);
}
