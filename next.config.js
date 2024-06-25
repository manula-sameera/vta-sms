// This file is used to configure the base path of the application
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    basePath: isProd ? '/vta-sms' : undefined,
    //assetPrefix: '/vta-sms/',
    assetPrefix: isProd ? '/vta-sms/' : undefined,
  }
