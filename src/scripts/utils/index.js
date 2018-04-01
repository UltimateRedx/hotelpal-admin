
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

export {
	scrollTop,NoticeMsg,NoticeError
}