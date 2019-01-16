const router = require('express').Router();
const bcrypt = require('bcryptjs');

const passport = require('../passport');
const User = require('../models/user');

const authCheck = (req, res, next) => {
    if(!req.user){
        // if user is not logged in
        res.redirect('/admin/login');
    } else {
        // if logged in
        next();
    }
};

router.get('/admin', authCheck, (req, res) => {
    res.render('index');
});

router.get('/admin/login', (req, res) => {
    res.render('login', {layout: 'login'});
});

router.post('/admin/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
}), (req, res) => {
    res.redirect('/admin');
});

router.get('/admin/logout', authCheck, (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/admin/login');
});

router.get('/admin/users', authCheck, (req, res) => {
    User.find({}, (err, users) => {
        res.render('users/index', {users: users});
    });
});

router.post('/admin/add-user', authCheck, (req, res) => {

    const newUser = new User({
        firstname: req.body.firstname,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({email: newUser.email}, (err, user) => {
        if (err) throw err;
        if (user) {
            req.flash('error_msg', 'This email is already used.');
            res.redirect('/admin/users');
        } else {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    newUser.password = hash;
                    newUser.save();
                    req.flash('success_msg', 'Account created.');
                    res.redirect('/admin/users');
                });
            });
        }
    });
});

router.get('/admin/profile/:id', authCheck, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) throw err;
        res.render('users/profile', {profile: user});
    });
});

router.delete('/admin/user-delete/:id', authCheck, (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, res) => {
        if (err) throw err;
    });
});

module.exports = router;