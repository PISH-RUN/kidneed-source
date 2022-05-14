"use strict";

const fs = require("fs");
const { parse } = require("csv-parse");
const { finished } = require("stream/promises");

async function stream(path) {
  const fd = await fs.open(path);
  return fd.createReadStream();
}

async function parser(path, config) {
  return (await stream(path)).pipe(parse(config));
}

module.exports = ({ strapi }) => ({
  async store(ctx) {
    const tags = {};
    const contents = {};
    let missed = 0;
    let missing = [];

    const { file } = ctx.request.files;

    const parser = fs.createReadStream(file.path).pipe(
      parse({
        columns: true,
      })
    );

    for await (const record of parser) {
      const tagIds = await getTagIds(
        record.tags.split(",").map((tag) => tag.trim())
      );

      await createContentTag(tagIds, record);
    }

    async function getTagIds(tags) {
      const result = [];
      for (const tag of tags) {
        const tagId = await getTagId(tag);
        if (tagId) {
          result.push(tagId);
        }
      }

      return result;
    }

    async function getTagId(tag) {
      let tagId = tags[tag];

      if (!(tag in tags)) {
        tagId = tags[tag] = (
          await strapi
            .query("api::tag.tag")
            .findOne({ where: { name: tag }, select: ["id"] })
        )?.id;
      }

      return tagId;
    }

    async function createContentTag(tagIds, record) {
      const { time, uuid, body, tagger } = record;
      let contentId = contents[uuid];

      if (!(uuid in contents)) {
        contentId = contents[uuid] = (
          await strapi
            .query("api::content.content")
            .findOne({ where: { uuid }, select: ["id"] })
        )?.id;
      }

      if (!contentId) {
        missing.push(record);
        missed += 1;
        return;
      }

      await strapi.query("api::content-tag.content-tag").create({
        data: {
          body,
          tags: tagIds,
          time,
          tagger: "+" + tagger,
          content: contentId,
        },
      });
    }

    return {
      missed,
      missing,
      ok: true,
    };
  },
});
