import winston, {format,createLogger,transports} from 'winston'
import jsonStringify from 'fast-safe-stringify';

const { combine, timestamp } = format; // , label, prettyPrint,printf
const logLikeFormat = {
	transform(info) {
	  const { label, message } = info;
	  const level = info[Symbol.for('level')];
	  const args = info[Symbol.for('splat')] || [];
	  console.log('args',args)
	  const strArgs = args.map(jsonStringify).join(' ');
	  info[Symbol.for('message')] = `${info?.timestamp} [${label}] ${level}: ${message} ${strArgs}`;
	  return info;
	}
  };
const logger = createLogger({
	level: 'info',
	format: // winston.format.json(), 
	combine(
		// format.colorize(),
		timestamp(),
		format.errors({stack: true}),
		logLikeFormat
	  ), 
	defaultMeta: { service: 'usr' },
	transports: [
	  //
	  // - Write all logs with importance level of `error` or less to `error.log`
	  // - Write all logs with importance level of `info` or less to `combined.log`
	  //
	  new winston.transports.File({ filename: 'error.log', level: 'error' }),
	  new winston.transports.File({ filename: 'combined.log' }),
	],
});
if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
	  format: winston.format.simple(),
	}));
  }

export default logger;