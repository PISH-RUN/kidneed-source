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
          { publishedAt: { $notNull: true } },
        ],
      },
      select: ["id"],
      populate: {
        editions: { where: { accepted: true }, select: ["tag"] },
      },
    });
  },

  async duration(contentIds) {
    if (!contentIds) {
      return [];
    }

    const contents = await strapi.query("api::content.content").findMany({
      where: { id: { $in: contentIds } },
      select: ["id", "meta"],
    });

    return contents
      .map((content) => ({
        id: content.id,
        duration: content.meta?.duration,
      }))
      .filter((e) => e.duration)
      .reduce(
        (obj, content) => ({ ...obj, [content.id]: content.duration }),
        {}
      );
  },
});
