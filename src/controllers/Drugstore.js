import Drug from '../models/DrugstoreSchema'

export default {
  // @desc Get all drugs
  // @route GET /shelter/v1/drugstore/drugs
  // @access Private
  async getDrugs(req, res) {
    const drugs = await Drug.find()

    if (!drugs) {
      console.log('Drugstore is empty, check database...'.red)

      res.status(404).send({
        success: false,
        message: 'The drugstore is empty'
      })
    }

    console.log(`\nDrugstore OK.\nDrugs: ${drugs.length}`.green)

    res.status(200).send({
      success: true,
      length: drugs.length,
      drugs
    })
  },

  // @desc Get single drug
  // @route GET /shelter/v1/drugstore/drugs/:id
  // @access Private
  async getDrug(req, res) {
    const drugId = req.params.id

    try {
      const drug = await Drug.findById(drugId)

      if (!drug) {
        console.log(`\nCannot find any drug by Id \'${drugId}\'`.red)

        res.status(404).send({
          success: false,
          message: `No drugs founded by Id \'${drugId}\'`
        })

      } else if (drug) {
        console.log(`\n\'${drug.name}\' founded!`.green)

        res.status(200).send({
          success: true,
          drug
        })
      }

    } catch (err) {
      console.log(`\nCannot find any drug by Id \'${drugId}\'`.red.bold)

      res.status(404).send({
        success: false,
        message: `No drugs founded by Id \'${drugId}\'`
      })
      return false
    }
  },

  // @desc Create new drug
  // @route POST /shelter/v1/drugstore/drugs
  // @access Private
  async createDrug (req, res) {
    const {
      name,
      category,
      description,
      use,
      imgUrl
    } = req.body

    let errors = []

    // Validations
    if(!name || !category || !description) {
      errors.push({
        message: 'Please, at least fill in the fields \'Name\', \'Category\' and \'Description\''
      })
    }

    if(use) {
      if(use.length > 1000) {
        errors.push({
          message: 'Use tutorial cannot be more than 1000 characters'
        })
      }
    }

    if(description.length > 1000) {
      errors.push({
        message: 'Description cannot be more than 1000 characters'
      })
    }

    // If there is any error
    if(errors.length > 0) {
      console.log(errors)
      res.status(401).send({
        sucess: false,
        errors
      })

    } else {
      await Drug.findOne({ name })
      .then(drug => {
        // Check if the drug already exists
        if(drug) {
          console.log(`\nThe drug \'${name}\' already exists`.red)
          errors.push({
            message: `The drug \'${name}\' already exists`
          })
          res.status(401).send({
            sucess: false,
            errors
          })

        } else {
          // If its a new drug
          const newDrug = new Drug({
            name,
            category,
            description,
            use,
            imgUrl
          })

          newDrug.save()
          .then(drug => {

            console.log(`\nNew drug \'${newDrug.name}\' saved!`.green)

            res.status(200).send({
              sucess: true,
              newDrug
            })
          })
          .catch(err => {

            console.log(`\nError when saving new drug: ${err.message}`.red)

            res.status(401).send({
              success: false,
              error: err
            })
          })
        }
      })
    }
  },

  // @desc Update drug
  // @route PUT /shelter/v1/drugstore/drugs/:id
  // @access Private
  async updateDrug (req, res) {
    const drugId = req.params.id

    try {
      let drug = await Drug.findById(drugId)

      if(!drug) {
        console.log(`\nNo drug found with Id \'${drugId}\'`.red)

        res.status(404).send({
          success: false,
          message: `No drug found with Id \'${drugId}\'`
        })

      } else if(drug) {
        drug = await Drug.findByIdAndUpdate(drugId, req.body, {
          new: true,
          runValidators: true
        })

        console.log(`\nDrug with Id \'${drugId}\' updated!`.green)

        res.status(200).send({
          success: true,
          message: `Drug with Id \'${drugId}\' updated!`,
          drug
        })
      }

    } catch(err) {
      console.log(`\nUpdate error: ${err.message}`.red)

      res.status(404).send({
        success: false,
        error: `${err.message}`
      })

      return false
    }
  },

  // @desc Delete drug
  // @route DELETE /shelter/v1/drugstore/drugs/:id
  // @access Private
  async deleteDrug (req, res) {
    const drugId = req.params.id

    try {
      let drug = await Drug.findById(drugId)

      if(!drug) {
        console.log(`\nNo drug found with Id \'${drugId}\'`.red)

        res.status(404).send({
          success: false,
          message: `No drug found with Id \'${drugId}\'`
        })

      } else if(drug) {
        drug.remove()

        console.log('\nDrug deleted!'.green)

        res.status(200).send({
          success: true,
          message: 'Drug deleted'
        })
      }

    } catch(err) {
      console.log(`\nDelete error: ${err.message}`.red)
      
      res.status(404).send({
        success: false,
        error: `Delete error: ${err.message}`
      })

      return false
    }
  }
}
