import dayjs from "dayjs";
import pino from "pino";

const transport = pino.transport({
    target: 'pino-pretty',
    options: { colorize: true }
  })
  
const log = pino({
    base: {
        pid: false //process id
    },
    timestamp: () => `,"time": "${dayjs().format()}"`,
}, transport);

export default log;