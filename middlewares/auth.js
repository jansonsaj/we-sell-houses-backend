import compose from 'koa-compose';
import {verifyToken, extractCallingUser} from './jwt.js';

export default compose([verifyToken, extractCallingUser]);
