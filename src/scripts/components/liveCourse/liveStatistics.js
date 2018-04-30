import React from 'react'
import {Modal, Button, Row, Col} from 'antd'
import {LIVE_COURSE} from 'scripts/remotes/index'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'
const prefix = 'liveStatistics'
export default class LivecStatistics extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}
	componentDidMount() {
		this.getStatisticsData()
	}
	getStatisticsData() {
		let {courseId} = this.props
		LIVE_COURSE.getCourseStatistics(courseId).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			let vo = res.vo;
			this.setState({
				freeEnrollTimes: vo.freeEnrollTimes,
				purchaseEnrollTimes: vo.purchaseEnrollTimes,
				tryFreeEnrollCount: vo.tryFreeEnrollCount,
				purchasedFee: vo.purchasedFee / 100,
				totalPeople: vo.totalPeople,
				freeCompleteRate: vo.freeCompleteRate,
				totalEnrollCount: vo.totalEnrollCount,
				purchaseEnrollRate: vo.purchaseEnrollRate,
				
			})
		})
	}
	
	render() {
		let {...rest} = this.props
		let {freeEnrollTimes, purchaseEnrollTimes, tryFreeEnrollCount, purchasedFee, totalPeople, 
			freeCompleteRate, totalEnrollCount, purchaseEnrollRate} = this.state
			console.log(this.state)
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
							<div className="form-group-item-body">{freeCompleteRate || '-'}%</div>
						</Col>
					</Row>
					<Row className="mb-8">
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">付费报名人数:</div>
							<div className="form-group-item-body">{purchaseEnrollTimes || '0'}</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">购买/预约:</div>
							<div className="form-group-item-body">{purchaseEnrollRate || '-'}%</div>
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
							<div className="form-group-item-body">
								70%
							</div>
						</Col>
						<Col span={8} className="form-group-item">
							<div className="form-group-item-heading">购买/听课:</div>
							<div className="form-group-item-body">
								80%
							</div>
						</Col>
					</Row>
				</div>
			</Modal>
		)
	}
	handleClose() {
		let {onClose} = this.props
		onClose()
	}
}