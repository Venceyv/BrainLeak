import schedule from 'node-schedule';
async function clearCache(cache) {
  const stream = cache.scanStream();
  stream.on('data', async (resultKeys) => {
    try {
      if (resultKeys.length != 0) {
        resultKeys.map(async (key) => {
          cache.del(key);
        });
      }
    } catch (error) {
      console.log('clearCache Failed Rservice --2');
    }
  });
  stream.on('end', () => {});
}
// removed expired token in a token
function clearCacheByTime(time, cache) {
  schedule.scheduleJob(
    time,
    async function (cache) {
      try {
        await clearCache(cache);
      } catch (error) {
        console.log('clearCacheByTime Failed Rservice --20');
      }
    }.bind(null, cache)
  );
}
export { clearCacheByTime };
