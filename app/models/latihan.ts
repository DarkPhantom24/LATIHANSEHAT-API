import mongoose from 'mongoose'

const LatihanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['cardio', 'strength', 'flexibility'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['terlaksana', 'belum terlaksana'],
      default: 'belum terlaksana',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Latihan', LatihanSchema)