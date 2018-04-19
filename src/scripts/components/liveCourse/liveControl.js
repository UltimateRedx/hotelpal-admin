import React from 'react'
import {Button, Row, Col, Select} from 'antd'
import {LIVE_COURSE} from 'scripts/remotes/index'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'

const Option = Select.Option

const prefix = 'liveControl'
export default class LiveControl extends React.Component {
	constructor() {
		super()
		this.state = {
			ongoing: false,
			selectedCourseId: '',
			courseList:[],
		}
	}
	getCourseList() {
		let from = new Date();
		from.setHours(0);from.setMinutes(0);from.setSeconds(0);from.setMilliseconds(0);
		let to = new Date();
		to.setDate(to.getDate() + 1)
		to.setHours(0);to.setMinutes(0);to.setSeconds(0);to.setMilliseconds(0);
		let data = {
			orderBy: 'openTime',
			order: 'asc',
			openTimeFrom: from,
			openTimeTo: to,
		}
		LIVE_COURSE.getLiveCoursePageList(data).then(res => {
			if (!res.success) {
				NoticeError(res.messages);
			}
			this.setState({courseList: res.voList})
		}) 
	}
	

	render() {
		let {ongoing, selectedCourseId, courseList} = this.state
		let  list = courseList.map(c => {
			return (
				<Option key={c.id}>{c.title}</Option> 
			)
		})
		return (
			<div className={prefix}>
				<Row gutter={50}>
					<Col span={12}>
						<Select disabled={ongoing} value={selectedCourseId} onChange={this.handleCourseChange.bind(this)}>
							{list}
						</Select>
					</Col>
					<Col span={12}>
						<div style={{backgroundColor: 'blue'}}>345</div>
					</Col>
				</Row>
			</div>
		)
	}

	handleCourseChange(value) {
		this.setState({selectedCourseId: value})
	}
}