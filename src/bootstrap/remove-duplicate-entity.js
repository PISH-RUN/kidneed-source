async function removeDuplicateEntity(strapi) {
  const eQuery = strapi.query("api::entity.entity");

  const entities = await eQuery.findMany({
    where: { content: null },
    select: ["id"],
  });

  if (entities.length === 0) {
    return;
  }

  console.log({ entities });
  const ids = entities.map((e) => e.id);

  await eQuery.deleteMany({ where: { id: { $in: ids } } });
}

module.exports = removeDuplicateEntity;
