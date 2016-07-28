var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Bumper = require('../models/Bumper.js');

var recentLimit = 100;
var selectedLimit = 5;

var passportLocal = require ('../auth/local');
var passportTwitter = require('../auth/twitter');
var passportFacebook = require('../auth/facebook');
var passportGoogle = require('../auth/google');
var passportGithub = require('../auth/github');
var passportLinkedIn = require('../auth/linkedin');

var moment = require('moment');
moment();

//  - for all routes that are just '/'
router.get('/', function(req, res) {
    res.sendFile('index.html');
});

router.post('/authorname', function (req, res) {
    User.findOne(
        {_id: req.body.authorid}, 
        function(err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } else {
            return res.status(200).json({
                status: 'Retrieved Settings!',
                docs: docs
            });
        }
    });

})

router.post('/userBoard', function (req, res) {
    Bumper.find()
        .or([ {authorID: req.body.authorid}, {'repostedby': req.body.authorid} ])
        .sort({'date': -1})
        .exec( function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }           
        return res.status(200).json({
            status: 'Retrieved user Bumper!',
            docs: docs                
        });
    })    
})

router.get('/myBoard', function (req, res) {
    Bumper.find()
        .or([ {authorID: req.user._id}, {'repostedby': req.user._id} ])
        .sort({'date': -1})
        .exec( function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }           
        return res.status(200).json({
            status: 'Retrieved all my Bumper!',
            docs: docs                
        });
    })    
})

router.get('/recentBoard', function (req, res) {
    Bumper.find({})
        .sort({'date': -1})
        .limit(recentLimit)
        .exec( function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }           
        return res.status(200).json({
            status: 'Retrieved all recent Bumper!',
            docs: docs                
        });
    })    
})

router.get('/selectedBoard', function (req, res) {
    Bumper.find({})
        .sort({'date': -1})
        .limit(selectedLimit)
        .exec( function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }           
        return res.status(200).json({
            status: 'Retrieved all recent Bumper!',
            docs: docs                
        });
    })    
})
 
router.post('/addBumper', function (req,res) {
    Bumper.create( {authorID: req.user._id, authorName: req.body.username, title: req.body.title, imgUrl: req.body.imgUrl}, 
        function(err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } 
         return res.status(200).json({
            status: 'Added Bumper Sticker!',
            docs: docs,
        });
    });    
})

router.post('/removeBumper', function (req, res) {
    Bumper.remove( {_id: req.body.bumperid }, function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } 
        return res.status(200).json({
            status: 'Removed Bumper Sticker!',
            docs: docs                
        });    
    });    
});

router.post('/updateBumper', function (req, res) {
    Bumper.update( {_id: req.body.bumperid },
        { $pull: { 'repostedby': req.user._id}}, function (err, docs) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        }  
        return res.status(200).json({
            status: 'Removed Bumper Sticker!',
            docs: docs                
        });  

    });    
});

router.post('/likeBumper', function (req,res) {
    var options = [
        {new: true}
    ]    
    Bumper.findOneAndUpdate( {_id: req.body.bumperid, authorID: {'$ne':req.user._id}, 'likeby': {'$ne':req.user._id}}, 
        {$push: {likeby: req.user._id} },
        options, 
        function (err, docs) {
        if (err) {
            return res.status(500).json( {
                err: err});
        }
        return res.status(200).json({
            status: 'Updated who likes this Bumper!',
            docs: docs                
        });        
    });  
})

router.post('/repostBumper', function (req,res) {
    var options = [
        {new: true}
    ]    
    Bumper.findOneAndUpdate( {_id: req.body.bumperid, authorID: {'$ne':req.user._id}, 'repostedby': {'$ne':req.user._id}}, 
        {$push: {repostedby: req.user._id} },
        options, 
        function (err, docs) {
        if (err) {
            return res.status(500).json( {
                err: err});
        }
        return res.status(200).json({
            status: 'Retrieved all recent Bumper!',
            docs: docs                
        });   
    });  
})

router.get('/status', function(req, res) {

    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    res.status(200).json({
        status: true,
        user: req.user
    });
});


router.post('/getSettings', function(req, res) {
    User.findOne(
        {_id: req.body.id}, 
        function(err, data) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } else {
            return res.status(200).json({
                status: 'Retrieved Settings!',
                data: data
            });
        }
    });
});


router.post('/updateSettings', function(req, res) {
    User.findOneAndUpdate(
        {_id: req.body.id},
        { $set: 
            {
            first: req.body.first,
            last: req.body.last,
            city: req.body.city,
            state: req.body.state
            }
        }, 
        {new: true}, 
        function(err, data) {
        if (err) {
            return res.status(500).json({
                err: err
            });
        } else {
            return res.status(200).json({
                status: 'Updated Settings!',
                data: data
            });
        }
    });
});

router.post('/register', function(req, res, next) {
    User.register(new User({
            username: req.body.username
        }),
        req.body.password,
        function(err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
            passportLocal.authenticate('local')(req, res, function() {
                return res.status(200).json({
                    status: 'Registration successful!',
                    id: req.user._id,
                    username: req.user.username
                });
            });        
        });
});

router.post('/login', function(req, res, next) {
    passportLocal.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            res.status(200).json({
                status: 'Login successful!',
                id: user._id,
                username: user.username
            });
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

// PASSPORT TWITTER AUTHENTICATION
router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { successRedirect: '/#/recent', failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication - this function isn't called because of 'successRedirect' assignment.
    // if successRedirect wasn't used and authentication was successful then this function would be called.
    res.json(req.user)
  });

// PASSPORT FACEBOOK AUTHENTICATION
router.get('/auth/facebook', passportFacebook.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passportFacebook.authenticate('facebook', { successRedirect: '/#/recent', failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication - this function isn't called because of 'successRedirect' assignment.
    // if successRedirect wasn't used and authentication was successful then this function would be called.
    res.json(req.user)
  });

// PASSPORT GOOGLE AUTHENTICATION
router.get('/auth/google', passportGoogle.authenticate('google'));

router.get('/auth/google/callback',
  passportGoogle.authenticate('google', { successRedirect: '/#/recent', failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication - this function isn't called because of 'successRedirect' assignment.
    // if successRedirect wasn't used and authentication was successful then this function would be called.
    res.json(req.user)
  });  

// PASSPORT LINKEDIN AUTHENTICATION
router.get('/auth/linkedin', passportLinkedIn.authenticate('linkedin'));

router.get('/auth/linkedin/callback',
  passportLinkedIn.authenticate('linkedin', { successRedirect: '/#/recent', failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication - this function isn't called because of 'successRedirect' assignment.
    // if successRedirect wasn't used and authentication was successful then this function would be called.
    res.json(req.user);
  });


// PASSPORT GITHUB AUTHENTICATION
router.get('/auth/github', passportGithub.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback',
  passportGithub.authenticate('github', { successRedirect: '/#/recent', failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication - this function isn't called because of 'successRedirect' assignment.
    // if successRedirect wasn't used and authentication was successful then this function would be called.
    res.json(req.user);
  });

// anything else
router.get('/*', function (req, res) {
    res.redirect('/');
})


module.exports = router;