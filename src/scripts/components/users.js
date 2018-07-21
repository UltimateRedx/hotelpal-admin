import React from 'react'
import {Table, Row, Col, Pagination, DatePicker, Input, Avatar, Card, Button } from 'antd'
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
			u.wxHeadImg = (<Avatar icon={u.wxHeadImg ? null : 'question'} shape='square' size='small' src={u.wxHeadImg}/>)
			u.wxNickname = (<a onClick={this.handleRefreshWxUserInfo.bind(this, u.domainId)} title='点击刷新微信用户信息'>{u.wxNickname || <Button>{u.subscribed=='N' ? '未关注' : '点击获取'}</Button>}</a>)
			u.headImg = (<Avatar icon={u.headImg ? null : 'question'} shape='square' size='small' src={u.headImg}/>)
			
			u.createTimeStr = moment(u.createTime).format('YYYY-MM-DD HH:mm')
			u.phoneRegTimeStr = u.phoneRegTime ? moment(u.phoneRegTime).format('YYYY-MM-DD HH:mm') : '-'
			u.totalFee = u.totalFee / 100
			return u;
		})
		return (
			<div className={prefix}>
				<Card title={
					<Row>
						{/* <Col span={8}>
							<RangePicker onChange={this.handleChange.bind(this)}/>
						</Col> */}
						{/* <Col span={1}></Col> */}
						<Col span = {4}>
							<Search onSearch={this.handleSearch.bind(this)} 
								placeholder='昵称/手机号/公司' enterButton
							/>
						</Col>
						<Col span = {9}></Col>
						<Col span={7} className='pl-30'>提示: 更新所有用户用时较长，请耐心等待。<br/>用户没有关注公众号，则获取不到昵称等信息</Col>
						<Col span={4} className='text-right'><Button title='此操作从微信服务器刷新所有用户信息，时间较长，慎用。' onClick={this.handleRefreshWxUserInfo.bind(this, '')}>更新所有用户微信信息</Button></Col>
					</Row>}
				>
				
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
				</Card>
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
	handleRefreshWxUserInfo(domainId) {
		USER.refreshWxUserInfo(domainId).then(res => {
			if (res.success) {
				setTimeout(() =>{this.getPageList();}, 1000)
			} else {NoticeErrorr(res.messages)}
		})
	}

}
const USER_COLUMNS = [
	{dataIndex: 'wxNickname', title: '微信昵称'},
	{dataIndex: 'wxHeadImg', title: '微信头像'},
	{dataIndex: 'headImg', title: '头像'},
	{dataIndex: 'nick', title: '昵称'},
	{dataIndex: 'phone', title: '手机号'},
	{dataIndex: 'company', title: '公司'},
	{dataIndex: 'title', title: '职位'},
	{dataIndex: 'purchasedNormalCourseCount', title: '课程订阅数'},
	{dataIndex: 'totalFee', title: '消费总金额'},
	{dataIndex: 'createTimeStr', title: '创建时间'},
	{dataIndex: 'phoneRegTimeStr', title: '注册时间'},
]