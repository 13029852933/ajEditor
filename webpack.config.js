var HtmlWebpackPlugin = require('html-webpack-plugin');
var server = require('webpack-dev-server');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
    entry: {

        ajEditor: [__dirname + "/src/static/ajEditor.js"],
        lib: [__dirname + "/src/static/jquery.min.js"],
        index : ['webpack-dev-server/client?http://127.0.0.1:8010/','webpack/hot/only-dev-server', __dirname + "/src/static/index.js"]

    },
    output: {
        path: __dirname + "/dist",
        publicPath:"http://127.0.0.1:8010/",
        filename: "js/[name].js",
        chunkFilename: "js/[name].js"
    },
    module:{
        loaders: [{
        test: /\.(?:jpg|png)/,
        loaders: ["url-loader?limit=80&name=[name].[ext]"]
    },{
        test: /\.(woff|svg|eot|ttf)/,
        loaders: ["url-loader?name=[name].[md5:hash:hex:7].[ext]"]
    },
    {
        test: /\.css$/,
        // loader: ExtractTextPlugin.extract("style", "css")
        loader: "style-loader!css-loader" 
    }]

    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ names: ['lib'] }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ // Also generate a test.html 
            filename: 'index.html',
            template: __dirname + "/src/index.html",
            chunks: ['lib', 'ajEditor','index'],
        })

        // new ExtractTextPlugin("style.css")
    ]

};

new server(webpack(config), {
    hot: true,
    inline: true,
    compress: true,
    stats: {
        chunks: false,
        children: false,
        colors: true
    },
    historyApiFallback: true
}).listen("8010", "127.0.0.1", function() {
    console.log("suc");
})