const { default: mongoose } = require("mongoose");

let connected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  //To avoid connected again when is connected before
  if (connected) {
    console.log("MongoDB is already connected...");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    connected = true;
    console.log("MongoDB is connected...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
