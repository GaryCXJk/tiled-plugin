var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
const FilewatcherPlugin = require("filewatcher-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'YED_Tiled.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
	plugins: [
		new FilewatcherPlugin({
			watchFileRegex: ['./src/header.js']
		}),
		new webpack.BannerPlugin({
			banner: fs.readFileSync('./src/header.js', 'utf8'),
			raw: true
		})
	],
    devtool: 'source-map'
};