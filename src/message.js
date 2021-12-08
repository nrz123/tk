import React from 'react'
import './home.css'
import 'antd/dist/antd.css'
import {Input,Button} from 'antd'
import HSplit from './hsplit.js'
const { TextArea } = Input
class Message extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            topHeight:360
        }
    }
    render(){
        return(
            <div style={{width:'100%',height:'100%'}}>
                <HSplit top={<div style={{width:'100%',height:'100%'}}>
                    {this.props.people.mess.map(p=><p align={p.align}>{p.text}</p>)}
                </div>} bottom={
                    <div style={{width:'100%',height:'100%'}}>
                        <div style={{width:'100%',height:'30px'}}></div>
                        <TextArea style={{width:'100%',height:'calc(100% - 80px)'}} value={this.state.text} onChange={e=>{
                            this.setState({text:e.target.value})
                        }}></TextArea>
                        <Button style={{width:'100%'}} onClick={()=>{
                            this.props.people.socket.conn.send(JSON.stringify({userId:this.props.localPeer.toB58String(),body:this.state.text}))
                            this.props.people.mess.push({text:this.state.text,align:'right'})
                            this.setState({text:''})
                        }}>发送消息</Button>
                    </div>
                } topHeight={this.state.topHeight} move={e=>{
                    this.setState({topHeight:e.clientY-e.currentTarget.offsetTop})
                }}></HSplit>
            </div>
        )
    }
}
export default Message