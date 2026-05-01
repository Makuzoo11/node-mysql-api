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
    const { host, port, user, password, database } = config_json_1.default.database;
    const dbPassword = process.env.DB_PASSWORD || password;
    if (!dbPassword) {
        throw new Error('MySQL password is not configured. Set DB_PASSWORD or config.database.password.');
    }
    const connection = await promise_1.default.createConnection({
        host,
        port,
        user,
        password: dbPassword
    });
    // create DB if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
    // connect to DB
    const sequelize = new sequelize_1.Sequelize(database, user, dbPassword, { dialect: 'mysql' });
    // init models
    db.Account = (0, account_model_1.default)(sequelize);
    db.RefreshToken = (0, refresh_token_model_1.default)(sequelize);
    // define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);
    // sync models with database
    await sequelize.sync();
}
