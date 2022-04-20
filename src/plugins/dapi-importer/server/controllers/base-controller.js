const validateModelUID = require("./validations/validate-model");
const modelUID = require("../utils/model-uid");
const os = require("os");

const createImportController = (importer, run) => ({
  async import(ctx) {
    try {
      const { model, filter } = ctx.request.body;

      const uid = modelUID(model);
      validateModelUID(uid);

      const url = `${importer.getStartURL()}${filter ? "&" + filter : ""}`;

      run(uid, url);

      ctx.body = importer.get(true);
    } catch (e) {
      ctx.badRequest(e.message);
    }
  },

  async report(ctx) {
    ctx.body = importer.get(true);
  },

  async stop(ctx) {
    importer.stop();
    ctx.body = importer.get();
  },

  async reset(ctx) {
    importer.reset();
    ctx.body = importer.get();
  },
});

module.exports = createImportController;
