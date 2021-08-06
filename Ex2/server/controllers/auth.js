import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import User from '../models/user.js';


//Partie enregistrement d'un utilisateur
//l'inscription  enregistre les utilisateurs dans la base de données. Tout d'abord, il vérifie si l'e-mail fourni a déjà été enregistré. Ensuite, si l'e-mail et le mot de passe ont été reçus, il hache le mot de passe et stocke l'utilisateur dans la base de données.
const signup =  (req, res) => {

    const regexPassword = new  RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"); //regex pour sécuriser un peu le formulaire (8 caractères minimum, 1 majuscule, 1 minuscule et 1 caractère spéciale obligatoire

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
                        //creation du user ds bdd avec le mail et le password hasher
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
//Login  gère les demandes de connexion. Il commence par vérifier si l'email correspond à un utilisateur de la base de données. Si tel est le cas, il hache le mot de passe et le compare au mot de passe utilisateur dans la base de données. S'ils correspondent, il répond avec un jeton secret temporaire.
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
//isAuth demande le jeton secret et, s'il est fourni, procède à sa vérification. Si tout se passe bien, il répondra enfin avec la ressource privée. Dans ce cas, cette ressource sera juste un message contenant "voici votre ressource". Cela suffit pour notre preuve de concept.
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