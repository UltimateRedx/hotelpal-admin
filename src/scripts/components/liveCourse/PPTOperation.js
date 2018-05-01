import React from 'react'
import { Button, Row, Col, Avatar } from 'antd'
import {CONTENT, LIVE_COURSE} from 'scripts/remotes/index'

import {NoticeMsg,NoticeError, Utils} from 'scripts/utils/index'


const prefix = 'ppt'
export default class PPTOperation extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			uploading: false,
			draggingImg: '',
			draggingOverIndex: '',
			imgList: [
			
			]
		}
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
		let {imgList} = this.state
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
				<input type='file' className='display-none' ref='fileInput' accept='image/jpeg,image/png'
							onChange={this.handleFileChange.bind(this)}/>
			</div>
		)
	}

	handleSelectImg(f) {
		this.refs.fileInput.click(f)
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