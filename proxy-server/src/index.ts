#!/usr/bin/env node
import { Command } from "commander";
import { startCachingServer } from "./server";

const program = new Command();

program
  .name("caching-server")
  .description("A powerful caching proxy server with CLI interface")
  .version("1.0.0");

program
  .option(
    "-p, --port <number>",
    "port number for the caching proxy server",
    "3000"
  )
  .option("-o, --origin <url>", "origin server URL to forward requests to")
  .option("--clear-cache", "clear the cache before starting", false)
  .helpOption("-h, --help", "display help information");

program.parse(process.argv);

const options = program.opts();

if (!options.origin) {
  console.error("Error: Origin server URL is required");
  program.help();
}

const port = parseInt(options.port);
if (isNaN(port) || port < 1 || port > 65535) {
  console.error("Error: Port must be a valid number between 1 and 65535");
  process.exit(1);
}

try {
  new URL(options.origin);
} catch {
  console.error("Error: Invalid origin URL format");
  process.exit(1);
}

startCachingServer(port, options.origin, options.clearCache);
