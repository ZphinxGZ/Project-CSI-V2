import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = "mongodb+srv://Oxygenn:teeraphan200479@cluster0.q2lf0.mongodb.net/";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
