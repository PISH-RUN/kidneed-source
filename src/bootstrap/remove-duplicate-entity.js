async function removeDuplicateEntity(strapi) {
  await strapi
    .query("api::entity.entity")
    .deleteMany({ where: { content: null } });
}

module.exports = removeDuplicateEntity;
