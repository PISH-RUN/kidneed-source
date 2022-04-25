"use strict";

const merge = require("lodash/merge");
/**
 *  task controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::task.task", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx.request;
    const newQuery = merge(query, {
      populate: ["content"]
    });

    return await strapi.service("api::task.task").find(newQuery);
  }
}));
