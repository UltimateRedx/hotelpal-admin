/*
	动态设置publicPath，在正式环境运行的时候为绝对路径，如果需要手动指定，可以直接设置
	__webpack_public_path__的值，如  __webpack_public_path__ = '/base/bundles/'

 */
if ( typeof window !== 'undefined' && window.app && window.app.bundlesPath ) {
	__webpack_public_path__ = window.app.bundlesPath;
}else{
	const scripts = document.getElementsByTagName( 'script' );
	for ( let i = scripts.length - 1; i >= 0; i-- ) {
		if( scripts[ i ].src.indexOf( '.bundle.js' ) >= 0 ) {
			let src = scripts[ i ].getAttribute( 'src' );
			__webpack_public_path__ = src.substr( 0, src.lastIndexOf( '/' ) + 1 );
			break;
		}
	}
}

require( 'es6-promise' ).polyfill();
import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import App from 'scripts/routers';
import { AppContainer } from 'react-hot-loader';
// import BizCharts from 'bizCharts'
const $root = document.querySelector( '#root' );
// BizCharts.track(false);
if ( process.env.NODE_ENV !== 'production' ) {
	console.log( 'this is dev mode' );
}

const render = () => {
	ReactDOM.render(<AppContainer>
			<LocaleProvider locale={zh_CN}><App /></LocaleProvider>
		</AppContainer> ,$root );
};

render()
if ( typeof module !== 'undefined' && module.hot ) {
	module.hot.accept( 'scripts/routers',function() {
		render();
	} );
}