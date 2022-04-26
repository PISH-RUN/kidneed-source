module.exports = {
  push: [],
  unshift: [
    {
      method: "POST",
      path: "/users/:id/entities",
      handler: "entity.assign",
      config: {
        prefix: "",
      },
    },
  ],
};
