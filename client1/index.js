const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const express = require("express");
const morgan = require("morgan");
const app = express();
const engine = require("ejs-mate");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const isAuthenticated = require("./isAuthenticated");
const checkSSORedirect = require("./checkSSORedirect");

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY, // Different secret than SSO server
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true if using HTTPS
      httpOnly: true,
      sameSite: 'lax', // Adjust to 'none' for cross-origin; use 'lax' for same-origin
    },
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));
app.engine("ejs", engine);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(checkSSORedirect());

const logout = (req, res, next) => {
  // logout the user from the application
  // and redirect to the SSO Server for logout
  // pass the redirect URL as current URL
  // serviceURL is where the sso should redirect in case of valid user
  const redirectURL = `${req.protocol}://${req.headers.host}${req.path}`;
  req.session.destroy();
  return res.redirect(
    `${process.env.HOST_SSO}/simplesso/logout?serviceURL=${redirectURL}`
  );
};


app.get("/", isAuthenticated, (req, res, next) => {
  // User profile is now included in the session from the server
  const userProfile = req.session.user?.userProfile || null;
  
  res.render("index", {
    what: `SSO-Consumer One`,
    user: req.session.user,
    userProfile: userProfile,
    title: "SSO-Consumer | Home"
  });
});

// API endpoint to get user profile from session
app.get("/api/profile", isAuthenticated, (req, res, next) => {
  const userProfile = req.session.user?.userProfile;
  
  if (userProfile) {
    return res.json(userProfile);
  } else {
    return res.status(404).json({ error: "User profile not found in session" });
  }
});

// API endpoint to get complete user data for localStorage
app.get("/api/user-data", isAuthenticated, (req, res, next) => {
  const userData = {
    user: req.session.user,
    userProfile: req.session.user?.userProfile,
    accessToken: req.session.user?.accessToken,
    timestamp: new Date().toISOString()
  };
  
  return res.json(userData);
});

// API endpoint to verify if user is authenticated
app.get("/api/auth/check", (req, res, next) => {
  if (req.session && req.session.user) {
    return res.json({ 
      authenticated: true, 
      userId: req.session.user.uid || req.session.user.id,
      email: req.session.user.email
    });
  } else {
    return res.json({ authenticated: false });
  }
});

app.get('/logout', logout);

app.use((req, res, next) => {
  // catch 404 and forward to error handler
  const err = new Error("Resource Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error({
    message: err.message,
    error: err,
  });
  const statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  if (statusCode === 500) {
    message = "Internal Server Error";
  }
  res.status(statusCode).json({ message });
});

app.listen(3001, () => {
  console.log("SSO-Consumer One is running on port 3001");
});
