"use strict";

const _ = require("lodash");

const UUID_PREFIX = "merged";

function getNonEmpty(contents, keys) {
  const result = {};
  for (let key of keys) {
    result[key] = contents.filter((c) => c[key])[0]?.[key] || "";
  }
  return result;
}

async function getContents(strapi, title) {
  return await strapi.query("api::content.content").findMany({
    where: { title, type: "game" },
    populate: ["attachments", "images", "editions"],
  });
}

async function getAge(contents) {
  const ageCategory = _.minBy(contents, "ageCategory").ageCategory;
  const maxAge = _.maxBy(contents, "maxAge").maxAge;
  return { ageCategory, maxAge };
}

function getRelations(contents) {
  const relations = contents.reduce(
    (acc, content) => {
      const attachments = content.attachments?.map((a) => a.id) || [];
      const images = content.images?.map((a) => a.id) || [];
      const editions = content.editions?.map((a) => a.id) || [];
      return {
        attachments: _.uniq([...acc.attachments, ...attachments]),
        images: _.uniq([...acc.images, ...images]),
        editions: _.uniq([...acc.editions, ...editions]),
      };
    },
    { attachments: [], images: [], editions: [] }
  );

  return _.omitBy(relations, (r) => r.length === 0);
}

function getMeta(contents) {
  let meta = {};
  for (let c of contents) {
    meta = _.merge(meta, c.meta);
  }
  return meta;
}

async function mergeGames(strapi) {
  const titles = await gameTitles(strapi);

  if (titles.length === 0) {
    console.log("There is no duplicate game to be merged");
    return;
  }

  await titles.reduce(async (acc, title) => {
    await acc;
    return process(title);
  }, Promise.resolve());

  async function process(title) {
    const contents = await getContents(strapi, title);

    const age = getAge(contents);

    const props = getNonEmpty(contents, [
      "description",
      "source",
      "sourceUrl",
      "srcFile",
    ]);

    const meta = getMeta(contents);

    const relations = getRelations(contents);

    try {
      await strapi.query("api::content.content").create({
        data: {
          ..._.pick(contents[0], ["title", "type"]),
          uuid: `merged${contents[0].uuid}`,
          meta,
          suitableFor: "both",
          ...props,
          ...age,
          ...relations,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
}

async function gameTitles(strapi) {
  const contents = await strapi
    .query("api::content.content")
    .findMany({ where: { type: "game" }, select: ["title"], orderBy: "title" });

  const merged = await strapi.query("api::content.content").findMany({
    where: { type: "game", uuid: { $startsWith: UUID_PREFIX } },
    select: ["title"],
    orderBy: "title",
  });

  const titles = contents.map((c) => c.title);
  const mergedTitles = merged.map((c) => c.title);

  return _.filter(_.difference(titles, mergedTitles), (val, i, iteratee) =>
    _.includes(iteratee, val, i + 1)
  );
}

module.exports = mergeGames;
