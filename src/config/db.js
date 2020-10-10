import mongoose from "mongoose";

export default {
  async connectDB(req, res) {
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Up: ${con.connection.host}`.yellow.bold);
  },
};
