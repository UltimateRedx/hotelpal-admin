import React from 'react'
import {Button, Row, Col, Select, Switch} from 'antd'
import {LIVE_COURSE, CONFIG} from 'scripts/remotes/index'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'
import E from 'wangeditor'
import moment from 'moment'
const Option = Select.Option

const prefix = 'liveControl'
export default class LiveControl extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			ongoing: false,
			selectedCourseId: '',
			courseList:[],
			preparing: false,
			currentMsg: '',
			assistantMsgList: [],
			userMsgList:[],
			editor: '',
			ws: '',
		}
	}
	componentDidMount() {
		let {currentMsg} = this.state
		const e1 = this.refs.content
		const editor = new E(e1)
		editor.customConfig.onchange = html => {
			this.setState({currentMsg: html})
		}
		editor.create()
		this.setState({editor})
		this.getCourseList()
		// let {active} = this.props
		// if (active) {
		// 	this.reAfterMount()
		// }
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
			}
			res.voList.forEach(course => {
				if (course.status == 'ONGOING') {
					this.setState({ongoing: true, selectedCourseId: course.id + ''}, this.joinChat)
				}
			})
			this.setState({courseList: res.voList})
		}) 
	}
	joinChat() {
		LIVE_COURSE.assistantMsgList(this.state.selectedCourseId).then(res => {
			if (res.success) {
				this.setState({assistantMsgList: res.data})
			} else {
				NoticeError(res.messages)
			}
		})
		let {ws} = this.state
		let {WS_ADDR, WS_URL, ADMIN_TOKEN} = CONFIG
		ws = new WebSocket(WS_ADDR + WS_URL + ADMIN_TOKEN);
		ws.onmessage = (e) => {
			let data = JSON.parse(e.data)
			let {assistantMsgList, userMsgList} = this.state
			if (data.assistant == 'Y') {
				assistantMsgList.push(data)
				this.setState({assistantMsgList})
			} else {
				userMsgList.push(data)
				this.setState({userMsgList})
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
		this.setState({ws})
	}
	terminateChat() {
		let {ws} = this.state
		if (ws.readyState != WebSocket.CLOSED) {
			ws.close()
		}
	}
	render() {
		let {ongoing, selectedCourseId, courseList, preparing, assistantMsgList, userMsgList} = this.state
		let  list = courseList.map(c => {
			return (
				<Option key={c.id}>{c.title}</Option> 
			)
		})
		assistantMsgList = assistantMsgList.map((msg, index) => {
			return (
				<div key={index} className='msgBlock'>
					<span>{moment(msg.createTime).format('HH:mm:ss')}:</span>
					<div dangerouslySetInnerHTML={{__html: msg.msg}}></div>
					<div className='primary-red unerline' onClick={this.handleRemoveMsg.bind(this, msg)}>删除</div>
				</div>
			)
		})
		userMsgList = userMsgList.map((msg, index) => {
			return (
				<div key={index} className='msgBlock'>
					<span>{moment(msg.createTime).format('HH:mm:ss')}:</span>
					<div dangerouslySetInnerHTML={{__html: msg.msg}}></div>
					<div className='primary-red unerline'>禁言</div>
				</div>
			)
		})
		return (
			<div className={prefix}>
				<Row gutter={50}>
					<Col span={12}>
						<Select disabled={ongoing} value={selectedCourseId} onChange={this.handleCourseChange.bind(this)}>
							{list}
						</Select>
						<Switch checked={ongoing} loading={preparing} onChange={this.handleStatusChange.bind(this)}></Switch>
						<h3 className="fs-14 f-bold mb-15 bt-d">助教发言</h3>
						<div className='box'>
							{assistantMsgList}
						</div>
						<div ref="content" className='editor'></div>
						<Button onClick={this.handleSendMsg.bind(this)} disabled={!ongoing}>发送</Button>
					</Col>
					<Col span={12}>
						<div className='box'>
							{userMsgList}
						</div>
					</Col>
				</Row>
			</div>
		)
	}

	handleCourseChange(value) {
		this.setState({selectedCourseId: value})
	}
	handleStatusChange(checked) {
		let{selectedCourseId} = this.state
		if (!selectedCourseId) {
			NoticeMsg('请先选择课程')
			return
		}
		if(checked) {
			this.setState({preparing: true})
			LIVE_COURSE.startLiveCourse(selectedCourseId).then(res => {
				if (!res.success) {
					NoticeError(res.messages)
					this.setState({preparing: false})
				} else {
					this.setState({preparing: false, ongoing: true}, this.joinChat)
				}
			})
		} else {
			//live end
			this.setState({preparing: true})
			LIVE_COURSE.terminateLiveCourse(selectedCourseId).then(res => {
				if (res.success) {
					this.setState({preparing: false, ongoing: false}, this.terminateChat)
				} else {
					NoticeError(res.messages)
					this.setState({preparing: false})
				}
			})
		}
	}
	handleSendMsg() {
		let {ws, currentMsg} = this.state
		if (ws.readyState != WebSocket.OPEN) {
			NoticeError("通信连接没有打开")
			return
		}
		ws.send(currentMsg)
		// let {selectedCourseId,currentMsg} = this.state
		// LIVE_COURSE.assistantMessage({courseId: selectedCourseId, msg: currentMsg}).then(res =>{
		// 	if (res.success) {
		// 		let {editor} = this.state
		// 		editor.txt.html('')
		// 		this.setState({assistantMsgList: res.voList, editor})
		// 	} else {
		// 		NoticeError(res.messages)
		// 	}
		// })
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