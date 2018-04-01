var path = require( 'path' );
var webpack = require( 'webpack' );
var HtmlWebpackPlugin = require( 'html-webpack-plugin' );
var es3ifyPlugin = require( 'es3ify-webpack-plugin' );
var baseConfig = require( './webpack.config.base' );


module.exports = {
	context: baseConfig.context,//“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。

	entry: baseConfig.entry,

	output: {
		path: path.join( __dirname, 'dist' ),
		publicPath: '/',
		filename: '[name].[chunkhash].bundle.js',
		chunkFilename: '[id].[chunkhash].chunk.js'
	},

	module: {
		rules : baseConfig.getRules()
	},

	resolve : baseConfig.getResolve(),

	plugins : [
		new es3ifyPlugin(),

		new webpack.optimize.UglifyJsPlugin( {
			compressor: {
				warnings: true,
				properties  : false
			},
			mangle: {
				except: [ '$super', '$', 'exports', 'require' ],
			},
			output : {
				keep_quoted_props: true
			}
		} ),

		new webpack.DefinePlugin( {
			'process.env' : {
				NODE_ENV : JSON.stringify( 'production' ),
				DEV_ROUTES : false
			}
		} ),

        // new webpack.optimize.CommonsChunkPlugin('commons', '[name].[hash].bundle.js'),
		new webpack.optimize.CommonsChunkPlugin( {
			names : [ 'commons','manifest' ],
            // filename :  '[name].[hash].bundle.js'
		} ),
	].concat( baseConfig.getViews() ).concat(baseConfig.getConmonPlugins())

};