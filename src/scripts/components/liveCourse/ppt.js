import React from 'react'
import classNames from 'classnames'
import { Button, Avatar} from 'antd'
import {LIVE_COURSE, CONFIG} from 'scripts/remotes/index'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'

const prefix = 'ppt'
export default class PPT extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			ws: '',
			imgList: [],
			currentIndex: 0,
			currentImg: '',
			nextImg: '',
		}
	}
	componentDidMount() {
		let url = location.href
		url = url.substring(url.lastIndexOf('/'))
		let courseId = url.substring(1, url.indexOf('@'))
		this.getLiveImgList(courseId)
		this.joinChat()
	}
	joinChat() {
		let {WS_ADDR, WS_PPT} = CONFIG
		ws = new WebSocket(WS_ADDR + WS_PPT);
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
	getLiveImgList(courseId) {
		LIVE_COURSE.getLiveImgList(courseId).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			let imgList = res.voList
			let currentImg, nextImg
			if (imgList.length > 0) {
				currentImg = imgList[0]
			}
			if (imgList.length > 1) {
				nextImg = imgList[2]
			}
			this.setState({imgList, currentImg, nextImg})
		})
	}
	render() {
		let {imgList, currentIndex, currentImg, nextImg} = this.state
		let list = imgList.map((img, index) => {
			return (
				<Avatar key={index} className={classNames('avatars p-15', index == currentIndex && 'current')} shape='square' size='large' src={img} onClick={this.handleChangeImg.bind(this, index)}/>
			)
		})
		let disablePre = currentIndex <= 0
		let disableNext = currentIndex >= imgList.length - 1
		return (
			<div className={prefix}>
				<div>
					<div className='p-30 inline-block'>
						<Avatar className='currentImg' shape='square' size='large' src={currentImg}/>
					</div>
					<div className='p-60 inline-block text-right'>
						<Avatar className='nextImg' shape='square' size='large' src={nextImg}/>
					</div>
				</div>
				<div className='footer w-100p'>
					<div className='left inline-block'>
						<Button icon='left' disabled={disablePre} onClick={this.handleShowPre.bind(this)}></Button>
					</div>
					<div className='inline-block'>{list}</div>
					<div className='right inline-block'>
						<Button icon='right' disabled={disableNext} onClick={this.handleShowNext.bind(this)}></Button>
					</div>
				</div>
			</div>
		)
	}
	handleShowPre() {
		let {currentIndex, imgList} = this.state
		if (currentIndex > 0) {
			this.setState({currentIndex: currentIndex - 1, currentImg: imgList[currentIndex - 1], nextImg: imgList[currentIndex]}, this.handleSendSignal)
		}
	}
	handleShowNext() {
		let {currentIndex, imgList} = this.state
		if (currentIndex < imgList.length - 1) {
			this.setState({currentIndex: currentIndex + 1, currentImg: imgList[currentIndex + 1], nextImg: (currentIndex + 2) < imgList.length ? imgList[currentIndex + 2] : null}
				, this.handleSendSignal)
		}
	}
	handleChangeImg(index) {
		let {imgList} = this.state
		let count = imgList.length
		if (index < count - 1) {
			this.setState({currentIndex: index, currentImg: imgList[index], nextImg: imgList[index + 1]}, this.handleSendSignal)
		} else {
			this.setState({currentIndex: index, currentImg: imgList[index], nextImg: null}, this.handleSendSignal)
		}
	}
	handleSendSignal() {
		let {ws, currentImg} = this.state
		if (ws.readyState != WebSocket.OPEN) {
			NoticeError("通信连接没有打开")
			return
		}
		ws.send(currentImg)
	}
}