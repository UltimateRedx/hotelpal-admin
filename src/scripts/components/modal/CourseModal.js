import React from 'react'
import classNames from 'classnames'
import {Modal, Row, Col, Button, Icon, Input, Avatar, InputNumber, Select, Radio, DatePicker} from 'antd'
import E from 'wangeditor'
import moment from 'moment'
import {NoticeMsg,NoticeError, Utils} from 'scripts/utils/index'
import {SPEAKER, CONTENT, COURSE} from 'scripts/remotes/index'
const RadioGroup = Radio.Group
const Option = Select.Option

const prefix = 'courseModal'
const getInitialState = (props) => {
	let {data} = props
	let d = data || {}
	Object.assign(d, {openTime: data.openTime ? new moment(data.openTime) : new moment(), price: data.price ? data.price / 100 : '0'})
	return d
}
export default class CourseModal extends React.Component{
	constructor(props) {
		super(props);
		this.state = getInitialState(props)
	}
	componentDidMount() {
		SPEAKER.getAll().then(res => {
			if (res.success) {
				this.setState({speakerList: res.voList})
			} else {
				NoticeError(res.messages)
			}
		})
		let {courseContent = {}} = this.state
		const e1 = this.refs.introduce
		const editor1 = Utils.createEditor(e1)
		editor1.customConfig.onchange = html => {
			courseContent.introduce = html
			this.setState({courseContent})
		}
		editor1.create()
		editor1.txt.html(courseContent.introduce)
		//2
		const e2 = this.refs.crowd
		const editor2 = Utils.createEditor(e2)
		editor2.customConfig.onchange = html => {
			courseContent.crowd = html
			this.setState({courseContent})
		}
		editor2.create()
		editor2.txt.html(courseContent.crowd)
		//3
		const e3 = this.refs.gain
		const editor3 = Utils.createEditor(e3)
		editor3.customConfig.onchange = html => {
			courseContent.gain = html
			this.setState({courseContent})
		}
		editor3.create()
		editor3.txt.html(courseContent.gain)
		//4
		const e4 = this.refs.subscribe
		const editor4 = Utils.createEditor(e4)
		editor4.customConfig.onchange = html => {
			courseContent.subscribe = html
			this.setState({courseContent})
		}
		editor4.create()
		editor4.txt.html(courseContent.subscribe)
	}
	handleClose() {
		let { onClose } = this.props;
		this.setState(getInitialState(this.props), () => {
			onClose()
		});
	}
	handleConfirm() {
		COURSE.updateCourse(this.state).then(res => {
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
					this.setState({bannerImg: res.vo})
				} else {
					NoticeError(res.messages)
				}
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
		this.setState({openTime: date})
	}
	handleTagChange(value, opt) {
		let tag = value.join(',');
		this.setState({tag})
	}
	render() {
		let {...rest} = this.props
		let {title = '', subTitle = '', courseOrder = '', status = 'NORMAL', bannerImg = '', tag = '',
			openTime, lessonNum = '', speakerId='', price = '', publish = 'N', speakerList = []} = this.state
		let speakerOpt = speakerList.map(s => {
			return (
				<Option key={s.id}>{s.nick}</Option> 
			)
		})
		let tagList = []
		if (tag) {
			tagList= tag.split(",").map((t, index) => {
				return (
					<Option key={t}>{t}</Option>
				)
			})
		}
		return (
			<Modal
				{...rest}
				title = '课程信息'
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
					<div className='f-r'>
						<Button key="back" className='btn-cancel' onClick={this.handleClose.bind(this)}>取消</Button>
						<Button key="submit" className="button-green white ml-8" onClick={this.handleConfirm.bind(this)}>
							保存
						</Button>
					</div>
					<h3 className="fs-14 f-bold mb-15">基本信息</h3>
					<Row className="mb-8">
						<Col span={16}>
							<Row className="mb-8">
								<Col span={12} className="form-group-item">
									<div className="form-group-item-heading">标题</div>
									<div className="form-group-item-body">
										<Input value={title}
											onChange={this.handleInputChange.bind(this, 'title')}/>
									</div>
								</Col>
								<Col span={12} className="form-group-item">
									<div className="form-group-item-heading">副标题</div>
									<div className="form-group-item-body">
										<Input value={subTitle}
											onChange={this.handleInputChange.bind(this, 'subTitle')}/>
									</div>
								</Col>
							</Row>
							<Row className="mb-8">
								<Col span={12} className="form-group-item">
									<div className="form-group-item-heading">开课时间</div>
									<div className="form-group-item-body">
										<DatePicker
											value={openTime}
											onChange={this.handleDateChange.bind(this)}
										/>
									</div>
								</Col>
								<Col span={12} className="form-group-item">
									<div className="form-group-item-heading">标签</div>
									<div className="form-group-item-body">
										<Select mode="tags" value={tag ? tag.split(",") : []} onChange={this.handleTagChange.bind(this)}>
											{tagList}
										</Select>
									</div>
								</Col>
							</Row>
							<Row className="mb-8">
								<Col span={8} className="form-group-item">
									<div className="form-group-item-heading">课时数量</div>
									<div className="form-group-item-body">
										<InputNumber
											value={lessonNum}
											min={0}
											onChange={this.handleNumberChange.bind(this,'lessonNum')}
										/>
									</div>
								</Col>
								<Col span={8} className="form-group-item">
									<div className="form-group-item-heading">价格</div>
									<div className="form-group-item-body">
										<InputNumber
											value={price}
											min={0}
											onChange={this.handleNumberChange.bind(this,'price')}
										/>
									</div>
								</Col>
								<Col span={8} className="form-group-item">
									<div className="form-group-item-heading">排序</div>
									<div className="form-group-item-body">
										<InputNumber
											value={courseOrder}
											min={0}
											onChange={this.handleNumberChange.bind(this,'courseOrder')}
										/>
									</div>
								</Col>
							</Row>
							<Row className="mb-8">
								<Col span={8} className="form-group-item">
									<div className="form-group-item-heading">设置预告</div>
									<div className="form-group-item-body">
										<Select defaultValue='NORMAL' onChange={this.handleSelectChange.bind(this, 'status')} value={status}>
											<Option value='NORMAL'>未配置</Option> 
											<Option value='PREDICTION'>预告</Option> 
											<Option value='NEW'>上新</Option> 
										</Select>
									</div>
								</Col>
								<Col span={8} className="form-group-item">
									<div className="form-group-item-heading">主讲人</div>
									<div className="form-group-item-body">
										<Select onChange={this.handleSelectChange.bind(this, 'speakerId')} value={speakerId + ''}>
											{speakerOpt}
										</Select>
									</div>
								</Col>
								<Col span={8} className="form-group-item">
									<div className="form-group-item-heading">是否发布</div>
									<div className="form-group-item-body">
										<RadioGroup value={publish} onChange={this.handleRadioChange.bind(this, 'publish')}>
											<Radio value='Y'>是</Radio>
											<Radio value='N'>否</Radio>
										</RadioGroup>
									</div>
								</Col>
							</Row>
							
						</Col>
						<Col span={2}></Col>
						<Col span={6}>
							<div className="form-group-item-heading">封面</div>
							<div className="form-group-item-body">
								<Avatar icon={bannerImg ? null : 'plus-square-o'} shape='square' size='large' src={bannerImg ? bannerImg : null} onClick={this.handleSelectImg.bind(this)}/>
							</div>
						</Col>
					</Row>
					<Row>
						<h3 className="fs-14 f-bold mb-15 bt-d">课程介绍</h3>
						<div ref="introduce" className='editor'></div>
					</Row>
					<Row>
						<h3 className="fs-14 f-bold mb-15 bt-d">适用人群</h3>
						<div ref="crowd" className='editor'></div>
					</Row>
					<Row>
						<h3 className="fs-14 f-bold mb-15 bt-d">您将获得</h3>
						<div ref="gain" className='editor'></div>
					</Row>
					<Row>
						<h3 className="fs-14 f-bold mb-15 bt-d">订阅须知</h3>
						<div ref="subscribe" className='editor'></div>
					</Row>
				</div>
				<input type='file' className='display-none' ref='fileInput' accept='image/jpeg,image/png'
							onChange={this.handleFileChange.bind(this)}/>
			</Modal>
		)

	}
}