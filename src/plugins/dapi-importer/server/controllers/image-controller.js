"use strict";

const Importer = require("../utils/importer");
const records = require("./record/record-handler");
const imageHandler = require("./record/image-handler");
const createImportController = require("./base-controller");
const importer = Importer("https://dapi.kidneed.ir/gallery/?format=json");

const runImporter = (uid, url) => {
  try {
    importer.run(uid, url);
    records.loopRecords(uid, importer, imageHandler);
  } catch (e) {
    console.error(e);
  }
};

module.exports = createImportController(importer, runImporter);
