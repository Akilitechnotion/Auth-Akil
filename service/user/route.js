const userApi = require("./controller/user.controller");

class Routes {
  constructor(app) {
    this.app = app;
  }
  /* creating app Routes starts */
  appRoutes() {
    this.app.post("/register", userApi.register);
    this.app.post("/login", userApi.login);
  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
