var http = require('http');
/**
 * Created by Francis on 10/17/2016.
 */
module.exports = function (app, passport) {

    app.get('/', function(req,res){
        res.render('index.ejs');
    });

    app.get('/login', function(req, res){
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    app.get('/signup', function(req, res){
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
    app.get('/playlists',isLoggedIn,function(req, res){
        if(req.user){
            http
            res.render('playlists.ejs', {user:req.user});
        }
        else{res.status(500).end();}
    });
    app.get('/profile',isLoggedIn, function(req,res){
        res.render('profile.ejs',{ user: req.user });
    });
    //FACEBOOK
    app.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'}));
    app.get('/auth/facebook/callback', passport.authenticate('facebook',{
        successRedirect:'/profile',
        failureRedirect:'/'
    }));
    //GOOGLE
    app.get('/auth/google', passport.authenticate('google', {scope:['profile','email']}));
    app.get('/auth/google/callback', passport.authenticate('google',{
        successRedirect:'/profile',
        failureRedirect:'/'
    }));
    //TWITTER
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter',{
        successRedirect:'/profile',
        failureRedirect:'/'
    }));
    //SPOTIFY
    app.get('/auth/spotify', passport.authenticate('spotify', {scope:['user-read-email', 'user-read-private'], show_dialog:true}));
    app.get('/auth/spotify/callback', passport.authenticate('spotify',{
        successRedirect:'/profile',
        failureRedirect:'/'
    }));
    app.get('/auth/youtube', passport.authenticate('youtube', {}));
    app.get('/auth/youtube/callback', passport.authenticate('youtube', {
        successRedirect:'/profile',
        failureRedirect:'/'
    }));

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect:'/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect:'/profile',
        failureRedirect:'/login',
        failureFlash:true
    }));

};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}