module.exports = (app, passport) => {
        
    app.get('/', (req, res) => {
        res.render('index.ejs')
    })

    app.get('/profile', (req, res) => {
        res.render('profile.ejs')
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
}

