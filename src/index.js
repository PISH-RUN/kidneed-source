"use strict";

const fixMaxAge = require("./bootstrap/fix-max-age");
const fixVideoSourceUrl = require("./bootstrap/fix-video-source-url");
const fixGameSourceUrl = require("./bootstrap/fix-game-source-url");
const posterSync = require("./bootstrap/poster-sync");
const acceptEditions = require("./bootstrap/accept-editions");

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    await fixMaxAge(strapi);
    await fixVideoSourceUrl(strapi);
    await fixGameSourceUrl(strapi);
    await acceptEditions(strapi);

    // syncPosters(strapi);
  },
};

async function syncPosters(strapi) {
  await posterSync({ strapi }).video();
  await posterSync({ strapi }).game();
  await posterSync({ strapi }).book();
  await posterSync({ strapi }).audio();
}
