module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },
    pwa: {
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "src/service-worker.js"
        }
    }
}