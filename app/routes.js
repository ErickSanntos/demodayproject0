module.exports = function(app, passport, db) {
    // const { ObjectId } = require('mongodb');
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile2', isLoggedIn, function(req, res) {
        db.collection('joblisting').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile2.ejs', {
            user : req.user,
             jobadd: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================
// Handle POST request to create a new job listing

app.post('/joblistings', (req, res) => {
    db.collection('joblisting').insertOne({ 
        jobTitle: req.body.jobTitle,
        location: req.body.location,
        jobType: req.body.jobType,
        salaryRange: req.body.salaryRange,
        companyLogo: req.body.companyLogo,
        applicationDeadline: req.body.applicationDeadline}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile2')
    })
  })


app.put('/joblistings', (req, res) => {
    db.collection('joblisting')
    .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
      $set: {
        thumbUp:req.body.thumbUp + 1
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

// Handle DELETE request to delete a job listing
const ObjectId = require('mongodb').ObjectId;

app.delete('/joblistings', (req, res) => {
  db.collection('joblisting').findOneAndDelete({
    _id: ObjectId(req.body.id)
  }, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.send('Job listing deleted!');
  });
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/index', function(req, res) {
            res.render('index.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile2', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/index', function(req, res) {
            res.render('index.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile2', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
  console.log(isLoggedIn)
    res.redirect('/');
}
