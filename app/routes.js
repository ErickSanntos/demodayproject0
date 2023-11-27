module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/main', isLoggedIn, function(req, res) {
        db.collection('joblisting').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('main.ejs', {
            user : req.user,
            jobadd : result
          })
        })
    });

    app.get('/profile', isLoggedIn, function(req, res) {
      const userId = req.user.id;
  
      // Fetch the user's profile from the database
      db.collection('profile').findOne({ _id: new ObjectId(userId) }, (err, userProfile) => {
          if (err) {
              console.log(err);
              return res.status(500).send('Error fetching profile data');
          }
  
          // Also fetch job listings
          db.collection('joblisting').find().toArray((err, jobListings) => {
              if (err) {
                  console.log(err);
                  return res.status(500).send('Error fetching job listings');
              }
  
              // Render the page with both user's profile data and job listings
              res.render('profile.ejs', {
                  user: req.user,
                  userProfile: userProfile,
                  jobadd: jobListings
              });
          });
      });
  });
  


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

   // Posting a Job Listing
app.post('/joblistings', isLoggedIn, (req, res) => {
  const userEmail = req.user.local.email; // Get the user's email from req.user

  console.log('User email:', userEmail);
  // Create a new job post document with user information
  const newJobPost = {
     // Store the user's email with the job post
    creatorEmail: userEmail, // Store the creator's email with the job post
    email: userEmail, // Store the user's email with the job post
    jobTitle: req.body.jobTitle,
    location: req.body.location,
    jobType: req.body.jobType,
    salaryRange: req.body.salaryRange,
    companyLogo: req.body.companyLogo,
    applicationDeadline: req.body.applicationDeadline,
    thumbUp: 0,
    thumbDown: 0,
  };

  // Save the job post to the database
 db.collection('joblisting').insertOne(newJobPost, (err, result) => {
    if (err) {
      return res.status(500).send('Error saving job listing');
    }

    console.log('Job listing saved to the database');
    res.redirect('/main');
  });
});
////// mailer////////
app.post('/send-email', (req, res) => {
  const { creatorEmail } = req.body;
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'santoselr39@gmail.com',
      pass: 'gfbqtgleoprmivvn',
    },
  });

  const mailOptions = {
    from: creatorEmail,
    to: creatorEmail,
    subject: 'Application Received',
    html: '<p>Your job posting has received an application.</p>',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Email could not be sent:', error);
      res.status(500).json({ error: 'Email could not be sent' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'Email sent successfully' });
    }
  });
});

const { ObjectId } = require('mongodb');

app.post('/addToProfile', async function(req, res) {
  console.log('Request to /addToProfile:', req.body);
  const userId = req.user.id; // Ensure you have user authentication in place
  const { jobId } = req.body;

  try {
      // Convert jobId to an ObjectId
      const objectId = new ObjectId(jobId);

      // Find the job details based on jobId
      const jobDetails = await db.collection('joblisting').findOne({ _id: objectId });
      if (!jobDetails) {
          return res.status(404).json({ error: 'Job not found' });
      }

      // Update the user's profile with the job details
      await db.collection('profile').updateOne(
          { _id: new ObjectId(userId) },
          { $addToSet: { savedJobs: jobDetails } } // Using $addToSet to avoid duplicates
      );
      
      res.json({ message: 'Job saved to profile successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// profile update post //
app.post('/updateProfile', isLoggedIn, (req, res) => {
  const { name, address, phoneNumber } = req.body;
  const userId = req.user.id;
  const userEmail = req.user.local.email; // Extracting the user's email

  // Update the user's profile in the database, or insert a new one if it doesn't exist
  db.collection('profile').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { name: name, address: address, phoneNumber: phoneNumber, email: userEmail } },
    { upsert: true }, // This option creates a new document if it doesn't exist
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error updating profile');
      }
      if (result.upsertedCount > 0) {
        console.log('Profile created successfully');
      } else if (result.modifiedCount > 0) {
        console.log('Profile updated successfully');
      } else {
        console.log('No changes made to the profile');
      }
      res.redirect('/profile');
    }
  );
});




//////////
  
    app.delete('/joblistings', (req, res) => {
      db.collection('joblisting').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('job deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/main', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/main', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
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
            res.redirect('/main');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
