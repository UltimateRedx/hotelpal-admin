import React from 'react'
import classNames from 'classnames'
import {Button, Row, Col, Select, Switch} from 'antd'
import {LIVE_COURSE, CONFIG} from 'scripts/remotes/index'
import {NoticeMsg,NoticeError, Utils} from 'scripts/utils/index'
import E from 'wangeditor'
import moment from 'moment'
const Option = Select.Option

const prefix = 'liveControl'
export default class LiveControl extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			editor: '',
			courseEnv: {},
			// ongoing: false,
			selectedCourseId: '',
			courseList:[],
			// preparing: false,
			// currentMsg: '',
			// assistantMsgList: [],
			// userMsgList:[],
			// editor: '',
			// ws: '',
			// couponShow: false,
		}
	}
	componentDidMount() {
		// const e1 = this.refs.content
		// const editor = Utils.createEditor(e1)
		// // editor.customConfig.onchange = html => {
		// // 	this.setState({currentMsg: html})
		// // }
		// editor.customConfig.menus.push('link')
		// editor.create()
		// this.setState({editor})
		this.getCourseList()
	}
	getCourseList() {
		let from = new Date();
		from.setHours(0);from.setMinutes(0);from.setSeconds(0);from.setMilliseconds(0);
		let to = new Date();
		to.setDate(to.getDate() + 1)
		to.setHours(0);to.setMinutes(0);to.setSeconds(0);to.setMilliseconds(0);
		let data = {
			orderBy: 'openTime',
			order: 'asc',
			openTimeFrom: from,
			openTimeTo: to,
			pageSize: 50,
		}
		LIVE_COURSE.getLiveCoursePageList(data).then(res => {
			if (!res.success) {
				NoticeError(res.messages);
				return
			}
			let courseEnv = {}
			res.voList.forEach(course => {
				let env = {
					ongoing: course.status == 'ONGOING',
					preparing: false,
					currentMsg: '',
					assistantMsgList: [],
					userMsgList:[],
					editor: '',
					ws: '',
					couponShow: 'Y' == course.couponShow,
				}
				courseEnv[course.id] = env
			})
			this.setState({courseList: res.voList, courseEnv})
		}) 
	}
	joinChat() {
		LIVE_COURSE.assistantMsgList(this.state.selectedCourseId).then(res => {
			if (res.success) {
				let {courseEnv} = this.state
				courseEnv[selectedCourseId].assistantMsgList = res.data
				this.setState({courseEnv})
			} else {
				NoticeError(res.messages)
			}
		})
		let {courseEnv, selectedCourseId} = this.state
		let {ws} = courseEnv[selectedCourseId]
		let {WS_ADDR, WS_URL, ADMIN_TOKEN} = CONFIG
		ws = new WebSocket(WS_ADDR + WS_URL + selectedCourseId + '/' + ADMIN_TOKEN);
		ws.onmessage = (e) => {
			let data = JSON.parse(e.data)
			let {assistantMsgList, userMsgList} = courseEnv[selectedCourseId]
			if (data.msgType == MSG_TYPE.TYPE_ASSISTANT_MESSAGE) {
				assistantMsgList.push(data)
				this.setState({courseEnv}, ()=> {this.refs.assistantMsg.scrollTop = this.refs.assistantMsg.scrollHeight})
			} else if (data.msgType == MSG_TYPE.TYPE_USER_MESSAGE) {
				userMsgList.push(data)
				this.setState({courseEnv}, ()=> {this.refs.userMsg.scrollTop = this.refs.userMsg.scrollHeight})
			}
		}
		ws.onopen = (e) => {
			NoticeMsg('WebSocket opened...')
		}
		ws.onclose = (e) => {
			NoticeMsg('WebSocket closed...')
		}
		ws.onerror = (e) => {
			console.log(e)
		}
		courseEnv[selectedCourseId].ws = ws
		this.setState({courseEnv})
	}
	terminateChat() {
		let {selectedCourseId, courseEnv} = this.state
		let {ws} = courseEnv[selectedCourseId]
		if (ws.readyState != WebSocket.CLOSED) {
			ws.close()
		}
	}
	handleBlockUser(msg) {
		if(!msg.id) return
		LIVE_COURSE.blockUser(msg.id).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
		})
	}
	render() {
		let {courseEnv, courseList, selectedCourseId = ''} = this.state
		let {ongoing = false, preparing = false, assistantMsgList = [], userMsgList = [], couponShow = false} = (courseEnv[selectedCourseId] || {})
		let  list = courseList.map(c => {
			return (
				<Option key={c.id}>{c.title}</Option>
			)
		})
		console.log(assistantMsgList)
		assistantMsgList = assistantMsgList.map((msg, index) => {
			return (
				<div key={index} className='msgBlock mb-15 p-15 pb-0'>
					<span className='f-bold '>{moment(msg.createTime).format('HH:mm:ss')}:</span>
					<div className='primary-red underline f-r pointer mr-30' onClick={this.handleRemoveMsg.bind(this, msg)}>删除</div>
					<div className='pl-30' dangerouslySetInnerHTML={{__html: msg.msg}}></div>
				</div>
			)
		})
		userMsgList = userMsgList.map((msg, index) => {
			return (
				<div key={index} className={classNames('msgBlock', msg.blocked == 'Y' && 'blocked')}>
					<span className='f-bold ' className='pointer' onClick={this.handleBlockUser.bind(this, msg)}><img className='h-20' src={msg.headImg} /> {msg.nick}</span>
					<div className='pl-30' dangerouslySetInnerHTML={{__html: msg.msg}}></div>
				</div>
			)
		})
		return (
			<div className={prefix}>
				<Row gutter={50}>
					<Col span={12}>
						<Select className='w-50p' value={selectedCourseId} onChange={this.handleCourseChange.bind(this)}>
							{list}
						</Select>
						<div className='f-r'>
							<Switch checked={ongoing} loading={preparing} 
								onChange={this.handleStatusChange.bind(this)} checkedChildren='直播中' unCheckedChildren='未直播'/>
							<Switch checked={couponShow}
								onChange={this.handleChangeCouponShow.bind(this)} checkedChildren='优惠显示中' unCheckedChildren='优惠未显示'/>
						</div>
						<div className='assistant-msg mt-15'>
							<h3 className="fs-14 f-bold bt-d mb-0">助教发言</h3>
							<div ref='assistantMsg' className='box default-box mb-30'>
								{assistantMsgList}
							</div>
							<div ref="content" className='editor'></div>
							<Button className='f-r' onClick={this.handleSendMsg.bind(this)} disabled={!ongoing}>发送</Button>
						</div>
					</Col>
					<Col span={12}>
						<div ref='userMsg' className='box default-box'>
							{userMsgList}
						</div>
					</Col>
				</Row>
			</div>
		)
	}

	handleCourseChange(value) {
		let {courseEnv} = this.state
		let {ongoing, ws} = courseEnv[value]
		let editor
		if (ongoing) {
			const e1 = this.refs.content
			const editor = Utils.createEditor(e1)
			editor.customConfig.onchange = html => {
				courseEnv[value].currentMsg = html
				this.setState({courseEnv})
			}
			editor.customConfig.menus.push('link')
			editor.create()
		}
		this.setState({selectedCourseId: value, editor}, () => {
			let {courseEnv, selectedCourseId} = this.state
			let {ongoing, ws} = courseEnv[selectedCourseId]
			if (ongoing && (!ws || ws.readyState != WebSocket.OPEN)) {
				this.joinChat()
			}
		})
	}
	handleChangeCouponShow(checked) {
		let{selectedCourseId, courseEnv} = this.state
		if (!selectedCourseId) {
			NoticeMsg('请先选择课程')
			return
		}
		if (courseEnv[selectedCourseId].ws.readyState != WebSocket.OPEN) {
			NoticeMsg('没有进行直播')
			return
		}
		LIVE_COURSE.changeCouponShowStatus(selectedCourseId, checked ? 'Y' : 'N').then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return;
			}
			courseEnv[selectedCourseId].couponShow = checked
			this.setState({courseEnv})
		})
	}
	handleStatusChange(checked) {
		let{selectedCourseId, courseEnv} = this.state
		if (!selectedCourseId) {
			NoticeMsg('请先选择课程')
			return
		}
		if(checked) {
			courseEnv[selectedCourseId].preparing = true
			this.setState({courseEnv})
			LIVE_COURSE.startLiveCourse(selectedCourseId).then(res => {
				if (!res.success) {
					NoticeError(res.messages)
					courseEnv[selectedCourseId].preparing = false
					this.setState({courseEnv})
				} else {
					courseEnv[selectedCourseId].preparing = false
					courseEnv[selectedCourseId].ongoing = true
					const e1 = this.refs.content
					const editor = Utils.createEditor(e1)
					editor.customConfig.onchange = html => {
						courseEnv[selectedCourseId].currentMsg = html
						this.setState({courseEnv})
					}
					editor.customConfig.menus.push('link')
					editor.create()
					this.setState({courseEnv}, this.joinChat)
				}
			})
		} else {
			//live end
			courseEnv[selectedCourseId].preparing = true
			this.setState({courseEnv})
			let {ws} = courseEnv[selectedCourseId]
			ws.close()
			LIVE_COURSE.terminateLiveCourse(selectedCourseId).then(res => {
				if (res.success) {
					courseEnv[selectedCourseId].preparing = false
					courseEnv[selectedCourseId].ongoing = false
					this.setState({courseEnv}, this.terminateChat)
				} else {
					NoticeError(res.messages)
					courseEnv[selectedCourseId].preparing = false
					this.setState({courseEnv})
				}
			})
		}
	}
	handleSendMsg() {
		let {selectedCourseId, courseEnv} = this.state
		let {ws, currentMsg} = courseEnv[selectedCourseId]
		if (ws.readyState != WebSocket.OPEN) {
			NoticeError("通信连接没有打开")
			return
		}
		ws.send(currentMsg)
	}
	handleRemoveMsg(msg) {
		LIVE_COURSE.removeAssistantMsg(msg.id).then(res =>{
			if (res.success) {
				this.setState({assistantMsgList: res.voList})
			} else {
				NoticeError(res.messages)
			}
		})
	}
}
const MSG_TYPE = {
	TYPE_USER_MESSAGE: 'TYPE_USER_MESSAGE',
	TYPE_ASSISTANT_MESSAGE: "TYPE_ASSISTANT_MESSAGE",
	TYPE_SHOW_COUPON: "TYPE_SHOW_COUPON",
	TYPE_HIDE_COUPON: "TYPE_HIDE_COUPON",
}