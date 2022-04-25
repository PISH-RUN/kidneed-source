"use strict";

const pick = require("lodash/pick");

module.exports = ({ strapi }) => ({
  async createEntity(content) {
    await strapi.service("api::entity.entity").create({
      data: {
        ...pick(content, ["title", "description", "meta", "sourceUrl"]),
        age: content.ageCategory || 0,
        gender: content.suitableFor || "both",
        content: content.id,
      },
    });
  },
});
