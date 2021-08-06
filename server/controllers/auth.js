import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import User from '../models/user.js';


//Partie enregistrement d'un utilisateur
const signup =  (req, res) => {

    const regexPassword = new  RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"); //regex pour sécuriser un peu le formulaire (8 caracy=tère minimum, 1 majuscule, 1 minuscule et 1 caractère spéciale obligatoire

    //Verifier si le mail exist
    User.findOne({ where: {
            email: req.body.email,
        }})
        .then(dbUser =>{
            if(dbUser) {
                return res.status(409).json({message: "Email déjà existant"});
            }
            else if(req.body.email && req.body.password){
                //Hachage du mot de passe
                bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
                    if(err){
                        return res.status(500).json({message: "Le mot de passe n\'a pas pu être haché"});
                    }
                    else if(passwordHash){
                        return User.create(({
                            email: req.body.email,
                            password: passwordHash,
                        }))
                            .then(() => {
                                res.status(200).json({message: "Utilisateur créer"});
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(502).json({message: "Erreur lors de la création de l'utilisateur"});
                            });
                    }
                });
            } else if(!req.body.password){
                return res.status(400).json({message: "Mot de passe non renseigné"});
            } else if(!req.body.email){
                return res.status(400).json({message: "Email non renseigné"});
            }
        })
        .catch(err => {
            console.log('error', err);
        });
};

//Partie Login
const login = (req,res) => {

    //Verifier si email exist dans la bdd
    User.findOne({ where: {
            email: req.body.email,
        }})
        .then(dbUser => {
            if(!dbUser){
                return res.status(404).json({message: "Utilisateur pas trouvé"});
            } else {
                //Mot de passe hash
                bcrypt.compare(req.body.password,dbUser.password, (err, compareRes) =>{
                    if(err) {
                        res.status(502).json({message : "Erreur lors de la vérification du mot de passe"});
                    } else if(compareRes){
                        const token = jwt.sign({email: req.body.email}, 'secret', {expiresIn : '1h'});
                        return res.status(200).json({message : "Utilisateur connecter", "token": token});
                    }else {
                        res.status(401).json({message: "Information de connection non valide"});
                    }
                });
            }
        })
        .catch(err =>{
            console.log('error', err);
        });
}


//partie authentification
const isAuth = (req, res) => {

    const authHeader = req.get("Authorization");
    if(!authHeader){
        return res.status(401).json({message: "non authentifié"});
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try{
        decodedToken = jwt.verify(token, 'secret');
    } catch(err) {
        return res.status(500).json({message : err.message || "jeton non valide" });
    }

    if(!decodedToken){
        res.status(401).json({message : "Accès refusé"});
    } else {
        res.status(200).json({message: "Voilà votre ressource"});
    }
}




export  { signup, login, isAuth };