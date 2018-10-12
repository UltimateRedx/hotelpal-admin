import React from 'react'
import {Card, Checkbox, notification} from 'antd'
import {ADMIN} from 'scripts/remotes'
import { NoticeError } from 'scripts/utils/index';

const uuid = require('uuid/v4')

const prefix = 'auth-manager'
export default class AuthManager extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			adminList:[],
		}
	}

	componentDidMount() {
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
				<Card title='后台用户权限管理'>
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
			<Card className='mb-15' title={user.user} key={user.id}>
				{optionList}
			</Card>
		)
	}

	
	handleCheckBoxChange(userId, authMenu, uuid, e) {
		notificationOperation.DESTROY(uuid)
		notificationOperation.CRATE(uuid)
		ADMIN.authorizeMenu(userId, authMenu).then(res => {
			if (!res.success) {
				NoticeError(res.message)
			}
			notificationOperation.UPDATE(uuid, res.success)
		})
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