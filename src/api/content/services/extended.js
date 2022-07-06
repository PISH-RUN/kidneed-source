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

  async duration(result, types) {
    const contentIds = types.reduce(
      (ids, type) => [...ids, ...result[type]],
      []
    );

    if (!contentIds) {
      return [];
    }

    const contents = await strapi.query("api::content.content").findMany({
      where: { id: { $in: contentIds } },
      select: ["id", "type", "meta"],
    });

    return contents
      .map((content) => ({
        id: content.id,
        duration: getDuration(content),
      }))
      .filter((e) => e.duration)
      .reduce(
        (obj, content) => ({ ...obj, [content.id]: content.duration }),
        {}
      );

    function getDuration(content) {
      if (type === "video") {
        return content.meta?.duration;
      }
      if (type === "audio") {
        return content.meta?.chapters?.[0]?.duration;
      }
    }
  },
});
