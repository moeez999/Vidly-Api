const winston = require("winston");
const express = require("express");
const app = express();
const CORS = require("cors");

app.use(
  CORS({
    origin: "*",
  })
);

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();
require("./startup/config")(process);
require("./startup/validation")();

const env = process.env.NODE_ENV || "dev";
const port = process.env.PORT || 30900;
if (env == "production") {
  require("./startup/prod")(app);
} else {
  console.log("سرور پورٹ 3000 چل رہا ہے۔");
}
app.listen(port, () => {
  winston.info(`Listening at ${port}`);
});
