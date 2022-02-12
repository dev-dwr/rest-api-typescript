import config from "config";
import connectDb from "./utils/connectDb";
import logger from "./utils/logger";
import createServer from "./utils/server";


const port = config.get<number>("port");

const app = createServer();

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connectDb();
});
