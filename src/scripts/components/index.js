import React from 'react'
import {Link} from 'react-router'
import {Layout, Menu, Modal, Row, Col, Input, Icon, Button} from 'antd'
const {Sider, Header} = Layout
const {Item} = Menu
import {NoticeMsg, NoticeError} from 'scripts/utils/index'
import { LOGIN } from '../remotes';
require('styles/index.less')
const prefix = 'navigation'
export default class Navigation extends React.Component {
	constructor(props) {
		super(props)
		let grantedMenuStr = window.sessionStorage.getItem('grantedMenu')
		this.state = {
			show: false,
			grantedMenu: new Set(JSON.parse(grantedMenuStr)) 
		}
	}
	render() {
		let {show, grantedMenu} = this.state
		return (
			<Layout className={prefix}>
				<Sider collapsible={true} className='sider'>
					<Menu selectable={false}><Item><Icon type="user" onClick={this.handleUserClick.bind(this)}/></Item></Menu>
					{grantedMenu.has() && this.renderMenu('/hotelpal/statistics', '数据统计')}
					{grantedMenu.has() && this.renderMenu('/hotelpal/settings', '配置')}
					{grantedMenu.has() && this.renderMenu('/hotelpal/speaker', '主讲人')}
					{grantedMenu.has() && this.renderMenu('/hotelpal/course', '订阅专栏')}
					{grantedMenu.has() && this.renderMenu('/hotelpal/lessonSelf', '成长专栏')}
					{grantedMenu.has() && this.renderMenu('/hotelpal/user', '用户管理')}
					{grantedMenu.has() && this.renderMenu('/hotelpal/order', '订单管理')}
					{grantedMenu.has() && this.renderMenu('/hotelpal/liveCourse', '直播课程')}
					{grantedMenu.has() && this.renderMenu('/hotelpal/ppt', '直播PPT')}
					{grantedMenu.has() && this.renderMenu('/hotelpal/coupon', '优惠券')}
					{grantedMenu.has() && this.renderMenu('/hotelpal/courseCourier', '添加课程')}
					
					 

					{/* <Menu selectable={false}><Item><Link to='/hotelpal/statistics'>数据统计</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/settings'>配置</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/speaker'>主讲人</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/course'>订阅专栏</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/lessonSelf'>成长专栏</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/user'>用户管理</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/order'>订单管理</Link></Item></Menu>
					
					<Menu selectable={false}><Item><Link to='/hotelpal/liveCourse'>直播课程</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/ppt'>直播PPT</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/coupon'>优惠券</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/courseCourier'>添加课程</Link></Item></Menu> */}
					
				</Sider>
				<Layout>
					<div className='container'>
						{this.props.children}
					</div>
					<PWModal show={show}
						onClose={this.closeModal.bind(this)}
					/>
				</Layout>
			</Layout>
		)
	}
	handleUserClick() {
		this.setState({show: true})
	}
	closeModal() {
		this.setState({show: false})
	}
	renderMenu(to, text) {
		return (
			<Menu selectable={false}><Item><Link to={to}>{text}</Link></Item></Menu>
		)
		
	}
}
class PWModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			old: '',
			nova: '',
		}
	}
	componentWillReceiveProps(nextProps) {
        this.setState({show: nextProps.show})
    }
	render() {
		let {show, old, nova} = this.state
		return (
			<Modal
				visible={show}
				title = '修改密码'
				width = {800}
				maskClosable = {false}
				onCancel={this.handleClose.bind(this)}
				footer = {[
					<Button key="back" className='btn-cancel' onClick={this.handleClose.bind(this)}>取消</Button>,
					<Button key="ok" onClick={this.handleConfirm.bind(this)}>修改</Button>
				]}
			>
				<Row>
					<Col>原密码:</Col>
					<Col><Input type='password' value={old} onChange={this.handleInputChange.bind(this, 'old')}/></Col>
				</Row>
				<Row>
					<Col>新密码:</Col>
					<Col><Input type='password' value={nova} onChange={this.handleInputChange.bind(this, 'nova')}/></Col>
				</Row>
			</Modal>

		)
	}
	handleInputChange(f, e) {
		this.setState({[f]: e.target.value})
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
		LOGIN.resetPW(old, nova).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			NoticeMsg('修改密码成功')
			this.handleClose()
		})
	}
	handleClose() {
		this.setState({old: '', nova: ''}, () => {
			let {onClose} = this.props
			onClose()
		})
	}
}