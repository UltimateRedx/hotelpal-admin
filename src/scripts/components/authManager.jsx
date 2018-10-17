import React from 'react'
import {Card, Checkbox, notification, Button, Popconfirm, Modal, Row, Col, Input} from 'antd'
import {ADMIN} from 'scripts/remotes'
import { NoticeError } from 'scripts/utils/index';

const uuid = require('uuid/v4')

const prefix = 'auth-manager'
export default class AuthManager extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			adminList:[],
			modal: false,
		}
	}

	componentDidMount() {
		this.updateAuthComponent()
	}

	updateAuthComponent() {
		//get auth
		ADMIN.getAdminAuth().then(res => {
			if (res.success) {
				this.setState({adminList: res.voList})
			}
		})
	}

	render() {
		let {adminList} = this.state
		let list = adminList.map(one => {return this.renderOne(one)})
		return (
			<div className={prefix}>
				<Card title='后台用户权限管理' extra={<Button onClick={this.handleModalShow.bind(this)}>添加用户</Button>}>
					{list}
				</Card>
			</div>
		)
	}

	renderOne(user) {
		let accessibleMenu = new Set(user.grantedResources.map(r => {return r.menu}))
		let optionList = AUTH_ITEM_LIST.map((item, index) => {
			return (<Checkbox key={index} checked={accessibleMenu.has(item.menu)} onChange={this.handleCheckBoxChange.bind(this, user.id, item.menu, uuid())}>{item.name}</Checkbox>)
		})
		return (
			<Card className='mb-15' title={user.name || user.user} key={user.id} 
				extra={
					<Popconfirm title={'确认删除：' + (user.name || user.user) + ' ?'} 
						onConfirm = {this.handleDelete.bind(this, user.id)} >
							<Button>删除</Button>
					</Popconfirm>}>
				{optionList}
			</Card>
		)
	}

	
	handleCheckBoxChange(userId, authMenu, uuid, e) {
		notificationOperation.DESTROY(uuid)
		notificationOperation.CRATE(uuid)
		ADMIN.authorizeMenu(userId, authMenu, e.target.checked?'Y':'N').then(res => {
			if (!res.success) {
				NoticeError(res.message)
			}
			this.updateAuthComponent()
			notificationOperation.UPDATE(uuid, res.success)
		})
	}

	handleDelete(userId) {
		ADMIN.deleteUser(userId).then(res => {
			if (res.success) {
				this.updateAuthComponent()
			} else {
				NoticeError(res.messages)
			}
		})
	}

	handleModalShow() {
		this.setState({modal: true})
	}

}
class NewAdminUserModal extends React.Component {
	constructor(props) {
		super(props) 
		this.state = {
			user: '',
			name: '',
		}
	}

	handleCloseModal() {
		this.state = {}
		let {onClose} = this.props
		onClose()
	}

	confirmHandler() {
		let {user, name} = this.state
		let {onClose} = this.props
		ADMIN.createAdminUser(user, name).then(res => {
			if (res.success) {
				onClose(true)
			} else {
				NoticeError(res.messages)
			}
		})
	}

	render() {
		let {show} = this.props
		let {user, name} = this.state
		return (
			<Modal 
				visible={show}
				title = '添加后台用户'
				width = {400}
				onCancel={this.handleCloseModal.bind(this)}
				maskClosable = {false}
				footer = {
					[
						<Button key="back" className='btn-cancel' onClick={this.handleCloseModal.bind(this)}>取消</Button>,
						<Button key="submit" className='button-green white' onClick={this.confirmHandler.bind(this)}>确认</Button>
					]
				}
			>
				<Row className='mb-8'>
					<Col className="form-group-item">
						<div className="form-group-item-heading">用户名</div>
						<div className="form-group-item-body">
							<Input value={user} onChange={this.inputHandler.bind(this, 'user')}/>
						</div>
					</Col>
				</Row>
				<Row>
					<Col className="form-group-item">
						<div className="form-group-item-heading">姓名/昵称</div>
						<div className="form-group-item-body">
							<Input value={name} onChange={this.inputHandler.bind(this, 'name')}  placeholder='选填'/>
						</div>
					</Col>
				</Row>
			</Modal>
		)
	}
	
	inputHandler(f, e) {
		this.setState({[f] : e.target.value})
	}
}













const key = 'updatable';
const UUID = 'thisisuuid'
const AUTH_ITEM_LIST = [
	{menu: 'MENU_HOME', name: '数据统计'},
	{menu: 'MENU_SYS_CONFIGURATION',name: '配置'},
	{menu: 'MENU_AUTH_MANAGER', name: '权限配置'},
	{menu: 'MENU_SPEAKER', name: '主讲人'},
	{menu: 'MENU_COURSE', name: '订阅专栏'},
	{menu: 'MENU_COURSE', name: '成长专栏'},
	{menu: 'MENU_USER', name: '用户管理'},
	{menu: 'MENU_ORDER', name: '订单管理'},
	{menu: 'MENU_LIVE', name: '直播课程'},
	{menu: 'MENU_LIVE', name: '直播PPT'},
	{menu: 'MENU_COUPON', name: '优惠券'},
	{menu: 'MENU_COURSE_ADD', name: '添加课程'},
]
const notificationOperation = {
	CRATE: (key) =>{
		notification.info({description: '准备更新， 更新成功后自动关闭 ...', duration: null, key, message: '正在更新 ... '})
	},
	UPDATE: (key, success) => {
		let config = {
			description: success ? '更新成功' : '更新失败', 
			duration: 2 , 
			key, 
			message: '权限更新'}
		if (success) notification.success(config)
		else notification.error(config)
	},
	DESTROY: (key) => {
		notification.close(key)
	}
}