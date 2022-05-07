"use strict";

const _ = require("lodash");

function batchFilter(array, predicates) {
  if (!Array.isArray(predicates)) {
    predicates = [predicates];
  }

  return array.reduce((result, current) => {
    const r = Array.from(result.map((r) => [...r]));
    predicates.forEach((predicate, index) => {
      if (predicate(current)) {
        r[index].push(current);
      }
    });

    return r;
  }, Array.from(predicates.map((p) => [])));
}

function strictFieldPredicator(field) {
  return ({ content: { editions } }) => {
    const matchedEditions = editions.filter(
      (e) => e.tag.toLowerCase() === field.toLowerCase()
    );
    return matchedEditions.length === editions.length;
  };
}

function softFieldPredicator(field) {
  return ({ content: { editions } }) =>
    editions.find((e) => e.tag.toLowerCase() === field.toLowerCase());
}

function selectedNormalize(selected) {
  return _.flatten(selected).map((s) => s.id);
}

function getDistribution(count) {
  const minor = Math.floor(count * 0.2);
  return [count - minor * 3, minor, minor, minor];
}

module.exports = ({ strapi }) => ({
  async generate({ age, type, gender, count, field, fields }) {
    const distribution = getDistribution(count);

    const records = await strapi
      .service("api::entity.extended")
      .pool({ type, age, gender });

    if (records.length <= count) {
      // if our entities is less than requested one, we need to return repeated results randomly
      return selectedNormalize([
        ...records,
        ..._.sampleSize(records, count - records.length),
      ]);
    }

    const minorFields = _.without(fields, field);

    const recordsWithEdition = records.filter(
      (r) => r.content.editions.length > 0
    );

    const strictDistributedRecords = batchFilter(
      recordsWithEdition,
      [field, ...minorFields].map(strictFieldPredicator)
    );

    const selected = distribution.map((d, i) =>
      _.sampleSize(strictDistributedRecords[i], d)
    );

    const remainedRecords = _.differenceBy(
      recordsWithEdition,
      _.flatten(selected),
      "id"
    );

    let remainedDistribution = distribution.map((d, i) =>
      Math.max(0, d - selected[i].length)
    );

    if (Math.max(...remainedDistribution) < 1) {
      return selectedNormalize(selected);
    }

    let softDistributedRecords = batchFilter(
      remainedRecords,
      [field, ...minorFields].map(softFieldPredicator)
    );

    let tempDist = [...remainedDistribution].sort((a, b) => a - b);
    while (tempDist.length > 0) {
      const min = tempDist[0];
      tempDist = tempDist.slice(1);

      if (min < 1) {
        continue;
      }

      const index = remainedDistribution.indexOf(min);

      if (softDistributedRecords[index].length < 1) {
        continue;
      }

      const nominated = _.sampleSize(
        softDistributedRecords[index],
        remainedDistribution[index]
      );

      selected[index].push(...nominated);

      softDistributedRecords = softDistributedRecords.map((r) =>
        _.differenceBy(r, nominated, "id")
      );
    }

    let finalRemainders = _.differenceBy(records, _.flatten(selected), "id");
    selected.forEach((records, index) => {
      const diff = distribution[index] - records.length;
      if (diff < 1) {
        return;
      }

      const compensate = _.sampleSize(finalRemainders, diff);
      selected[index].push(...compensate);
      finalRemainders = _.differenceBy(finalRemainders, compensate, "id");
    });

    return selectedNormalize(selected);
  },
});
