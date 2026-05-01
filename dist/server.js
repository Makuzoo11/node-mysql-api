"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_1 = __importDefault(require("./_helpers/swagger"));
const error_handler_1 = __importDefault(require("./_middleware/error-handler"));
const cors_1 = __importDefault(require("cors"));
const config_json_1 = __importDefault(require("./config.json"));
const accounts_controller_1 = __importDefault(require("./accounts/accounts.controller")); // 
const db_1 = require("./_helpers/db");
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 4000;
// middleware
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// routes
app.use('/api/accounts', accounts_controller_1.default); // 
app.use('/api-docs', swagger_1.default);
// test routes (optional, you can keep these)
app.get("/", (_req, res) => {
    res.json({
        message: "node-mysql-api is running",
        port,
    });
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.get("/config", (_req, res) => {
    res.json({
        database: {
            host: config_json_1.default.database.host,
            port: config_json_1.default.database.port,
            user: config_json_1.default.database.user,
            database: config_json_1.default.database.database,
        },
    });
});
app.use(error_handler_1.default);
async function start() {
    await db_1.ready;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
