module.exports = {
  overwrite: (parent) => ({
    ...parent,
    async me(ctx) {
      await parent.me(ctx);

      const { user } = ctx.state;

      const authUser = await strapi
        .service("plugin::users-permissions.user")
        .fetchAuthenticatedUser(user.id);

      ctx.body = { ...ctx.body, role: authUser.role };
    },
  }),
};
