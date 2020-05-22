
const resolve = dir => require('path').join(__dirname, dir);

module.exports = { 
    chainWebpack: config => {
      config.resolve.alias
        .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/good-analysis-total-components'))
    }
  }