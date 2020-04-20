import jwt from 'jsonwebtoken';
import userService from './UserService';

export function authMiddleware() {
  let tokenRegex = /Bearer\s(.+)/;
  return async (req, res, next) => {
    if (!tokenRegex.test(req.headers.authorization)) {
      res.status(401).end();
    } else {
      let token = tokenRegex.exec(req.headers.authorization)[1];
      try {
        let payload = jwt.verify(token, process.env.SECRET);
        let user = await userService.getByUsername(payload.subject);
        if (!user) {
          throw new Error();
        }
        req.principal = user.username;
      } catch (e) {
        res.status(401).end();
      }
      next();
    }
  };
}

export function generateToken(username) {
  return jwt.sign({
    subject: username,
    // The expiration is represented as a NumericDate: not miliseconds but seconds since the Epoch time
    exp: Math.ceil(Date.now() / 1000) + 60 * 60 * 48 // two days
  }, process.env.SECRET);
};

export function validateToken(token) {
  // if valid, it returns decoded payload;
  return jwt.verify(token, process.env.SECRET);
};
