import React from 'react'
import {Card, Table, Divider, Popconfirm, Modal, Button, Row, Col, Input, Avatar} from 'antd'
import {SETTINGS, CONTENT} from 'scripts/remotes'
import {NoticeError} from 'scripts/utils/index'


const prefix = 'settings'
export default class Settings extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			bannerList: [],
			banner: {},
			bannerModal: false,
			validity: '60',
			courseNum: '1',
			freeCourseLink: '',
		}
	}
	componentDidMount() {
		this.getBannerList()
	}
	getBannerList() {
		SETTINGS.getBannerList().then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({bannerList: res.voList})
		})
	}
	render() {
		let {bannerList, banner, bannerModal} = this.state
		let {validity, courseNum, freeCourseLink} = this.state
		let banner_list = bannerList.map(b => {
			b.op = (
				<div>
					<a className='underline' onClick={this.handleShowBannerModal.bind(this, b)}>编辑</a>
					<Divider type='vertical'/>
					<Popconfirm title={'确认删除：' + b.name + ' ?'} onConfirm = {this.handleRemoveBanner.bind(this, b)} >
						<a className="underline">删除</a>
					</Popconfirm>
				</div>
			)
			return b
		})
		return (
			<div className={prefix}>
				<Card title='首页Banner' extra={(<Button onClick={this.handleShowBannerModal.bind(this, {})}>新增banner</Button>)}>
					<Table
						columns={BANNER_COLUMNS}
						dataSource={banner_list}
						pagination = {false}
					/>
				</Card>
				<div className='h-30 layout-bg'/>
				<Card title='邀请链接'>
					<Row>
						<Col span={4} className="form-group-item">
							<div className="form-group-item-heading">有效期</div>
							<div className="form-group-item-body">
								<Input value={validity}
									placeholder='有效期'
									onChange={this.handleInputChange.bind(this, 'validity')}/>
							</div>
						</Col>
						<Col span={4}  className="form-group-item">
							<div className="form-group-item-heading">课程数量</div>
							<div className="form-group-item-body">
								<Input value={courseNum}
									placeholder='课程数量'
									onChange={this.handleInputChange.bind(this, 'courseNum')}/>
							</div>
						</Col>
						<Col span={1}/>
						<Col span={4}>
							<Button onClick={this.handleCreateFreeCourseLink.bind(this)}>生成邀请链接</Button>
						</Col>
					</Row>
					<Row className='mt-8'>
						<Col span = {24}>{freeCourseLink}</Col>
					</Row>
				</Card>
				<div className='h-30 layout-bg'/>
				<Card title='...'>
					<Button onClick={this.authorize.bind(this)}>This is a magic button.</Button>
				</Card>

				{bannerModal &&
					<Modal
						visible={bannerModal}
						title = 'Banner'
						width = {600}
						className = {`${prefix}`}
						onCancel={this.handleCloseModal.bind(this)}
						maskClosable = {false}
						footer = {
							[
								<Button key="back" className='btn-cancel' onClick={this.handleCloseModal.bind(this)}>取消</Button>,
								<Button key="submit" className="button-green white" onClick={this.handleUpdateBanner.bind(this)}>
									保存
								</Button>
							]
						}
					>
						<Row className="mb-8">
							<Col span={24} className="form-group-item">
								<div className="form-group-item-heading">名称</div>
								<div className="form-group-item-body">
									<Input value={banner.name || ''}
										onChange={this.handleBannerModalInputChange.bind(this, 'name')}/>
								</div>
							</Col>
							
						</Row>
						<Row className="mb-8">
							<Col span={24} className="form-group-item">
								<div className="form-group-item-heading">排序值</div>
								<div className="form-group-item-body">
									<Input value={banner.bannerOrder || ''}
										placeholder='输入数字, 值越小越靠前'
										onChange={this.handleBannerModalInputChange.bind(this, 'bannerOrder')}/>
								</div>
							</Col>
						</Row>
						<Row className="mb-8">
							<Col span={24} className="form-group-item">
								<div className="form-group-item-heading">链接地址</div>
								<div className="form-group-item-body">
									<Input value={banner.link || ''}
										onChange={this.handleBannerModalInputChange.bind(this, 'link')}/>
								</div>
							</Col>
						</Row>
						<Row className="mb-8">
							<Col span={24} className="form-group-item">
								<div className="form-group-item-heading">图片</div>
								<div className="form-group-item-body text-left">
									<Avatar className='w-70p' icon={banner.bannerImg ? null : 'plus-square-o'} 
										shape='square' size='large' 
										src={banner.bannerImg ? banner.bannerImg : null} 
										onClick={this.handleSelectImg.bind(this)}/>
								</div>
							</Col>
						</Row>
						<input type='file' className='display-none' ref='fileInput' accept='image/jpeg,image/png'
							onChange={this.handleFileChange.bind(this)}/>
					</Modal>
				}
			</div>
		)
	}
	handleBannerModalInputChange(f, e) {
		let {banner} = this.state
		banner[f] = e.target.value
		this.setState({banner})
	}
	handleInputChange(f, e) {
		this.setState({[f] : e.target.value})
	}
	handleShowBannerModal(banner) {
		let copiedBanner = {}
		Object.assign(copiedBanner, banner)
		this.setState({banner: copiedBanner, bannerModal: true})
	}
	handleUpdateBanner(){
		let {banner} = this.state
		SETTINGS.updateBanner(banner).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({bannerModal: false}, this.getBannerList)
		})
	}
	handleRemoveBanner(banner) {
		SETTINGS.removeBanner(banner.id).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.getBannerList()
		})
	}
	handleCloseModal(){
		this.setState({bannerModal: false})
	}
	handleSelectImg() {
		this.refs.fileInput.click();
	}
	handleFileChange(e) {
		let files = this.refs.fileInput.files;
		if (files) {
			let file = files[0];
			let formData = new FormData();
			formData.append('imgFile', file);
			CONTENT.uploadImg(formData).then(res => {
				if (res.success) {
					let {banner} = this.state
					banner.bannerImg = res.vo
					this.setState({banner})
				} else {
					NoticeError(res.messages)
				}
				this.refs.fileInput.value = null;
			})
		}
	}
	handleCreateFreeCourseLink() {
		let {courseNum, validity} = this.state
		SETTINGS.createFreeCourseLink(courseNum, validity).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({freeCourseLink: res.vo})
		})
	}
	authorize() {
		SETTINGS.getAuthorizeParams().then(res => {
			let url = 'https://mp.weixin.qq.com/safe/bindcomponent?action=bindcomponent&auth_type=3&no_scan=1&component_appid='+res.vo.componentAppId+'&pre_auth_code='+res.vo.preAuthCode+
				'&redirect_uri=http://t.hotelpal.cn/hotelpal/thirdParty/authorizerCallback#wechat_redirect'
			window.location.href=url
		})
	}
}
const BANNER_COLUMNS = [
	{dataIndex: 'bannerOrder', title: '排序'},
	{dataIndex: 'name', title: '名称'},
	{dataIndex: 'link', title: '地址'},
	{dataIndex: 'op', title: '操作'},
]
