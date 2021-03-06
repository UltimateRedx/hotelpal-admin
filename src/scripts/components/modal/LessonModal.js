import React from 'react'
import {Modal, Row, Col, Button, Icon, Input, InputNumber, Radio, DatePicker, notification } from 'antd'
import moment from 'moment'
import {NoticeMsg,NoticeError, Utils} from 'scripts/utils/index'
import {CONTENT, LESSON} from 'scripts/remotes/index'
const RadioGroup = Radio.Group

const prefix = 'lessonModal'
const getInitialState = (props) => {
	let {data} = props
	let d = data || {}
	Object.assign(d, {
		publishDate: data.publishDate ? new moment(data.publishDate) : new moment(), 
		audioUploading: false,
	})
	return d
}
export default class LessonModal extends React.Component{
	constructor(props) {
		super(props);
		this.state = getInitialState(props)
	}
	componentDidMount() {
		let {content = ''} = this.state
		const e1 = this.refs.content
		const editor1 = Utils.createEditor(e1)
		editor1.customConfig.onchange = html => {
			this.setState({content: html})
		}
		editor1.create()
		editor1.txt.html(content)
	}
	handleClose() {
		let { onClose } = this.props;
		this.setState(getInitialState(this.props), () => {
			onClose()
		});
	}
	handleConfirm() {
		let {audioUploading} = this.state
		if (audioUploading) {
			NoticeMsg('音频上传尚未完成, 请稍后保存')
			return
		}
		LESSON.updateLesson(this.state).then(res => {
			if (res.success) {
				let {onClose} = this.props
				onClose(true)
			} else {
				NoticeError(res.messages)
			}
		})
	}
	handleInputChange(field, e) {
		let state = this.state;
		state[field] = e.target.value;
		this.setState(state)
	}
	handleNumberChange(field, value) {
		let state = this.state;
		state[field] = value;
		this.setState(state)
	}
	handleSelectFile() {
		this.refs.fileInput.click();
	}
	handleFileChange(e) {
		let files = this.refs.fileInput.files;
		if (files) {
			let file = files[0];
			let formData = new FormData();
			formData.append('audioFile', file);
			this.setState({audioUploading: true}, this.handleUploadingAudio)
			CONTENT.uploadAudio(formData).then(res => {
				if (res.success) {
					let {audioUrl, audioLen, audioSize} = res.vo;
					this.setState({audioUrl, audioLen, audioSize})
				} else {
					NoticeError(res.messages)
				}
				this.setState({audioUploading: false}, () => {notification.close('audioUploading'); this.handleCompleteAudio()})
				this.refs.fileInput.value = null;
			})
		}
	}
	handleSelectChange(f, value) {
		let state = this.state
		state[f] = value
		this.setState(state)
	}
	handleRadioChange(f, e) {
		let state = this.state
		state[f] = e.target.value
		this.setState(state)
	}
	handleDateChange(date, dateString) {
		this.setState({publishDate: date})
	}
	handleTagChange(value, opt) {
		let tag = value.join(',');
		this.setState({tag})
	}
	handleUploadingAudio() {
		notification.info({
			key:'audioUploading',
			duration: null,
			icon: <Icon type="loading" />,
			message: '音频正在上传',
			description: '',
		})
	}
	handleCompleteAudio() {
		notification.info({
			key:'audioUploadComplete',
			duration: 3,
			icon: <Icon type="check-circle" />,
			message: '音频上传完成',
			description: '',
		})
	}
	render() {
		let {...rest} = this.props
		let {title = '', publishDate, lessonOrder = '', no = '', free = 'N', audioUrl, onSale = 'N'} = this.state
		return (
			<Modal
				{...rest}
				title = '课时信息'
				width = {1029}
				className = {`${prefix}`}
				onCancel={this.handleClose.bind(this)}
				maskClosable = {false}
				footer = {
					[
						<Button key="back" className='btn-cancel' onClick={this.handleClose.bind(this)}>取消</Button>,
						<Button key="submit" className="button-green white" onClick={this.handleConfirm.bind(this)}>
							保存
						</Button>
					]
				}
			>
				<div>
					<h3 className="fs-14 f-bold mb-15">基本信息</h3>
					<Row className="mb-8">
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">标题</div>
							<div className="form-group-item-body">
								<Input value={title}
									onChange={this.handleInputChange.bind(this, 'title')}/>
							</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">序号</div>
							<div className="form-group-item-body">
								<InputNumber
									value={lessonOrder}
									min={0}
									onChange={this.handleNumberChange.bind(this,'lessonOrder')}
								/>
							</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">发布时间</div>
							<div className="form-group-item-body">
								<DatePicker
									value={publishDate}
									onChange={this.handleDateChange.bind(this)}
								/>
							</div>
						</Col>
					</Row>
					<Row className="mb-8">
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">允许试听</div>
							<div className="form-group-item-body">
								<RadioGroup value={free} onChange={this.handleRadioChange.bind(this, 'free')}>
									<Radio value='Y'>是</Radio>
									<Radio value='N'>否</Radio>
								</RadioGroup>
							</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">上架</div>
							<div className="form-group-item-body">
								<RadioGroup value={onSale} onChange={this.handleRadioChange.bind(this, 'onSale')}>
									<Radio value='Y'>是</Radio>
									<Radio value='N'>否</Radio>
								</RadioGroup>
							</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">
								<a className='underline' onClick={this.handleSelectFile.bind(this)}>音频</a>
							</div>
							<div className="form-group-item-body">
								<audio className='w-100p' controls="controls" src={audioUrl ? audioUrl : null}></audio>
							</div>
						</Col>
					</Row>
					<Row>
						<h3 className="fs-14 f-bold mb-15 bt-d">图文介绍</h3>
						<div ref="content" className='editor'></div>
					</Row>
				</div>
				<input type='file' className='display-none' ref='fileInput' accept='audio/mpeg'
							onChange={this.handleFileChange.bind(this)}/>
			</Modal>
		)
	}
}