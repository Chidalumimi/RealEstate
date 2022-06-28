const express = require('express'),
      router = express.Router();
      const { ensureAuthenticated } = require('../config/auth');

      const Property = require('../model/Property');

      const Realtor = require('../model/Realtor');


router.get('/', (req, res) => {

    res.render('index');

})

router.get('/about', (req, res) => {

    res.render('about');

});

router.get('/contact', (req, res) => {

    res.render('contact');

});



router.get('/search', (req, res) => {
res.render('search')
});


router.post('/', (req,res)=>{
    let what = req.body.what;
    let where = req.body.where;

        Property.find({pType:what, city:where}, function(err, result){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                console.log({record:result})
                res.render('search', {record:result,what:what,where:where})
            }
        })
})

router.get('/searchRealtor', (req, res) => {
res.render('searchRealtor')
});


router.post('/search', (req, res) => {
        // console.log(req.params);
        // res.send("Processing");

        Realtor.find({username:req.body.user}, (err, record) => {
            if (record.length < 1) {
                res.redirect('/')
            } else {
                res.render('searchRealtor', {record})
            }
        })
    });


module.exports=router; 
