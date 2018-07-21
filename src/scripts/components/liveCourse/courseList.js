import React from 'react'
import {Modal, Button, Table, Pagination, Row, Divider, Popconfirm} from 'antd'
import CourseDetail from './courseDetail'
import LiveStatistics from './liveStatistics'
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
			statisticsModal: false,
			statisticsId: '',
		}
	}
	componentDidMount() {
		this.getPageList()
	}
	getPageList() {
		LIVE_COURSE.getLiveCoursePageList(this.state).then(res => {
			if(!res.success) NoticeError(res.messages)
			let liveCourseList = res.voList.map(course => {
				course.createTimeStr = moment(course.createTime).format('YYYY-MM-DD HH:mm')
				course.priceY = course.price/100;
				course.openTimeStr = moment(course.openTime).format('YYYY-MM-DD HH:mm')
				course.op = (
					<div>
						<a className='underline' onClick={this.handleUpdateCourse.bind(this, course)}>编辑</a>
						<Divider type='vertical'/>
						<a className='underline' onClick={this.handleShowStatistics.bind(this, course.id)}>统计数据</a>
						<Divider type='vertical'/>
						<Popconfirm title={`确认删除` + course.title + `?`} onConfirm={this.handleRemoveCourse.bind(this, course.id)}>
							<a className='underline'>删除</a>
						</Popconfirm>
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
	handleShowStatistics(courseId) {
		this.setState({statisticsModal: true, statisticsId: courseId})
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
		let {liveCourseList, currentPage, voTotal, detailModal, courseData, statisticsModal, statisticsId} = this.state
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
				{statisticsModal &&
					<LiveStatistics
						visible={statisticsModal}
						onClose={this.handleCloseModal.bind(this, 'statisticsModal')}
						courseId={statisticsId}
					/>
				}
			</div>
		)
	}
	
	handleRemoveCourse(id = '') {
		LIVE_COURSE.removeLiveCourse(id).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.getPageList()
		})
	}
}
const COURSE_COLUMNS = [
	{dataIndex: 'title', title: '标题'},
	{dataIndex: 'createTimeStr', title: '创建时间'},
	{dataIndex: 'priceY', title: '价格'},
	{dataIndex: 'publish', title: '上架状态'},
	{dataIndex: 'openTimeStr', title: '直播时间'},
	{dataIndex: 'purchasedTimes', title: '购买次数'},
	{dataIndex: 'freeEnrolledTimes', title: '免费预约数'},
	{dataIndex: 'vipEnrolledTimes', title: '会员预约数'},
	{dataIndex: 'totalPeople', title: '累计听课人次'},
	{dataIndex: 'op', title: '操作'},
]