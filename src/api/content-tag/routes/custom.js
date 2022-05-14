module.exports = {
  routes: [
    {
      method: "POST",
      path: "/import/content-tag",
      handler: "import.store",
    },
  ],
};
