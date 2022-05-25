async function acceptEditions(strapi) {
  await strapi
    .query("api::edition.edition")
    .updateMany({ data: { accepted: true } });
}

module.exports = acceptEditions;
