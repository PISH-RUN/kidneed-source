"use strict";

const cQuery = (strapi) => strapi.query("api::content.content");
const cService = (strapi) => strapi.service("api::content.content");

async function updateVideoAge(strapi) {
  const contents = await cQuery(strapi).findMany({
    where: {
      type: "video",
    },
    select: ["id", "meta"],
  });

  for (let content of contents) {
    let age = content.meta["age"];

    if (age === undefined) {
      continue;
    }

    await cService(strapi).update(content.id, {
      data: { ageCategory: age },
    });
  }
}

module.exports = updateVideoAge;
