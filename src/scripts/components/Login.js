import React from 'react'
import classNames from 'classnames'
import {Col, Avatar, Divider, Input} from 'antd'

const prefix = 'login'
export default class Login extends React.Component {
	constructor() {
		super()
		this.state = {
			user: '',
			auth: ''
		}
	}
	render() {
		let {user, auth} = this.state
		return (
			<div className={classNames(prefix, 'mt-100')}>
				<Col span={4}></Col>
				<Col span={16}>
					<div className='t-center center'>
						<Avatar shape='square' src={require('images/logo64.png')}/>
						<div>
							<h2 className='p-20 inline-block'>酒店邦</h2>
							<Divider type='vertical' className='bg-primary-red'/>
							<h4 className='p-20 inline-block'>管理后台</h4>
						</div>
						<div className='form-group-item mb-15'>
							<div className="form-group-item-body">
								<Input
									value={user}
									onChange={this.handleInputChange.bind(this,'user')}
								/>
							</div>
						</div>
						<div className='form-group-item mb-15'>
							<div className="form-group-item-body">
								<Input
									value={auth}
									onChange={this.handleInputChange.bind(this,'auth')}
								/>
							</div>
						</div>
						<button>登录</button>
					</div>
					
				</Col>
				<Col span={4}></Col>
			</div>
		)
	}
	handleInputChange(f, value) {
		this.setState({[f]: value})
	}
}