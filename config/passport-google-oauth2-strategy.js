const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy
const crypto=require('crypto');
const User=require('../models/user')

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID:"107448966713-2oqaic6v99shiv2lndl9lt17ubn25rh9.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/users/auth/google/callback"
},function(accessToken,refreshToken,profile,done){
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err)
        {
            console.log("Error in google strategy passport:  ",err);
            return
        }
        console.log(profile);

        if(user)
        {
            //set this user as req.user 
            return done(null,user);
        }
        else{
            //if not found found create the user and set it as req.user
            User.create({
                name:profile.displayName,
                password:crypto.randomBytes(20).toString('hex')
            },function(err, user){

                console.log("Error in creating user google strategy passport:  ",err);
                return done(null,user);
            })

        }
    })
}))


module.exports=passport;