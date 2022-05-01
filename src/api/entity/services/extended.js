"use strict";

const eQuery = (strapi) => strapi.query("api::entity.entity");

module.exports = ({ strapi }) => ({
  async pool({ type, age, gender }, options) {
    return await eQuery(strapi).findMany({
      where: {
        $and: [
          { content: { type } },
          { minAge: { $lte: age } },
          { maxAge: { $gte: age } },
          { gender: { $in: [gender, "both"] } },
        ],
      },
      select: ["id"],
      populate: {
        content: {
          select: ["id"],
          populate: { editions: { select: ["tag"] } },
        },
      },
    });
  },
  async duration(entityIds) {
    if (!entityIds) {
      return [];
    }

    const entities = await strapi.query("api::entity.entity").findMany({
      where: { id: { $in: entityIds } },
      select: ["id"],
      populate: { content: { select: "meta" } },
    });

    return entities
      .map((e) => ({
        id: e.id,
        duration: e.content.meta?.duration,
      }))
      .filter((e) => e.duration);
  },
});
