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
			courseType: COURSE_TYPE.NORMAL,
		}
	}
	componentDidMount() {
		this.getPageList()
	}
	getPageList() {
		CONTENT.getOrderList(this.state).then(res =>{
			if (!res.success){
				NoticeError(res.messages)
				return
			}
			this.setState({orderList: res.voList, currentPage: res.pageNumber, voTotal: res.voTotal})
		})
	}
	render(){
		let {orderList, voTotal, currentPage, pageSize, searchValue, courseType} = this.state
		orderList = orderList.map((u, index) => {
			u.payment = u.purchaseLog.payment / 100
			u.createTimeStr = moment(u.createTime).format('YYYY-MM-DD HH:mm')
			u.purchaseTimeStr = u.purchaseLog.createTime ? moment(u.purchaseLog.createTime).format('YYYY-MM-DD HH:mm') : '-'
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
				</Row>
				<Table 
					bordered={true}
					columns={ORDER_COLUMNS}
					dataSource={orderList}
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
		this.setState({createTimeFrom: date[0], createTimeTO: date[1]}, this.getPageList)
	}
	handleSearch(value) {
		this.setState({searchValue: value}, this.getPageList)
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
	{dataIndex: 'purchaseLog.payMethod', title: '购买方式'},
	{dataIndex: 'createTimeStr', title: '订单创建时间'},
	{dataIndex: 'purchaseTimeStr', title: '购买时间'},
]
const COURSE_TYPE = {
	NORMAL: 'NORMAL',
	LIVE: 'LIVE',
}