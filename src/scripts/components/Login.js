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
						{/* <div className='form-group-item mb-15'>
							<div className="form-group-item-body">
								<Input
									value={user}
									onChange={this.handleInputChange.bind(this,'user')}
								/>
							</div>
						</div> */}
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
		let {auth} = this.state
		if (!auth) {
			NoticeMsg("请输入密码")
			return
		}
		LOGIN.login(auth).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			window.localStorage.setItem("loggedIn", 'Y')
			window.location.href = '#/hotelpal'
		})
	}
}