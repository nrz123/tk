import React from 'react'
import './home.css'
import 'antd/dist/antd.css'
import { Layout, Menu,Button} from 'antd'
import { UserOutlined,PlusOutlined} from '@ant-design/icons'
import Select from './select.js'
import Message from './message'
const { Content, Sider } = Layout
const Libp2p  =  require ('libp2p') 
const Mplex = require('libp2p-mplex')
const Bootstrap = require('libp2p-bootstrap')
const WebRTCStar   = require('libp2p-webrtc-star')
const PeerId = require('peer-id')
const { Multiaddr } = require('multiaddr')
const { NOISE } = require('@chainsafe/libp2p-noise')
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            peoples:[]
        }
    }
    async componentWillMount() {
        if(!this.props.location.state)window.location.replace("/#/login")
        const {privKey}=this.props.location.state
        if(!privKey)window.location.replace("/#/login")
        let localPeer=await PeerId.createFromPrivKey(Buffer.from(privKey,'base64'))
        console.log(localPeer)
        const libp2p = global.libp2p = await Libp2p.create({
            addresses: {
                listen: [
                    '/ip4/47.241.176.115/tcp/13579/wss/p2p-webrtc-star',
                ]
            },
            peerId:localPeer,
            modules: {
                transport: [WebRTCStar],
                connEncryption: [NOISE],
                streamMuxer: [Mplex],
            }
        })
        libp2p.on('peer:discovery', (peerId) => {
            console.log(`Found peer ${peerId.toB58String()}`)
        })
        
        libp2p.connectionManager.on('peer:connect', (connection) => {
            console.log(`Connected to ${connection.remotePeer.toB58String()}`)
        })
        libp2p.connectionManager.on('peer:disconnect', (connection) => {
            console.log(`Disconnected from ${connection.remotePeer.toB58String()}`)
        })

        await libp2p.start()
        console.log(`libp2p id is ${libp2p.peerId.toB58String()}`)
        this.setState({localPeer:localPeer})
    }
    render(){
        return(
            <div style={{width:'100%',height:'100%'}}>
                <Select visible={this.state.showSelect} ok={userId=>{
                    if(this.state.peoples.find(p=>p.id==userId))return
                    global.libp2p.dial(new Multiaddr('/ip4/47.241.176.115/tcp/13579/wss/p2p-webrtc-star/p2p/'+userId)).then(connection=>{
                        console.log(connection)
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
                            {this.state.people?<Message people={this.state.people} localPeer={this.state.localPeer}></Message>:null}
                        </div>
                    </div>
                    </Content>
                </Layout>
            </div>
        )
    }
}
export default Home