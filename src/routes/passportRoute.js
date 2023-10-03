import express from "express";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL;

router.get("/login/success", (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${CLIENT_URL}/dashboard`,
    failureRedirect: "/login/failed",
  })
);

router.get("/github", passport.authenticate("github", { scope: ["profile",'user:email'] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: `${CLIENT_URL}/dashboard`,
    failureRedirect: "/login/failed",
  })
);

export default router;
