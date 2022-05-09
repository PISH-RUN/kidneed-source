async function fixGames(strapi) {
  const games = await strapi
    .query("api::content.content")
    .findMany({ where: { type: "game", uuid: { $startsWith: "merged" } } });

  let count = 0;
  await games.reduce(async (acc, game) => {
    await acc;
    return updateGame(game);
  }, Promise.resolve());

  console.log(`${count} games updated`);
  console.error(`${games.length - count} games failed to update`);

  async function updateGame(game) {
    const data = {};
    if (!game.categoryAge) {
      data.ageCategory = 8;
      data.maxAge = 11;
    }

    data.uuid = game.uuid.replaceAll("merged", "");

    try {
      await strapi.service("api::content.content").update(game.id, { data });
      count += 1;
    } catch (e) {
      console.error(e.message);
    }
  }
}

module.exports = fixGames;
