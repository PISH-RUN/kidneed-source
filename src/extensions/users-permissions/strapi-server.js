const routes = require("./routes/routes");
const entitiyController = require("./controllers/entitiy-controller");
const extendedService = require("./services/extended");
const userController = require("./controllers/user-controller");

module.exports = (plugin) => {
  modifyControllers(plugin);

  modifyRoutes(plugin);

  modifyServices(plugin);

  return plugin;
};

function modifyControllers(plugin) {
  plugin.controllers.user = userController.overwrite({
    ...plugin.controllers.user,
  });

  plugin.controllers.entity = entitiyController;
}

function modifyRoutes(plugin) {
  plugin.routes["content-api"].routes.unshift(...routes.unshift);
  plugin.routes["content-api"].routes.push(...routes.push);
}

function modifyServices(plugin) {
  plugin.services.extended = extendedService;
}
