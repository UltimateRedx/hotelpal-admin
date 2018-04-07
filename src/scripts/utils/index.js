
import {message} from 'antd'
function scrollTop(value) {
	if (typeof document !== 'undefined') {
		value = value || 0;
		document.documentElement.scrollTop = value;
		document.body.scrollTop = value;
	}
}
message.config({
	top: 34,
	duration: 3,
  });
function NoticeMsg(msg){
	message.info(msg);
}
function NoticeError(msg) {
	message.error(msg, 5);
}
function isEmptyObject(obj) {
	return (Object.keys(obj).length === 0 && obj.constructor === Object) 
}
export {
	scrollTop,NoticeMsg,NoticeError,isEmptyObject
}