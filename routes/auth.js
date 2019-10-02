const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../models/user");

router.post("/signup", (req,res)=> {
    User.findOne({$or: [{username: req.body.username, email: req.body.email}]})
        .then((user)=> {
            debugger
            if(user) res.send("User with this email or username already exists")
            else {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    if(err) res.send(err.message)
                    else {
                        User.create({
                            username: req.body.username,
                            password: hash,
                            email: req.body.email,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname
                        })
                        .then(()=> {
                            res.send("signed up")
                        })
                        .catch((err)=> {
                            debugger
                            res.send(err.message)
                        })
                    }
                })
            }
        })
    })   

router.get("/signup", (req,res)=> {
    res.render("signup");
})

router.post("/login", (req,res)=> {
    User.findOne({username: req.body.username})
        .then((user)=> {
            if(!user) res.send("Invalid credentials")
            else {
                bcrypt.compare(req.body.password, user.password, function(err, equal) {
                    if(err) res.send(err);
                    else if(!equal) res.send("Invalid credentials");
                    else {
                        req.session.user = user;
                        res.send("logged in");
                    }
                });
            }
        })
        .catch(err=> {
            res.send("error erropr", err);
        })
})

router.get("/logout", (req, res)=> {
    req.session.destroy();
    res.send("logged out");
})

module.exports = router;