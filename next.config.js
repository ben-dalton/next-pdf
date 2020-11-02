const withPlugins = require('next-compose-plugins')
const withSourceMaps = require('@zeit/next-source-maps')()
const withCSS = require('@zeit/next-css')

const nextConfig = {
    target: 'serverless',
}

module.exports = withPlugins(
    [
        [withSourceMaps],
        [withCSS],
    ],
    nextConfig,
)
