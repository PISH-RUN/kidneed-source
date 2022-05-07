async function videoSourceUrl(strapi) {
  const entities = await strapi.query("api::entity.entity").findMany({
    where: {
      content: { type: "video" },
      sourceUrl: { $notContains: "telewebion" },
    },
    select: ["id"],
    populate: { content: { select: "meta" } },
  });

  await entities.reduce(async (acc, entity) => {
    await acc;
    return updateEntity(entity);
  }, Promise.resolve());

  console.log(`${entities.length} source url has been updated`);

  async function updateEntity(entity) {
    if (!entity.content.meta?.source?.[0]?.src) {
      return;
    }

    await strapi.service("api::entity.entity").update(entity.id, {
      data: { sourceUrl: entity.content.meta?.source?.[0]?.src },
    });
  }
}

module.exports = videoSourceUrl;
