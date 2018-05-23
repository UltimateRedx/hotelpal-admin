
import {message} from 'antd'
import moment from 'moment'
import E from 'wangeditor'
import {CONTENT} from 'scripts/remotes/index'
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
		let obj = value.trim().match(/([1-9]\d*)/) || value.trim().match(/0/)
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
	},
	formatDate: (str) => {
		if (!str) return '-';
		return moment(str).format('YYYY-MM-DD')
	},
	formatDateTime: (str) => {
		if (!str) return '-'
		return moment(str).format('YYYY-MM-DD HH:mm:ss')
	},
	formatHS: (str) => {
		if (!str) return '-'
		return moment(str).format('HH:mm')
	},
	createEditor: (selector) => {
		const editor = new E(selector)
		editor.customConfig.showLinkImg = false
		editor.customConfig.menus = ['bold', 'image', 'link']
		editor.customConfig.customUploadImg = (files, insert) => {
			if (files && files.length > 0) {
				let file = files[0];
				let formData = new FormData();
				formData.append('imgFile', file);
				CONTENT.uploadImg(formData).then(res => {
					if (!res.success) {
						NoticeError(res.messages)
						return
					}
					insert(res.vo)
				})
			}
		}
		return editor;
	}
}
export {
	scrollTop,NoticeMsg,NoticeError,isEmptyObject, Utils
}