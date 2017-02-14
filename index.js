let queues = {};
module.exports = (key, fn) => {
  if(key in queues){
    return Promise.resolve(fn()).then(data => {
      process.nextTick(() => {
        queues[key].forEach(deferred => deferred.resolve(data));
        delete queues[key];
      });
      return data;
    }).catch(err => {
      process.nextTick(() => {
        queues[key].forEach(deferred => deferred.reject(err));
        delete queues[key];
      });
      return Promise.reject(err);
    });
  }else{
    queues[key] = [];
    return new Promise((resolve, reject) => {
      queues[key].push({
        resolve,
        reject
      });
    });
  }
}
