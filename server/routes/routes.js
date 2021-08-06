import express from "express";

import { signup,login, isAuth } from '../controllers/auth.js';

const router = express.Router();


//Lister mes différentes routes:
router.post('/login', login);

router.post('/signup', signup);

router.get('/private', isAuth);

//Pour les autres chemins d'erreurs
router.use('/', (req,res) => {
    res.status(404).json({error: 'Page non trouvé'});
});

export default router;