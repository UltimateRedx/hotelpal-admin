import React from 'react'
import {Table, Pagination, Divider, Modal, Button, Popconfirm, Row, Col, Select, Input} from 'antd'
import moment from 'moment'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'
import {SPEAKER, COMMENT} from 'scripts/remotes/index' 
const Option = Select.Option
const TextArea = Input.TextArea
const prefix = 'commentModal'
export default class CommentModal extends React.Component {

	constructor(props) {
		super(props)
		let {course} = props
		this.state = {
			currentPage: 1,
			pageSize: 10,
			commentList:[],
			voTotal: 0,

			replyModal: false,
			comment: {},
			speakerId: course && course.speakerId + '' || '',
			content: '',
			speakerList: [],
		}
	}
	componentDidMount() {
		let {lesson} = this.props
		this.setState({lesson}, this.getPageList)
	}
	getPageList() {
		COMMENT.getCommentPageList(this.state).then(res => {
			if (res.success) {
				this.setState({commentList: res.voList, voTotal: res.voTotal})
			} else {
				NoticeError(res.messages);
			}
		})
	}
	handleClose() {
		let { onClose } = this.props;
		onClose()
	}
	onChangePage(page, pageSize) {
		this.setState({currentPage: page, pageSize}, this.getPageList)
	}
	paginationTotalRender(total, range) {
		return (
			<span>{range[0]}-{range[1]}条，共{total}条</span>
		)
	}
	handleReverseElite(commentList, comment) {
		comment.elite = comment.elite === 'Y' ? 'N' : 'Y';
		COMMENT.updateElite(comment).then(res => {
			if (res.success) {
				this.setState({commentList})
			} else {
				NoticeError(res.messages)
			}
		})
	}
	handleDeleteComment(comment) {
		COMMENT.deleteComment(comment.id).then(res => {
			if (res.success) {
				this.getPageList();
			} else {
				NoticeError(res.messages)
			}
		})
	}
	handleReplyModal(comment) {
		this.setState({replyModal: true, comment})
		SPEAKER.getAll().then(res => {
			if (res.success) {
				this.setState({speakerList: res.voList})
			} else {
				NoticeError(res.messages)
			}
		})
	}
	handleCloseReply(refresh) {
		this.setState({replyModal: false})
		if (refresh) {
			this.getPageList()
		}
	}
	handleReply() {
		let {comment, content, speakerId} = this.state
		COMMENT.replyComment({replyToId: comment.id, content, speakerId}).then(res =>{
			if (res.success){
				this.handleCloseReply(true)
			}else {
				NoticeError(res.messages)
			}
		})
	}
	handleSpeakerChange(f, value) {
		let state = this.state
		state[f] = value
		this.setState(state)
	}
	handleInputChange(field, e) {
		let state = this.state;
		state[field] = e.target.value;
		this.setState(state)
	}
	renderReplyModal() {
		let {course} = this.props;
		let {speakerList, comment, replyModal, speakerId, content} = this.state;
		let speakerOpt = speakerList.map(s => {
			return (
				<Option key={s.id}>{s.nick}</Option> 
			)
		})
		return (
			<Modal
				visible={replyModal}
				title = '回复评论'
				width = {800}
				onCancel={this.handleCloseReply.bind(this)}
				maskClosable = {false}
				footer = {
					[
						<Button key="back" className='btn-cancel' onClick={this.handleCloseReply.bind(this)}>取消</Button>,
						<Button key="submit" className='button-green white' onClick={this.handleReply.bind(this)}>回复</Button>
					]
				}
			>
				<Row className='mb-15'>
					<h3 className="fs-14 f-bold inline">回复: &nbsp;</h3>{comment.content}
				</Row>
				<Row className='mb-8'>
					<Col className="form-group-item">
						<div className="form-group-item-heading">主讲人</div>
						<div className="form-group-item-body">
							<Select onChange={this.handleSpeakerChange.bind(this, 'speakerId')} value={speakerId}>
								{speakerOpt}
							</Select>
						</div>
					</Col>
				</Row>
				<Row>
					<Col className="form-group-item">
						<div className="form-group-item-heading">回复内容</div>
						<div className="form-group-item-body">
							<TextArea value={content} autosize={true}
								onChange={this.handleInputChange.bind(this, 'content')}/>
						</div>
					</Col>
				</Row>
			</Modal>
		)
	}
	render() {
		let {lesson = {}, ...rest} = this.props
		let {commentList, voTotal, currentPage, replyModal} = this.state
		commentList.forEach((c) => {
			c.createTime = moment(c.createTime).format('YYYY-MM-DD HH:mm')
			c.op = (
				<div>
					<a className="table-href" onClick={this.handleReverseElite.bind(this, commentList, c)}>{c.elite === 'Y' ? '取消精选' : '设为精选'}</a>
					<Divider type='vertical'/>
					<a className="table-href" onClick={this.handleReplyModal.bind(this, c)}>回复</a>
					<Divider type='vertical'/>
					{
						c.deleted ==='N' &&
						<Popconfirm title={'确认删除 ?'} onConfirm={this.handleDeleteComment.bind(this, c)}>
							<a className="table-href">删除</a>
						</Popconfirm>
					}
					{c.deleted ==='Y' &&
						<div className='inline'>已删除</div>
					}
				</div>
			)
		})
		return (
			<div>
				<Modal
					{...rest}
					title = '课时评论'
					width = {1029}
					className = {`${prefix}`}
					onCancel={this.handleClose.bind(this)}
					maskClosable = {false}
					footer = {
						[
							<Button key="back" className='btn-cancel' onClick={this.handleClose.bind(this)}>关闭</Button>
						]
					}
				>
					<h3 className="fs-14 f-bold mb-15">课时 {lesson ? lesson.title : ''}</h3>
					<Table 
						columns={COMMENT_COLUMNS}
						dataSource={commentList}
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
				</Modal>
				{
					replyModal && 
					this.renderReplyModal()
				}
			</div>
		)
	}
}
const COMMENT_COLUMNS=[
	{dataIndex: 'createTime', title: '时间',   width:'15%'},
	{dataIndex: 'nick', title: '用户',  width:'15%'},
	{dataIndex: 'content', title: '内容',     width:'50%'},
	{dataIndex: 'op', title: '操作',       width:'20%'},
	
]