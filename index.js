const express=require('express');

//Library used for reading and writing cookies
const cookieParser=require('cookie-parser');
//used for firing up the express
const app=express();
const port=8000;

//Used for Session Cookie
const session=require('express-session')
const passport=require('passport')
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy')
const passportGoogle=require('./config/passport-google-oauth2-strategy')
const MongoStore=require('connect-mongo')(session);
// SASS
const sassMiddleware=require('node-sass-middleware')
// SASS settings
app.use(sassMiddleware({
    //From where to pick up the SCSS file to convert into  CSS
    src:'./assets/scss',
    //Where to put the CSS file
    dest:'./assets/css',
    //To display errors during the compilation
    debug:true,
    outputStyle:'extended',
    //CSS folder inside Assets
    prefix:'/css'


}))

const flash=require('connect-flash');

//include the library
const expressLayouts=require('express-ejs-layouts');
app.use(expressLayouts); 
//Extract styles and script from sub  pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//include the database configuration when the server is firing up
const db=require('./config/mongoose')

// used to fecth the data in key value format
app.use(express.urlencoded({ extended: true }));

//tell the app to use the cookie parser
app.use(cookieParser());

//make trhe uploads path available to the browser
app.use('/uploads', express.static(__dirname+'/uploads'))





//setup views EJS
//view engine is property whose value is EJS
app.set('view engine','ejs')
//acess the view folder
app.set('views','./views')

//setting up the view path
app.use(express.static('./assets'))

// MongoStore is used to store the session cookie in the Db
app.use(session({
    //name of the Cookie
    name:'codeial',
    //TODO change the secret beforee deployment in production mode
    //Key: to encode and decode a encryption
    secret:'blahsomething',
    //When the session is not initialized OR
    //When the user is not signed in

    saveUninitialized: false,
    resave:false,
    //Give an age to cookie,after that this cookie expires
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore(
        {
        mongooseConnection:db,
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err||'connect-mongodb setup ok');
    })

}))

//Tell the app to use passport and session
app.use(passport.initialize());
app.use(passport.session());

//Whenever any request comes in the "seAuthenticatedUser" middleware get called and the user will
//be set in locals so the user can be accesible in views
app.use(passport.setAuthenticatedUser)
const customMware=require('./config/middleware')

//We need to put it after the session because it uses session cookies
app.use(flash());
app.use(customMware.setFlash);


// use Express Router
//Note: We can also give './routes/index'
//Its not necessary as it by default fetches Index(Router) because there is export in index.js of Router
app.use('/', require('./routes'));



// used for running the server
//accepts a port number and a callback function
app.listen(port, function(err)
{ 
    if(err)
    {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`server is running on port: ${port}`);
    

})