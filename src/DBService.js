import mysql from 'mysql';

export default class DBService {
  async ensureConnection() {
    if (!this.connection) {
      this.connection = mysql.createConnection({
        host: process.env.DB_HOST,
        // port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
      });
      await (new Promise((res, rej) => {
        this.connection.connect(err => {
          if (err) {
            rej(err);
          } else {
            res();
          }
        });
      }));
    }
    return this.connection;
  }

  async executeQuery(...args) {
    await this.ensureConnection();
    return new Promise((res, rej) => {
      this.connection.query(...args, (error, results, fields) => {
        if (error) {
          rej(error);
        } else {
          res([results, fields]);
        }
      });
    });
  }
}
