// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     basePath: '/vta-sms'
// }
// module.exports = nextConfig

// next.config.js

const repo = 'vta-sms'
const assetPrefix = `/${repo}/`
const basePath = `/${repo}`

module.exports = {
  assetPrefix: assetPrefix,
  basePath: basePath,
}
