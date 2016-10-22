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

    app.get('/connect/local', function (req, res) {
        res.render('local.ejs', {message:req.flash('loginMessage')});
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect:'/connect/local',
        failureFlash:true
    }));

    app.get('/unlink/local', function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    app.get('/connect/facebook', passport.authorize('facebook', {scope:'email'}));
    app.get('connect/facebook/callback', passport.authorize('facebook',{
        successRedirect:'/profile',
        failureRedirect:'/'
    }));

    app.get('/unlink/facebook', function (req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });


    app.get('/connect/twitter', passport.authorize('twitter', {scope:'email'}));
    app.get('connect/twitter/callback', passport.authorize('twitter',{
        successRedirect:'/profile',
        failureRedirect:'/'
    }));

    app.get('/unlink/twitter', function (req, res) {
        var user = req.user;
        user.twitter.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    app.get('/connect/google', passport.authorize('google', {scope:['profile','email']}));
    app.get('connect/google/callback', passport.authorize('google',{
        successRedirect:'/profile',
        failureRedirect:'/'
    }));

    app.get('/unlink/google', function (req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    app.get('/connect/spotify', passport.authorize('spotify', {scope:['user-read-email', 'user-read-private']}));
    app.get('connect/spotify/callback', passport.authorize('spotify',{
        successRedirect:'/profile',
        failureRedirect:'/'
    }));

    app.get('/unlink/spotify', function (req, res) {
        var user = req.user;
        user.spotify.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    app.get('/connect/youtube', passport.authorize('youtube', {}));
    app.get('connect/youtube/callback', passport.authorize('youtube',{
        successRedirect:'/profile',
        failureRedirect:'/'
    }));

    app.get('/unlink/youtube', function (req, res) {
        var user = req.user;
        user.youtube.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}