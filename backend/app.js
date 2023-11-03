  require('dotenv').config();
  const cors = require('cors');
  const express = require('express');
  const app = express();
  const axios = require('axios');
  const bodyParser = require('body-parser');

  const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's actual domain
    credentials: true, // Allow credentials (cookies, tokens, etc.)
  };
  app.use(cors(corsOptions));
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your client's origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
    next();
  });
  app.use(bodyParser.json());

 
  const mongoose = require('mongoose');
  const User = mongoose.model('User',require('./database/schema/userSchema').userSchema);

  const bcrypt = require('bcrypt');
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  const GithubStartegy = require('passport-github2').Strategy;
  const session = require('express-session');
  const { v4: uuidv4 } = require('uuid');
  const nodemailer = require('nodemailer');
  const flash = require('connect-flash')
  app.use(flash());
  var transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:Number(process.env.SMTP_PORT),
    secure:Boolean(process.env.STMP_SECURE),
    service : 'gmail',
    auth : {
      user : process.env.EMAIL_SMTP,
      pass : process.env.EMAIL_PASSWORD,
    }
  })
  console.log(process.env.EMAIL_SMTP)
  console.log(process.env.EMAIL_PASSWORD)
  passport.use(new GoogleStrategy({
      clientID:process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRET,
      callbackURL:"http://localhost:8000/auth/google",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },async(accesstoken,refreshtoken,profile,done)=>{
          //these accesstoken and refreshtoken cannot be used by us so that's a problem
          console.log(profile);
          var user=await User.findOne({email:profile.emails[0].value});
      
          if(user==null){
            await User.create({Id:profile.id,username:profile.displayName,email:profile.emails[0].value,profilePic:profile.photos[0].value}); 
          }
          user=await User.findOne({email:profile.emails[0].value});
          user.profilePic=profile.photos[0].value;
          
          await user.save();
          return done(null,user);
    
    }));
    
  passport.use(new GithubStartegy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/github",
    userEmailURL:'https://api.github.com/user/emails'
  },
  async(accesstoken,refreshtoken,profile,done)=>{
    //these accesstoken and refreshtoken cannot be used by us so that's a problem
    const headers = {
      'Authorization': 'token '+accesstoken,
    };
    const res = await axios.get('https://api.github.com/user/emails',{
      headers : headers,
    })
    console.log(res.data)
    let i=0;
    for(i=0;i<res.data.length;i++){
      if(res.data[i].primary==true){
        break
      }
    }
    const userEmail = res.data[i].email;
    var user=await User.findOne({email:userEmail});

    if(user == null){
      await User.create({Id:profile.id,username:profile.username,email:userEmail,profileURL:profile.profileUrl,profilePic : profile.photos[0].value}); 
    }
    user = await User.findOne({Id:profile.id});
    user.profileURL = profile.profileUrl;
    user.profilePic = profile.photos[0].value;
    await user.save();
    return done(null,user);
  }))  
  passport.use(new LocalStrategy({usernameField:'username',passwordField:'password'},async (username,password,done)=>{
    try{
      const user=await User.findOne({username:username});
      console.log("here");
      if( user == null ){
          done(null,false,{message:"no such user exists"});
      }
      else{
        const flag = await bcrypt.compare(password,user.password);
        if(flag && user.verified){
          done(null,user);
        }
        else{
          if(user.verified == false){
            var mailOptions = {
              from : process.env.EMAIL_SMTP,
              to : user.email,
              subject : 'Email Verification for Odyssey',
              text : 'http://localhost:8000/auth/verify?Id=' + user.Id,
            }
            transporter.sendMail(mailOptions,(err,info)=>{
              if(err==null){
                done(null,false,{message:"email verification sent"});
              }
              else{
                console.log(err);
                console.log(info);
                done(null,false,{message:"email verification not sent!!\nmaybe SMTP server is Full"});
              }
            })
          }
          else{
            done(null,false,{message:"password is incorrect"});
          }  
        }   
      }  
  }
  catch{
      done(null,false,{message:"something went wrong"});
  }
  }));
  
  passport.serializeUser((user,done)=>{
    done(null,user._id);
  });
  passport.deserializeUser(async (userid,done)=>{
    const user=await User.findOne({_id:userid});
    return done(null,user);
  })
  
  app.use(session({
   secret:process.env.SESSION_SECRET,
   resave:false,
   saveUninitialized:false,
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/logout',(req,res)=>{
    if(req.isAuthenticated()==true){
      req.logOut((err)=>{
        if(err!=null){
          res.status(400).send(err);
          res.end();
      }
        res.status(200).send('signed out');
        res.end();
      });
    }
  })

  app.get('/auth/google',passport.authenticate('google',{successRedirect:'/',failureRedirect:'/login',scope:['profile','email']}))
  app.get('/auth/github',passport.authenticate('github',{successRedirect:'/',failureRedirect:'/login',scope:['user','user:email','read:user']}))
  
  app.post('/auth/register',async (req,res,next)=>{
    //send email from here
    const data = {...req.body.data,Id:uuidv4()};
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(data.password , 10);

    var user = null;

    user = await User.findOne({email : data.email})
    if(user == null){
      const user = await User.create({
        Id : data.Id,
        email : data.email,
        username : data.username,
        password : hashedPassword,
        verified : false,
      })

      var mailOptions = {
        from : process.env.EMAIL_SMTP,
        to : data.email,
        subject : 'Email Verification for Odyssey',
        text : 'http://localhost:8000/auth/verify?Id='+data.Id,
      }
      transporter.sendMail(mailOptions,(err,info)=>{
        if(err==null){
          res.status(200).send('email has been sent')
        }
        else{
          console.log(err);
          console.log(info);
          res.status(200).send('something went wrong in sending the email');
        }
      })
    }
    else{
      res.status(200).send('already exist');
    }
  })
  
  app.get('/auth/local',passport.authenticate('local',{failureRedirect:'/localfailure',successRedirect:'/localsuccess',failureFlash:true}
  ));
  app.get('/localsuccess',(req,res)=>{
    res.status(200).send('logged in successfully!!');   
  })
  app.get('/localfailure',(req,res)=>{
   
    const failureMessage = req.flash('error')[0];
    res.status(201).send(failureMessage)
  })
  app.get('/auth/verify',async(req,res)=>{
    
    const user = await User.findOne({Id:req.query.Id})
  
    user.verified = true;
    await user.save();
    res.send('you have been verified');
    
  })
  app.get('/auth/status',(req,res)=>{
    res.send(req.isAuthenticated());
  })

  app.get('/user',(req,res)=>{
    if(!req.isAuthenticated()){
        res.status(500).json({error:'not authenticated'});
    }
    else{
        res.send(req.user);
        res.end();
    }
  })
  app.get('/',(req,res)=>{
    if(req.isAuthenticated()){
        
        res.status(200)
        res.redirect('http://localhost:3000/'); 
    }
    else{
        res.redirect('http://localhost:3000/')
    }
  })
  app.get('/login',(req,res)=>{
    //fallback for all authentication
    
  })
  app.listen(process.env.PORT||3000,()=>{
      console.log(`backend server is listening on ${process.env.port}`);
  })

  
  mongoose.connect("mongodb://127.0.0.1:27017/Odeysey").then(()=>{console.log("connected")});