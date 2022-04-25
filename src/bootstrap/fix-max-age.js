"use strict";

async function updateMaxAge(strapi, min, max) {
  await strapi.query("api::content.content").updateMany({
    where: {
      ageCategory: min,
    },
    data: {
      maxAge: max,
    },
  });
}

async function fixMaxAge(strapi) {
  await updateMaxAge(strapi, 3, 7);
  await updateMaxAge(strapi, 8, 11);
}

module.exports = fixMaxAge;
