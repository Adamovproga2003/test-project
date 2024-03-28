import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = (url: any) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
};

export default connectDB;
