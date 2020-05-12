import User from '../models/UserSchema'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default {
  // @desc Register handler
  // @route POST /shelter/v1/auth/register
  // @access Public
  async register (req, res) {
    const { username, email, password, password2, role } = req.body
    let errors = [] // Validation errors

    // Check empty fields
    if(!username || !email || !password || !password2) {
      errors.push({
        message: 'Please, fill in all fields'
      })
    }

    // Password match
    if(password !== password2) {
      errors.push({
        message: 'Passwords don\'t match'
      })
    }

    // Password length
    if(password.length < 6) {
      errors.push({
        message: 'Password should be at least 6 charaters'
      })
    }

    if(errors.length > 0) {
      // If there is any validation errors
      console.log(errors);
      res.status(401).send(
        errors,
        username,
        email,
        password,
        password2
      )

    } else {
      // Check if user exists
      await User.findOne({ username })
      .then(user => {
        if(user) {
          console.log(`\nUser ${username} already exists`.red.bold)
          errors.push({
            message: `User ${username} already exists`
          })

          res.status(401).send(
            errors,
            username,
            email,
            password,
            password2
          )

        } else {
          // If its a new user
          const newUser = new User({
            username,
            email,
            password,
            role
          })

          // Save user on DB
          newUser.save()
          .then(user => {

            console.log(`User "${newUser.username}" registered\n User role: ${newUser.role}`.green.bold)

            res.status(201).send(user)
          })
          .catch(err => {

            console.log(`Error when trying to save the user "${newUser.username}"\nError: ${err.message}`.red.bold)

            res.status(401).send(`Error when trying to save the user \"${newUser.username}\"`)
          })
        }
      })
    }
  },

  // @desc Login handler
  // @route POST /shelter/v1/auth/login
  // @access Public
  async login (req, res) {
    const { username, password } = req.body

    // Validation
    if(!username || !password) {
      console.log('Please, provide an username and password'.red)
      res.status(401).send({
        success: false,
        message: 'Please, provide an username and password'
      })
      return false
    }

    // Search user on DB
    const user = await User.findOne({ username }).select('+password')

    // Check if user exists
    if(!user) {
      console.log(`Failed. User ${username} not found`.red)

      res.status(404).send({
        success: false,
        message: `User ${username} not found`
      })

    } else {
      // Match password
      const isMatch = bcrypt.compareSync(req.body.password, user.password)

      if(isMatch === true) {
        // Required options to exchange the JWT Token
        const payload = {
          id: user._id,
          username: user.username,
          role: user.role
        }

        // Sign user in
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: 3600
        })

        console.log(`User "${user.username}" logged in`.green)
        res.status(200).send({
          sucess: true,
          message: `User ${user.username} logged in!`,
          role: user.role,
          user: user.username,
          token: token
        })

      } else {
        console.log('Invalid password'.red)
        res.status(401).send({
          success: false,
          message: 'Invalid password'
        })
      }
    }
  },
  // @desc Logout Handler
  // @route GET /shelter/v1/auth/logout
  // @access Private
  logout (req, res) {

    if(req.headers['x-access-token']) {

      console.log('User logged out'.red)

      res.status(201).send({
        success: true,
        message: 'User logged out',
        token: null
      })

    } else {

      console.log('User logged out, there is no X-Access-Token'.red)

      res.status(201).send({
        success: true,
        message: 'User logged out',
        token: null
      })
    }
  },
  // @desc Get User Info
  // @route GET /shelter/v1/auth/user
  // @access Private
  async user (req, res) {
    let token

    try {
      // Check if there is a token
      if (req.headers['x-access-token']) {

        token = req.headers['x-access-token']

        // console.log(`Token from x-access: ${token}`.red.bold)
      }
      console.log('Get User - X-Access-Token: OK'.green.bold)

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

      const loggedUser = await User.findById(decodedToken.id)
      req.user = loggedUser

      // console.log(loggedUser)

      res.status(201).send(loggedUser)

      console.log(`User "${loggedUser.username}" found`.cyan)

    } catch(err) {

      console.log(`Error on getting user: ${err.message}`.red)

      res.status(401).send({
        success: false,
        message: 'Cannot get the user'
      })
    }
  }
}
