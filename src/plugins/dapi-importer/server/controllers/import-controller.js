"use strict";

const Importer = require("../utils/importer");
const records = require("./record/record-handler");
const createImportController = require("./base-controller");
const importer = Importer("https://dapi.kidneed.ir/dev/content/?format=json");

const runImporter = (uid) => {
  importer.run(uid);
  records.loopRecords(uid, importer, records.create);
};

module.exports = createImportController(importer, runImporter);
