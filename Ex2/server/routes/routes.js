import express from "express";

import { signup,login, isAuth } from '../controllers/auth.js';

const router = express.Router();


//Lister mes différentes routes:
router.post('/login', login);

router.post('/signup', signup);

router.get('/private', isAuth);

export default router;