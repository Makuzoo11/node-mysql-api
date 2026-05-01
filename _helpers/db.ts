import config from '../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;
export const ready = initialize();

async function initialize() {
    const host = process.env.DB_HOST ?? config.database.host;
    const port = Number(process.env.DB_PORT ?? config.database.port);
    const user = process.env.DB_USER ?? config.database.user;
    const database = process.env.DB_NAME ?? config.database.database;

    // Allow either env vars or config.json, and keep blank passwords supported.
    const dbPassword = process.env.DB_PASSWORD ?? config.database.password ?? '';

    let connection;
    try {
        connection = await mysql.createConnection({
            host,
            port,
            user,
            password: dbPassword
        });
    } catch (error: any) {
        if (error?.code === 'ER_ACCESS_DENIED_ERROR') {
            throw new Error(
                `MySQL rejected the connection for user '${user}'@'${host}'. ` +
                `Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME as needed.`
            );
        }

        throw error;
    }

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    const sequelize = new Sequelize(database, user, dbPassword, {
        host,
        port,
        dialect: 'mysql'
    });

    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
}
