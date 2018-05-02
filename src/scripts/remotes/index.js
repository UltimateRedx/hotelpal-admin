const { remote, Remote } = require( 'beyond-remote' )
const apiBasePath = '/hotelpal'
const CONFIG = {
	WS_ADDR: 'ws://' + location.hostname + ':8081',
	WS_URL: '/hotelpal/admin/live/chat/',
	ADMIN_TOKEN: 'guFvC1iN6cnFVV257dwDVbEqttQ40vcJUzvAWvBdw6k0H8Tqblk1xXs2wbO95INF',
}
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
		let {currentPage,pageSize, orderBy, containsContent = true} = data;
		const body = {currentPage,pageSize, orderBy, containsContent}
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
		let {id, title, subTitle, speakerNick, speakerTitle, openTime, bannerImg, price, inviteRequire, inviteImg, content, relaCourseId, publish, coupon} = data
		const body = {id, title, subTitle, speakerNick, speakerTitle, openTime, bannerImg, price: price * 100, inviteRequire, inviteImg, introduce: content, relaCourseId, publish, coupon: coupon * 100}
		return remoteBase.create({url, body})();
	},
	getLiveCoursePageList: (data) => {
		const url = '/admin/liveCourse/getLiveCoursePageList'
		let {currentPage=1, pageSize=10, orderBy = 'createTime', order = 'desc', openTimeFrom='', openTimeTo=''} = data
		const body = {currentPage, pageSize, orderBy, order, openTimeFrom, openTimeTo}
		return remote.create({url, body})();
	},
	startLiveCourse: (courseId) => {
		const url = '/admin/liveCourse/startLive'
		const body = {courseId}
		return remoteBase.create({url, body})();
	},
	terminateLiveCourse: (courseId) => {
		const url = '/admin/liveCourse/terminateLive'
		const body = {courseId}
		return remoteBase.create({url, body})();
	},
	// assistantMessage: (data) => {
	// 	const url = '/admin/live/assistant/sendMsg'
	// 	let {courseId, msg} = data
	// 	const body = {courseId, msg}
	// 	return remoteBase.create({url, body})()
	// },
	removeAssistantMsg: (id) => {
		const url = '/admin/live/assistant/removeMsg'
		const body = {msgId: id}
		return remoteBase.create({url, body})()
	},
	assistantMsgList: (courseId) => {
		const url = '/live/assistantMsgList'
		const body = {courseId}
		return remoteBase.create({url, body})()
	},
	blockUser: (msgId) => {
		const url = '/admin/live/assistant/blockUser'
		const body = {msgId}
		return remoteBase.create({url, body})()
	},
	changeCouponShowStatus: (show = 'N') => {
		const url = '/admin/live/assistant/changeCouponShowStatus'
		const body = {show}
		return remoteBase.create({url, body})()
	},
	getCourseStatistics: (courseId) => {
		const url = '/admin/liveCourse/getCourseStatistics'
		const body = {courseId}
		return remoteBase.create({url, body})()
	},
	getCourseStatisticsCurve: (courseId) => {
		const url = '/admin/liveCourse/getCourseStatisticsCurve'
		const body = {courseId}
		return remoteBase.create({url, body})()
	},
	updateCourseImage: (courseId, imgList) => {
		const url = '/admin/liveCourse/updateCourseImage'
		const body = {courseId, imgList}
		return remoteBase.create({url, body})()
	}
	
}
const USER = {
	getVipMemberList: (data) => {
		const url = '/admin/live/vip/getVipList'
		let {currentPage=1, pageSize=10, searchValue = ''} = data
		const body = {currentPage, pageSize, phone: searchValue}
		return remoteBase.create({url, body})()
	},
	addLiveVip: (phone, validity) => {
		const url = '/admin/live/vip/addLiveVip'
		const body = {phone, validity}
		return remoteBase.create({url, body})()
	},
	removeLiveVip: (phone) => {
		const url = '/admin/live/vip/removeLiveVip'
		const body = {phone}
		return remoteBase.create({url, body})()
	}
}
export {SPEAKER, CONTENT, COURSE, LESSON, COMMENT, USER,
	LIVE_COURSE, CONFIG, }