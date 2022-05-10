"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");

const createActivityValidation = yup.object().shape({});

const generatePlanValidation = (allowed) =>
  yup.object().shape({
    age: yup.number().integer().positive().min(3).max(11).required(),
    days: yup.number().integer().positive().min(1).max(31).required(),
    gender: yup.mixed().oneOf(["boy", "girl"]).required(),
    field: yup.mixed().oneOf(allowed).required(),
  });

module.exports = {
  validatePlanGeneration: (allowed) =>
    validateYupSchema(generatePlanValidation(allowed)),
};
