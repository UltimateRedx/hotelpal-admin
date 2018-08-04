import React from 'react'
import classNames from 'classnames'
import {Button, Row, Col, Select, Switch, Input} from 'antd'
import {LIVE_COURSE, CONFIG} from 'scripts/remotes/index'
import {NoticeMsg,NoticeError, Utils} from 'scripts/utils/index'
import moment from 'moment'
const Option = Select.Option

const prefix = 'liveControl'
export default class LiveControl extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			editor: '',
			courseEnv: {},
			selectedCourseId: '',
			courseList:[],
		}
	}
	componentDidMount() {
		this.getCourseList()
	}
	getCourseList() {
		let from = new Date();
		from.setHours(0);from.setMinutes(0);from.setSeconds(0);from.setMilliseconds(0);
		let data = {
			orderBy: 'openTime',
			order: 'asc',
			openTimeFrom: from,
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
					id: course.id,
					ongoing: course.status == 'ONGOING',
					preparing: false,
					currentMsg: '',
					assistantMsgList: [],
					userMsgList:[],
					ws: '',
					couponShow: 'Y' == course.couponShow,
					mockUserMsg: '',
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
		LIVE_COURSE.userChatList(this.state.selectedCourseId).then(res => {
			if (res.success) {
				res.voList.forEach(vo => {
					let user = vo.user
					vo.company = user.company
					vo.headImg = user.headImg
					vo.nick = user.nick
					vo.title = user.title
					vo.user = null;
				})
				let {courseEnv} = this.state
				courseEnv[selectedCourseId].userMsgList = res.voList
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
			} else if (data.msgType === MSG_TYPE.TYPE_LIVE_TERMINATE) {
				let {courseEnv, selectedCourseId} = this.state
				courseEnv[selectedCourseId].ongoing = false
				this.setState({courseEnv})
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
		//服务器会关闭ws，关闭之前有消息发送出来
		// let {selectedCourseId, courseEnv} = this.state
		// let {ws} = courseEnv[selectedCourseId]
		// if (ws.readyState != WebSocket.CLOSED) {
		// 	ws.close()
		//}
	}
	handleBlockUser(msg) {
		if(!msg.id) return
		LIVE_COURSE.blockUser(msg.id).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			let {selectedCourseId} = this.state
			let {userMsgList} = this.state.courseEnv[selectedCourseId]
			let toBlockMsg = userMsgList.find((m) =>{return m.id == msg.id});
			if (toBlockMsg) {
				toBlockMsg.firseBlocked=true
			}
			this.setState({userMsgList})
		})
	}
	render() {
		let {courseEnv, courseList, selectedCourseId = ''} = this.state
		let {ongoing = false, preparing = false, assistantMsgList = [], userMsgList = [], couponShow = false, mockUserMsg = '', id} = (courseEnv[selectedCourseId] || {})
		let  list = courseList.map(c => {
			return (
				<Option key={c.id}>{c.title}</Option>
			)
		})
		assistantMsgList = assistantMsgList.map((msg, index) => {
			return (
				<div key={index} className='msgBlock mb-15 p-15 pb-0'>
					<span className='f-bold '>{moment(msg.createTime).format('HH:mm:ss')}:</span>
					<div className='primary-red underline f-r pointer mr-30' onClick={this.handleRemoveMsg.bind(this, msg)}>删除</div>
					<div className='pl-30' dangerouslySetInnerHTML={{__html: msg.msg}}></div>
				</div>
			)
		})
		let user_msg_list = userMsgList.map((msg, index) => {
			return (
				<div key={index} className={classNames('msgBlock', msg.blocked == 'Y' && 'blocked', msg.firseBlocked && 'grey')}>
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
							<Button className='f-r' onClick={this.handleSendMsg.bind(this)}>发送</Button>
						</div>
					</Col>
					<Col span={12}>
						<div className='fs-18 f-bold mb-15'>推流地址:<br/>
							第一行 url: { id && `rtmp://video-center.alivecdn.com/app`}<br/>
							第二行 流名称: {id && `${id}?vhost=lv.hotelpal.cn`}
						</div>
						<div ref='userMsg' className='box default-box'>
							{user_msg_list}
						</div>
						<h3 className="fs-14 f-bold bt-d mb-0">随机用户发言</h3>
						<Input className='' value={mockUserMsg} onChange={this.handleMockUserMsgChange.bind(this)} onPressEnter={this.handleSendMockUserMsg.bind(this)}/>
					</Col>
				</Row>
			</div>
		)
	}

	handleCourseChange(value) {
		let {courseEnv, editor, selectedCourseId} = this.state
		this.removeEditor()
		const e1 = this.refs.content
		editor = Utils.createEditor(e1)
		editor.customConfig.onchange = html => {
			courseEnv[value].currentMsg = html
			this.setState({courseEnv})
		}
		editor.customConfig.menus.push('link')
		editor.create()
		
		try {
			let {ws} = courseEnv[selectedCourseId]
			if (selectedCourseId != value && ws && ws.readyState == WebSocket.OPEN) {
				ws.close()
			}
		} catch(e) {
		}
		this.setState({selectedCourseId: value, editor}, () => {
			let {courseEnv, selectedCourseId} = this.state
			let {ws} = courseEnv[selectedCourseId]
			if (!ws || ws.readyState != WebSocket.OPEN) {
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
		// if (courseEnv[selectedCourseId].ws.readyState != WebSocket.OPEN) {
		// 	NoticeMsg('没有进行直播')
		// 	return
		// }
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
					this.setState({courseEnv})
				}
			})
		} else {
			//live end
			courseEnv[selectedCourseId].preparing = true
			this.setState({courseEnv})
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
		let {selectedCourseId, courseEnv, editor} = this.state
		let {ws, currentMsg} = courseEnv[selectedCourseId]
		if (ws.readyState != WebSocket.OPEN) {
			NoticeError("通信连接没有打开")
			return
		}
		ws.send(currentMsg)
		editor.txt.html('')
	}
	handleRemoveMsg(msg) {
		LIVE_COURSE.removeAssistantMsg(msg.id).then(res =>{
			if (res.success) {
				let {selectedCourseId, courseEnv} = this.state
				courseEnv[selectedCourseId].assistantMsgList = res.voList
				this.setState({courseEnv})
			} else {
				NoticeError(res.messages)
			}
		})
	}
	removeEditor() {
		let editor = this.refs.content
		while (editor.firstChild) {
			editor.removeChild(editor.firstChild);
		}
	}

	handleMockUserMsgChange(e) {
		let {selectedCourseId, courseEnv} = this.state
		courseEnv[selectedCourseId].mockUserMsg = e.target.value
		this.setState(courseEnv)
	}
	handleSendMockUserMsg() {
		let {selectedCourseId, courseEnv} = this.state
		LIVE_COURSE.mockUserMsg(selectedCourseId, courseEnv[selectedCourseId].mockUserMsg).then(res => {
			if (!res.success) {
				NoticeMsg(res.messages)
				return
			}
			courseEnv[selectedCourseId].mockUserMsg = ''
			this.setState(courseEnv)
		})
	}
}
const MSG_TYPE = {
	TYPE_USER_MESSAGE: 'TYPE_USER_MESSAGE',
	TYPE_ASSISTANT_MESSAGE: "TYPE_ASSISTANT_MESSAGE",
	TYPE_SHOW_COUPON: "TYPE_SHOW_COUPON",
	TYPE_HIDE_COUPON: "TYPE_HIDE_COUPON",
	TYPE_LIVE_TERMINATE: 'TYPE_LIVE_TERMINATE',
}