# Caching Server

A lightweight caching server built with TypeScript and Bun, designed to store and retrieve key-value pairs efficiently to reduce load on backend services or databases.

## Features
- In-memory key-value caching.
- Built with Bun for high performance.
- TypeScript for type safety and maintainability.

## Technologies
- **Runtime:** Bun (v1.2.20 or later)
- **Language:** TypeScript
- **Dependencies:** Managed via Bun package manager


## Installation & Usage
1. Pull the image and run:
   ```
   docker run -p <service-port>:<service-port> gajjarmohit/caching-server:latest --port 3001 --origin <your-targe-url>
   ```

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a Pull Request.

Ensure code follows TypeScript conventions and include tests where applicable.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details (create one if not present).

## Acknowledgments
- Initialized with [Bun](https://bun.sh/docs/cli/init).
- Inspired by simple caching solutions in TypeScript and Node.js.

For the latest updates, visit the [GitHub repository](https://github.com/Gajjar-Mohit/caching-server).