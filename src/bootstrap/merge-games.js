"use strict";

const _ = require("lodash");

async function mergeGames(strapi) {
  const titles = await gameTitles(strapi);

  await titles.reduce(async (acc, title) => {
    await acc;
    return process(title);
  }, Promise.resolve());

  async function process(title) {
    const contents = await strapi
      .query("api::content.content")
      .findMany({ where: { title, type: "game" }, populate: ["*"] });
  }
}

async function gameTitles(strapi) {
  const contents = await strapi
    .query("api::content.content")
    .findMany({ where: { type: "game" }, select: ["title"], orderBy: "title" });

  const titles = contents.map((c) => c.title);

  return _.filter(titles, (val, i, iteratee) =>
    _.includes(iteratee, val, i + 1)
  );
}

module.exports = mergeGames;
