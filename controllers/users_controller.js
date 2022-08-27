const User=require('../models/user')
const fs=require('fs')
const path=require('path')

module.exports.profile=function(req,res)
{
   User.findById(req.params.id, function(err, user)
   {
      res.render('user_profile',{
         title: "user profile",
         profile_user: user
      }) 
   })
  
}


module.exports.update=async function(req, res)
{
   // if(req.user.id == req.params.id)
   // {
   //    User.findByIdAndUpdate(req.params.id,req.body , function(err, user)
   //    {
   //       return res.redirect('back')
   //    } )
   // }
   // else{
   //    return res.status(401).send('Unauthorized')
   // }
   if(req.user.id == req.params.id)
   {
         try{

            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
               if(err)
               {
                  console.log('Multer Error: ', err);
               }

               user.name=req.body.name
               user.email=req.body.email
               if(req.file)
               {
                  if(user.avatar)
                  {
                     fs.unlinkSync(path.join(__dirname,'..',user.avatar))

                  }
                  //this is saving the path of the uploaded file into
                  // the avatar field in the use
                  user.avatar= User.avatarPath+'/'+ req.file.filename
               }

               user.save();
            })


         }
         catch{

            req.flash('error',err);
            return res.redirect('back')

         }

   }
   else
   {
      req.flash('error','Unauthorized');
      return res.status(401).send('Unauthorized')


   }

}


//render the sign up page
module.exports.signup=function(req, res)
{
   if(req.isAuthenticated())
   {
      req.flash('success', "Already signed in")
      return res.redirect('/users/profile')
      // return res.redirect('back')
   }
   return res.render('user_sign_up',{
      title: "Codeial Sign Up"
   })
}


//render the sign In page
module.exports.signIn=function(req,res)
{
   if(req.isAuthenticated())
   {
      req.flash('success', "Already signed in")
      res.redirect('/users/profile')
   }
   return res.render('user_sign_in',{
      title: "Codeial Sign In"
   })
}

//get the sign-up data
//set up an action

module.exports.create=function(req,res)
{
   //If the password and confirm-password doesn't match
   if(req.body.password!=req.body.confirm_password)
   {
      return res.redirect('back')
   }
   User.findOne({email:req.body.email}, function(err,user){
      //If any issue arises
      if(err)
      {
         console.log('error in finding user in signing up');
         return;
      }


      //If user is not found ..that means its a new user
      if(!user)
      {
        User.create(req.body, function(err, user){
         if(err)
         {
            console.log('Error in creating user while signing up');
            return;
         }

         //After sign-up it will take you to the sign-in page
         return res.redirect('/users/sign-in')
        }) 
      }

      //If user is already present
      else
      {
         return res.redirect('back')
      }
   })
    
}

//set up an action

module.exports.createSession=function(req,res)
{
   //to do later
   // console.log("Welcome");
   // return res.send('<h1>Hello</h1>')
   req.flash('success','Logged in successfully');

   return res.redirect('/')
}

module.exports.destroySession=function(req,res)
{
   //passport gives this function
   // req.logout();
   // return res.redirect('/')
   req.logout(function(err)
   {
      if (err)
      {
         return next(err);
      }

      req.flash('success','you have been logged out !!!!!')

      res.redirect('/')
   })
}

