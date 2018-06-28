import React from 'react'
import {Link} from 'react-router'
import {Table, Pagination, Row, Button, Icon,Avatar, message, Popconfirm, Divider, Layout} from 'antd'
import moment from 'moment'
import {NoticeError} from 'scripts/utils/index'
import {LESSON} from 'scripts/remotes/index'
import LessonSelfModal from 'scripts/components/modal/LessonSelfModal'
import CommentModal from 'scripts/components/modal/CommentModal'

const prefix = 'lesson-self'
export default class LessonSelf extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			type: 'SELF',
			lessonList:[],
			editModal: false,
			currentPage: 1,
			pageSize: 10,
			voTotal: 0,
			lesssonData: {},
			order: 'desc',
			orderBy: 'publishDate',
			commentModal: false,
		}
	}
	componentDidMount() {
		this.getPageList();
	}
	getPageList() {
		LESSON.getLessonList(this.state).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({lessonList: res.voList, currentPage: res.pageNumber, voTotal: res.voTotal})
		})
	}
	
	paginationTotalRender(total, range) {
		return (
			<span>{range[0]}-{range[1]}条，共{total}条</span>
		)
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
	
	render() {
		let {lessonList, editModal, voTotal, currentPage, lessonData, commentModal} = this.state;
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
			res.publishDateStr = res.publishDate && moment(res.publishDate).format('YYYY-MM-DD')
			return res;
		})
		return (
			<div className={prefix}>
				<Row className='mb-20 pt-10 pl-15'>
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

				{editModal &&
					<LessonSelfModal
						visible={editModal}
						onClose={this.handleCloseModal.bind(this, 'editModal')}
						data = {lessonData}
					/>
				}
				{commentModal &&
					<CommentModal
						visible={commentModal}
						onClose={this.handleCloseModal.bind(this, 'commentModal')}
						lesson = {lessonData}
					/>
				}
			</div>
		)
	}
	handleUpdateLesson(res) {
		this.setState({editModal: true, lessonData: res})
	}
	handleAddLesson() {
		this.setState({editModal: true, lessonData:{}})
	}
	onChangePage(page, pageSize) {
		this.setState({currentPage: page, pageSize}, this.getPageList);
	}
	handleCloseModal(f, refresh) {
		this.setState({[f]: false})
		if (refresh) {
			this.getPageList()
		}
	}
	handleShowCommentModal(res) {
		this.setState({commentModal: true, lessonData: res})
	}
}
const LESSON_COLUMNS = [
	{dataIndex: 'lessonOrder', title: '序号'},
	{dataIndex: 'title', title: '标题'},
	{dataIndex: 'createTimeStr', title: '创建时间'},
	{dataIndex: 'publishDateStr', title: '发布时间'},
	{dataIndex: 'pv', title: 'PV'},
	{dataIndex: 'uv', title: 'UV'},
	{dataIndex: 'op', title: '操作'},
]