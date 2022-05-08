"use strict";

const pick = require("lodash/pick");

module.exports = ({ strapi }) => ({
  async createEntity(content) {
    await strapi.service("api::entity.entity").create({
      data: {
        ...pick(content, ["title", "description", "meta", "sourceUrl", "type"]),
        minAge: content.ageCategory || 0,
        maxAge: content.maxAge || 11,
        gender: content.suitableFor || "both",
        content: content.id,
      },
    });
  },
});
