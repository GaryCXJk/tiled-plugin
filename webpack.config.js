var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
const FilewatcherPlugin = require("filewatcher-webpack-plugin");
var buildpdf = require('./build-pdf');

var getBanner = function() {
	var header = fs.readFileSync('./src/header.js', 'utf8');
	var help = fs.readFileSync('./doc/help.js', 'utf8');
	
	help = help.replace('/*', ' *').replace('*/', '*');
	header = header.replace('@help', '@help\n' + help);
	return header;
}

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'YED_Tiled.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/env']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
	plugins: [
		new FilewatcherPlugin({
			watchFileRegex: ['./src/header.js', './doc/help.js']
		}),
		new webpack.BannerPlugin({
			banner: getBanner(),
			raw: true
		})
	],
    devtool: 'source-map'
};