import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../../models/model.js";

dotenv.config();

const secretKey = process.env.SECRETKEY;

// Sign In route
export const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    try {
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "password",
              message: "The credentials you provided are invalid.",
              code: "INVALID_CREDENTIALS",
            },
          ],
        });
      }

      // jwt token using email and id
      const token = jwt.sign({ email: email, id: user._id }, secretKey);
  
      res.status(201).json({
        status: true,
        content: {
          data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
    
          },
          meta: {
            access_token: token,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  };
  