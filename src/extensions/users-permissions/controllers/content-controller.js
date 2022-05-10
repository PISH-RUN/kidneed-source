"use strict";

const CQuery = () => strapi.query("api::content.content");
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

    const contents = await CQuery().findMany({
      where: query.filters,
      select: ["id"],
    });

    const contentsId = contents.map((c) => c.id);

    const tasks = [];
    await contentsId.reduce(async (acc, content) => {
      await acc;
      return createTask(content);
    }, Promise.resolve());

    async function createTask(content) {
      const data = { user: userId, content, field };
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
