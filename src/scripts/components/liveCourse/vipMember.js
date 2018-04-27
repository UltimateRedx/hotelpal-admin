import React from 'react'
import {Modal, Button, Table, Pagination, Row, Popconfirm, Input} from 'antd'
import {USER} from 'scripts/remotes/index'
import {NoticeMsg, NoticeError} from 'scripts/utils/index'
import moment from 'moment'
import NewMemberModal from './newMemberModal'
const Search = Input.Search
const prefix = 'vipMember'
export default class VipMember extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			voTotal: 0,
			currentPage: 1,
			pageSize: 10,
			memberList: [],
			newMemberModal: false,
			searchValue: '',
		}
	}
	componentDidMount() {
		this.getPageList()
	}
	getPageList() {
		USER.getVipMemberList(this.state).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({memberList: res.voList})
		})
	}
	paginationTotalRender(total, range) {
		return (
			<span>{range[0]}-{range[1]}条，共{total}条</span>
		)
	}
	removeOnePhone(phone) {
		USER.removeLiveVip(phone).then(res => {
			if(!res.success) {
				NoticeError(res.messages)
				return
			}
			this.getPageList()
		})
	}
	handleSearchPhone(value) {
		if (!value) return
		this.setState({searchValue: value}, this.getPageList)
	}
	
	render() {
		let {currentPage, voTotal, newMemberModal, memberList, searchValue} = this.state
		memberList = memberList.map(u => {
			u.liveVipStartTimeStr = u.liveVipStartTime ? moment(u.liveVipStartTime).format('YYYY-MM-DD HH:mm:ss') : ''
			let vipStartTime = new Date(u.liveVipStartTime)
			u.validTo = u.liveVipStartTime && u.validity ? moment(vipStartTime.setDate(vipStartTime.getDate() + u.validity)).format('YYYY-MM-DD HH:mm:ss') : ''
			u.op = (
				<div>
					<Popconfirm title={`确认收回` + u.phone + `?`} onConfirm={this.removeOnePhone.bind(this, u.phone)}>
						<a className=''>收回</a>
					</Popconfirm>
				</div>
			)
			return u
		})
		return (
			<div>
				<Row className='mb-20 pt-10 pl-15'>
					<Button icon='plus' onClick={this.handleShowModal.bind(this)}>添加会员</Button>
					<Search className='f-r w-20p' placeholder='手机号搜索' 
						onSearch={this.handleSearchPhone.bind(this)} value={searchValue}
						onChange={this.handleSearchChange.bind(this)}/>
				</Row>
				<Table 
					columns={VIP_MEMBER_COLUMNS}
					dataSource={memberList}
					pagination = {false}
				/>
				<div className='pagination'>
					<Pagination 
						size="small" 
						total={voTotal} 
						current={currentPage} 
						onChange={this.onChangePage.bind(this)}
						showTotal={this.paginationTotalRender.bind(this)}
					/>
				</div>
				{newMemberModal && 
					<NewMemberModal
						visible={newMemberModal}
						onClose={this.handleCloseModal.bind(this)}
						removePhone={this.removeOnePhone.bind(this)}
					/>
				}
			</div>
		)
	}
	handleSearchChange(e) {
		this.setState({searchValue: e.target.value})
	}
	onChangePage(page, pageSize) {
		this.setState({currentPage: page}, this.getPageList)
	}
	handleShowModal() {
		this.setState({newMemberModal: true})
	}
	handleCloseModal() {
		this.setState({newMemberModal: false}, this.getPageList)
	}
}
const VIP_MEMBER_COLUMNS = [
	{dataIndex: 'nick', title: '昵称'},
	{dataIndex: 'liveVipStartTimeStr', title: '发卡时间'},
	{dataIndex: 'phone', title: '手机号'},
	{dataIndex: 'validTo', title: '有效期至'},
	{dataIndex: 'op', title: '操作'},
]