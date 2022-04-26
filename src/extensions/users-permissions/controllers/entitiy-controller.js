"use strict";

const EnQuery = () => strapi.query("api::entity.entity");
const taskQuery = () => strapi.query("api::task.task");
const taskService = () => strapi.service("api::task.task");

async function getTask(data) {
  return await taskQuery().findOne({ where: data });
}

module.exports = {
  async assign(ctx) {
    const { query, params, body } = ctx.request;
    const { id: userId } = params;
    const { field } = body.data;

    const entities = await EnQuery().findMany({
      where: query.filters,
      select: ["id"],
    });

    const entitiesId = entities.map((e) => e.id);

    const tasks = [];
    await entitiesId.reduce(async (acc, entity) => {
      await acc;
      return createTask(entity);
    }, Promise.resolve());

    async function createTask(entity) {
      const data = { user: userId, entity, field };
      let task = await getTask(data);

      if (!task) {
        task = await taskService().create({
          data,
          fields: "id",
        });
      }

      tasks.push(task.id);
    }

    return { data: { tasks } };
  },
};
