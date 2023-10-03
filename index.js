import cookieSession from "cookie-session";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
// import passportSetup from "./passport";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import session from "express-session";
// import authRoute from "./routes/auth";
import Route from "./src/routes/routes.js";
import Connection from "./src/database/db.js";
import { User } from "./src/models/model.js";
import passportRoute from "./src/routes/passportRoute.js";

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

dotenv.config();

app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({ name: "session", keys: ["yash"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SERVER_URL = process.env.SERVER_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const newuser = new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,

            email: profile.emails[0].value,
          });

          await newuser.save();

          console.log("newuser", newuser);

          cb(null, newuser);
        }

        cb(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/auth/github/callback`,
      scope: ["user:email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      try {
        const user = await User.findOne({ githubId: profile.id });
        const fullName = profile.displayName;
        const nameParts = fullName.split(" ");
        let firstName = "";
        let lastName = "";
        if (nameParts.length > 1) {
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(" ");
        } else {
          firstName = fullName;
        }
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);

        if (!user) {
          const newuser = new User({
            githubId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,

             email: profile.emails[0].value,
          });

          await newuser.save();

          console.log("newuser", newuser);

          cb(null, newuser);
        }

        cb(null, user);
      } catch (error) {
        console.log(error);
      }
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use("/", Route);
app.use("/auth", passportRoute);

const MONGOURL = process.env.MONGOURL;

Connection(MONGOURL).then((res) => {
  console.log(res);
  if (res === "success") {
    app.listen(port || process.env.PORT, () =>
      console.log(`Server is running on PORT ${port}`)
    );
  }
});
