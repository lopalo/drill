var webpack = require("webpack");

var DEV = process.env.NODE_ENV !== "production";

var config = {
    entry: "./index",
    output: {
        path: __dirname + "/../public/js",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"]
                }
            }
        ]
    },
    babel: {
        plugins: [
            "transform-object-rest-spread"
        ]
    },
    devtool: "source-map",
    plugins: [
        new webpack.DefinePlugin({
            DEBUG: DEV
        })
    ]
};

if (DEV) {
    var LiveReloadPlugin = require("webpack-livereload-plugin");
    config.plugins.push(new LiveReloadPlugin({
        appendScriptTag: true,
        hostname: "vladio"
    }));
} else {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false}
    }));
}


module.exports = config;
