const express = require('express'),
      mongoose = require('mongoose'),
      ejs = require('ejs'),
      session = require('express-session'),
      flash = require('connect-flash'),

      app = express();

      mongoose.connect("mongodb://localhost:27017/realEstateDB", {useNewUrlParser:true})

      app.use(express.json())
      app.use(express.static("public"));
      app.set('view engine', 'ejs');
      app.use(express.urlencoded({extended:true}));

      // code ...



      // EXPRESS-SESSION MIDDLEWARE
      app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
      }));

//       // passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

      // CONNECT FLASH

      app.use(flash());

      app.use((req,res,next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.message = req.flash('message');
        res.locals.error_msg = req.flash('error_msg');
        next();
      });

    //Routes
      app.use('/', require('./routes/index'));
      app.use('/realtor', require('./routes/realtor'));


app.listen(2100, () => {
  console.log('Server started on port 2100');
});
