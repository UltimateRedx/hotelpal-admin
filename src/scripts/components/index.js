import React from 'react'
import {Link, Modal, Row, Col, Input} from 'react-router'
import {Layout, Menu, Modal} from 'antd'
const {Sider, Header} = Layout
const {Item} = Menu
import {NoticeMsg} from 'scripts/utils/index'
require('styles/index.less')
const prefix = 'navigation'
export default class Navigation extends React.Component {
	render() {
		return (
			<Layout className={prefix}>
				<Sider collapsible={true} className='sider'>
					<Menu selectable={false}><Item></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/statistics'>数据统计</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/settings'>配置</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/speaker'>主讲人</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/course'>订阅专栏</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/lessonSelf'>成长专栏</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/user'>用户管理</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/order'>订单管理</Link></Item></Menu>
					
					<Menu selectable={false}><Item><Link to='/hotelpal/liveCourse'>直播课程</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/ppt'>直播PPT</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/coupon'>优惠券</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/courseCourier'>添加课程</Link></Item></Menu>
					
				</Sider>
				<Layout>
					<div className='container'>
						{this.props.children}
					</div>
				</Layout>
			</Layout>
		)
	}
}
class PWModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			old: '',
			nova: ''
		}
	}
	render() {
		let {show} = this.props
		return (
			<Modal
				visible={show}
				title = '修改密码'
				width = {800}
				maskClosable = {false}
				footer = {null}
			>
				<Row>
					<Col>原密码:</Col>
					<Col><Input onChange={this.handleInputChange.bind(this, 'old')}/></Col>
				</Row>
				<Row>
					<Col>新密码:</Col>
					<Col><Input onChange={this.handleInputChange.bind(this, 'nova')}/></Col>
				</Row>
				<Row><Button onClick={this.handleConfirm.bind(this)}/></Row>
			</Modal>

		)
	}
	handleInputChange(f, e) {
		this.setState([f], e.target.value)
	}
	handleConfirm() {
		let {old, nova} = this.state
		if (!old) {
			NoticeMsg('请输入旧密码')
			return
		}
		if (!nova) {
			NoticeMsg('请输入新密码')
			return
		}
		
	}
}