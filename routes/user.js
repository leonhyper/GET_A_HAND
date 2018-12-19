let users = require('../models/user');
let express = require('express');
var app = express();
let router = express.Router();
let mongoose = require('mongoose');
let db = mongoose.connection;

// mongoose.connect('mongodb://localhost:27017/issuesdb');
mongoose.connect('mongodb://issuesdb:1013702057zs@ds139193.mlab.com:39193/issuesdb');

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.register = (req,res) => {
    res.setHeader('Content-Type', 'application/json');

    var user = new users();

    user.name = req.body.name;
    user.pass = req.body.pass;

    user.save(function(err) {
        if (err)
            res.json({ message: 'Registration failed!', errmsg : err } );
        else
            res.json({ message: 'Registration succeed!', data: user });
    });
}

router.validate = (req,res) => {
    res.setHeader('Content-Type', 'application/json');

    users.findOne({name: req.params.name, pass: req.params.pass}, (err, user) => {
        if (err) {
            res.json(err)
        }
        res.send(user)
    })
}
 router.validateName = (req,res) => {
     res.setHeader('Content-Type', 'application/json');
     users.findOne({name: req.params.name}, (err, user) => {
         if (err) {
             res.json(err)
         }
         res.send(user)
     })
 }

module.exports = router;
