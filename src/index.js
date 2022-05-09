"use strict";

const syncContentEntity = require("./bootstrap/content-entity-sync");
const fixMaxAge = require("./bootstrap/fix-max-age");
const mergeGames = require("./bootstrap/merge-games");
const removeDuplicateEntity = require("./bootstrap/remove-duplicate-entity");
const videoSourceUrl = require("./bootstrap/video-source-url");
const entityType = require("./bootstrap/entity-type");
const fixGames = require("./bootstrap/fix-games");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await removeDuplicateEntity(strapi);
    await syncContentEntity(strapi);
    // await fixMaxAge(strapi);
    // await mergeGames(strapi);
    await videoSourceUrl(strapi);
    await entityType(strapi);
    await fixGames(strapi);
  },
};
