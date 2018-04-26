import React from 'react'
import {Modal, Button, Table, Pagination, Row} from 'antd'
import {USER} from 'scripts/remotes/index'
import {NoticeMsg, NoticeError} from 'scripts/utils/index'
import moment from 'moment'
import NewMemberModal from './newMemberModal'

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
	render() {
		let {currentPage, voTotal, newMemberModal, memberList} = this.state
		memberList = memberList.map(u => {
			u.liveVipStartTimeStr = u.liveVipStartTime ? moment(u.liveVipStartTime) : ''
			u.validTo = u.liveVipStartTime && u.validity ? moment(liveVipStartTime.setDate(liveVipStartTime.getDate() + u.validity)) : ''
			return u
		})
		return (
			<div>
				<Row className='mb-20 pt-10 pl-15'>
					<Button icon='plus' onClick={this.handleShowModal.bind(this)}>添加会员</Button>
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
					/>
				}
			</div>
		)
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