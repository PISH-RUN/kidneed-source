async function entityTypeFiller(strapi) {
  const entities = await strapi.query("api::entity.entity").findMany({
    where: { type: { $null: true } },
    select: ["id"],
    populate: { content: { select: ["type"] } },
  });

  await entities.reduce(async (acc, entity) => {
    await acc;
    return updateEntityType(entity);
  }, Promise.resolve());

  console.log(`${entities.length} type updated`);

  async function updateEntityType(entity) {
    await strapi
      .service("api::entity.entity")
      .update(entity.id, { data: { type: entity.content.type } });
  }
}

module.exports = entityTypeFiller;
