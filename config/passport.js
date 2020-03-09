const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
let User = require('../app/models/user')
const configFBAuth = require('./facebook-auth') // for test

module.exports = (passport) => {

    //required login session amd serialize user
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

    //local login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        if(email)
        email = email.toLowerCase()
        //async
        process.nextTick(() => {
            User.findOne({'local.email': email}, (err, user) => {
                if(err)
                    return done(err)
                if(!user)
                    return done(null, false, req.flash('loginMessage', 'No user found'))
                if(!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Wrong password'))
                else 
                    return done(null, user)
            })
        })
    }))

    //local signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        if(email)
            email = email.toLowerCase()
        //async
        process.nextTick(() => {
            if(!req.user) {
                User.findOne({'local.email': email}, (err, user) => {
                    if(err)
                        return done(err)
                    if(user) {
                        return done(null, false, req.flash('signupMessage', 'email already taken'))
                    } else {
                        let newUser = new User()
                        newUser.local.email = email
                        newUser.local.password = newUser.generateHash(password)

                        newUser.save((err) => {
                            if(err)
                                return done(err)

                            return done(null, newUser)
                        })
                    }
                })
            }else if (!req.user.local.email) {
                User.findOne({'local.email': email}, (err, user) => {
                    if(err)
                        return done(err)
                    if(user) {
                        return done(null, false, req.flash('loginMessage', 'email already taken'))
                    } else {
                        let user = req.user
                        user.local.email = email
                        user.local.password = user.generateHash(password)
                        user.save((err) => {
                            if(err)
                                return done(err)

                            return done(null, user)
                        })
                    }
                })
            } else {
                 // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user)
            }
        })
    }))

    const fbStrategy = configFBAuth.facebookAuth
    fbStrategy.passReqToCallback = true
    passport.use(new FacebookStrategy(fbStrategy,(req, token, refreshToken, profile, done) => {
        
        //async
        process.nextTick(() => {
            if(!req.user) {
                User.findOne({'facebook.id': profile.id}, (err, user) => {
                    if(err)
                        return done(err)
                    if(user) {
                        if(!user.facebook.token) {
                            user.facebook.token = token
                            user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
                            user.facebook.email = (profile.emails[0].value || '').toLowerCase()

                            user.save((err) => {
                                if(err)
                                    return done(err)

                                return done(null, user)
                            })
                        }
                        
                        return done(null, user)
                    } else {
                        let newUser = new User()
                        newUser.facebook.id = profile.id
                        newUser.facebook.token = token
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase()

                        newUser.save((err) => {
                            if(err)
                                return done(err)

                            return done(null, newUser)
                        })                    
                    }
                })
            } else {
                let user = req.user // pull the user out of the session

                user.facebook.id    = profile.id
                user.facebook.token = token
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName
                user.facebook.email = (profile.emails[0].value || '').toLowerCase()

                user.save(function(err) {
                    if (err)
                        return done(err)
                        
                    return done(null, user)
                })
            }
        })
    }))
}