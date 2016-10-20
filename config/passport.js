var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var SpotifyStrategy = require('passport-spotify').Strategy;
var YoutubeV3Strategy = require('passport-youtube-v3').Strategy;

var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport){
    
    passport.serializeUser(function (user,done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback:true
    }, function (req, email, password, done) {
        process.nextTick(function () {
            User.findOne({
                'local.email': email
            }, function (err, user) {
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                }else{
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function (err) {
                        if(err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    }, function (req, email, password, done) {
        User.findOne({'local.email':email}, function (err, user) {
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
            if(!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
            return done(null, user);
        });
    }));

    ///FACEBOOK
    passport.use(new FacebookStrategy({
        clientID:configAuth.facebookAuth.clientID,
        clientSecret:configAuth.facebookAuth.clientSecret,
        callbackURL:configAuth.facebookAuth.callbackURL,
        profileFields:['emails', 'displayName', 'name']
    }, function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({'facebook.id': profile.id}, function (err, user) {
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null, user);
                }else{
                    var newUser = new User();

                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName+' '+profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;

                    newUser.save(function (err) {
                        if(err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    
    ///GOOGLE
    passport.use(new GoogleStrategy({
        clientID:configAuth.googleAuth.clientID,
        clientSecret:configAuth.googleAuth.clientSecret,
        callbackURL:configAuth.googleAuth.callbackURL
    }, function (token, refreshToken, profile, done ) {
        process.nextTick(function () {
            User.findOne({'google.id': profile.id}, function (err, user) {
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null, user);
                }else{
                    var newUser = new User();

                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName
                    newUser.google.email = profile.emails[0].value;

                    newUser.save(function (err) {
                        if(err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    
    ///TWITTER
    
    passport.use(new TwitterStrategy({
        consumerKey:configAuth.twitterAuth.consumerKey,
        consumerSecret:configAuth.twitterAuth.consumerSecret,
        callbackURL:configAuth.twitterAuth.callbackURL
    }, function (token, tokenSecret, profile, done ) {
        process.nextTick(function () {
            User.findOne({'twitter.id': profile.id}, function (err, user) {
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null, user);
                }else{
                    var newUser = new User();

                    newUser.twitter.id = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.username = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    newUser.save(function (err) {
                        if(err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    //SPOTIFY
    passport.use(new SpotifyStrategy({
        clientID: configAuth.spotifyAuth.clientID,
        clientSecret:configAuth.spotifyAuth.clientSecret,
        callbackURL:configAuth.spotifyAuth.callbackURL
    }, function (accessToken, refreshToken, profile, done ) {
        process.nextTick(function () {
            console.log(profile);
            User.findOne({'spotify.id': profile.id}, function (err, user) {
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null, user);
                }else{
                    var newUser = new User();

                    newUser.spotify.id = profile.id;
                    newUser.spotify.token = accessToken;
                    newUser.spotify.country = profile.country;
                    newUser.spotify.urls = profile.external_urls;
                    newUser.spotify.href = profile.href;
                    newUser.spotify.photo = profile.photos;
                    newUser.spotify.email = profile.emails[0].value;
                    newUser.spotify.display_name = profile.displayName;

                    newUser.save(function (err) {
                        if(err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use(new YoutubeV3Strategy({
        clientID: configAuth.youtubeAuth.clientID,
        clientSecret: configAuth.youtubeAuth.clientSecret,
        callbackURL: "http://127.0.0.1:3000/auth/youtube/callback",
        scope: [
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/youtube.force-ssl'
        ]
    },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        process.nextTick(function(){
        User.findOne({ 'youtube.id': profile.id }, function (err, user) {
          // return done(err, user);
           if(err){
                    return done(err);
                }
                if(user){
                    return done(null, user);
                }else{
                    var newUser = new User();

                    newUser.youtube.id = profile.id;
                    newUser.youtube.token = accessToken;
                    newUser.youtube.name = profile.displayName;

                    newUser.save(function (err) {
                        if(err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
        });
        });
      }
    ));

};