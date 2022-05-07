"use strict";

const { validatePlanGeneration } = require("./validations");

async function getEntities(payload) {
  return await strapi.service("api::entity.plan").generate(payload);
}

function createPayload(base, extra) {
  return { ...base, ...extra };
}

const types = (days) => [
  { type: "video", count: days * 2 },
  { type: "activity", count: days * 2 },
  { type: "book", count: days },
  { type: "audio", count: days },
  { type: "game", count: days },
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

    return { data: result };
  },
};
