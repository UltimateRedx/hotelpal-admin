import React from 'react'
import classNames from 'classnames'
import {Col, Avatar, Divider, Input, Button} from 'antd'
import { NoticeMsg, NoticeError } from 'scripts/utils/index';
import {LOGIN} from 'scripts/remotes'
const prefix = 'login'
export default class Login extends React.Component {
	constructor() {
		super()
		this.state = {
			user: '',
			auth: ''
		}
	}
	componentDidMount() {
		let loggedIn = window.localStorage.getItem("loggedIn")
		if ('Y' === loggedIn) {
			window.location.href = '#/hotelpal'
		}
	}
	render() {
		let {user, auth} = this.state
		return (
			<div className={classNames(prefix, 'mt-100')}>
				<Col span={9}></Col>
				<Col span={6}>
					<div className='t-center center'>
						<Avatar shape='square' src={require('images/logo64.png')}/>
						<div>
							<h2 className='p-20 inline-block'>酒店邦</h2>
							<Divider type='vertical' className='bg-primary-red'/>
							<h4 className='p-20 inline-block'>管理后台</h4>
						</div>
						<div className='form-group-item mb-15'>
							<Input
								placeholder='请输入用户名'
								value={user}
								onChange={this.handleInputChange.bind(this,'user')}
								onPressEnter={this.handleLogin.bind(this)}
							/>
						</div>
						<div className='form-group-item mb-15'>
							<Input
								type='password'
								value={auth}
								placeholder='请输入密码'
								onChange={this.handleInputChange.bind(this,'auth')}
								onPressEnter={this.handleLogin.bind(this)}
							/>
						</div>
						<Button onClick={this.handleLogin.bind(this)}>登录</Button>
					</div>
					
				</Col>
				<Col span={9}></Col>
			</div>
		)
	}
	handleInputChange(f, e) {
		this.setState({[f]: e.target.value})
	}
	handleLogin() {
		let {user, auth} = this.state
		if (!user) {
			NoticeMsg("请输入用户名")
			return
		}
		if (!auth) {
			NoticeMsg("请输入密码")
			return
		}
		LOGIN.login(user, auth).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			window.sessionStorage.clear()
			window.localStorage.setItem("loggedIn", 'Y')
			window.sessionStorage.setItem("grantedMenu", JSON.stringify(new Set(res.vo)));
			let grantedLink = this.getGrantedLinks()
			if (grantedLink.length > 0) {
				window.location.href = '#' + grantedLink[0]
			}
		})
	}
	getGrantedLinks() {
		let grantedMenuStr = window.sessionStorage.getItem('grantedMenu')
		let grantedMenu = new Set(JSON.parse(grantedMenuStr))
		let links = []
		if (grantedMenu.has('MENU_HOME')) links.push('/hotelpal/statistics')
		if (grantedMenu.has('MENU_SYS_CONFIGURATION')) links.push('/hotelpal/settings')
		if (grantedMenu.has('MENU_AUTH_MANAGER')) links.push('/hotelpal/auth')
		if (grantedMenu.has('MENU_SPEAKER')) links.push('/hotelpal/speaker')
		if (grantedMenu.has('MENU_COURSE')) links.push('/hotelpal/course')
		if (grantedMenu.has('MENU_USER')) links.push('/hotelpal/user')
		if (grantedMenu.has('MENU_ORDER')) links.push('/hotelpal/order')
		if (grantedMenu.has('MENU_LIVE')) links.push('/hotelpal/liveCourse')
		if (grantedMenu.has('MENU_COUPON')) links.push('/hotelpal/coupon')
		if (grantedMenu.has('MENU_COURSE_ADD')) links.push('/hotelpal/courseCourier')
		return links
	}
}