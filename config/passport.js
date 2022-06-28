

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Realtor = require('../model/Realtor');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'username' }, (username, password, done) => {

            //match user
            Realtor.findOne({username:username})
            .then(realtor => {
                if(!realtor){
                    return done(null, false, {message: 'That username is not registered'});
                }

                //Match password
                bcrypt.compare(password, realtor.password, (err, isMatch) =>{
                    if (err) throw err;

                    if(isMatch){
                        return done(null, realtor);
                    }
                    else{
                        return done(null, false, {message: 'password incorrect'})
                    }
                })
            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser((Realtor, done)=> {
        done(null, Realtor.id);
    });



    passport.deserializeUser((id, done)=> {
        Realtor.findById(id, (err, Realtor) => {
            done(err, Realtor);
        });
    });
}
