import DBService from './DBService';
import crypto from 'crypto';
import {generateToken} from './auth';

class UserService extends DBService {
  async getByUsername(username) {
    let result = await this.executeQuery(`select * from users where username = '${username}'`);
    return result[0].length > 0 ? result[0][0] : null;
  }
  async login(username, password) {
    let user = await this.getByUsername(username);
    if (!user) {
      throw new Error('invalid username or password');
    }
    let hash = crypto.pbkdf2Sync(password, 'salt', 10000, 50, 'sha512').toString('hex');
    if (user.password !== hash) {
      throw new Error('invalid username or password');
    }
    delete user.password;
    user.token = generateToken(username);
    return user;
  }
}

export default new UserService();
