import React from 'react'
import {Modal, Row, Col, Button, Icon, Input, Avatar, InputNumber, Radio, DatePicker, Select} from 'antd'
import moment from 'moment'
import {NoticeMsg,NoticeError, Utils,} from 'scripts/utils/index'
import {COUPON,COURSE} from 'scripts/remotes/index'
const RadioGroup = Radio.Group
const Option = Select.Option
const prefix = 'couponModal'
const getInitialState = (props) => {
	let {data} = props
	let d = {
		id: data.id || '',
		edit: !!data.edit,
		courseList: [],
		name: data.name || '', 
		total: data.total || '0', 
		value: data.value || '0', 
		validityType: data.validityType || VALIDITY_TYPE.FIXED, 
		validity: data.validity && moment(data.validity) || new moment(), 
		validityDays: data.validityDays || '', 
		apply: data.apply || APPLY_TYPE.ALL, 
		applyToPrice: data.applyToPrice || '',
		applyToCourse: data.applyToCourse || [],
	}
	return d
}
export default class CourseModal extends React.Component{
	constructor(props) {
		super(props);
		this.state = getInitialState(props)
	}
	componentDidMount() {
		
	}
	getCourseList() {
		COURSE.getList({currentPage: 1, pageSize: 20, orderBy: 'courseOrder', containsContent: false}).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({courseList: res.voList})
		})
	}
	handleConfirm() {
		COUPON.updateSysCoupon(this.state).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			let {onClose} = this.props
			onClose(true)
		})
	}
	
	render() {
		let {...rest} = this.props
		let {name, total, value, validityType, validity, validityDays, apply, applyToPrice, edit,
			courseList} = this.state
		let courseOptions = courseList.map(c => {
			return (<Option key={c.id} title={c.title}>{c.title}</Option>)
		})
		return (
			<Modal
				{...rest}
				title = '编辑优惠券'
				width = {600}
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
						<Col span={24} className="form-group-item">
							<div className="form-group-item-heading">优惠券名称</div>
							<div className="form-group-item-body">
								<Input value={name}
									onChange={this.handleInputChange.bind(this, 'name')}/>
							</div>
						</Col>
					</Row>
					<Row className="mb-8">
						<Col span={24} className="form-group-item">
							<div className="form-group-item-heading">总数</div>
							<div className="form-group-item-body">
								<InputNumber value={total}
									min={0}
									precision={0}
									onChange={this.handleNumberChange.bind(this, 'total')}/>
							</div>
						</Col>
					</Row>
					<Row className="mb-8">
						<Col span={24} className="form-group-item">
							<div className="form-group-item-heading">面额</div>
							<div className="form-group-item-body">
								<Input value={value}
									prefix={<Icon type="pay-circle-o" />}
									onChange={(e) => {this.setState({value: Utils.getNumericValue(e.target.value, 2)})}}/>
							</div>
						</Col>
					</Row>
					<Row className="mb-8">
						<Col span={24} className="form-group-item">
							<div className="form-group-item-heading">有效期</div>
							<div className="form-group-item-body text-left">
								<RadioGroup value={validityType} onChange={this.handleRadioChange.bind(this, 'validityType')}>
									<Radio className='mb-8 block-i' value={VALIDITY_TYPE.FIXED}>
										<span>固定日期</span>
										<DatePicker
											className='ml-8'
											showToday={false}
											disabled={validityType != VALIDITY_TYPE.FIXED}
											value={(validityType === VALIDITY_TYPE.FIXED && validity) ? validity : new moment()}
											onChange={this.handleDateChange.bind(this)}
										/>
									</Radio>
									<Radio className='mb-8 block-i' value={VALIDITY_TYPE.FIXED_DAYS}>
										<span>固定天数</span>
										<InputNumber value={validityDays}
											className='ml-8'
											min={0}
											precision={0}
											disabled={validityType != VALIDITY_TYPE.FIXED_DAYS}
											onChange={this.handleNumberChange.bind(this, 'validityDays')}/>
									</Radio>
									<Radio className='block-i' value={VALIDITY_TYPE.FIXED_DAY}>
										<span>当天有效</span>
									</Radio>
								</RadioGroup>
							</div>
						</Col>
					</Row>
					<Row className="mb-8">
						<Col span={24} className="form-group-item">
							<div className="form-group-item-heading">使用产品</div>
							<div className="form-group-item-body text-left">
								<RadioGroup value={apply} onChange={this.handleRadioChange.bind(this, 'apply')} disabled={edit}>
									<Radio className='mb-8 block-i' value={APPLY_TYPE.ALL}>
										<span>所有订阅专栏，需满金额</span>
										<Input className='auto-width ml-8' value={applyToPrice}
											prefix={<Icon type="pay-circle-o" />}
											disabled={apply != APPLY_TYPE.ALL}
											onChange={(e) => {this.setState({applyToPrice: Utils.getNumericValue(e.target.value, 2)})}}/>
									</Radio>
									<Radio className='mb-8 block-i' value={APPLY_TYPE.PARTICULAR}>
										<span>指定订阅专栏</span>
										<Select className='ml-8 course'
											disabled={apply != APPLY_TYPE.PARTICULAR}
											mode='multiple'
											onChange={this.handleCourseChange.bind(this)}
										>
											{courseOptions}
										</Select>
									</Radio>
								</RadioGroup>
							</div>
						</Col>
					</Row>
				</div>
			</Modal>
		)
	}

	handleClose() {
		let { onClose } = this.props;
		this.setState(getInitialState(this.props), () => {
			onClose()
		});
	}
	handleInputChange(field, e) {
		this.setState({[field]: e.target.value})
	}
	handleNumberChange(field, value) {
		this.setState({[field]: value})
	}
	
	handleRadioChange(f, e) {
		let {courseList} = this.state
		this.setState({[f]: e.target.value}, () => {
			if(f === APPLY_TYPE.PARTICULAR && courseList.length == 0)
				this.getCourseList()
		})
	}
	handleDateChange(date, dateString) {
		this.setState({validity: date})
	}
	handleCourseChange(value) {
		this.setState({applyToCourse: value})
	}
}
const VALIDITY_TYPE = {
	FIXED: 'FIXED',
	FIXED_DAYS: 'FIXED_DAYS',
	FIXED_DAY: 'FIXED_DAY',
}
const APPLY_TYPE = {
	ALL: 'ALL',
	PARTICULAR: 'PARTICULAR'
}
export {VALIDITY_TYPE, APPLY_TYPE}