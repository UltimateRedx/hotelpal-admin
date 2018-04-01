import React from 'react'
import {Table, Pagination, Row, Button, Icon,Avatar, message, Popconfirm, Divider} from 'antd'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'
import {SPEAKER} from 'scripts/remotes/index'
import SpeakerModal from 'scripts/components/modal/SpeakerModal'

const prefix = 'speaker'
export default class Speaker extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			speakerList:[],
			speakerModal: false,
			currentPage: 1,
			pageSize: 10,
			voTotal: 0,
			speakerData: {},
		}
	}
	componentDidMount() {
		this.getPageList();
	}
	getPageList() {
		SPEAKER.getList(this.state).then(res => {
			if (res.success) {
				this.setState({speakerList: res.voList, currentPage: res.pageNumber, voTotal: res.voTotal});
			} else{
				NoticeError(res.messages)
			}
		})
	}
	handleAddSpeaker() {
		this.setState({speakerModal: true, speakerData:{}})
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
		this.setState({speakerModal: false})
		if (refresh) {
			this.getPageList()
		}
	}
	handleDeleteSpeaker(data) {
		SPEAKER.deleteSpeaker(data).then(res => {
			if (res.success) {
				this.getPageList();
			} else {
				NoticeErrorres.messages;
			}
		})
	}
	handleUpdateSpeaker(res) {
		this.setState({speakerModal: true, speakerData: res})
	}
	render() {
		let {speakerList, speakerModal, voTotal, currentPage, speakerData} = this.state;
		speakerList.forEach(res => {
			res.head = (
				<Avatar icon={res.headImg ? null : 'question'} shape='square' size='large' src={res.headImg}/>
			)
			res.op = (
				<div>
					<a className="table-href" onClick={this.handleUpdateSpeaker.bind(this, res)}>编辑</a>
					<Divider type='vertical'/>
					<Popconfirm title={'确认删除：' + res.nick + ' ?'} onConfirm = {this.handleDeleteSpeaker.bind(this,res)} >
						<a className="table-href">删除</a>
					</Popconfirm>
				</div>
			)
			res.describe = (
				<div dangerouslySetInnerHTML={{__html: res.desc}}></div>
			)
		})
		return (
			<div className={prefix}>
				<Row>
					<Button icon='plus' onClick={this.handleAddSpeaker.bind(this)}>添加主讲人</Button>
				</Row>
				<Table 
					columns={SPEAKER_COLUMNS}
					dataSource={speakerList}
					pagination = {false}
				/>
				<Pagination 
					size="small" 
					total={voTotal} 
					current={currentPage} 
					onChange={this.onChangePage.bind(this)}
					showTotal={this.paginationTotalRender.bind(this)}
				/>

				{speakerModal &&
					<SpeakerModal
						visible={speakerModal}
						onClose={this.handleCloseModal.bind(this)}
						data = {speakerData}
					/>
				}
			</div>
		)
	}
}
const SPEAKER_COLUMNS = [
	{dataIndex: 'head', title: '头像'},
	{dataIndex: 'op', title: '操作'},
	{dataIndex: 'nick', title: '姓名'},
	{dataIndex: 'company', title: '公司'},
	{dataIndex: 'title', title: '职位'},
	{dataIndex: 'describe', title: '介绍'},
	
]