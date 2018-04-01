let path = require( 'path' );
let webpack = require( 'webpack' );
var HtmlWebpackPlugin = require( 'html-webpack-plugin' );
module.exports = {
	context:path.join( __dirname, '../src' ),

	entry: './index.js',

	output: {
		path: path.join( __dirname, 'hot' ),
		publicPath: '/',
		filename: '[name].bundle.js',
		chunkFilename: '[id].chunk.js'
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

	resolve: {
		modules: [ path.join( __dirname, '../src' ), 'node_modules' ],
		extensions : ['.js', '.jsx', '.json']
	},

	plugins: [
		new webpack.NamedModulesPlugin(),

		new webpack.HotModuleReplacementPlugin(),

		new webpack.LoaderOptionsPlugin( {
			debug: true
		} ),

		new webpack.DefinePlugin( {
			'process.env': {
				NODE_ENV: JSON.stringify( 'development' ),
				DEV_ROUTES: true,
				MOCK: true
			}
		} ),

		new webpack.optimize.CommonsChunkPlugin( {
			name: 'commons',
			filename: '[name].bundle.js'
		} ),
		new HtmlWebpackPlugin( {
			template: path.join( __dirname, '../src/index.html' ),
			inject: true, //默认值，script标签位于html文件的 body 底部
			filename: 'index.html',
		} ) 

	],
	devtool: '#inline-source-map'
};