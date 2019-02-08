import React from 'react'
import {Table, Row, Col, Pagination, Input, Avatar, Card, Button, Popover, Empty, message, Progress } from 'antd'
import moment from 'moment'
import {USER} from 'scripts/remotes'
import {NoticeError, isEmptyObject} from 'scripts/utils/index'

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
			orderBy: 'u.createTime',
			order: 'desc',
			tableColmns: USER_COLUMNS,
			listenLogCache: new Map()
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
	getUserListenLog(domainId) {
		let {listenLogCache} = this.state
		if(listenLogCache.has(domainId)) {
			return 
		}
		USER.getUserListenLog(domainId).then(res => {
			if (!res.success) {
				message.warn(res.messages)
				return
			}
			let {listenLogs, lessonMap, courseMap} = res.vo
			if (!listenLogs) {
				listenLogCache.set(domainId, <Empty/>)
				this.setState({listenLogCache})
				return 
			}
			
			let progress = listenLogs.map(log => {
				let courseId = lessonMap[log.lessonId].courseId
				let courseTitle ='自主课程'
				if (courseId) {
					courseTitle = courseMap[lessonMap[log.lessonId].courseId].title
				}
				let lessonTitle = lessonMap[log.lessonId].title
				let lessonLength = lessonMap[log.lessonId].audioLen
				let percent = log.maxPos/lessonLength*100
				return (
					<Row key={log.id} style={{width: 600}}>
						<Col span={12}>
							<div style={{width:145,textOverflow:'ellipsis',whiteSpace: 'nowrap',overflow: 'hidden',display:'inline-block'}}>{courseTitle}</div>
							<div style={{margin: '0 2px',display:'inline-block',verticalAlign: 'top'}}>:</div>
							<div style={{width:145,textOverflow:'ellipsis',whiteSpace: 'nowrap',overflow: 'hidden',display:'inline-block'}}>{lessonTitle}</div>
							{/* <div>酒店电商万能公式从0到1:什么是酒店电商万能公式？</div> */}
						</Col>
						<Col span={12}>
							<Progress percent={percent} status={percent>90 ? 'success': 'normal'} showInfo={false} style={{display:'inline-block', width: '90%'}}/>
							<span style={{color: '#F04A4C',display:'inline-block'}}>x{Math.ceil(log.recordLen/lessonLength)}</span>
						</Col>
					</Row>
				)
			})
			let content = (
				<div>{progress}</div>
			)
			listenLogCache.set(domainId, content)
			this.setState({listenLogCache})
		})
	}
	render(){
		let {userList, voTotal, currentPage, pageSize, tableColmns} = this.state
		let user_list = userList.map((user, index) => {
			let u = {}
			Object.assign(u, user)
			u.wxHeadImg = (<Avatar icon={u.wxHeadImg ? null : 'question'} shape='square' size='small' src={u.wxHeadImg}/>)
			u.wxNickname = (<a onClick={this.handleRefreshWxUserInfo.bind(this, u.domainId)} title='点击刷新微信用户信息'>{u.wxNickname || <Button>{u.subscribed=='N' ? '未关注' : '点击获取'}</Button>}</a>)
			u.headImg = (<Avatar icon={u.headImg ? null : 'question'} shape='square' size='small' src={u.headImg}/>)
			
			u.createTimeStr = moment(u.createTime).format('YYYY-MM-DD HH:mm')
			u.phoneRegTimeStr = u.phoneRegTime ? moment(u.phoneRegTime).format('YYYY-MM-DD HH:mm') : '-'
			u.totalFee = u.totalFee / 100
			u.nick = (
				<Popover placement='rightTop' content={this.state.listenLogCache.has(u.domainId) ? this.state.listenLogCache.get(u.domainId) : (<Empty/>)} 
					onMouseEnter={this.getUserListenLog.bind(this, u.domainId)}><div>{u.nick}</div></Popover>
			)
			return u;
		})
		return (
			<div className={prefix}>
				<Card title={
					<Row className='w-100p'>
						<Col span = {8}>
							<Search onSearch={this.handleSearch.bind(this)} 
								placeholder='昵称/手机号/公司' enterButton
							/>
						</Col>
						<Col span = {2}></Col>
						<Col span={8} className='pl-30'>提示: 更新所有用户用时较长，请耐心等待。<br/>用户没有关注公众号，则获取不到昵称等信息</Col>
						<Col span={4} className='text-right'><Button title='此操作从微信服务器刷新所有用户信息，时间较长，慎用。' onClick={this.handleRefreshWxUserInfo.bind(this, '')}>更新所有用户微信信息</Button></Col>
					</Row>}
				>
					<Table 
						bordered={true}
						columns={tableColmns}
						dataSource={user_list}
						pagination = {false}
						onChange={this.handleTableChange.bind(this)}
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
		this.setState({searchValue: value, currentPage:1}, this.getPageList)
	}
	handleRefreshWxUserInfo(domainId) {
		USER.refreshWxUserInfo(domainId).then(res => {
			if (res.success) {
				setTimeout(() =>{this.getPageList();}, 500)
			} else {NoticeErrorr(res.messages)}
		})
	}
	handleTableChange(pagination, filters, sorter) {
		if (!isEmptyObject(sorter)) {
			if ('purchasedNormalCourseCount' === sorter.columnKey) {
				sorter.column.sortOrder = sorter.order
				this.setState({orderBy: 'purchaseCount', order: 'descend' === sorter.order ? 'desc' : 'asc'}, this.getPageList)
			}
			if ('totalFee' === sorter.columnKey) {
				sorter.column.sortOrder = sorter.order
				this.setState({orderBy: 'totalFee', order: 'descend' === sorter.order ? 'desc' : 'asc'}, this.getPageList)
			}
		}
	}
}
let USER_COLUMNS = [
	{dataIndex: 'wxNickname', title: '微信昵称'},
	{dataIndex: 'wxHeadImg', title: '微信头像'},
	{dataIndex: 'headImg', title: '头像'},
	{dataIndex: 'nick', title: '昵称'},
	{dataIndex: 'phone', title: '手机号'},
	{dataIndex: 'company', title: '公司'},
	{dataIndex: 'title', title: '职位'},
	{dataIndex: 'purchasedNormalCourseCount', title: '课程订阅数', sorter: true},
	{dataIndex: 'totalFee', title: '消费金额', sorter: true, sortOrder: false},
	{dataIndex: 'phoneRegTimeStr', title: '注册时间'},
]