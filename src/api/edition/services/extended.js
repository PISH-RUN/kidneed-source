"use strict";

module.exports = ({ strapi }) => ({
  async fields() {
    const model = await strapi.getModel("api::edition.edition");

    return model.attributes.tag.enum;
  },
});
