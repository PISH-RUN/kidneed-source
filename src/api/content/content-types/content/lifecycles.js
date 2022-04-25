"use strict";

async function createEntity(content) {
  await strapi.service("api::content.extended").createEntity(content);
}

async function removeEntity(entity) {
  await strapi.service("api::entity.entity").delete(entity.id);
}

module.exports = {
  async afterUpdate(event) {
    const { model, result } = event;
    const { uid } = model;

    const content = await strapi.query(uid).findOne({
      where: { id: result.id },
      populate: ["entity"],
    });

    if (result.publishedAt && !content.entity) {
      await createEntity(content);
    }

    if (!result.publishedAt && content.entity) {
      await removeEntity(content.entity);
    }
  },
};
