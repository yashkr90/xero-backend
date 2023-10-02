import cookieSession from "cookie-session";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
// import passportSetup from "./passport";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);




const GOOGLE_CLIENT_ID =process.env.GOOGLE_CLIENT_ID
  "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "/auth/github/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

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
