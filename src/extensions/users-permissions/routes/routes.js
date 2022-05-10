module.exports = {
  push: [],
  unshift: [
    {
      method: "POST",
      path: "/users/:id/contents",
      handler: "content.assign",
      config: {
        prefix: "",
      },
    },
  ],
};
