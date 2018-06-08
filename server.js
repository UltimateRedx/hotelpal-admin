var path = require( 'path' );
var webpack = require( 'webpack' );
var WebpackDevServer = require( 'webpack-dev-server' );
var config = require( './config/webpack.config.dev' );
var ip = '0.0.0.0';
var port = 8080;

if ( typeof config.entry === 'string' ) {
	config.entry = [ 'react-hot-loader/patch', 'webpack-dev-server/client?http://' + ip + ':' + port, 'webpack/hot/only-dev-server', config.entry ];
} else if ( typeof config.entry === 'object' ) {
	for ( var k in config.entry ) {
		var main = config.entry[ k ];
		config.entry[ k ] = [ 'react-hot-loader/patch', 'webpack-dev-server/client?http://' + ip + ':' + port, 'webpack/hot/only-dev-server' ].concat( main );
	}
}

new WebpackDevServer( webpack( config ), {
	contentBase: path.resolve( __dirname, './' ),
	hot: true,//启动热加载，使用inline模式，热加载的好处是实现项目文件修改立即自动重新打包编译并且刷新浏览器的效果。
    //设置webpack-dev-server启动的时候，bundles的输出的路径，打包的时候这个publicPath没有作用
	publicPath: config.output.publicPath,
	public: config.output.publicPath,
	historyApiFallback: false,
    // /api/* 会指向  http://127.0.0.1:3000/api/*  如  /api/users 就会指向  http://127.0.0.1:3000/api/users
	disableHostCheck: true,
	proxy: {
		'/hotelpal/*': {
			target: 'http://127.0.0.1:8081'
			// target: 't.hotelpal.cn:8080',
		}
	},
} ).listen( port, function ( err ) {
	if ( err ) {
		console.log( err ); //eslint-disable-line no-console
	} else {
		console.log( 'Listening at http://127.0.0.1:' + port ); //eslint-disable-line no-console
	}
} );
