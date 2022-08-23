"use strict";

const fixMaxAge = require("./bootstrap/fix-max-age");
const fixVideoSourceUrl = require("./bootstrap/fix-video-source-url");
const fixGameSourceUrl = require("./bootstrap/fix-game-source-url");
const posterSync = require("./bootstrap/poster-sync");
const acceptEditions = require("./bootstrap/accept-editions");
const updateVideoAge = require("./bootstrap/update-video-age");

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    // await fixMaxAge(strapi);
    // await fixVideoSourceUrl(strapi);
    // await fixGameSourceUrl(strapi);
    // await acceptEditions(strapi);
    await updateVideoAge(strapi);
    // syncPosters(strapi);
  },
};

async function syncPosters(strapi) {
  await posterSync({ strapi }).video();
  await posterSync({ strapi }).game();
  await posterSync({ strapi }).book();
  await posterSync({ strapi }).audio();
}
