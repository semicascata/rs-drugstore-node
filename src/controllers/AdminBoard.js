import User from '../models/UserSchema'

export default {
  // @desc Get all users
  // @route GET /shelter/v1/users
  // @access Private
  async getUsers(req, res) {
    const users = await User.find()

    if (!users) {
      console.log('There is no user, check database'.red)

      res.status(404).send({
        success: false,
        message: 'There is no user'
      })
    }

    console.log(`Users OK\nUsers: ${users.length}`.green)

    res.status(200).send({
      success: true,
      length: users.length,
      users
    })
  },

  // @desc Get single user
  // @route GET /shelter/v1/users/:id
  // @access Private
  async getUser(req, res) {
    const userId = req.params.id

    try {
      const user = await User.findById(userId)

      if (!user) {
        console.log(`Cannot find any user by Id "${userId}"`.red)

        res.status(404).send({
          success: false,
          message: `No users found by Id \'${userId}\'`
        })

      } else if (user) {
        console.log(`User "${user.username}" found`.green)

        res.status(200).send({
          success: true,
          user
        })
      }

    } catch (err) {
      console.log(`Cannot find any user by Id "${userId}"`.red.bold)

      res.status(404).send({
        success: false,
        message: `No users found by Id "${userId}"`
      })
      return
    }
  },

  // @desc Update user
  // @route PUT /shelter/v1/users/:id
  // @access Private
  async updateUser (req, res) {
    const userId = req.params.id

    try {
      let user = await User.findById(userId)

      if(!user) {
        console.log(`No user found with Id "${userId}"`.red)

        res.status(404).send({
          success: false,
          message: `No user found with Id "${userId}"`
        })

      } else if(user) {
        user = await User.findByIdAndUpdate(userId, req.body, {
          new: true,
          runValidators: true
        })

        console.log(`User with Id "${userId}" updated!`.green)

        res.status(200).send({
          success: true,
          message: `User with Id "${userId}" updated!`,
          user
        })
      }

    } catch(err) {
      console.log(`Update error: ${err.message}`.red)

      res.status(404).send({
        success: false,
        error: `${err.message}`
      })

      return
    }
  },

  // @desc Delete user
  // @route DELETE /shelter/v1/users/:id
  // @access Private
  async deleteUser (req, res) {
    const userId = req.params.id

    try {
      let user = await User.findById(userId)

      if(!user) {
        console.log(`No user found with Id "${userId}"`.red)

        res.status(404).send({
          success: false,
          message: `No user found with Id "${userId}"`
        })

      } else if(user) {
        user.remove()

        console.log('User deleted'.green)

        res.status(200).send({
          success: true,
          message: 'User deleted'
        })
      }

    } catch(err) {
      console.log(`Delete error: ${err.message}`.red)

      res.status(404).send({
        success: false,
        error: `Delete error: ${err.message}`
      })

      return
    }
  }
}
