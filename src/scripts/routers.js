import React from 'react'
import {Router, Route, IndexRedirect, hashHistory, Link} from 'react-router'
import {scrollTop} from 'scripts/utils/index'

import Navigation from 'scripts/components/index'
import Login from 'scripts/components/Login'
import Statistics from 'scripts/components/statistics'
import Speaker from 'scripts/components/speaker'
import Course from 'scripts/components/course'
import Lesson from 'scripts/components/lesson'
import LiveCourse from 'scripts/components/liveCourse/index'
import PPTOperation from 'scripts/components/liveCourse/PPTOperation'
import PPT from 'scripts/components/liveCourse/ppt'
import LessonSelf from 'scripts/components/lessonSelf'
import Users from 'scripts/components/users'
import Orders from 'scripts/components/order'
import Settings from 'scripts/components/settings'
import Coupon from 'scripts/components/coupon'
import CourseCourier from 'scripts/components/courseCourier'
import AuthManager from 'scripts/components/authManager'
const Container = (props) => props.children;
export default class Routers extends React.Component{

	render(){
		return (
			<Router history={hashHistory}>
				<Route path='/'>
					<IndexRedirect to='/login'/>
					<Route onEnter={scrollTop} path='login' component={Login}/>
				</Route>
				<Route path='/hotelpal' component={Navigation}>
					<IndexRedirect to='course'/>
					<Route onEnter={scrollTop} path='statistics' component={Statistics}/>
					<Route onEnter={scrollTop} path='speaker' component={Speaker}/>
					<Route onEnter={scrollTop} path='course' component={Container}>
						<IndexRedirect to='index'/>
						<Route onEnter={scrollTop} path='index' component={Course}/>
						<Route onEnter={scrollTop} path='lesson/:courseId' component={Lesson}/>
					</Route>
					<Route onEnter={scrollTop} path='lessonSelf' component={LessonSelf}/>>
					<Route onEnter={scrollTop} path='liveCourse' component={LiveCourse}/>
					<Route onEnter={scrollTop} path='ppt' component={PPTOperation}/>
					<Route onEnter={scrollTop} path='user' component={Users}/>
					<Route onEnter={scrollTop} path='order' component={Orders}/>
					<Route onEnter={scrollTop} path='settings' component={Settings}/>
					<Route onEnter={scrollTop} path='auth' component={AuthManager}/>
					<Route onEnter={scrollTop} path='coupon' component={Coupon}/>
					<Route onEnter={scrollTop} path='courseCourier' component={CourseCourier}/>
				</Route>
				<Route onEnter={scrollTop} path='/live/img/:token' component={PPT}/>
			</Router>
		)
	}
}