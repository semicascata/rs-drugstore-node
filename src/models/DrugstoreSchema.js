import mongoose from 'mongoose'

const DrugSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, add a name'],
    unique: true
  },
  category: {
    type: String,
    enum: ['Pills', 'Health-Care', 'Antibiotics', 'Cures', 'Other'],
    required: [true, 'Please, insert a category']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
    required: [true, 'Please, insert an description']
  },
  use: {
    type: String,
    maxlength: [1000, 'Use tutorial cannot be more than 1000 characters'],
    default: 'No manual needed'
  },
  imgUrl: {
    type: String,
    default: 'https://gamepedia.cursecdn.com/pathologic_gamepedia/thumb/e/ee/Visir.png/600px-Visir.png?version=85750521e44e6285f28f922d73ae8c0e'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Drug', DrugSchema)
