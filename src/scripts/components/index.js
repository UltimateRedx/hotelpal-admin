import React from 'react'
import {Link} from 'react-router'
import {Layout, Menu} from 'antd'
const {Sider, Header} = Layout
const {Item} = Menu

require('styles/index.less')
const prefix = 'navigation'
export default class Navigation extends React.Component {
	render() {
		return (
			<Layout className={prefix}>
				<Sider collapsible={true} className='sider'>
					<Menu selectable={false}><Item><Link to='/hotelpal/statistics'>数据统计</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/settings'>配置</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/speaker'>主讲人</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/course'>订阅专栏</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/lessonSelf'>成长专栏</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/user'>用户管理</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/order'>订单管理</Link></Item></Menu>
					
					<Menu selectable={false}><Item><Link to='/hotelpal/liveCourse'>直播课程</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/ppt'>直播PPT</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/coupon'>优惠券</Link></Item></Menu>
					<Menu selectable={false}><Item><Link to='/hotelpal/courseCourier'>添加课程</Link></Item></Menu>
					
				</Sider>
				<Layout>
					<div className='container'>
						{this.props.children}
					</div>
				</Layout>
			</Layout>
		)
	}
}