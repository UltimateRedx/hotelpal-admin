import React from 'react'
import {Table, Pagination, Row, Button, Icon,Avatar, message, Popconfirm, Divider, Layout} from 'antd'
import moment from 'moment'
import {NoticeMsg,NoticeError} from 'scripts/utils/index'
import {COUPON} from 'scripts/remotes/index'

export default class Coupon extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			currentPage: 1,
			pageSize: 10,
			voTotal: 0,
			couponList:[],

		}
	}
	componentDidMount() {
		COUPON.getSysCoupon(this.state).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({couponList: res.voList, currentPage: res.pageNumber, voTotal: res.voTotal})
		})
	}


	render() {
		let {courseList, courseModal, voTotal, currentPage, courseData} = this.state;
		
		return (
			<div className={prefix}>
				<Row className='mb-20 pt-10 pl-15'>
					<Button icon='plus' onClick={this.handleAddCourse.bind(this)}>添加课程</Button>
				</Row>
				<Table 
					columns={COURSE_COLUMNS}
					dataSource={list}
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

				{courseModal &&
					<CourseModal
						visible={courseModal}
						onClose={this.handleCloseModal.bind(this)}
						data = {courseData}
					/>
				}
			</div>
		)
	}
}