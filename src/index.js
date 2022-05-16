"use strict";

const fixMaxAge = require("./bootstrap/fix-max-age");
const fixVideoSourceUrl = require("./bootstrap/fix-video-source-url");
const fixGameSourceUrl = require("./bootstrap/fix-game-source-url");

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    await fixMaxAge(strapi);
    await fixVideoSourceUrl(strapi);
    await fixGameSourceUrl(strapi);
  },
};
