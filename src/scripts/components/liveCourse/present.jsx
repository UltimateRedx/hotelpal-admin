import React from 'react'
import {Row, Col, Select, Input, Icon} from 'antd'
import {LIVE_COURSE} from 'scripts/remotes/index'
import {NoticeMsg, NoticeError} from 'scripts/utils/index'
const Option = Select.Option
const Search = Input.Search

const prefix = 'live-present'
export default class Present extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedCourseId: '',
			courseList:[],
			ENROLL: '',
			ONGOING: '',
			TOTAL: '',
		}
	}
	componentDidMount() {
		this.getCourseList()
	}
	getCourseList() {
		let data = {
			orderBy: 'openTime',
			order: 'asc',
			pageSize: 50,
		}
		LIVE_COURSE.getLiveCoursePageList(data).then(res => {
			if (!res.success) {
				NoticeError(res.messages);
				return
			}
			let {selectedCourseId, ENROLL, ONGOING, TOTAL} = this.state
			if (res.voList.length > 0) {
				selectedCourseId = res.voList[0].id + ''
				ENROLL = res.voList[0].enrollBaseLine
				ONGOING = res.voList[0].ongoingBaseLine
				TOTAL = res.voList[0].totalBaseLine
			}
			this.setState({courseList: res.voList, selectedCourseId, ENROLL, ONGOING, TOTAL})
		}) 
	}
	render() {
		let {courseList, selectedCourseId, ENROLL, ONGOING, TOTAL} = this.state
		let list = courseList.map(c => {
			return (
				<Option key={c.id}>{c.title}</Option>
			)
		})
		return (
			<div className={prefix}>
				<Row key='1'>
					<Col span={6}>
						<Select value={selectedCourseId} onChange={this.handleCourseChange.bind(this)}>
							{list}
						</Select>
					</Col>
				</Row>
				<Row key='2' className='mt-30'>
					<Col span={2} className='lh-32'>
						报名人数显示:
					</Col>
					<Col span={4}>
						<Search value={ENROLL} onChange={this.handleBaseLineChange.bind(this, 'ENROLL')} enterButton={<Icon type="check-circle-o"/>} onSearch={this.handleUpdatePresent.bind(this, 'ENROLL')}/>
					</Col>
				</Row>
				<Row key='3' className='mt-30'>
					<Col span={2} className='lh-32'>
						观看中人数显示:
					</Col>
					<Col span={4}>
						<Search value={ONGOING} onChange={this.handleBaseLineChange.bind(this, 'ONGOING')} enterButton={<Icon type="check-circle-o"/>} onSearch={this.handleUpdatePresent.bind(this, 'ONGOING')}/>
					</Col>
				</Row>
				<Row key='4' className='mt-30'>
					<Col span={2} className='lh-32'>
						观看总人数显示:
					</Col>
					<Col span={4}>
						<Search value={TOTAL} onChange={this.handleBaseLineChange.bind(this, 'TOTAL')} enterButton={<Icon type="check-circle-o"/>} onSearch={this.handleUpdatePresent.bind(this, 'TOTAL')}/>
					</Col>
				</Row>
			</div>
		)
	}
	renderChangeButton() {
	}
	handleCourseChange(value) {
		let {courseList} = this.state
		let course = courseList.find(c => {return c.id == value})
		this.setState({selectedCourseId: value, 
			ENROLL: course.enrollBaseLine, 
			ONGOING: course.ongoingBaseLine, 
			TOTAL: course.totalBaseLine, 
		})
	}
	handleBaseLineChange(f, e) {
		this.setState({[f]: e.target.value})
	}
	handleUpdatePresent(f) {
		let {selectedCourseId} = this.state
		let baseLine = this.state[f]
		LIVE_COURSE.configureBaseLine(selectedCourseId, f, baseLine).then(res => {
			if (res.success) {
				NoticeMsg('设置成功')
			} else {
				NoticeError(res.messages)
			}
		})
	}
}