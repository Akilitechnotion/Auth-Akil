const express = require("express");
const helmet = require("helmet");
const http = require("http");
const AppConfig = require("./config/app-config");
const UserRoutes = require("./service/user/route");
const logger = require("./config/winston");

class Server {
  constructor() {
    this.app = express();
    this.app.use(helmet());
    this.http = http.Server(this.app);
  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
  }

  /* Including app Routes starts */
  includeRoutes() {
    new UserRoutes(this.app).routesConfig();
  }
  /* Including app Routes ends */

  startTheServer() {
    this.appConfig();
    this.includeRoutes();

    const port = process.env.NODE_SERVER_PORT || 4000;
    const host = process.env.NODE_SERVER_HOST || "localhost";

    this.http.listen(port, host, () => {
      logger.info(`Listening on http://${host}:${port}`);
    });
  }
}

module.exports = new Server();
