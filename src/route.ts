import express from 'express';
// import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();


router.get('/', (req, res) => {
    res.send('Hello, TypeScript with Node.js!');
});
export default router;
