const { remote, Remote } = require( 'beyond-remote' )
const apiBasePath = typeof window !== 'undefined' && window.app && window.app.apiBasePath ? window.app.apiBasePath : ''

function parseRes( res ) {
	return typeof res === 'string' ? JSON.parse( res ) : res;
}
const headers = {
	'Content-Type': 'application/json;charset=UTF-8'
};
const remoteOpts = {
	basePath: apiBasePath,
	method: 'POST',
	requestJSON: false,
	responseJSON: false,
	timeout: 20,
	headers,
	dataType: 'json'
};

const remoteBaseOpts = {
	basePath: apiBasePath,
	method: 'POST',
	requestJSON: false,
	responseJSON: false,
	timeout: 20,
	headers: {},
	dataType: 'json'
};
const remoteBase = new Remote();
remote.base( remoteOpts );
remoteBase.base( remoteBaseOpts );

const SPEAKER = {
	getList: (data) => {
		const url = '/speaker/getList'
		let {currentPage,pageSize} = data;
		const body = {currentPage,pageSize}
		return remoteBase.create({url, body})();
	},
	updateSpeaker: (data) => {
		const url = '/speaker/updateSpeaker'
		let {id,nick,company,title,phone,headImg,desc} = data;
		const body = {id,nick,company,title,phone,headImg,desc}
		return remoteBase.create({url, body})();
	},
	deleteSpeaker: (data) => {
		const url = '/speaker/deleteSpeaker'
		let {id} = data;
		const body = {id}
		return remoteBase.create({url, body})();
	}
}
const COURSE = {
	getList: (data) => {
		const url = '/admin//course/getPageList'
		let {currentPage,pageSize, orderBy} = data;
		const body = {currentPage,pageSize, orderBy}
		return remoteBase.create({url, body})();
	},
}
const CONTENT = {
	uploadImg: (file) => {
		const url = '/image/uploadImg'
		const body = file
		return remoteBase.create({url, body})();
	}
}
export {SPEAKER, CONTENT, COURSE}