async function removeDuplicateEntity(strapi) {
  const eQuery = strapi.query("api::entity.entity");

  const entities = await eQuery.findMany({
    where: {
      $or: [
        { content: null },
        { minAge: { $null: true } },
        { maxAge: { $null: true } },
      ],
    },
    select: ["id"],
  });

  if (entities.length === 0) {
    return;
  }

  const ids = entities.map((e) => e.id);

  await eQuery.deleteMany({ where: { id: { $in: ids } } });
}

module.exports = removeDuplicateEntity;
