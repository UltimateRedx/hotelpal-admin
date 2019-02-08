import React from 'react'
import {Table, Row, Col, Pagination, DatePicker, Input, Select } from 'antd'
import moment from 'moment'
import {CONTENT} from 'scripts/remotes'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'

const {RangePicker} = DatePicker
const {Search} = Input
const {Option} = Select

const prefix = 'orders'
export default class Orders extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			orderList: [],
			voTotal: 0,
			currentPage: 1,
			pageSize: 20,
			createTimeFrom: '',
			createTimeTo: '',
			purchaseDateFrom: '',
			purchaseDateTo: '',
			searchValue: '',
			searchValueCourse: '',
			courseType: COURSE_TYPE.NORMAL,
		}
	}
	componentDidMount() {
		this.getPageList()
	}
	getPageList() {
		CONTENT.getPurchaseOrderList(this.state).then(res =>{
			if (!res.success){
				NoticeError(res.messages)
				return
			}
			this.setState({orderList: res.voList, currentPage: res.pageNumber, voTotal: res.voTotal})
		})
	}
	render(){
		let {orderList, voTotal, currentPage, pageSize, searchValue, courseType} = this.state
		let order_list = orderList.map((user, index) => {
			let u = {}
			Object.assign(u, user)
			u.payment = u.payment / 100 + (u.originalPrice != u.payment ? (' (优惠-' + (u.originalPrice - u.payment) / 100) + ')' : '')
			u.couponValue = u.couponId ? u.couponValue / 100 : '-'
			u.purchaseTimeStr = moment(u.createTime).format('YYYY-MM-DD HH:mm')
			return u;
		})
		return (
			<div className={prefix}>
				<Row className='mb-20 pt-10 pl-15'>
					<Col span = {2}>
						<Select onChange={this.handleSelectChange.bind(this)} value={courseType}>
							<Option value={COURSE_TYPE.NORMAL}>订阅课程</Option> 
							<Option value={COURSE_TYPE.LIVE}>直播课程</Option> 
						</Select>
					</Col>
					<Col span={8}>
						<RangePicker onChange={this.handleChange.bind(this)}/>
					</Col>
					<Col span={1}></Col>
					<Col span = {4}>
						<Search onSearch={this.handleSearch.bind(this)} 
							placeholder='昵称/手机号/公司' enterButton
						/>
					</Col>
					<Col span={1}></Col>
					<Col span = {4}>
						<Search onSearch={this.handleSearchByCourse.bind(this)} 
							placeholder='课程名称' enterButton
						/>
					</Col>
				</Row>
				<Table 
					bordered={true}
					columns={ORDER_COLUMNS}
					dataSource={order_list}
					pagination = {false}
				/>
				<div className='pagination'>
					<Pagination 
						size="small" 
						total={voTotal} 
						current={currentPage}
						pageSize={pageSize}
						onChange={this.onChangePage.bind(this)}
						showTotal={this.paginationTotalRender.bind(this)}
					/>
				</div>
			</div>
		)
	}
	onChangePage(page, pageSize) {
		this.setState({currentPage: page, pageSize}, this.getPageList);
	}
	paginationTotalRender(total, range) {
		return (
			<span>{range[0]}-{range[1]}条，共{total}条</span>
		)
	}
	handleChange(date, dateStr) {
		this.setState({purchaseDateFrom: date[0], purchaseDateTo: date[1]}, this.getPageList)
	}
	handleSearch(value) {
		this.setState({searchValue: value}, this.getPageList)
	}
	handleSearchByCourse(value) {
		this.setState({searchValueCourse: value}, this.getPageList)
	}
	handleSelectChange(value) {
		this.setState({courseType: value}, this.getPageList)
	}

}
const ORDER_COLUMNS = [
	{dataIndex: 'orderTradeNo', title: '订单号'},
	{dataIndex: 'user.nick', title: '用户'},
	{dataIndex: 'user.phone', title: '手机号码'},
	{dataIndex: 'courseTitle', title: '课程'},
	{dataIndex: 'payment', title: '金额'},
	{dataIndex: 'payMethodName', title: '购买方式'},
	{dataIndex: 'couponValue', title: '优惠券抵扣'},
	{dataIndex: 'purchaseTimeStr', title: '购买时间'},
]
const COURSE_TYPE = {
	NORMAL: 'NORMAL',
	LIVE: 'LIVE',
}