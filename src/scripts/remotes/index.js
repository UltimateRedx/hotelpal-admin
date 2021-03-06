import {notification} from 'antd'
const { remote, Remote } = require( 'beyond-remote' )

// const apiBasePath = window.location.href.substring(window.location.href.indexOf(window.location.host)+window.location.host.length, window.location.href.indexOf('admin')) + '/hotelpal'
const domain=window.location.href.substring(window.location.href.indexOf(window.location.host)+window.location.host.length, window.location.href.indexOf('admin'))
const apiBasePath = domain + (domain.endsWith("/") ? '' : '/') + 'hotelpal'
// const apiBasePath = 'http://v2.hotelpal.cn/hotelpal'
const CONFIG = {
	WS_ADDR: ('https:' == location.protocol ? 'wss:': 'ws:') + '//' + location.hostname,
	// WS_URL: '/hotelpal/admin/live/chat/',

	// WS_ADDR: 'ws://127.0.0.1:8081',
	WS_URL: '/live/chat',
	
	ADMIN_TOKEN: 'guFvC1iN6cnFVV257dwDVbEqttQ40vcJUzvAWvBdw6k0H8Tqblk1xXs2wbO95INF',
	// WS_PPT: '/hotelpal/live/op',
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
	timeout: 90,
	headers,
	dataType: 'json'
};

