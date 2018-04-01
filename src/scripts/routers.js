import React from 'react'
import {Router, Route, IndexRedirect, hashHistory, Link} from 'react-router'
import classNames from 'classnames'
import {scrollTop} from 'scripts/utils/index'

import Navigation from 'scripts/components/index'
import Login from 'scripts/components/Login'
import Statistics from 'scripts/components/statistics'
import Speaker from 'scripts/components/speaker'
import Course from 'scripts/components/course'

export default class Routers extends React.Component{

	render(){
		return (
			<Router history={hashHistory}>
				<Route path='/' component={Navigation}>
					<IndexRedirect to='intro'/>
					<Route onEnter={scrollTop} path='statistics' component={Statistics}/>
					<Route onEnter={scrollTop} path='speaker' component={Speaker}/>
					<Route onEnter={scrollTop} path='course' component={Course}/>
					
				</Route>
			</Router>
		)
	}
}