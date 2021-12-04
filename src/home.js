import React from 'react'
import './home.css'
import 'antd/dist/antd.css'
import { Layout, Menu,Button} from 'antd'
import { UserOutlined,PlusOutlined} from '@ant-design/icons'
import Select from './select.js'
import Message from './message'
const { Content, Sider } = Layout
const WStar = require('libp2p-webrtc-star')
const PeerId = require('peer-id')
const {Multiaddr} = require('multiaddr')
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            peoples:[]
        }
    }
    componentWillMount() {
        if(!this.props.location.state)window.location.replace("login")
        const {privKey}=this.props.location.state
        if(!privKey)window.location.replace("login")
        PeerId.createFromPrivKey(Buffer.from(privKey,'base64')).then(localPeer=>{
            this.setState({localPeer:localPeer})
            const ws=global.ws=new WStar({ 
                upgrader:{
                    upgradeInbound: maConn => maConn,
                    upgradeOutbound: maConn => maConn,
                    localPeer
                }
            })
            ws.createListener(socket => {
                socket.conn.on('data',data=>{
                    let mess=JSON.parse(data.toString())
                    let {userId,body}=mess
                    let people=this.state.peoples.find(p=>p.id==userId)
                    if(!people){
                        people={id:userId,name:'新用户',socket:socket,mess:[]}
                        this.state.peoples.push(people)
                    }
                    body&&people.mess.push(body)
                    this.setState({})
                })
            }).listen(new Multiaddr('/ip4/47.241.176.115/tcp/13579/wss/p2p-webrtc-star/p2p/'+localPeer.toB58String()))
        }).catch(e=>window.location.replace("login"))
    }
    render(){
        return(
            <div style={{width:'100%',height:'100%'}}>
                <Select visible={this.state.showSelect} ok={userId=>{
                    global.ws.dial(new Multiaddr('/ip4/47.241.176.115/tcp/13579/wss/p2p-webrtc-star/p2p/'+userId)).then(socket=>{
                        this.state.peoples.push({id:userId,name:'新用户',socket:socket,mess:[]})
                        socket.conn.send(JSON.stringify({userId:userId}))
                        this.setState({})
                    })
                }} close={()=>this.setState({showSelect:undefined})}/>
                <Layout style={{width:'100%',height:'100%'}}>
                    <Sider style={{background:'#f0f0f0'}}>
                        <div align="center" style={{height:'40px',lineHeight:'40px',fontSize:'24px',background:'#d8d8d8',color:'white'}}>
                            <p>TK</p>
                        </div>
                        <div style={{width:'100%',height:'35px',float:'left'}}>
                            <Button icon={<PlusOutlined/>} onClick={()=>{
                                this.setState({showSelect:true})
                            }} style={{width:'100%',height:'100%'}}></Button>
                        </div>
                        <Menu mode="inline">
                            {this.state.peoples.map(people=><Menu.Item style={{margin:'0px',background:'#f0f0f0'}} icon={<UserOutlined />} onClick={()=>{
                                this.setState({people:people})
                            }}>
                                {people.name}
                            </Menu.Item>)}
                        </Menu>
                    </Sider>
                    <Content>
                    <div style={{width:'100%',height:'100%'}}>
                        <div style={{width:'100%',height:'40px'}}>
                            {this.state.localPeer?<p>{this.state.localPeer.toB58String()}</p>:null}
                        </div>
                        <div style={{width:'100%',height:'calc(100% - 40px)'}}>
                            {this.state.people?<Message people={this.state.people}></Message>:null}
                        </div>
                    </div>
                    </Content>
                </Layout>
            </div>
        )
    }
}
export default Home