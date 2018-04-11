import React from 'react'
import {Modal, Button, Table, Pagination, Row} from 'antd'
import CourseDetail from './courseDetail'
const prefix = 'liveCourseList'
export default class LiveCourseList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			voTotal: 0,
			currentPage: 1,
			liveCourseList: [],
			detailModal: false,
			courseData: {},
		}
	}
	getPageList() {

	}
	handleAddCourse() {
		this.setState({detailModal: true, courseData: {}})
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
		let  list = liveCourseList.map(course => {
			return course
		})
		return (
			<div>
				<Row className='mb-20 pt-10 pl-15'>
					<Button icon='plus' onClick={this.handleAddCourse.bind(this)}>添加课程</Button>
				</Row>
				<Table 
					columns={COURSE_COLUMNS}
					dataSource={list}
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
	{dataIndex: 'onSale', title: '上架状态'},
	{dataIndex: 'openTimeStr', title: '直播时间'},
	{dataIndex: 'purchaseCount', title: '购买次数'},
	{dataIndex: 'freeCount', title: '免费预约数'},
	{dataIndex: 'PV', title: '累计听课人次'},
	{dataIndex: 'op', title: '操作'},
]