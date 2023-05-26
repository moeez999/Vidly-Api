require("winston-mongodb");
const winston = require("winston");
const { transports } = require("winston");

module.exports = function () {
  winston.configure({
    transports: [
      new winston.transports.File({ filename: "logfile.log" }),
      new transports.Console(),
      // new transports.MongoDB({ db: "mongodb://localhost/vidly", level: "error" }),
    ],
  });

  process.on("unhandledRejection", (ex) => {
    console.log(ex.message);
    winston.error(ex.message, ex);
    process.exit(1);
  });
  process.on("uncaughtException", (ex) => {
    console.log(ex.message);
    winston.error(ex.message, ex);
    process.exit(1);
  });
};
