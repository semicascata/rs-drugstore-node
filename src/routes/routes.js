import AuthControl from '../controllers/AuthControl'
import Drugstore from '../controllers/Drugstore'
import Jwt from '../middlewares/Jwt'

// Custom URL
const url = '/shelter/v1';

export default (app) => {
    app.get(url, (req, res) => {
      console.log('\nWelcome to Ravel\'s Shelter API'.green.bold)
      res.status(200).json({
        success: true,
        message: "Welcome to Ravel\'s Shelter API 😷"
      })
    })

    // Authentication
    app.post(`${url}/auth/register`, AuthControl.register)
    app.post(`${url}/auth/login`, AuthControl.login)
    app.get(`${url}/auth/logout`, AuthControl.logout)
    app.get(`${url}/auth/user`, AuthControl.user)

    // Drugstore
    app.get(`${url}/drugstore`, Jwt.protect, Drugstore.getDrugs)
    app.post(`${url}/drugstore`, Jwt.protect, Drugstore.createDrug)
    app.get(`${url}/drugstore/:id`, Jwt.protect, Drugstore.getDrug)
    app.put(`${url}/drugstore/:id`, Jwt.protect, Drugstore.updateDrug)
    app.delete(`${url}/drugstore/:id`, Jwt.protect, Drugstore.deleteDrug)
}
