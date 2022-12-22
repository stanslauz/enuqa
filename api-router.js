const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { expressjwt: expressJwt } = require('express-jwt');
const { Timestamp } = require('mongodb');
const userSchema = require('./schema/userSchema');

function apiRouter(database) {
    const router = express.Router();
    router.use(
        expressJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }).unless({ path: ['/api/signUp', '/api/login']})
    );

    router.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
          res.status(401).send({ error: err.message });
        }
      });
     
    router.get('/users', (req, res)=> {

        const userCollection = database.collection('users');
        userCollection.find({}).toArray((err, docs)=>{
            return res.json(docs);
        });
    
    });
    
    router.post('/signUp', (req, res)=> {
    const user = req.body;
    const userCollection = database.collection('users');
        
    //check existance
    userCollection.findOne({"username": user.username}, (error, user)=>
    {

        if ( user != null){
            return res.status(409).json({error: 'user name exists'});
        }

    }
     );

    userCollection.findOne({"email": user.email}, (error, user)=>{
        if (user == null){
            
            bcrypt.hash(req.body.password, 10, (error, hash) => {
                   const newUser = userCollection.insertOne({
                    "userName": req.body.username,
                    "firstName": req.body.firstName,
                    "lastName": req.body.lastName,
                    "email": req.body.email,
                    "phoneNumber": req.body.phoneNumber
                    // "password": hash,
                    // "coverphoto": "",
                    // "admin": false,
                    // "createdAt": Timestamp,
                    // "image": "",
                    // "subscribers": 0,
                    // "subscription": [],
                    // "playlist": [],
                    // "videos": [],
                    // "previews": 120,
                    // "history": [],
                    // "notifications": []
                   });

                   return res.status(200).json({message: `${req.body.name} created successfull`});
            });
                
        }else{
            console.log("exist")
            return res.status(409).json({error: 'user exists'});
        }
    });

    
    
    });

    router.post('/login', (req, res) => {
        const user = req.body;
        const userCollection = database.collection('users');
        userCollection.findOne({email: user.email}, (err, result)=> {
            if (!result){
                return res.status(404).json({error: 'user not found'})
            }
             
            if (!bcrypt.compareSync(user.password, result.password)) {
                return res.status(401).json({ error: 'incorrect password '});
              }


              const payload = {
                name: result.name,
                admin: result.admin
              };
              const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });
              return res.json({
                message: 'successfuly authenticated',
                token: token
              });
        })
    });

    router.post("/logout", (req, res)=> {

        console.log("as")
// 
    });

    return router;
};

module.exports = apiRouter;