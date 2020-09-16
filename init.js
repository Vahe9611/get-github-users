module.exports = async (githubService, userService) => {
  const Promise = require("bluebird")
  const moment = require('moment');
  
  const dateStart = moment('2020-01-01');
  const dateEnd = moment();
  const timeRanges = [];

  while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
    timeRanges.push(`${dateStart.format('YYYY-MM-DD')}..${dateStart.add(1,'month').format('YYYY-MM-DD')}`);
  }

  try {
    
    const users = await Promise.map(timeRanges, async (date) => {
      return await githubService.getUsersByPage(date);
    });
    
    await Promise.map(users.flat(), async ({login}) => {
      try {
        const normlizedData = await githubService.getUserByUsername(login);
        const [res, created] = await userService.insert(normlizedData)
    
        if(created) {
            console.log('\x1b[36m%s\x1b[0m', `${res.username} created`);
        }else {
            console.log('\x1b[33m%s\x1b[0m: ', `${res.username} finded`);
        }
    
      } catch (e) {
        console.log(e)
      }
    }, {concurrency: 2});
  } catch (error) {
    console.log(error);
  }
  
}