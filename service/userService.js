module.exports = (app) => {
  const settings = app.locals.settings;
  const SDB      = settings.SDB;
  const { GithubUser } = SDB;

  return {
    insert: async (data) => {
      return await GithubUser.findOrCreate({
        where: {
          username: data.username
        },
        defaults: data,
        raw: true,
      })
    }
  }
} 