import express from "express";

import { signup,login, isAuth } from '../controllers:auth.js';

const router = express.Router();


//Lister mes différentes routes:
router.post('/login',login);

router.post('signup', signup);

router.get('/private', isAuth);

//Définir une route public
// router.get('/public', (req,res,next) =>{
//     res.status(200).json({message: 'Ressources public'});
// });

//Pour les autres chemins d'erreurs
router.use('/', (req,res,next) => {
    res.status(404).json({error: 'Page non trouvé'});
});

export default router;