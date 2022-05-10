"use strict";

const cQuery = (strapi) => strapi.query("api::content.content");

module.exports = ({ strapi }) => ({
  async pool({ type, age, gender }, options) {
    return await cQuery(strapi).findMany({
      where: {
        $and: [
          { type },
          { ageCategory: { $lte: age } },
          { maxAge: { $gte: age } },
          { suitableFor: { $in: [gender, "both"] } },
        ],
      },
      select: ["id"],
      populate: {
        editions: { select: ["tag"] },
      },
    });
  },
});
