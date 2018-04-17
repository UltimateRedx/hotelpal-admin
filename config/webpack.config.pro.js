var path = require( 'path' );
var webpack = require( 'webpack' );
var HtmlWebpackPlugin = require( 'html-webpack-plugin' );
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
var es3ifyPlugin = require( 'es3ify-webpack-plugin' );
var CompressionPlugin = require("compression-webpack-plugin")
module.exports = {
	context: path.join( __dirname, '../src' ),//“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。

	entry: './index.js',

	output: {
		path: path.join( __dirname, '../', 'dist' ),
		publicPath: '',
		filename: '[name].[chunkhash].bundle.js',
		chunkFilename: '[id].[chunkhash].chunk.js'
	},

	module: {
		rules: [
			{ test : /\.jsx?$/, loader : 'babel-loader' , exclude: /(node_modules|bower_components)/ },
			{ test: /\.(png|jpg|jpeg|gif)$/, use:[ { loader : 'url-loader', options : { limit : 30000 } } ] },
			{ test: /\.(svg|ttf|eot|woff(\(?2\)?)?)(\?[a-zA-Z_0-9.=&]*)?(#[a-zA-Z_0-9.=&]*)?$/, loader : 'file-loader' },
			{
				test: /\.less$/,
				use: [ 'style-loader' ,'css-loader', {
					loader: 'postcss-loader',
					options: {
						plugins: function() {
							return [ require( 'autoprefixer' ) ];
						}
					}
				},'less-loader']
			},
			{test : /\.css$/, use : ['style-loader','css-loader']}
		]
	},

	resolve : {
		modules: [ path.join( __dirname, '../src' ), 'node_modules' ],
		extensions : ['.js', '.jsx', '.json']
	},

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
		new ExtractTextPlugin( {
			filename : '[name].[chunkhash].bundle.css',
			allChunks : true,
			disable : false,
			ignoreOrder: true
		} ),
		new HtmlWebpackPlugin( {
			template: path.join( __dirname, '../src/index.html'),
			inject: true,
			filename: 'index.html',
			version: +new Date,
			entryName: '',
			title: '酒店邦成长营',
			minify: {
				removeComments: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
			// chunks: [ 'manifest', 'commons', options.chunks ]
		} ),
		new CompressionPlugin({
			asset: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
			algorithm: 'gzip',//算法
			test: new RegExp(
				 '\\.(js|css)$'    //压缩 js 与 css
			),
			threshold: 10240,//只处理比这个值大的资源。按字节计算
			minRatio: 0.8//只有压缩率比这个值小的资源才会被处理
	   })

	]

};