import {Router} from 'express';
import userService from './UserService';

const router = Router();

router.post('/login', async (req, res) => {
  let {username, password} = req.body;
  if (!username || !password) {
    res.status(422).json({error: 'invalid input'});
  } else {
    try {
      res.json(await userService.login(username, password));
    } catch (e) {
      res.status(422).json({error: e.message});
    }
  }
});

export default router;
