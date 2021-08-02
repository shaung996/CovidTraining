  const cookieParser = require("cookie-parser");
  const csrf = require("csurf");
  const bodyParser = require("body-parser");
  const express = require("express");
  const admin = require("firebase-admin");
  
  var firebase = require('firebase/app');
  require('firebase/auth');
  require('firebase/database');
  
  const serviceAccount = require("./serviceAccountKey.json");
  const { auth } = require("firebase-admin");
  
   // Initialize Firebase
  
   const firebaseConfig = {
    apiKey: "AIzaSyBa1QN8C_dlKJT8Mcum0aeo1rnAda1YM6U",
    authDomain: "covidtraining-5a2cc.firebaseapp.com",
    databaseURL: "https://covidtraining-5a2cc-default-rtdb.firebaseio.com",
    projectId: "covidtraining-5a2cc",
    storageBucket: "covidtraining-5a2cc.appspot.com",
    messagingSenderId: "70195591210",
    appId: "1:70195591210:web:c333d35af6915815eb2b53"
  };
   
  firebase.initializeApp(firebaseConfig);

  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://covidtraining-5a2cc-default-rtdb.firebaseio.com",
  });
  
  const csrfMiddleware = csrf({ cookie: true });
  
  const PORT = process.env.PORT || 5000;
  const app = express();
  
  app.engine("html", require("ejs").renderFile);
  app.use(express.static("static"));
  
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(csrfMiddleware);
  
  
  app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
  });


  //INITIALIZE
  
  app.get("/login", function (req, res) {
    res.render("login.html");
  });

  app.get("/signup", function (req, res) {
    res.render("signup.html");
  });
  
  app.get("/addGoal", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("addGoal.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
  });

  app.get("/viewGoal", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("viewGoal.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
  });


  app.get("/editGoal", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("editGoal.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
  });



  app.get("/profile", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("profile.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
  });
  
  app.get("/", function (req, res) {
    res.render("login.html");
  });


  app.post("/currentUser", function (req, res){
    admin
  .auth()
  .getUser(uid)
  .then((userRecord) => {
    console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });
  })



  app.post("/sessionLogin", (req, res) => {

    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin
    .auth()
    .createSessionCookie(idToken, {expiresIn})
    .then(
      (sessionCookie) => {
        const options = {maxAge: expiresIn, httpOnly: true};
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({status: "success"}));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST! - app.js /sessionLogin");
      }
    );

  });

  app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/login");
  })


  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("state = definitely signed in")
    } else {
      console.log("state = definitely signed out")
    }
  });
    

  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });











