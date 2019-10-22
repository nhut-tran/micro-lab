const path = require('path')
const nodemoneplugin= require('nodemon-webpack-plugin')
module.exports = {
    entry: ['@babel/polyfill','./public/src/js/index.js'],
    output: {
                path: path.resolve(__dirname, 'public/dist/js'),
                filename: 'bundle.js'
            },
    // plugins: [
    //     new nodemoneplugin()
    // ],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
   
}