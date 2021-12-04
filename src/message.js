import React from 'react'
import './home.css'
import 'antd/dist/antd.css'
import {Input} from 'antd'
import HSplit from './hsplit.js'
const { TextArea } = Input
class Message extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            topHeight:360
        }
    }
    componentDidMount() {

    }
    render(){
        return(
            <div style={{width:'100%',height:'100%'}}>
                <HSplit top={<div style={{width:'100%',height:'100%'}}>
                </div>} bottom={
                    <div style={{width:'100%',height:'100%'}}>
                        <div style={{width:'100%',height:'30px'}}></div>
                        <TextArea style={{width:'100%',height:'calc(100% - 20px)'}}></TextArea>
                    </div>
                } topHeight={this.state.topHeight} move={e=>{
                    this.setState({topHeight:e.clientY-e.currentTarget.offsetTop})
                }}></HSplit>
            </div>
        )
    }
}
export default Message