const remoteBaseOpts = {
	basePath: apiBasePath,
	method: 'POST',
	requestJSON: false,
	responseJSON: false,
	timeout: 90,
	headers: {},
	dataType: 'json'
};
const remoteBase = new Remote();
remote.base( remoteOpts );
remoteBase.base( remoteBaseOpts );
remoteBase.on('success', (e) => {
	e.data.clone().text().then((res)=> {
		postProcessXHR(res)
	})
})
let heartBeatShow = false
let loggedIn = false
remote.on('success', (e) => {
	let res = e.data.clone()
	// if (!loggedIn) {
		res.text().then(res => {
			postProcessXHR(res)
		})
	// } else if (res.url.indexOf('heartBeat') >= 0) {

	// }
})
function postProcessXHR(res) {
	try{
		res = JSON.parse(res)
	} catch(err){return}
	if (res.code == 401) {
		window.localStorage.setItem("loggedIn", 'N')
		window.location.href='#/login'
		loggedIn = false
	}
}
var beating = false
function beat() {
	if (beating) {
		return
	}
	beating = true
	var timeIntervalId = setInterval(() => {
		remote.create({url:'/admin/heartBeat'})().then(res => {
			if (res.code == 401){
				clearInterval(timeIntervalId)
				beating = false
			}
	
			// if (!heartBeatShow) {
			// 	notification.warn({
			// 		description: '当前会话不再可用，请将未保存的内容复制到其他位置', 
			// 		message: '与服务器断开连接...', 
			// 		duration: null, 
			// 		key: 'heartBeat',
			// 		onClose: () =>{heartBeatShow = false}}
			// 		)
			// 	heartBeatShow = true
			// }
			
		})
	}, 5 * 60 * 1000);
}
beat()
const LOGIN = {
	login: (user, auth) => {
		const url = 'admin/login'
		const body = {user, auth}
		return remoteBase.create({url, body})().then(res => {
			loggedIn = true
			beat()
			return res
		})
	},
	resetPW: (old, nova) => {
		return remoteBase.create({
			url: '/admin/resetPW',
			body: {old, nova},
		})()
	},
	logout: () => {
		return remoteBase.create({url:'/admin/logout'})()
	}
}
const ADMIN = {
	getAdminAuth: () => {
		return remoteBase.create({
			url: '/admin/getAdminAuth',
		})()
	},
	authorizeMenu: (uid, menu, authorize) => {
		return remoteBase.create({url: '/admin/authorizeMenu', body: {uid, menu, authorize}})()
	},
	deleteUser: (uid) => {
		return remoteBase.create({url:'/admin/deleteUser', body: {uid}})()
	},
	createAdminUser: (user = '', name = '') => {
		return remoteBase.create({url: '/admin/createAdminUser', body: {user, name}})()
	} 
}
const SETTINGS = {
	getBannerList: () => {
		const url = '/admin/content/getBannerList'
		return remoteBase.create({url})()
	},
	updateBanner: (data)=> {
		let {id, link, bannerOrder, bannerImg, name} = data
		const url = '/admin/content/updateBanner'
		const body = {id, link, bannerOrder, bannerImg, name}
		return remote.create({url, body})()
	},
	removeBanner: (id) => {
		const url = '/admin/content/removeBanner'
		const body = {id}
		return remoteBase.create({url, body})()
	},
	createFreeCourseLink: (courseNum, validity) => {
		const url = '/admin/content/createFreeCourseLink'
		const body = {courseNum, validity}
		return remoteBase.create({url, body})()
	},
	getAuthorizeParams() {
		return remote.create({
			url: '/thirdParty/getAuthorizeParams'
		})()
	},
	updateStaticImg: (index, url) => {
		return remoteBase.create({
			url: 'admin/content/updateStaticImg',
			body: {index, url}
		})()
	}
}
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
		let {currentPage,pageSize, orderBy, containsContent = true, from, to} = data;
		let body = {currentPage,pageSize, orderBy, containsContent}
		if (from) {
			body.dateFrom = from
		}
		if (to) {
			body.dateTo = to
		}
		return remoteBase.create({url, body})();
	},
	updateCourse: (data) => {
		const url = '/admin/course/updateCourse'
		let {id,status, speakerId, lessonNum, title, openTime, publish, price, courseOrder, subTitle, bannerImg, tag, courseContent} = data
		const body = {id,status, speakerId, lessonNum, title, openTime, publish, price: price ? price : 0, courseOrder, subTitle, bannerImg, tag, 
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
		let {courseId = '', currentPage = '1',pageSize = '10', orderBy='lessonOrder', order = 'asc',type = 'NORMAL', from, to} = data;
		let body = {courseId, currentPage,pageSize, orderBy, type, order}
		if (from) {
			body.statisticsDateFrom = from
		}
		if (to) {
			body.statisticsDateTo = to
		}
		return remoteBase.create({url, body})();
	},
	updateLesson: (data) => {
		const url = '/admin/lesson/updateLesson'
		let {id,courseId,publishDate,free,onSale,lessonOrder,title,audioUrl,audioLen,audioSize,content, type, coverImg} = data
		const body = {id,courseId,publishDate,free,onSale,lessonOrder,title,audioUrl,audioLen,audioSize,content, type, coverImg}
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
		return remote.create({url, body})();
	},
	updateElite: (data) => {
		const url = '/admin/comment/updateElite'
		let {id, elite} = data;
		const body = {id, elite}
		return remote.create({url, body})();
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
	},
	getOrderList: (data) => {
		const url = '/admin/content/getOrderList'
		let {currentPage = '1',pageSize = '10', orderBy='createTime', order = 'desc' ,courseType = 'NORMAL', purchaseDateTo = '', purchaseDateFrom = '', searchValue = ''} = data;
		const body = {currentPage,pageSize, orderBy, courseType, order, purchaseDateFrom, purchaseDateTo, searchValue}
		return remote.create({url, body})();
	},
	getPurchaseOrderList: (data) => {
		const url = '/admin/content/getPurchaseOrderList'
		let {currentPage = '1',pageSize = '10', orderBy='id', order = 'desc' ,courseType = 'NORMAL', purchaseDateTo = '', purchaseDateFrom = '', searchValue = '', searchValueCourse = ''} = data;
		const body = {currentPage,pageSize, orderBy, classify: courseType, order, purchaseDateFrom, purchaseDateTo, searchValue, searchValueCourse}
		return remote.create({url, body})();
	},
	getStatisticsData: (from, to) => {
		let data = {ignored: true};
		if (from) {
			data.from = from
		}
		if (to) {
			data.to = to
		}
		return remoteBase.create({
			url: '/admin/content/getStatisticsData',
			body: data
		})()
	},
	getDailySales: () => {
		return remoteBase.create({
			url: '/admin/content/getDailySales'
		})()
	},
	getUserByPhone(phoneList = []) {
		return remote.create({
			url: '/admin/content/getUserByPhone',
			body: {phoneList}
		})()
	},
	addCourse: (domainIdList=[], courseId='') => {
		return remote.create({
			url: 'admin/content/addCourse',
			body: {domainIdList, courseId}
		})()
	}
}
const LIVE_COURSE = {
	updateLiveCourse: (data) => {
		const url = '/admin/liveCourse/updateLiveCourse'
		let {id, title, subTitle, speakerNick, speakerTitle, openTime, bannerImg, price, inviteRequire, inviteImg, content, relaCourseId, publish, sysCouponId, relaCourseCouponImg} = data
		const body = {id, title, subTitle, speakerNick, speakerTitle, openTime, bannerImg, price, inviteRequire, inviteImg, introduce: content, 
			relaCourseId: (relaCourseId && relaCourseId > '0') ? relaCourseId : '', publish, 
			sysCouponId: (sysCouponId && sysCouponId > '0') ? sysCouponId : '',
			relaCourseCouponImg}
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
	userChatList: (courseId) => {
		const url = '/admin/live/assistant/userChatList'
		const body = {courseId}
		return remoteBase.create({url, body})()
	},
	
	blockUser: (msgId) => {
		const url = '/admin/live/assistant/blockUser'
		const body = {msgId}
		return remoteBase.create({url, body})()
	},
	changeCouponShowStatus: (courseId = '', show = 'N') => {
		const url = '/admin/live/assistant/changeCouponShowStatus'
		const body = {courseId, show}
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
	},
	getLiveImgList: (courseId) => {
		const url = '/admin/liveCourse/getLiveImgList'
		const body = {courseId}
		return remoteBase.create({url, body})()
	},

	mockUserMsg: (courseId, msg) => {
		const url = '/admin/live/assistant/mockUserMsg'
		const body = {courseId, msg}
		return remoteBase.create({url, body})()
	},
	removeLiveCourse: (id) => {
		const url = '/admin/liveCourse/removeLiveCourse'
		const body = {id}
		return remoteBase.create({url, body})()
	},
	configureBaseLine: (courseId, type, baseLine) => {
		return remoteBase.create({
			url: '/admin/liveCourse/configureBaseLine',
			body: {courseId, type, baseLine}
		})()
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
	},
	getUserList: (data) => {
		const url = '/admin/user/getUserList'
		let {currentPage = 1, pageSize = 10, phoneRegTimeFrom = '', phoneRegTimeTo = '', searchValue = '', 
			orderBy = 'createTime', order = 'desc'} = data
		const body = {currentPage, pageSize, order, orderBy, phoneRegTimeFrom, phoneRegTimeTo, searchValue}
		return remote.create({url, body})()
	},
	refreshWxUserInfo(domainId) {
		return remoteBase.create({
			url: '/admin/user/refreshWxUserInfo',
			body: {domainId}
		})()
	},
	getUserListenLog(domainId) {
		return remoteBase.create({
			url: '/admin/user/getUserListenLog',
			body: {domainId}
		})()
	}
}
const COUPON = {
	getSysCoupon: (data) => {
		const url = '/admin/coupon/getSysCoupon'
		let {currentPage = 1, pageSize = 10, 
			orderBy = 'createTime', order = 'desc'} = data
		const body = {currentPage, pageSize, order, orderBy}
		return remote.create({url, body})()
	},
	updateSysCoupon: (data) => {
		const url = '/admin/coupon/updateSysCoupon'
		let {id = '', name, value = '0', total, validityType, validity, validityDays, apply, applyToPrice = '0', applyToCourse} = data
		const body = {id, name, value, total, validityType, validity, validityDays, apply, applyToPrice, applyToCourse}
		return remote.create({url, body})()
	},
	deleteSysCoupon: (id = '') => {
		const url = '/admin/coupon/deleteSysCoupon'
		const body = {id}
		return remoteBase.create({url, body})()
	}
}
export {LOGIN, ADMIN, SETTINGS, SPEAKER, CONTENT, COURSE, LESSON, COMMENT, USER,
	LIVE_COURSE, CONFIG, COUPON}