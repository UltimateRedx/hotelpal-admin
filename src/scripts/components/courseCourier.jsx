import React from 'react'
import {Card, Table, Button, Row, Col, Input, Select} from 'antd'
import {CONTENT, COURSE} from 'scripts/remotes'
import {NoticeError, NoticeMsg} from 'scripts/utils/index'
const TextArea = Input.TextArea
const Option = Select.Option
const prefix = 'settings'
export default class CourseCourier extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			phoneList:[],
			userList:[],
			duplicatePhoneNum: 0,
			courseList:[],
			selectedCourseId: '',
		}
	}
	componentDidMount() {
		this.getCourseList()
	}
	getCourseList() {
		COURSE.getList({currentPage: 1, pageSize: '', containsContent: false}).then(res => {
			this.setState({courseList: res.voList})
		})
	}
	render() {
		let {phoneList, userList, duplicatePhoneNum, courseList, selectedCourseId} = this.state
		userList = userList.map((u, index) => {
			u.index = index + 1
			return u
		})
		courseList = courseList.map(course => {
			return (
				<Option key={course.id}>{course.title}</Option> 
			)
		})
		return (
			<div className={prefix}>
				<Card title='添加课程' extra={<Button onClick={this.handleAddCourse.bind(this)} disabled={userList.length == 0}>确认添加</Button>}>
					<Col span={2}>
						<div>有{phoneList.length}行手机号码{duplicatePhoneNum > 0 && ('，重复号码有' + duplicatePhoneNum + '个')}</div>
						<TextArea autosize={{minRows: 6}} onChange={this.handlePhoneChange.bind(this)} placeholder='输入/粘贴手机号码，一行一个。按回车键确认'/>
					</Col>
					<Col span={2} className='t-center'><Button icon="double-right" onClick={this.handleQueryUser.bind(this)}/></Col>
					<Col span = {16}>
						<Table
							columns={COLUMNS}
							dataSource={userList}
							pagination = {false}
						/>
					</Col>
					<Col span={4} className='pl-15'>
						<div>选择课程</div>
						<Select onChange={this.handleCourseChange.bind(this)} value={selectedCourseId}>
							{courseList}
						</Select>
					</Col>
				</Card>
			</div>
		)
	}
	handleAddCourse() {
		let {userList, selectedCourseId} = this.state
		if (!selectedCourseId) {
			NoticeMsg('请选择课程')
			return
		}
		CONTENT.addCourse(Array.from(new Set(userList.map(u => {return u.domainId}))), selectedCourseId).then(res => {
			if (res.success) {
				NoticeMsg('添加成功')
			} else {
				NoticeError(res.messages)
			}
		})
	}
	handlePhoneChange(e) {
		let phoneList = e.target.value.split('\n').filter(p =>{return p.length>0})
		let set = new Set(phoneList)
		let duplicatePhoneNum = 0
		if(phoneList.length != set.size) {
			duplicatePhoneNum = phoneList.length - set.size
		}
		this.setState({phoneList, duplicatePhoneNum})
	}
	handleQueryUser() {
		let {phoneList} = this.state
		if (phoneList.length == 0) return
		CONTENT.getUserByPhone(Array.from(new Set(phoneList))).then(res => {
			if (res.success) {
				this.setState({userList: res.voList})
			}else {
				NoticeError(res.messages)
			}
		})
	}
	handleCourseChange(value) {
		this.setState({selectedCourseId: value})
	}
}
const COLUMNS = [
	{dataIndex: 'index', title:'序号'},
	{dataIndex: 'phone', title: '手机号码'},
	{dataIndex: 'nick', title: '昵称'},
	{dataIndex: 'company', title: '公司'},
	{dataIndex: 'title', title: '职位'},
]
