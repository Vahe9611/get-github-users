module.exports = (app) => {
  const { Octokit } = require("@octokit/rest");
  const { throttling } = require("@octokit/plugin-throttling");

  const ThrotteledOctokit = Octokit.plugin(throttling);

  const octokit = new ThrotteledOctokit({
    auth: process.env.GITHUB_TOKEN,
    throttle: {
      onRateLimit: (retryAfter, options) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`
        );
  
        // Retry twice after hitting a rate limit error, then give up
        if (options.request.retryCount <= 2) {
          console.log(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onAbuseLimit: (retryAfter, options) => {
        // does not retry, only logs a warning
        octokit.log.warn(
          `Abuse detected for request ${options.method} ${options.url}`
        );
      },
    },
  });

  octokit.rateLimit.get();
  
  const getUsersByPage = async (date, page = 1, users = [] ) => {
    try {
      
      const { data: { items } }  = await octokit.search.users({
        q: `created:${date}+location:"United+States"`,
        per_page: 100,
        page
      });
      console.log('items --> ', items.length);
      
      if(items.length == 0) {
        return users
      }
      return getUsersByPage(date, page + 1, [...users, ...items])

    } catch (e) {
      console.log(e);
      if (e.status === 422 || e.status === 404) {
        console.log(e.message)
        return users
      } else
        return e

    }
    
  }

  const getUserByUsername = async (username) => {
    try {
      const { data } = await octokit.users.getByUsername({
        username,
      });
      
      return {
        username: data.login,
        email: data.email,
        country: data.location,
        githubCreatedDate: data.created_at,
        emailed: data.email ? true : false
      }

    } catch (e) {
      console.log(e);
    }
  }

  return {
    getUsersByPage,
    getUserByUsername
  }

}