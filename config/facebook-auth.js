module.exports = {
    'facebookAuth' : {
        'clientID': '578025292796790', //clientFacebookID
        'clientSecret': 'f32f77d4dd8e904980037abdb1671f31', //clientSecret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name']
    }    
}