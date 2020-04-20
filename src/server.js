import morgan from 'morgan';
import express from 'express';
import notesRouter from './notesRouter';
import userRouter from './userRouter';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {authMiddleware} from './auth';

dotenv.config();

const port = process.env.PORT || 8000;
const server = express();

server.use(morgan(process.env.NODE_ENV || 'dev'));
server.use(bodyParser.json());
server.use('/notes', authMiddleware(), notesRouter);
server.use('/user', userRouter);

server.listen(port, () => {
  /**
   * see:
   * https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
   * https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
   */
  console.log('\x1b[91m%s\x1b[0m %s', '[notes-be]', 'server is running at port ' + port);
});
