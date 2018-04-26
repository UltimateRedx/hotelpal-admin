import React from 'react'
import {Tabs} from 'antd'
import CourseList from './courseList'
import LiveControl from './liveControl'
import VipMember from './vipMember'
const TabPane = Tabs.TabPane

const prefix = 'liveCourse'
export default class LiveCourse extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			activeKey: KEY_COURSE,
		}
	}
	render() {
		let {activeKey} = this.state
		return (
			<Tabs
				size='large'
				className='pl-15 pr-15'
				activeKey={activeKey}
				onChange={this.handleTabChange.bind(this)}
			>
				<TabPane key={KEY_COURSE} tab='课程'><CourseList/></TabPane>
				<TabPane key={KEY_LIVE_CONTROL} tab='直播控制'><LiveControl active={activeKey == KEY_LIVE_CONTROL}/></TabPane>
				<TabPane key={KEY_MEMBER} tab='会员'><VipMember/></TabPane>
				
			</Tabs>
		)
	}
	handleTabChange(ak) {
		this.setState({activeKey: ak})
	}
}
const KEY_COURSE = 'COURSE'
const KEY_LIVE_CONTROL = 'LIVE_CONTROL'
const KEY_MEMBER = 'MEMBER'