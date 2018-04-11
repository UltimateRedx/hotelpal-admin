import React from 'react'
import {Tabs} from 'antd'
import CourseList from './courseList'
const TabPane = Tabs.TabPane

const prefix = 'liveCourse'
export default class LiveCourse extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	render() {
		return (
			<Tabs
				size='large'
				className='pl-15 pr-15'
			>
				<TabPane key='1' tab='课程'><CourseList/></TabPane>
				<TabPane key='2' tab='直播控制'></TabPane>
				<TabPane key='3' tab='会员'></TabPane>
				
			</Tabs>
		)
	}
}