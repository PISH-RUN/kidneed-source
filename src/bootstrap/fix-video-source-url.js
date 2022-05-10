"use strict";

const cQuery = (strapi) => strapi.query("api::content.content");
const cService = (strapi) => strapi.service("api::content.content");

async function videoSourceUrl(strapi) {
  const contents = await cQuery(strapi).findMany({
    where: {
      $and: [
        { type: "video" },
        {
          $or: [
            { sourceUrl: { $notContains: "play.filmgardi.com" } },
            { sourceUrl: { $null: true } },
          ],
        },
      ],
    },
    select: ["id", "meta"],
  });

  await contents.reduce(async (acc, content) => {
    await acc;
    return updateContent(content);
  }, Promise.resolve());

  console.log(`${contents.length} video source url has been updated`);

  async function updateContent(content) {
    let src = content.meta?.source?.[0]?.src;

    if (!src) {
      return;
    }

    await cService(strapi).update(content.id, {
      data: { sourceUrl: src.replace("telewebion", "filmgardi") },
    });
  }
}

module.exports = videoSourceUrl;
