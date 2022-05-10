module.exports = {
  routes: [
    {
      method: "POST",
      path: "/plan-generator",
      handler: "plan-generator.generate",
      config: {
        auth: false,
      },
    },
  ],
};
