import React from 'react'
import {Link} from 'react-router'
import {Table, Pagination, Row, Button, Icon,Avatar, message, Popconfirm, Divider, Layout} from 'antd'
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
	render() {
		let {courseList, courseModal, voTotal, currentPage, courseData} = this.state;
		let list = courseList.map(res => {
			res.op = (
				<div>
					<a className="table-href" onClick={this.handleUpdateCourse.bind(this, res)}>编辑</a>
					<Divider type='vertical'/>
					{/* <a className="table-href" onClick={this.handleMapToLesson.bind(this, res)}>查看课时</a> */}
					<Link to={`/hotelpal/course/lesson/${res.id}`}>查看课时</Link>
					<Divider type='vertical'/>
					<Popconfirm title={'确认删除：' + res.title + ' ?'} onConfirm = {this.handleDeleteCourse.bind(this,res)} >
						<a className="table-href">删除</a>
					</Popconfirm>
				</div>
			)
			res.createTimeStr = moment(res.createTime).format('YYYY-MM-DD HH:mm')
			res.openTimeStr = res.openTime && moment(res.openTime).format('YYYY-MM-DD HH:mm')
			return res;
		})
		return (
			<div className={prefix}>
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
	{dataIndex: 'courseOrder', title: '序号'},
	{dataIndex: 'title', title: '标题'},
	{dataIndex: 'createTimeStr', title: '创建时间'},
	{dataIndex: 'speaker.nick', title: '主讲人'},
	{dataIndex: 'publish', title: '上架状态'},
	{dataIndex: 'openTimeStr', title: '开课时间'},
	{dataIndex: 'a', title: '销量'},
	{dataIndex: 'b', title: '销售额'},
	{dataIndex: 'c', title: 'PV'},
	{dataIndex: 'd', title: 'UV'},
	{dataIndex: 'op', title: '操作'},
]