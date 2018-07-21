import React from 'react'
import {Modal, Button, Row, Col} from 'antd'
import { Chart, Axis, Geom, Tooltip } from 'bizcharts'
import {LIVE_COURSE} from 'scripts/remotes/index'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'
import moment from 'moment'


const prefix = 'liveStatistics'
export default class LivecStatistics extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			freeCompleteRate: 0,
			purchaseEnrollRate: 0,
			enrollOnlineRate: 0,
			onlinePurchaseRate: 0,
			onlineEnrollRate: 0,
		}
	}
	componentDidMount() {
		this.getStatisticsData()
		this.getStatisticsCurve()
	}
	getStatisticsData() {
		let {courseId} = this.props
		LIVE_COURSE.getCourseStatistics(courseId).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			let vo = res.vo
			this.setState({
				freeEnrollTimes: vo.freeEnrollTimes,
				purchaseEnrollTimes: vo.purchaseEnrollTimes,
				tryFreeEnrollCount: vo.tryFreeEnrollCount,
				purchasedFee: vo.purchasedFee / 100,
				totalPeople: vo.totalPeople,
				freeCompleteRate: vo.freeCompleteRate,
				totalEnrollCount: vo.totalEnrollCount,
				purchaseEnrollRate: vo.purchaseEnrollRate,
				enrollOnlineRate: vo.enrollOnlineRate,
				onlinePurchaseRate: vo.onlinePurchaseRate,
				onlineEnrollRate: vo.onlineEnrollRate,
			})
		})
	}

	getStatisticsCurve() {
		let {courseId} = this.props
		LIVE_COURSE.getCourseStatisticsCurve(courseId).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			let osList = res.vo.onlineSumList
			if (osList) {
				osList.forEach(os => {
					os.time = moment(os.createTime).format('HH:mm')
				})
			}
			this.setState({onlineSum: osList})
		})
	}
	
	render() {
		let {...rest} = this.props
		let {freeEnrollTimes, purchaseEnrollTimes, tryFreeEnrollCount, purchasedFee, totalPeople, 
			freeCompleteRate, totalEnrollCount, purchaseEnrollRate, enrollOnlineRate, onlinePurchaseRate, onlineEnrollRate} = this.state
		let {onlineSum = []} = this.state
		return (
			<Modal
				{...rest}
				title='公开课数据'
				width={1029}
				className={`${prefix}`}
				onCancel={this.handleClose.bind(this)}
				footer={
					[
						<Button key="back" className='btn-cancel w-64' onClick={this.handleClose.bind(this)}>关闭</Button>
					]
				}
			>
				<div className='box default-box'>
					<Row className="mb-8">
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">免费报名人数:</div>
							<div className="form-group-item-body">{tryFreeEnrollCount || '0'}</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">免费报名完成人数:</div>
							<div className="form-group-item-body">{freeEnrollTimes || '0'}</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">免费报名完成率:</div>
							<div className="form-group-item-body">{freeCompleteRate.toFixed(2)}%</div>
						</Col>
					</Row>
					<Row className="mb-8">
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">付费报名人数:</div>
							<div className="form-group-item-body">{purchaseEnrollTimes || '0'}</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">购买/预约:</div>
							<div className="form-group-item-body">{purchaseEnrollRate.toFixed(2)}%</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">付费报名金额:</div>
							<div className="form-group-item-body">{purchasedFee || '0'}</div>
						</Col>
					</Row>
					<Row className="mb-8">
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">预约总人数:</div>
							<div className="form-group-item-body">{totalEnrollCount || '0'}</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">累计收看人数:</div>
							<div className="form-group-item-body">{totalPeople || '0'}</div>
						</Col>
					</Row>
				</div>
				<div className='box default-box'>
					<Row className="mb-8">
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">听课/预约:</div>
							<div className="form-group-item-body">{onlineEnrollRate.toFixed(2)}%</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">购买/听课:</div>
							<div className="form-group-item-body">{onlinePurchaseRate.toFixed(2)}%</div>
						</Col>
					</Row>
				</div>
				<div className='w-100p'>
					<Chart forceFit height={200}
						data={onlineSum}
					>
						<Axis name="time" />
						<Axis name="onlineSum"/>
						<Tooltip crosshairs={{type : "y"}}/>
						<Geom type='line' position='time*onlineSum' size={2} />
						<Geom type='point' position="time*onlineSum" size={4} shape={'circle'}/>
					</Chart>
				</div>
				<div className='w-100p'>
					<Chart forceFit height={200}
						data={onlineSum}
					>
						<Axis name="time" />
						<Axis name="onlineSum"/>
						<Tooltip crosshairs={{type : "y"}}/>
						<Geom type='line' position='time*onlineSum' size={2} />
						<Geom type='point' position="time*onlineSum" size={4} shape={'circle'}/>
					</Chart>
				</div>
			</Modal>
		)
	}
	handleClose() {
		let {onClose} = this.props
		onClose()
	}
}
// const ONLINE_SUM_SCALE = {
// 	'onlineSum': {min: 0},
// 	'time': {range: [ 0 , 1] }
// }
