import mongoose from "mongoose";
import config from "config";
import logger from "../utils/logger";

const connectDb = async () => {
  const dbUri = config.get<string>("dbUri");
  try {
    await mongoose.connect(dbUri);
    logger.info("Mongo Database connected");
  } catch (err) {
    logger.error(`Could not connect to database: ${err}`);
    process.exit(1);
  }
};

export default connectDb;
