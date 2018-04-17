import React from 'react'
import {Modal, Button, Table, Pagination, Row} from 'antd'
import CourseDetail from './courseDetail'
import {LIVE_COURSE} from 'scripts/remotes/index'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'
import moment from 'moment'

const prefix = 'liveCourseList'
export default class LiveCourseList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			voTotal: 0,
			currentPage: 1,
			pageSize: 10,
			liveCourseList: [],
			detailModal: false,
			courseData: {},
		}
	}
	componentDidMount() {
		this.getPageList()
		this.testWS()
	}
	testWS() {
		console.log('prepare to open ws...')
		let ws = new WebSocket("ws://127.0.0.1:8081/hotelpal/live/chat");
		ws.onopen = (e) => {
			console.log('open...', e)
		}
		ws.onclose= (e) => {
			console.log('close...', e)
		}
		ws.onmessage = (e) => {
			console.log('onmessage...', e)
		}
		let index = 0;
		let i = setInterval(() => {
			if (index ++ > 20) {
				ws.close()
				clearInterval(i)
			}
			ws.send('The ' + index + ' ws msg...')
		}, 3000)

	}
	getPageList() {
		LIVE_COURSE.getLiveCoursePageList(this.state).then(res => {
			if(!res.success) NoticeError(res.messages)
			let liveCourseList = res.voList.map(course => {
				course.createTimeStr = moment(res.createTime).format('YYYY-MM-DD HH:mm')
				course.priceY = course.price/100;
				course.openTimeStr = moment(res.openTime).format('YYYY-MM-DD HH:mm')
				course.op = (
					<div>
						<a onClick={this.handleUpdateCourse.bind(this, course)}>编辑</a>
					</div>
				)
				return course;
			})
			this.setState({liveCourseList, currentPage: res.pageNumber, voTotal: res.voTotal})
		})
	}
	handleUpdateCourse(res) {
		this.setState({detailModal: true, courseData: res})
	}
	handleCloseModal(modal, refresh) {
		this.setState({[modal]: false})
		if (refresh) {
			this.getPageList()
		}
	}
	onChangePage() {

	}
	paginationTotalRender(total, range) {
		return (
			<span>{range[0]}-{range[1]}条，共{total}条</span>
		)
	}
	render() {
		let {liveCourseList, currentPage, voTotal, detailModal, courseData} = this.state
		
		return (
			<div>
				<Row className='mb-20 pt-10 pl-15'>
					<Button icon='plus' onClick={this.handleUpdateCourse.bind(this, {})}>添加课程</Button>
				</Row>
				<Table 
					columns={COURSE_COLUMNS}
					dataSource={liveCourseList}
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
				{detailModal && 
					<CourseDetail
						visible={detailModal}
						onClose={this.handleCloseModal.bind(this, 'detailModal')}
						course={courseData}
					/>
				}
			</div>
		)
	}
}
const COURSE_COLUMNS = [
	{dataIndex: 'title', title: '标题'},
	{dataIndex: 'createTimeStr', title: '创建时间'},
	{dataIndex: 'priceY', title: '价格'},
	{dataIndex: 'publish', title: '上架状态'},
	{dataIndex: 'openTimeStr', title: '直播时间'},
	{dataIndex: 'purchaseCount', title: '购买次数'},
	{dataIndex: 'freeCount', title: '免费预约数'},
	{dataIndex: 'PV', title: '累计听课人次'},
	{dataIndex: 'op', title: '操作'},
]