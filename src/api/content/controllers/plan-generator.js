"use strict";

const { validatePlanGeneration } = require("./validations");

async function getEntities(payload) {
  return await strapi.service("api::content.plan").generate(payload);
}

function createPayload(base, extra) {
  return { ...base, ...extra };
}

const types = (days) => [
  { type: "video", count: days * 2 },
  { type: "activity", count: days * 2 },
  { type: "book", count: 2 * Math.ceil((days - 1) / 3) },
  { type: "audio", count: 2 * Math.ceil((days - 1) / 3) },
  { type: "game", count: 2 * Math.ceil((days - 1) / 3) },
];

module.exports = {
  async generate(ctx) {
    const { body } = ctx.request;
    const { age, days, gender, field } = body.data;

    const fields = await strapi.service("api::edition.extended").fields();

    await validatePlanGeneration(fields)(body.data);

    const baseProps = { age, gender, fields, field };

    const result = await types(days).reduce(async (acc, entity) => {
      const result = await acc;
      result[entity.type] = await entities(entity);
      return Promise.resolve(result);
    }, Promise.resolve({}));

    async function entities(entity) {
      return await getEntities(createPayload(baseProps, entity));
    }

    const durations = await strapi
      .service("api::content.extended")
      .duration(result, ["video", "audio"]);

    return { data: result, durations };
  },
};
