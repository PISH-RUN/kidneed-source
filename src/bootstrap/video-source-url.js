async function videoSourceUrl(strapi) {
  const entities = await strapi.query("api::entity.entity").findMany({
    where: {
      $and: [
        { content: { type: "video" } },
        {
          $or: [
            { sourceUrl: { $notContains: "play.filmgardi.com" } },
            { sourceUrl: { $null: true } },
          ],
        },
      ],
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
    let src = entity.content.meta?.source?.[0]?.src;
    if (!src) {
      return;
    }

    await strapi.service("api::entity.entity").update(entity.id, {
      data: { sourceUrl: src.replace("telewebion", "filmgardi") },
    });
  }
}

module.exports = videoSourceUrl;
