import React from 'react'
import{Card, Row, Col, Button, DatePicker} from 'antd'
import { Chart, Axis, Geom, Tooltip } from 'bizcharts'
import {CONTENT} from 'scripts/remotes/index'
import { NoticeError } from 'scripts/utils/index';
const {RangePicker} = DatePicker
const prefix = 'statistics'
export default class Statistics extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			from: '',
			to: '',
			vo: {},
			dailySales:[]
		}
	}
	componentDidMount() {
		this.getStatisticsData()
		this.getDailySales()
	}
	getStatisticsData() {
		let {from, to} = this.state
		CONTENT.getStatisticsData(from, to).then(res => {
			if (res.success) {
				this.setState({vo: res.vo})
			} else {
				NoticeError(res.messages)
			}
		})
	}
	getDailySales() {
		CONTENT.getDailySales().then(res => {
			this.setState({dailySales: res.vo.days})
		})
	}
	render() {
		let {vo, dailySales} = this.state
		return (
			<div className={prefix}>
				<Card title='历史总计'>
					<Row>
						<Col span={6} className='t-center'>
							<label className='block-i f-bold fs-30'>{vo.totalUserCount || '0'}</label>
							<label className='block-i f-bold'>累计用户</label>
						</Col>
						<Col span={6} className='t-center'>
							<label className='block-i f-bold fs-30'>{vo.totalRegUserCount || '0'}</label>
							<label className='block-i f-bold'>累计注册用户</label>
						</Col>
						<Col span={6} className='t-center'>
							<label className='block-i f-bold fs-30'>{vo.totalFeeUserCount || '0'}</label>
							<label className='block-i f-bold'>累计付费用户</label>
						</Col>
						<Col span={6} className='t-center'>
							<label className='block-i f-bold fs-30'>{vo.totalFee ? vo.totalFee/100 : '0'}</label>
							<label className='block-i f-bold'>累计付费金额</label>
						</Col>
					</Row>
				</Card>
				<div className='h-30 layout-bg'/>
				{dailySales.length > 0 &&
					<div className='w-100p'>
						<Chart forceFit height={250} padding={50}
							data={dailySales}
						>
							<Axis name="date"/>
							<Axis name="sales"/>
							<Tooltip crosshairs={{type : "y"}} itemTpl={charts_template}/>
							<Geom type='line' position='date*sales' size={2} />
							<Geom type='point' position="date*sales" size={4} shape={'circle'}/>
						</Chart>
					</div>
				}
				<div className='h-30 layout-bg'/>
				<Card title='分时段统计' extra={this.renderDateSelect()}>
					<Row className='data-row'>
						<Col span={12} className='t-center'>
							<label className='block-i f-bold fs-30'>{vo.pv || '0'}</label>
							<label className='block-i f-bold'>浏览次数</label>
						</Col>
						<Col span={12} className='t-center'>
							<label className='block-i f-bold fs-30'>{vo.uv || '0'}</label>
							<label className='block-i f-bold'>独立访客</label>
						</Col>
					</Row>
					<Row className='data-row data-row-2'>
						<Col span={6} className='t-center'>
							<label className='block-i f-bold fs-30'>{vo.userCount || '0'}</label>
							<label className='block-i f-bold'>新增用户</label>
						</Col>
						<Col span={6} className='t-center'>
							<label className='block-i f-bold fs-30'>{vo.regUserCount || '0'}</label>
							<label className='block-i f-bold'>新增注册用户</label>
						</Col>
						<Col span={6} className='t-center'>
							<label className='block-i f-bold fs-30'>{vo.feeUserCount || '0'}</label>
							<label className='block-i f-bold'>新增付费用户</label>
						</Col>
						<Col span={6} className='t-center'>
							<label className='block-i f-bold fs-30'>{vo.fee ? vo.fee/100 : '0'}</label>
							<label className='block-i f-bold'>新增付费金额</label>
						</Col>
					</Row>
					<Row className='data-row data-row-3'>
						<Col span={11} className='t-center'>
							<Row>
								<Col span={24} className='text-left column'>
									<label>成长专栏</label>
								</Col>
							</Row>
							<Row>
								<Col span={12} className='t-center'>
									<label className='block-i f-bold fs-30'>{vo.normalCoursePv || '0'}</label>
									<label className='block-i f-bold'>浏览次数</label>
								</Col>
								<Col span={12} className='t-center'>
									<label className='block-i f-bold fs-30'>{vo.normalCourseUv || '0'}</label>
									<label className='block-i f-bold'>独立访客</label>
								</Col>
							</Row>
						</Col>
						<Col span={2}/>
						<Col span={11} className='t-center'>
							<Row>
								<Col span={24} className='text-left column'>
									<label>订阅专栏</label>
								</Col>
							</Row>
							<Row>
								<Col span={12} className='t-center'>
									<label className='block-i f-bold fs-30'>{vo.selfCoursePv || '0'}</label>
									<label className='block-i f-bold'>浏览次数</label>
								</Col>
								<Col span={12} className='t-center'>
									<label className='block-i f-bold fs-30'>{vo.selfCourseUv || '0'}</label>
									<label className='block-i f-bold'>独立访客</label>
								</Col>
							</Row>
						</Col>
					</Row>
				</Card>
			</div>
		)
	}
	renderDateSelect() {
		return (
			<div className='selection'>
				<Button className='inline-block'onClick={this.handleDateChange.bind(this, DAY)}>今天</Button>
				<Button className='ml-8 inline-block' onClick={this.handleDateChange.bind(this, YDAY)}>昨天</Button>
				<Button className='ml-8 inline-block' onClick={this.handleDateChange.bind(this, WEEK)}>一周</Button>
				<Button className='ml-8 inline-block' onClick={this.handleDateChange.bind(this, MONTH)}>一月</Button>
				<RangePicker className='ml-8 auto-width' onChange={this.handleRangeChange.bind(this)}/>
			</div>
		)
	}
	
	handleDateChange(range) {
		let from = ''
		let date = new Date()
		let to = ''
		if (range === YDAY) {
			date.setDate(date.getDate() - 1)
			from = date
			to = new Date();
			to.setDate(to.getDate() - 1)
		} else if (range === WEEK) {
			date.setDate(date.getDate() - 7)
			from = date
		} else if (range === MONTH) {
			date.setMonth(date.getMonth() - 1)
			from = date
		}
		this.setState({from, to}, this.getStatisticsData)
	}
	handleRangeChange(date) {
		this.setState({from: date[0], to: date[1]}, this.getStatisticsData)
	}
}
const DAY = 'DAY'
const YDAY = 'YDAY'
const WEEK = 'WEEK'
const MONTH = 'MONTH'
const charts_template=
'<li data-index={index}>\
	<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>\
	销售额: ￥ {value}\
</li>'