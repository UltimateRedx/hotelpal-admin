var HtmlWebpackPlugin = require( 'html-webpack-plugin' );
var path = require( 'path' );
let webpack = require( 'webpack' );
var appEntry = {
    home : {
        path : '',
    },
    entrance : {
        path : '',
    },
};


function getView( options ) {
	var template = options.template || 'index.html';
	return new HtmlWebpackPlugin( {
		template: path.join( __dirname, '../deploys/' + template ),
		inject: true,
		filename: options.filename,
		version: options.version || +new Date,
		entryName: options.entry || '',
	} );
}

var baseConfig = {

	getHTMLPlugins: function( template ) {
		var arr = [];
		template = template || 'index.html';
		for ( var k in appEntry ) {
			var htmlFile = k === 'entrance' ? 'index' : k;
			arr.push( new HtmlWebpackPlugin( {
				template: path.join( __dirname, '../src/' + template ),
				inject: true, //默认值，script标签位于html文件的 body 底部
				filename: htmlFile + '.html',
				// chunks: [ 'commons', k ]
			} ) );
		}
		return arr;
	},

	getViews: function() {
		var version = +new Date;
		var results = [];
		for ( var k in appEntry ) {
			results.push( getView( {
				filename: appEntry[ k ].path,
				version: version,
				chunks: k
			} ) );
		}
		return results;
	},
	entry: './index.js',
	context:path.join( __dirname, '../src' ),

	dllOutput: path.join(__dirname,'./lib'),

	getRules: function(isDev) {
		let conmonRules = [
			{ test : /\.jsx?$/, loader : 'babel-loader' , exclude: /(node_modules|bower_components)/ },
			{ test: /\.(png|jpg|jpeg|gif)$/, use:[ { loader : 'url-loader', options : { limit : 30000 } } ] },
			{ test: /\.(svg|ttf|eot|woff(\(?2\)?)?)(\?[a-zA-Z_0-9.=&]*)?(#[a-zA-Z_0-9.=&]*)?$/, loader : 'file-loader' }
		]
		if(isDev) {
			conmonRules.push({
				test: /\.less$/,
				use: [ 'style-loader' ,'css-loader', {
					loader: 'postcss-loader',
					options: {
						plugins: function() {
							return [ require( 'autoprefixer' ) ];
						}
					}
				}]
			})
		}else{
			
		}
		return conmonRules;
	},

	getResolve: function(isDev) {
		let ret = {
			modules: [ path.join( __dirname, '../src' ), 'node_modules' ],
			extensions : ['.js', '.jsx', '.json']
		}
		if(isDev) {
			ret.unsafeCache = true
		}
		return ret;
	}
};

module.exports = baseConfig;