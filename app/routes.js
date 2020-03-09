module.exports = (app, passport) => {
        
    app.get('/', (req, res) => {
        res.render('index.ejs')
    })

    app.get('/profile', (req, res) => {
        res.render('profile.ejs', {
            user: req.user
        })
    })

    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

    //LOGIN
    app.get('/login', (req, res) => {
        res.render('login.ejs', {message: req.flash('loginMessage')})
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failRedirect : '/login',
        failureFlash: true
    }))

    //SIGN UP
    app.get('/signup', (req, res) => {
        res.render('signup.ejs', {message: req.flash('signupMessage')})
    })

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    //facebook login
    //send to facebook auth
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}))

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }))

    //alrdy login and connecting to other login
    //local connect
    app.get('/connect/local', (req, res) => {
        res.render('connect-local.ejs', {message: req.flash('loginMessage')})
    })
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }))

    //facebook
    app.get('/connect/facebook', passport.authorize('facebook', {scope : ['public_profile', 'email']}))

    app.get('/connect/facebook/callback', 
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }))


    //unlink account
    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, (req, res) => {
        let user            = req.user
        user.local.email    = undefined
        user.local.password = undefined
        user.save((err) => {
            res.redirect('/profile')
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, (req, res) => {
        let user            = req.user
        user.facebook.token = undefined
        user.save((err) => {
            res.redirect('/profile')
        });
    });
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}