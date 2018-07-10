import React from 'react'
import {Table, Row, Col, Pagination, DatePicker, Input } from 'antd'
import moment from 'moment'
import {USER} from 'scripts/remotes'
import {NoticeError} from 'scripts/utils/index'

const {RangePicker} = DatePicker
const {Search} = Input
const prefix = 'users'

export default class Users extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			userList: [],
			voTotal: 0,
			currentPage: 1,
			pageSize: 20,
			phoneRegTimeFrom: '',
			phoneRegTimeTo: '',
			searchValue: '',
		}
	}
	componentDidMount() {
		this.getPageList()
	}
	getPageList() {
		USER.getUserList(this.state).then(res =>{
			if (!res.success){
				NoticeError(res.messages)
				return
			}
			this.setState({userList: res.voList, currentPage: res.pageNumber, voTotal: res.voTotal})
		})
	}
	render(){
		let {userList, voTotal, currentPage, pageSize, searchValue} = this.state
		userList = userList.map((u, index) => {
			u.createTimeStr = moment(u.createTime).format('YYYY-MM-DD HH:mm')
			u.phoneRegTimeStr = u.phoneRegTime ? moment(u.phoneRegTime).format('YYYY-MM-DD HH:mm') : '-'
			return u;
		})
		return (
			<div className={prefix}>
				<Row className='mb-20 pt-10 pl-15'>
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
					columns={USER_COLUMNS}
					dataSource={userList}
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
		this.setState({phoneRegTimeFrom: date[0], phoneRegTimeTo: date[1]}, this.getPageList)
	}
	handleSearch(value) {
		this.setState({searchValue: value}, this.getPageList)
	}

}
const USER_COLUMNS = [
	{dataIndex: 'nick', title: '昵称'},
	{dataIndex: 'phone', title: '手机号'},
	{dataIndex: 'company', title: '公司'},
	{dataIndex: 'title', title: '职位'},
	{dataIndex: 'f3', title: '课程订阅数'},
	{dataIndex: 'b23', title: '消费总金额'},
	{dataIndex: 'createTimeStr', title: '创建时间'},
	{dataIndex: 'phoneRegTimeStr', title: '注册时间'},
]