import React from 'react'
import {Table, Pagination, Row, Button, Icon,Avatar, message, Popconfirm, Divider} from 'antd'
import moment from 'moment'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'
import {COURSE} from 'scripts/remotes/index'
import CourseModal from 'scripts/components/modal/CourseModal'

const prefix = 'course'
export default class Course extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			courseList:[],
			courseModal: false,
			currentPage: 1,
			pageSize: 10,
			voTotal: 0,
			courseData: {},
			orderBy:''
		}
	}
	componentDidMount() {
		this.getPageList();
	}
	getPageList() {
		COURSE.getList(this.state).then(res => {
			if (res.success) {
				this.setState({courseList: res.voList, currentPage: res.pageNumber, voTotal: res.voTotal});
			} else{
				NoticeError(res.messages)
			}
		})
	}
	handleAddCourse() {
		this.setState({courseModal: true, courseData:{}})
	}
	onChangePage(page, pageSize) {
		this.setState({currentPage: page, pageSize}, this.getPageList);
	}
	paginationTotalRender(total, range) {
		return (
			<span>{range[0]}-{range[1]}条，共{total}条</span>
		)
	}
	handleCloseModal(refresh) {
		this.setState({courseModal: false})
		if (refresh) {
			this.getPageList()
		}
	}
	handleDeleteCourse(data) {
		COURSE.deleteCourse(data).then(res => {
			if (res.success) {
				this.getPageList();
			} else {
				NoticeErrorres.messages;
			}
		})
	}
	handleUpdateCourse(res) {
		this.setState({courseModal: true, courseData: res})
	}
	handleMapToLesson() {

	}
	render() {
		let {courseList, courseModal, voTotal, currentPage, courseData} = this.state;
		let list = courseList.map(res => {
			res.op = (
				<div>
					<a className="table-href" onClick={this.handleUpdateCourse.bind(this, res)}>编辑课程</a>
					<Divider type='vertical'/>
					<a className="table-href" onClick={this.handleMapToLesson.bind(this, res)}>查看课时</a>
					<Divider type='vertical'/>
					<Popconfirm title={'确认删除：' + res.title + ' ?'} onConfirm = {this.handleDeleteCourse.bind(this,res)} >
						<a className="table-href">删除</a>
					</Popconfirm>
				</div>
			)
			res.createTime = moment(res.createTime).format('YYYY-MM-DD HH:mm')
			res.openTime = res.openTime && moment(res.openTime).format('YYYY-MM-DD HH:mm')
			return res;
		})
		return (
			<div className={prefix}>
				<Row>
					<Button icon='plus' onClick={this.handleAddCourse.bind(this)}>添加课程</Button>
				</Row>
				<Table 
					columns={COURSE_COLUMNS}
					dataSource={list}
					pagination = {false}
				/>
				<Pagination 
					size="small" 
					total={voTotal} 
					current={currentPage} 
					onChange={this.onChangePage.bind(this)}
					showTotal={this.paginationTotalRender.bind(this)}
				/>

				{courseModal &&
					<CourseModal
						visible={courseModal}
						onClose={this.handleCloseModal.bind(this)}
						data = {courseData}
					/>
				}
			</div>
		)
	}
}
const COURSE_COLUMNS = [
	{dataIndex: 'title', title: '标题'},
	{dataIndex: 'op', title: '操作'},
	{dataIndex: 'createTime', title: '创建时间'},
	{dataIndex: 'speakerNick', title: '主讲人'},
	{dataIndex: 'publish', title: '上架状态'},
	{dataIndex: 'openTime', title: '开课时间'},
	{dataIndex: 'order', title: '排序'},
	{dataIndex: 'a', title: '销量'},
	{dataIndex: 'b', title: '销售额'},
	{dataIndex: 'c', title: 'PV'},
	{dataIndex: 'd', title: 'UV'},
]