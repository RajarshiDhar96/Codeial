const passport=require('passport');

const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/user')

//Authentication using passport
passport.use(new LocalStrategy({

    //Check from the schema about your username
    //Basically the field to detect a user
    usernameField:'email',
    passReqToCallback: true
    },

    //Its a inbuilt callback function
    function(req ,email,password,done)
    {
        //done is a callback function which is reporting back to passport.js

        //find a user and estabilish the identiy
        //Note: the first email is the property in the schema.\
        //We have to give the usernameField in line 11 in the first propert(email)
        // the 2nd one is value which is passed
        User.findOne({email:email},function(err,user)
        {
            if(err)
            {
                req.flash('error',err)
                return done(err)
            }

            //If user is not present
            //or
            //the password is incorrect
            if(!user || user.password!=password)
            { 
                req.flash('error','Invalid username/password')

                //done(error, status)
                //no error: null
                //Authentication status: false
                return done(null, false)
            }

            return done(null,user)
        })

    }


));

//Serializing the user to decide which key is to be kept in the cookies

passport.serializeUser(function(user, done)
{
    //Since there is no error , thats why its null
    //users id will be stored in encrypted format into the cookie

    done(null, user.id)
})

//Deserializing the user from the key in the cookies so that browser can use it when it sends request

passport.deserializeUser(function(id,done)
{
    User.findById(id, function(err,user){
        if(err)
        {
            console.log("Error in finding user-->Passport");
            return done(err)
        }

        return done(null,user)
        
    })
})

//check if the user is authenticated
//It will be used as middleware

passport.checkAuthentication=function(req, res,next)
{
    console.log("Inside check authentication");
    //If the user is signed in, then pass on the request to
    // the next function(controller's action)
    if(req.isAuthenticated())
    {
        return next();
    }
    console.log("I am called");
    return res.redirect('/users/sign-in')
}

//A middleware to check if the user is signed in or not
passport.setAuthenticatedUser=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        //req.user contains the current signed un user from the session cookie 
        //and we are just sending this to the locals for the views
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;