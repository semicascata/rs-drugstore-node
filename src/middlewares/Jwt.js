import jwt from 'jsonwebtoken'
import User from '../models/UserSchema'

export default {
  // Protect Routes
  async protect (req, res, next) {
    let token

    // Check if there is a token on cookies
    if (req.headers['x-access-token'] && req.headers['x-access-token'] !== undefined) {
      token = req.headers['x-access-token']
      console.log(`X-Access-Token: ${token}`.green.bold)
      // console.log('X-Access-Token: OK'.green.bold)
    }

    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //   console.log(req.headers.authorization)
    //   token = req.headers.authorization.split(' ')[1]
    // }

    try {
      if(!token || token === undefined) {
        console.log('User not logged in'.red)

        res.status(401).send({
          success: false,
          message: 'You need log in to access this page'
        })
        return false
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decodedToken.id)

      const loggedUser = req.user
      console.log(`Authentication OK for user: ${loggedUser.username}`.green)
      next()

    } catch(err) {
      console.log('Authentication failed'.red)
      res.status(401).send({
        sucess: false,
        error: `${err.message}`
      })
    }
  },

  // Authorize Roles
  authorize (...roles) {
    return async (req, res, next) => {

      const user = req.user

      // console.log(user)

      if(!roles.includes(user.role)) {
        console.log('User role is not authorized to access this route'.red)

        res.status(403).send({
          success: false,
          message: 'User role is not authorized to access this route'
        })
        return false
      }

      console.log('Authorized'.cyan.bold)
      next()
    }
  }
}
