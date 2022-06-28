const express = require('express'),
router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');
// const path = require('path');
const { ensureAuthenticated } = require('../config/auth');

 const Realtor = require('../model/Realtor');
 const Property = require('../model/Property');

 let fs = require('fs');
let path = require('path');
let multer = require('multer');

 // MULTER
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
      console.log(file);
      cb(null, file.fieldname +'-'+ Date.now());
    }
  })

  let upload = multer({storage:storage});


router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/login', (req, res) => {

    res.render('login');

})




router.post('/signup', upload.single('image'), (req, res)=>{
    const{fName, lName, description, cEmail,cNumber, yearsOfExp,
        address, state, username, password,password2,date} = req.body;

    let errors = [];

    //Check passwords match

    if(password !== password2){
        errors.push({msg: "Passwords do not match"});
        req.flash('error_msg', 'Passwords do not match')
    }

    //Check password length
    if(password.length < 8){
        errors.push({msg: "password should be at least eight characters"})
    }

    if(errors.length > 0){
        res.render('signup', {
            errors,
            fName, lName, description, cEmail,cNumber, yearsOfExp,
        address, state, username, password,password2
        });

    }else{
        //validation passed
            Realtor.findOne({ username: username  })
            .then(realtor => {
                if(realtor){
                    //user exists
                    errors.push({msg: 'Username is already registered'});
                    res.render('signup', {
                        errors,
                        fName, lName, description, cEmail,cNumber, yearsOfExp,
                        address, state, username, password,password2
                    });

                }
                else{
                    const newRealtor = new Realtor({
                        fName, lName, description, cEmail,cNumber, yearsOfExp,
        address, state, username, password, date,  upload:{
            data:fs.readFileSync(path.join('C:/Users/HP/Desktop/FULLSTACK/REALESTATE'+'/uploads/'+req.file.filename)),
            contentType: 'image/png'
          }

                    });
                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newRealtor.password, salt, (err, hash) => {
                            if(err) throw err;

                            //Set password hashed
                            newRealtor.password = hash;

                            //Save new user
                            newRealtor.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now successfully registered and can log in')
                                res.redirect('/realtor/login');
                            })
                            .catch(err => console.log(err))
                    }))

                }
            });
    }
});

//login handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/realtor/dashboard',
        failureRedirect:'/realtor/login',
        failureFlash:true
    })(req, res, next);
} );


//Dashboard

router.get('/dashboard', ensureAuthenticated, (req,res)=>{

        Realtor.find({username:req.user.username}, function(err, record){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                console.log(req.user.username)
                res.render('dashboard', {record,username:req.user.username})
            }
        })

})

// Add Property

router.get('/addProp', ensureAuthenticated, (req,res)=>{

        Property.find({username:req.user.username}, function(err){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                // console.log(req.user.username)
                res.render('add_property', {username:req.user.username})
            }
        })

})

// const addProduct = (req, res) => {
//         if (!req.session.merchant_id && !req.session.username) {
//             req.flash('error_msg', "Please login to access App")
//             res.redirect('/login');
//         } else {
//             res.render('add_product', {merchant_id:req.session.merchant_id, username:req.session.username})
//         }
//     }

router.post('/addProp', upload.single('image'), (req, res)=>{
    const{pName, pType, room, pAddress, city, price, year} = req.body;

    let errors = [];

    if(errors.length > 0){
        res.render('add_property', {
            errors,
            pName, pType, room, pAddress, city, price, year
        });

    }else{
        //validation passed
            const newProperty = new Property({
                        pName, pType, room, pAddress, city, price, year, username:req.user.username,  upload:{
            data:fs.readFileSync(path.join('C:/Users/HP/Desktop/FULLSTACK/REALESTATE'+'/uploads/'+req.file.filename)),
            contentType: 'image/png'
          }

        });

            //Save new user
            newProperty.save()
            .then(user => {
            req.flash('success_msg', 'Property added successfully')
            res.redirect('/realtor/viewProp');
            })
            .catch(err => console.log(err))
                    }

    });

//View Properties

router.get('/viewProp', ensureAuthenticated, (req,res)=>{

        Property.find({username:req.user.username}, function(err, record){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                console.log(req.user.username)
                res.render('view_property', {record,username:req.user.username})
            }
        })

});

router.get('/edit/:pid', (req, res) => {
    Property.find({_id:req.params.pid}, (error, record) => {
                if (error) {
                    req.flash('error_msg', "Could not query database")
                    res.redirect('/edit/:pid');
                } else {
                    res.render('edit_page', {record, username:req.user.username});
                }
            })
});

router.post('/edit/:pid', (req, res) => {

            const {pName, pType, room, pAddress,price, year, date} = req.body;

            Property.updateOne({_id:req.params.pid}, {$set:{pName, pType, room, pAddress,price, year, date}}, (err, record) => {
                if (err) {
                    req.flash('error_msg', "Could not update Property");
                    res.redirect('/edit/:pid');
                } else {
                    req.flash('message', "Property successfully updated");
                    res.redirect('/realtor/viewProp')
                }
            })
        })

router.get('/:pid', (req, res) => {

         Property.deleteOne({_id:req.params.pid}, (error, record) => {
            if (error) {
                req.flash('error_msg', "Could not query database")
            } else {
                req.flash('message', "Property deleted successfully");
                res.redirect('/realtor/viewProp')
            }
        })
})



module.exports=router;
