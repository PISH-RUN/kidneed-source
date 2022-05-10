async function fixGameUrl(strapi) {
  const games = await strapi.query("api::content.content").findMany({
    where: {
      $and: [
        { type: "game" },
        {
          $or: [
            { sourceUrl: { $notContains: "yekodo.ir" } },
            { sourceUrl: { $null: true } },
          ],
        },
      ],
    },
  });

  let count = 0;
  await games.reduce(async (acc, game) => {
    await acc;
    return updateGame(game);
  }, Promise.resolve());

  console.log(`${count} game url has been updated`);

  async function updateGame(game) {
    const url = game.meta?.url || game.meta?.Link;

    if (!url) {
      console.log({ id: game.id, url });
      return;
    }

    await strapi.service("api::content.content").update(game.id, {
      data: {
        sourceUrl: url.replace("kidneed", "yekodo").replace("game2", "game"),
      },
    });

    count += 1;
  }
}

module.exports = fixGameUrl;
