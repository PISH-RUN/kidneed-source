"use strict";

async function syncContentEntity(strapi) {
  const unsyncedContents = await strapi.query("api::content.content").findMany({
    where: { $and: [{ entity: null }, { publishedAt: { $notNull: true } }] },
  });

  await unsyncedContents.reduce(async (acc, content) => {
    await acc;
    return createEntity(content);
  }, Promise.resolve());

  async function createEntity(content) {
    await strapi.service("api::content.extended").createEntity(content);
  }
}

module.exports = syncContentEntity;
