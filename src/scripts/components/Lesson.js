import React from 'react'
import {Link,browserHistory } from 'react-router'
import  { Redirect } from 'react-router-dom'
import {Table, Pagination, Row, Button, Icon,Avatar, message, Popconfirm, Divider, Layout, Col} from 'antd'
import moment from 'moment'
import {NoticeMsg,NoticeError,isEmptyObject} from 'scripts/utils/index'
import {LESSON, COURSE} from 'scripts/remotes/index'
import LessonModal from 'scripts/components/modal/LessonModal'
import CommentModal from 'scripts/components/modal/CommentModal'

const prefix = 'lesson'
export default class Lesson extends React.Component {
	constructor(props) {
		super(props)
		this.state={
			courseData: {},
			lessonList:[],
			lessomModal: false,
			currentPage: 1,
			pageSize: 10,
			voTotal: 0,
			lessonData: {},
			orderBy:'',
			commentModal: false,
		}
	}
	
	componentDidMount() {
		let courseId = this.props.params.courseId;
		if(!courseId) {
			browserHistory.push('/#/course')
			return
		}
		this.getCourseData(courseId)
		this.setState({courseId}, this.getPageList)
	}
	getCourseData(id) {
		COURSE.getCourse({id}).then(res => {
			if(res.success) {
				this.setState({courseData: res.vo})
			} else {
				NoticeError(res.messages)
			}
		})
	}
	getPageList() {
		let {courseId} = this.state
		LESSON.getLessonList(this.state).then(res => {
			if (res.success) {
				res.voList.forEach(vo => {
					vo.courseId = courseId
				})
				this.setState({lessonList: res.voList, currentPage: res.pageNumber, voTotal: res.voTotal});
			} else{
				NoticeError(res.messages)
			}
		})
	}
	handleAddLesson() {
		let {courseId} = this.state
		this.setState({lessonModal: true, lessonData:{courseId}})
	}
	onChangePage(page, pageSize) {
		this.setState({currentPage: page, pageSize}, this.getPageList);
	}
	paginationTotalRender(total, range) {
		return (
			<span>{range[0]}-{range[1]}条，共{total}条</span>
		)
	}
	handleCloseModal(field, refresh) {
		let state = this.state
		state[field] = false
		this.setState(state)
		if (refresh) {
			this.getPageList()
		}
	}
	handleDeleteLesson(data) {
		LESSON.deleteLesson(data).then(res => {
			if (res.success) {
				this.getPageList();
			} else {
				NoticeErrorres.messages;
			}
		})
	}
	handleUpdateLesson(res) {
		this.setState({lessonModal: true, lessonData: res})
	}
	handleShowCommentModal(res) {
		this.setState({commentModal: true, lessonData: res})
	}
	render() {
		let {lessonList, lessonModal, voTotal, currentPage, lessonData, courseData, commentModal} = this.state;
		let list = lessonList.map(res => {
			res.op = (
				<div>
					<a className="table-href" onClick={this.handleUpdateLesson.bind(this, res)}>编辑</a>
					<Divider type='vertical'/>
					<a onClick={this.handleShowCommentModal.bind(this, res)}>查看评论</a>
					<Divider type='vertical'/>
					<Popconfirm title={'确认删除：' + res.title + ' ?'} onConfirm = {this.handleDeleteLesson.bind(this,res)} >
						<a className="table-href">删除</a>
					</Popconfirm>
				</div>
			)
			res.createTimeStr = moment(res.createTime).format('YYYY-MM-DD HH:mm')
			res.publishDateStr = res.publishDate && moment(res.publishDate).format('YYYY-MM-DD HH:mm')
			return res;
		})
		return (
			<div className={prefix}>
				<div className='title'>
					<Link className='fs-18 f-bold mb-15 underline' to='/course'>课程&nbsp;</Link>
					<span>&nbsp; &gt; 课时</span>
				</div>
				{/* <Row className='info'>
					<h3 className="fs-14 f-bold mb-15">{courseData.title || ''}</h3>
				</Row>
				<Row>
					<Col span={4}>
						<div className='form-group-item'>
							<div className='form-group-item-heading'>主讲人: </div>
							<div className="form-group-item-body text-left lh-31">{courseData.speaker ? courseData.speaker.nick : 'NONE'}</div>
						</div>
					</Col>
					<Col span={20}></Col>
				</Row>
				<Row>
					<Col span={4}>
						<div className='form-group-item'>
							<div className='form-group-item-heading'>开课时间: </div>
							<div className="form-group-item-body text-left lh-31">{courseData.openTime ? moment(courseData.openTime).format('YYYY-MM-DD') : 'NONE'}</div>
						</div>
					</Col>
					<Col span={20}></Col>
				</Row>
				<Row>
					<Col span={4}>
						<div className='form-group-item'>
							<div className='form-group-item-heading'>价格: </div>
							<div className="form-group-item-body text-left lh-31">{courseData.price}</div>
						</div>
					</Col>
					<Col span={20}></Col>
				</Row> */}
				<Row className='mb-20 pt-10 pl-15'>
					<div className="fs-14 f-bold inline mr-30">课程：{courseData.title || ''}</div>
					<Button icon='plus' onClick={this.handleAddLesson.bind(this)}>添加课时</Button>
				</Row>
				<Table 
					columns={LESSON_COLUMNS}
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

				{lessonModal &&
					<LessonModal
						visible={lessonModal}
						onClose={this.handleCloseModal.bind(this, 'lessonModal')}
						data = {lessonData}
					/>
				}
				{commentModal &&
					<CommentModal
						visible={commentModal}
						onClose={this.handleCloseModal.bind(this, 'commentModal')}
						lesson = {lessonData}
						course={courseData}
					/>
				}
			</div>
		)
	}
}

const LESSON_COLUMNS = [
	{dataIndex: 'lessonOrder', title: '序号'},
	{dataIndex: 'title', title: '标题'},
	{dataIndex: 'createTimeStr', title: '创建时间'},
	{dataIndex: 'publishDateStr', title: '发布时间'},
	{dataIndex: 'onSale', title: '上架状态'},
	{dataIndex: 'free', title: '可试听'},
	{dataIndex: 'resourceSize', title: '音频大小'},
	{dataIndex: 'commentCount', title: '评论数量'},
	{dataIndex: 'op', title: '操作'},
]