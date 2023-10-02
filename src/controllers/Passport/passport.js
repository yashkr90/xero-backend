import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import mongoose from "mongoose";
import { User } from "../../models/model.js";

const GOOGLE_CLIENT_ID="643378754479-jmjhe2gjmsa1ok0qlorunalu2d1augnd.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET="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"

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ googleId: profile.id }, async function (err, user) {

        console.log(profile);
        cb(null,profile)
        // if (err) {
        //   return cb(err, null);
        // }

        // if (!user) {
        //   const newUser = new User({
        //     googleId: profile.id,
        //     username: profile.name.givenName,
        //   });

        //   await newUser.save();
        //   cb(null, newUser);
        // }
        // cb(null, user);
      });
    }
  )
);

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: `${process.env.GITHUB_CLIENT_ID}`,
//       clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
//       callbackURL: "/auth/github/callback",
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       User.findOne({ githubId: profile.id }, async (err, doc) => {
//         if (err) {
//           return cb(err, null);
//         }

//         if (!doc) {
          // const fullName = profile.username;
          // const nameParts = fullName.split(" ");

          // const firstName = nameParts[0];
          // const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

          // const newUser = new User({
          //   githubId: profile.id,
          //   firstName: firstName,
          //   lastName:lastName
          // });

//           await newUser.save();
//           cb(null, newUser);
//         }
//         cb(null, doc);
//       });
//     }
//   )
// );
