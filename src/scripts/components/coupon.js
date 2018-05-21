import React from 'react'
import {Table, Pagination, Row, Button, Popconfirm, Divider} from 'antd'
import moment from 'moment'
import {NoticeMsg,NoticeError,Utils} from 'scripts/utils/index'
import {COUPON} from 'scripts/remotes/index'
import CouponModal from 'scripts/components/modal/couponModal'

const prefix = 'coupon'
export default class Coupon extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			currentPage: 1,
			pageSize: 10,
			voTotal: 0,
			couponList:[],
			couponModal: false,
			couponData: {},
		}
	}
	componentDidMount() {
		this.getPageList()
	}
	getPageList() {
		// COUPON.getSysCoupon(this.state).then(res => {
		// 	if (!res.success) {
		// 		NoticeError(res.messages)
		// 		return
		// 	}
		// 	this.setState({couponList: res.voList, currentPage: res.pageNumber, voTotal: res.voTotal})
		// })
	}
	addCoupon() {
		this.setState({couponModal: true, couponData: {}})
	}

	render() {
		let {couponList, couponModal, voTotal, currentPage, couponData} = this.state;
		let dataList = couponList.map(coupon => {
			coupon.createTimeStr = Utils.formatDateTime(coupon.createTime)
			coupon.validityStr = Utils.formatDateTime(validity)
			return coupon
		})
		return (
			<div className={prefix}>
				<Row className='mb-20 pt-10 pl-15'>
					<Button icon='plus' onClick={this.addCoupon.bind(this)}>添加优惠券</Button>
				</Row>
				<Table 
					columns={COUPON_COLUMN}
					dataSource={dataList}
					pagination = {false}
				/>
				<div className='pagination'>
					<Pagination 
						size="small" 
						total={voTotal} 
						current={currentPage} 
						onChange={this.onChangePage.bind(this)}
						showTotal={this.paginationTotalRender.bind(this)}
					/>
				</div>

				{couponModal &&
					<CouponModal
						visible={couponModal}
						onClose={this.handleCloseModal.bind(this)}
						data = {couponData}
					/>
				}
			</div>
		)
	}
	onChangePage(page, pageSize) {
		this.setState({currentPage: page, pageSize}, this.getPageList);
	}
	paginationTotalRender(total, range) {
		return (
			<span>{range[0]}-{range[1]}条，共{total}条</span>
		)
	}
	handleCloseModal(refresh) {
		this.setState({couponModal: false})
		if (refresh) {
			this.getPageList()
		}
	}
}
const COUPON_COLUMN = [
	{dataIndex: 'name', title: '优惠券名称'},
	{dataIndex: 'value', title: '面额'},
	{dataIndex: 'total', title: '数量'},
	{dataIndex: 'createTimeStr', title: '创建时间'},
	{dataIndex: 'validityStr', title: '有效期至'},
	{dataIndex: 'op', title: '操作'},
]