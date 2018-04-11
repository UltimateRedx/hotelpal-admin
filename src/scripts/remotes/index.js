const { remote, Remote } = require( 'beyond-remote' )
const apiBasePath = '/hotelpal'

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
		const url = '/admin/speaker/getList'
		let {currentPage,pageSize} = data;
		const body = {currentPage,pageSize}
		return remoteBase.create({url, body})();
	},
	getAll: () => {
		const url = '/admin/speaker/getAll'
		return remoteBase.create({url})();
	},
	updateSpeaker: (data) => {
		const url = '/admin/speaker/updateSpeaker'
		let {id,nick,company,title,phone,headImg,desc} = data;
		const body = {id,nick,company,title,phone,headImg,desc}
		return remoteBase.create({url, body})();
	},
	deleteSpeaker: (data) => {
		const url = '/admin/speaker/deleteSpeaker'
		let {id} = data;
		const body = {id}
		return remoteBase.create({url, body})();
	}
}
const COURSE = {
	getList: (data) => {
		const url = '/admin/course/getPageList'
		let {currentPage,pageSize, orderBy} = data;
		const body = {currentPage,pageSize, orderBy}
		return remoteBase.create({url, body})();
	},
	updateCourse: (data) => {
		const url = '/admin/course/updateCourse'
		let {id,status, speakerId, lessonNum, title, openTime, publish, price, courseOrder, subTitle, bannerImg, tag, courseContent} = data
		const body = {id,status, speakerId, lessonNum, title, openTime, publish, price, courseOrder, subTitle, bannerImg, tag, 
			introduce:courseContent.introduce,
			crowd:courseContent.crowd,
			gain:courseContent.gain,
			subscribe:courseContent.subscribe,
		}
		return remote.create({url, body})();
	},
	getCourse: ({id}) => {
		const url = '/admin/course/getCourse'
		const body = {id}
		return remoteBase.create({url, body})()
	},
	deleteCourse: ({id}) => {
		const url = '/admin/course/deleteCourse'
		const body = {id}
		return remoteBase.create({url, body})()
	},
}
const LESSON = {
	getLessonList: (data) => {
		const url = '/admin/lesson/getPageList'
		let {courseId, currentPage,pageSize, orderBy} = data;
		const body = {courseId, currentPage,pageSize, orderBy}
		return remoteBase.create({url, body})();
	},
	updateLesson: (data) => {
		const url = '/admin/lesson/updateLesson'
		let {id,courseId,publishDate,free,onSale,order,title,audioUrl,audioLen,audioSize,content} = data
		const body = {id,courseId,publishDate,free,onSale,order,title,audioUrl,audioLen,audioSize,content}
		return remote.create({url, body})();
	},
	deleteLesson: ({id}) => {
		const url = '/admin/lesson/deleteLesson'
		const body = {id}
		return remoteBase.create({url, body})()
	},
}
const COMMENT = {
	getCommentPageList: (data) => {
		const url = '/admin/comment/getCommentPageList'
		let {lesson, currentPage,pageSize} = data;
		const body = {lessonId: lesson.id, currentPage,pageSize}
		return remoteBase.create({url, body})();
	},
	updateElite: (data) => {
		const url = '/admin/comment/updateElite'
		let {id, elite} = data;
		const body = {id, elite}
		return remoteBase.create({url, body})();
	},
	deleteComment: (id) => {
		const url = '/admin/comment/deleteComment'
		const body = {id}
		return remoteBase.create({url, body})();
	},
	replyComment:(data) =>{
		const url = '/admin/comment/replyComment'
		let {replyToId, content, speakerId} = data
		const body = {replyToId, content, speakerId}
		return remoteBase.create({url, body})();
	}
}
const CONTENT = {
	uploadImg: (file) => {
		const url = '/image/uploadImg'
		const body = file
		return remoteBase.create({url, body})();
	},
	uploadAudio: (file) => {
		const url = '/audio/uploadAudio'
		const body = file
		return remoteBase.create({url, body})();
	}
}
const LIVE_COURSE = {
	updateLiveCourse: (data) => {
		const url = '/admin/liveCourse/updateLiveCourse'
		let {id, title, subTitle, speakerNick, speakerTitle, openTime, bannerImg, price, inviteRequire, inviteImg, content, relaCourseId, publish, } = data
		const body = {id, title, subTitle, speakerNick, speakerTitle, openTime, bannerImg, price: price * 100, inviteRequire, inviteImg, introduce: content, relaCourseId, publish}
		return remoteBase.create({url, body})();
	}
}
export {SPEAKER, CONTENT, COURSE, LESSON, COMMENT, 
	LIVE_COURSE}