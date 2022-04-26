"use strict";

const merge = require("lodash/merge");

const EnQuery = () => strapi.query("api::entity.entity");

module.exports = {
  async assign(ctx) {
    const { query, params } = ctx.request;
    const { id: userId } = params;

    const entities = await EnQuery().findMany({
      where: query.filters,
      select: ["id"],
    });

    const entitiesId = entities.map((e) => e.id);

    await entitiesId.reduce(async (acc, entity) => {
      await acc;
      return updateEntity(entity);
    }, Promise.resolve());

    async function updateEntity(entity) {
      await strapi.query("api::entity.entity").update({
        where: { id: entity },
        data: { assignee: userId },
      });
    }

    return { data: { updated: entitiesId } };
  },
};
