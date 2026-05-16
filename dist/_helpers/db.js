"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ready = void 0;
const config_json_1 = __importDefault(require("../config.json"));
const promise_1 = __importDefault(require("mysql2/promise"));
const sequelize_1 = require("sequelize");
const account_model_1 = __importDefault(require("../accounts/account.model"));
const refresh_token_model_1 = __importDefault(require("../accounts/refresh-token.model"));
const db = {};
exports.default = db;
exports.ready = initialize();
async function initialize() {
    var _a, _b, _c, _d, _e, _f;
    const host = (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : config_json_1.default.database.host;
    const port = Number((_b = process.env.DB_PORT) !== null && _b !== void 0 ? _b : config_json_1.default.database.port);
    const user = (_c = process.env.DB_USER) !== null && _c !== void 0 ? _c : config_json_1.default.database.user;
    const database = (_d = process.env.DB_NAME) !== null && _d !== void 0 ? _d : config_json_1.default.database.database;
    // Allow either env vars or config.json, and keep blank passwords supported.
    const dbPassword = (_f = (_e = process.env.DB_PASSWORD) !== null && _e !== void 0 ? _e : config_json_1.default.database.password) !== null && _f !== void 0 ? _f : '';
    let connection;
    try {
        connection = await promise_1.default.createConnection({
            host,
            port,
            user,
            password: dbPassword
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'ER_ACCESS_DENIED_ERROR') {
            throw new Error(`MySQL rejected the connection for user '${user}'@'${host}'. ` +
                `Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME as needed.`);
        }
        throw error;
    }
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
    const sequelize = new sequelize_1.Sequelize(database, user, dbPassword, {
        host,
        port,
        dialect: 'mysql'
    });
    db.Account = (0, account_model_1.default)(sequelize);
    db.RefreshToken = (0, refresh_token_model_1.default)(sequelize);
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);
    await sequelize.sync();
}
