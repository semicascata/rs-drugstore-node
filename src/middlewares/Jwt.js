import jwt from "jsonwebtoken";
import User from "../models/UserSchema";

export default {
  // Protect Routes
  async protect(req, res, next) {
    let token;

    // Check if there is a token on cookies
    if (
      req.headers["x-access-token"] &&
      req.headers["x-access-token"] !== undefined
    ) {
      token = req.headers["x-access-token"];

      // console.log(`X-Access-Token: ${token}`.green.bold)
      // console.log('X-Access-Token: OK'.green.bold)
    }

    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //   console.log(req.headers.authorization)
    //   token = req.headers.authorization.split(' ')[1]
    // }

    try {
      if (!token || token == null) {
        console.log("User not logged in".red);

        res.status(401).json({
          success: false,
          message: "You need log in to access this page",
        });
        return;
      }

      // console.log(req.headers['x-access-token'])

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodedToken.id);

      const loggedUser = req.user;
      console.log(`Authentication OK for user: ${loggedUser.username}`.green);

      next();
    } catch (err) {
      console.log("Authentication failed".red);
      res.status(401).json({
        sucess: false,
        error: `${err.message}`,
      });
    }
  },

  // Authorize Roles
  authorize(...roles) {
    return async (req, res, next) => {
      // const user = req.user

      const token = req.headers["x-access-token"];
      const user = jwt.verify(token, process.env.JWT_SECRET);

      if (!roles.includes(user.role)) {
        console.log("User role is not authorized to access this route".red);

        res.status(403).json({
          success: false,
          message: "User role is not authorized to access this route",
        });
        return false;
      }

      // console.log('Authorized'.cyan.bold)
      next();
    };
  },
};
