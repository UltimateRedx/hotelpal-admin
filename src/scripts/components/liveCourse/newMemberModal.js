import React from 'react'
import { Modal, Button, Row, Col, Input, InputNumber, Icon} from 'antd'
import {USER} from 'scripts/remotes/index'
import {NoticeMsg, NoticeError, Utils} from 'scripts/utils/index'

const prefix = 'newMemberModal'

export default class NewMemberModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			phoneList:[],
			validity: '',
			phone: '',
			validity: '',
		}
	}
	componentDidMount() {
	}
	handleClose() {
		let { onClose } = this.props;
		onClose()
	}
	handleAddOne() {
		let{phone, validity} = this.state
		USER.addLiveVip(phone, validity).then(res => {
			if(!res.success) {
				NoticeError(res.messages)
				return
			}
			let {phoneList} = this.state
			phoneList.push(phone)
			this.setState({phoneList})
		})
	}
	render() {
		let {...rest} = this.props
		let {phoneList, validity, phone} = this.state
		phoneList = phoneList.map((p, index) => {
			return this.renderOne(p, index)
		})
		return (
			<Modal
				{...rest}
				title='添加公开课会员'
				width={320}
				height={640}
				className={`${prefix}`}
				onCancel={this.handleClose.bind(this)}
				maskClosable={false}
				footer={
					[
						<Button key="back" className='btn-cancel w-64' onClick={this.handleClose.bind(this)}>确定</Button>
					]
				}
			>
				<div className='box default-box'>{phoneList}</div>
				<Row className="mb-8 edit-row">
					<Col span={18}>
						<Input value={phone}
							onChange={this.handleInputChange.bind(this)} />
					</Col>
					<Col span={1}/>
					<Col span={4}>
						<Icon type="plus" className=' plus f-bold' onClick={this.handleAddOne.bind(this)}/>
					</Col>
				</Row>
				<Row className="mb-8 edit-row">
					<Col span={19} className="form-group-item">
						<div className="form-group-item-heading">有效期(天)</div>
						<div className="form-group-item-body">
							<InputNumber
								value={validity}
								min={1}
								precision={0}
								onChange={this.handleNumberChange.bind(this)}
							/>
						</div>
					</Col>
				</Row>
			</Modal>
		)
	}
	renderOne(phone, index) {
		return (
			<Row className="mb-8" key={index}>
				<Col span={8}>
					<div className="form-group-item-body">{phone}</div>
				</Col>
				<Col span={8} className='text-left'>
					<div className="form-group-item-body"><Icon type="close-circle-o" className='primary-red f-bold'/></div>
				</Col>
			</Row>
		)
	}
	handleInputChange(e) {
		this.setState({phone: e.target.value})
	}
	handleNumberChange(value) {
		let v = Utils.getIntValue(value)
		this.setState({validity: v})
	}
}