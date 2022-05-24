"use strict";

const merge = require("lodash/merge");
const download = require("../utils/download");

const cQuery = (strapi) => strapi.query("api::content.content");
const cService = (strapi) => strapi.service("api::content.content");

async function posterSynced(strapi, id) {
  return await cService(strapi).update(id, {
    data: { posterSynced: true },
  });
}
async function seeder(strapi, { query = {}, type }, handler) {
  let limit = 5;

  let baseQuery = {
    where: {
      $and: [
        { type },
        {
          $or: [{ posterSynced: false }, { posterSynced: { $null: true } }],
        },
      ],
    },
  };

  baseQuery = merge(baseQuery, query);

  while (true) {
    baseQuery = merge(baseQuery, { limit });
    const [videos, count] = await cQuery(strapi).findWithCount(baseQuery);

    await handler(videos);

    if (count === 0) {
      break;
    }
  }
}

module.exports = ({ strapi }) => ({
  async video() {
    await seeder(
      strapi,
      {
        type: "video",
        query: { select: ["id", "meta"], populate: ["poster"] },
      },
      async (videos) => {
        for (let video of videos) {
          let verticalPoster = video.meta?.verticalPoster?.[0]?.url;

          if (!verticalPoster || video.poster) {
            await posterSynced(strapi, video.id);
            continue;
          }

          verticalPoster = "https://gateway.telewebion.com" + verticalPoster;

          try {
            const file = await download.resource(verticalPoster);
            await cService(strapi).update(video.id, {
              data: { posterSynced: true },
              files: { poster: [file] },
            });
            console.log({ video: video.id, message: `poster updated` });
          } catch (e) {
            console.log(e.message);
            await posterSynced(strapi, video.id);
          }
        }
      }
    );
  },
  async game() {
    await seeder(
      strapi,
      {
        type: "game",
        query: { populate: ["images"], select: ["id"] },
      },
      async (games) => {
        for (let game of games) {
          let image = game.images?.[0].id;

          if (!image) {
            await posterSynced(strapi, game.id);

            continue;
          }

          try {
            await cService(strapi).update(game.id, {
              data: { posterSynced: true, poster: image },
            });
            console.log({ game: game.id, message: `game updated` });
          } catch (e) {
            console.log(e.message);
            await posterSynced(strapi, game.id);
          }
        }
      }
    );
  },
  async book() {
    await seeder(
      strapi,
      {
        type: "book",
        query: { select: ["id", "meta"], populate: ["poster"] },
      },
      async (books) => {
        for (let book of books) {
          let img = book.meta?.img;

          if (!img || book.poster) {
            await posterSynced(strapi, book.id);

            continue;
          }

          try {
            const file = await download.resource(img);
            await cService(strapi).update(book.id, {
              data: { posterSynced: true },
              files: { poster: [file] },
            });
            console.log({ book: book.id, message: `poster updated` });
          } catch (e) {
            console.log(e.message);
            await posterSynced(strapi, book.id);
          }
        }
      }
    );
  },
  async audio() {
    await seeder(
      strapi,
      {
        type: "audio",
        query: { populate: ["images"], select: ["id"] },
      },
      async (audios) => {
        for (let audio of audios) {
          let image = audio.images?.[0].id;

          if (!image) {
            await posterSynced(strapi, audio.id);
            continue;
          }

          try {
            await cService(strapi).update(audio.id, {
              data: { posterSynced: true, poster: image },
            });
            console.log({ audio: audio.id, message: `game updated` });
          } catch (e) {
            console.log(e.message);
            await posterSynced(strapi, audio.id);
          }
        }
      }
    );
  },
});
