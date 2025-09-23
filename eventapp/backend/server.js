// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dbConnection = require("./utils/database");
const {
  setupSecurity,
  getCorsOptions,
} = require("../../middleware/securityHeaders.js");

const app = express();
const environment = process.env.NODE_ENV || "development";

// Setup security headers and middleware
setupSecurity(app, environment);

// CORS configuration
app.use(cors(getCorsOptions(environment)));

// Body parsing with security limits
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

const port = process.env.PORT || 5003;

// CORS: allow your frontend + credentials (cookies)
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // e.g., http://localhost:3003
    credentials: true,
  })
);

// Sessions (secure: true in production with HTTPS)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // 🔒 true in prod
    },
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Passport serialize/deserialize
passport.serializeUser((user, done) => done(null, user._id.toString()));
passport.deserializeUser(async (id, done) => {
  try {
    const u = await User.findById(id);
    done(null, u);
  } catch (e) {
    done(e);
  }
});

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // http://localhost:5003/auth/google/callback
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) return done(new Error("No email from Google"));

        let user = await User.findOne({ username: email });
        if (!user) {
          // ✅ Remove hardcoded password (store null instead)
          user = await User.create({
            username: email,
            password: null, // no password for OAuth-only accounts
            role: "User",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// --- OAuth routes (popup-aware) ---
app.get("/auth/google", (req, res, next) => {
  const isPopup = req.query.popup === "1";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: isPopup ? "popup" : "redirect",
    prompt: "select_account",
  })(req, res, next);
});

// Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?err=oauth`,
  }),
  (req, res) => {
    const payload = {
      _id: req.user._id,
      role: req.user.role,
      username: req.user.username,
    };
    const token = jwt.sign(payload, process.env.SESSION_SECRET, {
      expiresIn: "1h",
    });

    const isPopup = (req.query.state || "") === "popup";

    if (isPopup) {
      res.send(`<!doctype html>
<html><body><script>
  (function () {
    try {
      var msg = { type: "oauth-token", token: "${token}" };
      window.opener && window.opener.postMessage(msg, "${process.env.FRONTEND_URL}");
    } catch (e) {}
    window.close();
  })();
</script></body></html>`);
      return;
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/login/sso?token=${encodeURIComponent(token)}`
    );
  }
);

// --- Your existing API routes ---
const userRoute = require("./routes/user/user.routes");
const occasionRoute = require("./routes/events/occasion.routes");
const eventbookingRouter = require("./routes/events/eventbooking.routes");

app.use("/api/users/", userRoute);
app.use("/api/occasions/", occasionRoute);
app.use("/api/eventbookings/", eventbookingRouter);

// Health/root
app.get("/", (req, res) => {
  res.send("Welcome to Occasion renting system!");
});

// Start + DB connect
app.listen(port, () => {
  console.log(`Node JS Server Started port ${port}`);
  dbConnection.connectDB();
});
