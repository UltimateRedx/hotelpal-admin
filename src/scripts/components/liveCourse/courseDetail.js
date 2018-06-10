import React from 'react'
import { Modal, Button, Radio, DatePicker, Spin, Select, Row, Col, Input, InputNumber, Avatar, Icon} from 'antd'
import moment from 'moment'
import E from 'wangeditor'
const RadioGroup = Radio.Group
const Option = Select.Option
// const moment = require('moment')
import {CONTENT, LIVE_COURSE, COURSE, COUPON} from 'scripts/remotes/index'
import {NoticeMsg,NoticeError, Utils} from 'scripts/utils/index'
const prefix = 'courseDetail'
const getInitialState = (props) => {
	let { course } = props
	return {
		id: course.id || '',
		title: course.title || '',
		subTitle: course.subTitle || '',
		speakerNick: course.speakerNick || '',
		speakerTitle: course.speakerTitle || '',
		openTime: course.openTime ? moment(course.openTime) : new moment(),
		bannerImg: course.bannerImg || '',
		price: course.price / 100 || '',
		inviteRequire: course.inviteRequire || '',
		inviteImg: course.inviteImg || '',
		content: course.introduce || '',
		relaCourseId: course.relaCourseId && (course.relaCourseId + '') || '0',
		publish: course.publish || 'N',
		sysCouponList:[],
		sysCouponId: course.sysCouponId && (course.sysCouponId + '') || '0',

		uploading: false,
		uploadingFor: '',
		courseList:[]
	}
}
export default class CourseDetail extends React.Component {
	constructor(props) {
		super(props)
		this.state = getInitialState(props)
	}
	componentDidMount() {
		//getCourseList
		this.getCourseList()
		this.getSysCouponList()
		//init editor
		let {content} = this.state
		const e1 = this.refs.content
		const editor1 = Utils.createEditor(e1)
		editor1.customConfig.onchange = html => {
			this.setState({content: html})
		}
		editor1.create()
		editor1.txt.html(content)
	}
	getCourseList() {
		COURSE.getList({currentPage:1 ,pageSize: 50, orderBy: 'createTime', containsContent: false}).then(res => {
			if(!res.success) NoticeError(res.messages)
			this.setState({courseList: res.voList})
		})
	}
	getSysCouponList() {
		COUPON.getSysCoupon({pageSize: 50}).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({sysCouponList: res.voList})
		})
	}
	handleClose() {
		let { onClose } = this.props;
		this.setState(getInitialState(this.props), () => {
			onClose()
		});
	}
	handleConfirm() {
		let {onClose} = this.props
		LIVE_COURSE.updateLiveCourse(this.state).then(res => {
			if (!res.success) NoticeError(res.messages)
			onClose(true)
		})
	}
	
	render() {
		let {...rest} = this.props
		let { title, subTitle, speakerNick, speakerTitle, openTime, bannerImg, price, inviteRequire, inviteImg, content, relaCourseId, publish, sysCouponList, sysCouponId } = this.state
		let {uploading, courseList} = this.state
		courseList = [<Option key='0'>无</Option>].concat(courseList.map(course => {
			return (
				<Option key={course.id}>{course.title}</Option> 
			)
		}))
		let couponList = [<Option key='0'>无</Option>].concat(sysCouponList.map(coupon => {
			return (
				<Option key={coupon.id}>{coupon.name}</Option> 
			)
		}))
		return (
			<Modal
				{...rest}
				title='公开课'
				width={1029}
				className={`${prefix}`}
				onCancel={this.handleClose.bind(this)}
				maskClosable={false}
				footer={
					[
						<Button key="back" className='btn-cancel w-64' onClick={this.handleClose.bind(this)}>取消</Button>,
						<Button key="submit" className="button-green white w-64" onClick={this.handleConfirm.bind(this)} loading={uploading} >
							{!uploading && '保存'}
						</Button>
					]
				}
			>
				<Row className="mb-8">
					<Col span={16}>
						<Row className="mb-8">
							<Col span={12} className="form-group-item">
								<div className="form-group-item-heading">标题</div>
								<div className="form-group-item-body">
									<Input value={title}
										onChange={this.handleInputChange.bind(this, 'title')} />
								</div>
							</Col>
							<Col span={12} className="form-group-item">
								<div className="form-group-item-heading">副标题</div>
								<div className="form-group-item-body">
									<Input value={subTitle}
										onChange={this.handleInputChange.bind(this, 'subTitle')} />
								</div>
							</Col>
						</Row>
						<Row className="mb-8">
							<Col span={12} className="form-group-item">
								<div className="form-group-item-heading">主讲人姓名</div>
								<div className="form-group-item-body">
									<Input value={speakerNick}
										onChange={this.handleInputChange.bind(this, 'speakerNick')} />
								</div>
							</Col>
							<Col span={12} className="form-group-item">
								<div className="form-group-item-heading">主讲人职位</div>
								<div className="form-group-item-body">
									<Input value={speakerTitle}
										onChange={this.handleInputChange.bind(this, 'speakerTitle')} />
								</div>
							</Col>
						</Row>
						<Row className="mb-8">
							<Col span={12} className="form-group-item">
								<div className="form-group-item-heading">开课时间</div>
								<div className="form-group-item-body">
									<DatePicker
										value={openTime}
										showTime={true}
										format='YYYY-MM-DD HH:mm'
										onChange={this.handleDateChange.bind(this)}
									/>
								</div>
							</Col>
							<Col span={12} className="form-group-item">
								<div className="form-group-item-heading">上架</div>
								<div className="form-group-item-body">
									<RadioGroup value={publish} onChange={this.handleRadioChange.bind(this, 'publish')}>
										<Radio value='Y'>是</Radio>
										<Radio value='N'>否</Radio>
									</RadioGroup>
								</div>
							</Col>
						</Row>
						<Row className="mb-8">
							<Col span={12} className="form-group-item">
								<div className="form-group-item-heading">价格(元)</div>
								<div className="form-group-item-body">
									<InputNumber
										value={price}
										min={0}
										onChange={this.handleNumberChange.bind(this, 'price')}
									/>
								</div>
							</Col>
							<Col span={12} className="form-group-item">
								<div className="form-group-item-heading">需邀请数</div>
								<div className="form-group-item-body">
									<InputNumber
										value={inviteRequire}
										min={0}
										precision={0}
										onChange={this.handleNumberChange.bind(this, 'inviteRequire')}
									/>
								</div>
							</Col>
						</Row>
						<Row className="mb-8">
							<Col span={12} className="form-group-item">
								<div className="form-group-item-heading">关联课程</div>
								<div className="form-group-item-body">
									<Select onChange={this.handleSelectChange.bind(this, 'relaCourseId')} value={relaCourseId}>
										{courseList}
									</Select>
								</div>
							</Col>
							<Col span={12} className="form-group-item">
								<div className="form-group-item-heading">优惠</div>
								<div className="form-group-item-body">
									<Select onChange={this.handleSelectChange.bind(this, 'sysCouponId')} value={sysCouponId}>
										{couponList}
									</Select>
								</div>
							</Col>
						</Row>
						<Row className="mb-8">
							<h3 className="fs-14 f-bold mb-15 bt-d">课程介绍</h3>
							<div ref="content" className='editor'></div>
						</Row>
					</Col>
					<Col span={2}/>
					<Col span={6}>
						<div className="form-group-item-heading">海报</div>
						<div className="form-group-item-body">
							<Avatar icon={bannerImg ? null : 'plus-square-o'} shape='square' size='large' src={bannerImg ? bannerImg : null} onClick={this.handleSelectImg.bind(this, 'bannerImg')}/>
						</div>
						<div className="form-group-item-heading">邀请图片</div>
						<div className="form-group-item-body">
							<Avatar icon={inviteImg ? null : 'plus-square-o'} shape='square' size='large' src={inviteImg ? inviteImg : null} onClick={this.handleSelectImg.bind(this, 'inviteImg')}/>
						</div>
					</Col>
				</Row>
				<input type='file' className='display-none' ref='fileInput' accept='image/jpeg,image/png'
							onChange={this.handleFileChange.bind(this)}/>
			</Modal>
		)
	}
	handleInputChange(field, e) {
		let state = this.state;
		state[field] = e.target.value;
		this.setState(state)
	}
	handleDateChange(date, dateString) {
		this.setState({ openTime: date })
	}
	handleRadioChange(f, e) {
		let state = this.state
		state[f] = e.target.value
		this.setState(state)
	}
	handleNumberChange(field, value) {
		let state = this.state;
		if (field === 'price' || field === 'coupon') {
			state[field] = Utils.getNumericValue(value)
		} else if (field === 'inviteRequire') {
			state[field] = Utils.getIntValue(value)
		}
		this.setState(state)
	}
	handleSelectChange(f, value) {
		let state = this.state
		state[f] = value
		this.setState(state)
	}
	handleSelectImg(f) {
		this.setState({uploadingFor: f}, ()=> {this.refs.fileInput.click(f)})
	}
	handleFileChange(e) {
		let files = this.refs.fileInput.files;
		let {uploadingFor} = this.state
		if (files) {
			let file = files[0];
			let formData = new FormData();
			formData.append('imgFile', file);
			this.setState({uploading: true})
			CONTENT.uploadImg(formData).then(res => {
				if (res.success) {
					this.setState({[uploadingFor]: res.vo})
				} else {
					NoticeError(res.messages)
				}
				this.refs.fileInput.value = null;
				this.setState({uploading: false})
			})
		}
	}

}