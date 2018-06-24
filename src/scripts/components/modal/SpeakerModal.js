import React from 'react'
import classNames from 'classnames'
import {Row, Col, Button, Modal, Input, Avatar} from 'antd'
import {NoticeError, Utils} from 'scripts/utils/index'
import {SPEAKER, CONTENT} from 'scripts/remotes/index'

const prefix = 'speakerModal'
const getInitialState = (props) => {
	let {data} = props
	return {
		id: data.id || "",
		nick: data.nick || '',
		company: data.company || '',
		title: data.title || '',
		phone: data.phone || '',
		headImg: data.headImg || '',
		desc: data.desc || '',
		errors:{},
	}
}
export default class SpeakerModal extends React.Component{
	constructor(props) {
		super(props);
		this.state = getInitialState(props)
	}
	componentDidMount() {
		let {desc} = this.state
		const elem = this.refs.editor
		const editor = Utils.createEditor(e1)
		editor.customConfig.onchange = html => {
			this.setState({desc: html})
		}
		editor.create()
		editor.txt.html(desc)
	}
	handleClose() {
		let { onClose } = this.props;
		this.setState(getInitialState(this.props), () => {
			onClose()
		});
	}
	handleConfirm() {
		SPEAKER.updateSpeaker(this.state).then(res => {
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
	handleSelectImg() {
		this.refs.fileInput.click();
	}
	handleFileChange(e) {
		let files = this.refs.fileInput.files;
		if (files) {
			let file = files[0];
			let formData = new FormData();
			formData.append('imgFile', file);
			CONTENT.uploadImg(formData).then(res => {
				if (res.success) {
					this.setState({headImg: res.vo})
				} else {
					NoticeError(res.messages)
				}
				this.refs.fileInput.value = null;
			})
		}
	}
	render() {
		let{...rest} = this.props
		let {nick, company, title, phone, headImg, desc, errors} = this.state;
		return (
			<Modal
				{...rest}
				title = '主讲人信息'
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
					<Row className="mb-8">
						<Col span={16}>
							<Row className="mb-8">
								<Col className="form-group-item">
									<div className="form-group-item-heading">姓名</div>
									<div className="form-group-item-body">
										<Input value={nick}
											className= {classNames(errors.nick && 'input-error')}
											onChange={this.handleInputChange.bind(this, 'nick')}/>
										{errors.nick && <div className="input-error-message">{errors.nick}</div>}
									</div>
								</Col>
							</Row>
							<Row className="mb-8">
								<Col className="form-group-item">
									<div className="form-group-item-heading">公司</div>
									<div className="form-group-item-body">
										<Input value={company}
											className= {classNames(errors.company && 'input-error')}
											onChange={this.handleInputChange.bind(this, 'company')}/>
										{errors.company && <div className="input-error-message">{errors.company}</div>}
									</div>
								</Col>
							</Row>
							<Row className="mb-8">
								<Col className="form-group-item">
									<div className="form-group-item-heading">职位</div>
									<div className="form-group-item-body">
										<Input value={title}
											className= {classNames(errors.title && 'input-error')}
											onChange={this.handleInputChange.bind(this, 'title')}/>
										{errors.title && <div className="input-error-message">{errors.title}</div>}
									</div>
								</Col>
							</Row>
							<Row>
								<Col className="form-group-item">
									<div className="form-group-item-heading">手机号</div>
									<div className="form-group-item-body">
										<Input value={phone}
											className= {classNames(errors.phone && 'input-error')}
											onChange={this.handleInputChange.bind(this, 'phone')}/>
										{errors.phone && <div className="input-error-message">{errors.phone}</div>}
									</div>
								</Col>
							</Row>
						</Col>
						<Col span={2}></Col>
						<Col span={6}>
							<div className="form-group-item-heading">头像</div>
							<div className="form-group-item-body">
								<Avatar icon={headImg ? null : 'plus-square-o'} shape='square' size='large' src={headImg} onClick={this.handleSelectImg.bind(this)}/>
							</div>
						</Col>
					</Row>
					<Row>
						<div ref="editor" className='editor'></div>
					</Row>
				</div>
				<input type='file' className='display-none' ref='fileInput' accept='image/jpeg,image/png'
							onChange={this.handleFileChange.bind(this)}/>
			</Modal>
		)

	}
}