import schedule from 'node-schedule';
async function clearCache(cache) {
    const stream = cache.scanStream();
    stream.on("data", async (resultKeys) => {
        try {
            resultKeys.map(async (key) => {
                cache.del(key);
            })
        } catch (error) {
            console.log(error);
        }
    })
    .on('end',(error)=>
    {
    });
}
// removed expired token in a token
function clearCacheByTime(time, cache) {
    schedule.scheduleJob(time, async function (cache) {
        try {
            await clearCache(cache);
        } catch (error) {
            console.log(error);
        }
    }.bind(null, cache));
}
export{clearCacheByTime};