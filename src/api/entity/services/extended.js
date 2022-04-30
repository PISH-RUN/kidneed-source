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
});
