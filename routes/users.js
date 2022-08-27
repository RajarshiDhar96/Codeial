const express=require('express')
const router=express.Router();
const passport=require('passport')

const usersController=require('../controllers/users_controller');
router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);
router.get('/sign-up', usersController.signup);
router.get('/sign-in', usersController.signIn);
router.post('/create', usersController.create)

// router.post('/create-session', usersController.createSession)

//use Passport as a middleware to authenticate
//2nd one is a middleware
//If the Authentication fails it will redirect to "users/sign-in"
//If the Authentication is successful it will take you to "usersController.createSession"
router.post('/create-session',passport.authenticate(
    //Strategy : Local
    'local',
    //If the Authentication is failed
    {failureRedirect:'/users/sign-in'}
),usersController.createSession)


router.get('/sign-out', usersController.destroySession)
router.get('/auth/google', passport.authenticate('google',{scope:['profile', 'email']}))
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/users/sign-in'}),usersController.createSession)
module.exports=router;