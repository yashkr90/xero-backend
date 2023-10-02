import {getMe,signIn,signUp} from "../controllers/userController/userController.js"
import authenticate from "../middleware/authentication.js";
import Express from "express";
const router = Express.Router();

router.post("/v1/auth/signup",signUp);
router.post("/v1/auth/signin", signIn);
router.get("/v1/auth/me",authenticate,getMe);


export default router;