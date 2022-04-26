"use strict";

module.exports = {
  async assign(ctx) {
    const { body, params } = ctx.request;
    const { id: userId } = params;
    const { entities } = body.data;

    await entities.reduce(async (acc, entity) => {
      await acc;
      return updateEntity(entity);
    }, Promise.resolve());

    async function updateEntity(entity) {
      await strapi.query("api::entity.entity").update({
        where: { id: entity },
        data: { assignee: userId },
      });
    }

    const updatedEntites = await strapi
      .query("api::entity.entity")
      .findMany({ where: { id: { $in: entities } }, select: ["id"] });

    return { data: { updated: updatedEntites.map((e) => e.id) } };
  },
};
