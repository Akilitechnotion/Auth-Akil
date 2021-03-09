const userApi = require("./controller/user.controller");

class Routes {
  constructor(app) {
    this.app = app;
  }
  /* creating app Routes starts */
  appRoutes() {
    this.app.get("/register", userApi.register);
  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
