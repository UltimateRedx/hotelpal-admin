import React from 'react'
import { Button, Row, Col, Avatar, Select} from 'antd'
import {CONTENT, LIVE_COURSE} from 'scripts/remotes/index'

import {NoticeMsg,NoticeError, Utils} from 'scripts/utils/index'
const {Option} = Select

const prefix = 'pptop'
export default class PPTOperation extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			uploading: false,
			draggingImg: '',
			draggingOverIndex: '',
			opLink: '',
			courseList: [],
			selectedCourseId:'',
			imgList: [
			
			]
		}
	}
	componentDidMount() {
		LIVE_COURSE.getLiveCoursePageList({pageSize: 50}).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({courseList: res.voList})
		})
	}
	getLiveImgList() {
		let {selectedCourseId} = this.state
		LIVE_COURSE.getLiveImgList(selectedCourseId).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({imgList: res.voList, opLink: res.vo})
		})
	}
	handleSave() {
		let {imgList,selectedCourseId} = this.state
		if (!imgList || imgList.length == 0 || !selectedCourseId) return
		LIVE_COURSE.updateCourseImage(selectedCourseId, imgList).then(res => {
			if (!res.success) {
				NoticeError(res.messages)
				return
			}
			this.setState({opLink: res.vo})
		})
	}
	handleDragStart(img, index, proxy, e) {
		let {imgList} = this.state
		imgList.splice(index, 1)
		this.setState({draggingImg: img, imgList}, ()=>{console.log('start', this.state)})
	}
	handleDragOver(proxy, e) {
		e.preventDefault()
		// let {imgList, draggingImg} = this.state
		// imgList.splice(index, 0, draggingImg)
		// this.setState({imgList}, ()=>{console.log(this.state)})
	}
	handleDragEnter(img, index, proxy, e) {
		console.log('enter', index)
		let {imgList, draggingImg} = this.state
		imgList.splice(index, 0, draggingImg)
		this.setState({imgList, draggingOverIndex: index}, ()=>{console.log(this.state)})
	}
	handleDragLeave(img, index, proxy, e) {
		console.log('leave', index)
		let {imgList, draggingImg, draggingOverIndex} = this.state
		if (!draggingOverIndex || draggingOverIndex != index) return
		imgList.splice(index, 1)
		this.setState({imgList, draggingOverIndex: ''}, ()=>{console.log(this.state)})
	}
	render() {
		let {imgList, opLink, courseList, selectedCourseId} = this.state
		courseList = courseList.map(course => {
			return (
				<Option key={course.id}>{course.title}</Option> 
			)
		})
		let list = imgList.map((img, index) => {
			return (
				<Avatar key={index} className='avatars p-15 pl-30 pr-0' shape='square' size='large' src={img} 
					// draggable
					// onDragStart={this.handleDragStart.bind(this, img, index)}
					// onDragOver={this.handleDragOver.bind(this)}
					// onDragEnter={this.handleDragEnter.bind(this, img, index)}
					// onDragLeave={this.handleDragLeave.bind(this, img, index)}
				/>
			)
		}).concat(<Avatar key={imgList.length} className='ml-30' icon='plus-square-o' shape='square' size='large' onClick={this.handleSelectImg.bind(this, 'bannerImg')}/>)
		return (
			<div className={prefix}>
				<div>
					{list}
				</div>
				<div className='footer w-100p'>
					<Select onChange={this.handleSelectChange.bind(this)} value={selectedCourseId}>
						{courseList}
					</Select>
					<Button onClick={this.handleSave.bind(this)}>{opLink ? '保存' : '保存并生成链接'}</Button>
					{!!opLink &&
						<div className='inline-block ml-30'>操作链接：{opLink}</div>
					}
				</div>
				<input type='file' className='display-none' ref='fileInput' accept='image/jpeg,image/png'
							onChange={this.handleFileChange.bind(this)}/>
			</div>
		)
	}

	handleSelectImg(f) {
		let {selectedCourseId} = this.state
		if (!selectedCourseId) {
			NoticeMsg("请先选择课程")
			return
		}
		this.refs.fileInput.click(f)
	}
	handleSelectChange(value) {
		this.setState({selectedCourseId: value}, this.getLiveImgList)
	}
	handleFileChange(e) {
		let files = this.refs.fileInput.files;
		if (files) {
			let file = files[0];
			let formData = new FormData();
			formData.append('imgFile', file);
			this.setState({uploading: true})
			CONTENT.uploadImg(formData).then(res => {
				if (res.success) {
					let {imgList} = this.state
					imgList.push(res.vo)
					this.setState({imgList})
				} else {
					NoticeError(res.messages)
				}
				this.refs.fileInput.value = null;
				this.setState({uploading: false})
			})
		}
	}
}