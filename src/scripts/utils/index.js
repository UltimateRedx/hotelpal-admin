
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
const Utils = {
	getIntValue: (value) => {
		value = value + ''
		let obj = value.trim().match(/([1-9]\d*)|0/)
		let properValue = '0'
		if (obj) {
			properValue = obj[0]
		}
		return  properValue
	},
	getNumericValue: (value, n) => {
		value = value + ''
		let regex = '(([1-9]\\d*\\.?)|(0\\.))\\d{0,' + (n ? n : 2) + '}'
		let obj = value.trim().match(new RegExp(regex))
		let properValue = '0'
		if (obj) {
			properValue = obj[0]
		}
		return  properValue
	}
}
export {
	scrollTop,NoticeMsg,NoticeError,isEmptyObject, Utils
}