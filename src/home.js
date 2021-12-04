import React from 'react'
import './home.css'
import 'antd/dist/antd.css'
import { Layout, Menu,Button,message} from 'antd'
import { UserOutlined,PlusOutlined} from '@ant-design/icons'
import Select from './select.js'
import Message from './message'
const { Content, Sider } = Layout
const pipe = require('it-pipe')
const all = require('it-all')
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
            ws.createListener((conn) => {
                console.log(conn)
            }).listen(new Multiaddr('/ip4/47.241.176.115/tcp/13579/wss/p2p-webrtc-star/p2p/'+localPeer.toB58String()))
        }).catch(e=>window.location.replace("login"))
    }
    async componentDidMount() {
        // const localPeer1 = await PeerId.create()
        // console.log(localPeer1.toJSON())
        // const localPeer2 = await PeerId.create()
        // const addr1 = new Multiaddr('/ip4/47.241.176.115/tcp/13579/wss/p2p-webrtc-star/p2p/'+localPeer1.toB58String())
        // const addr2 = new Multiaddr('/ip4/47.241.176.115/tcp/13579/wss/p2p-webrtc-star/p2p/'+localPeer2.toB58String())
        // const ws1 = new WStar({ 
        //     upgrader:{
        //         upgradeInbound: maConn => maConn,
        //         upgradeOutbound: maConn => maConn,
        //         localPeer1
        //     }
        // })
        // const ws2 = new WStar({ 
        //     upgrader:{
        //         upgradeInbound: maConn => maConn,
        //         upgradeOutbound: maConn => maConn,
        //         localPeer2
        //     }
        // })
        // const listener1 = ws1.createListener((conn) => {
        //     console.log('new connection opened1')
        //     pipe(conn,conn)
        // })
        // const listener2 = ws2.createListener((conn) => {
        //     console.log('new connection opened2')
        //     pipe(conn,conn)
        // })
        // await listener1.listen(addr1)
        // await listener2.listen(addr2)
        // console.log('listening')
        // const [sigRefs] = ws2.sigReferences.values()
        // console.log(sigRefs.signallingAddr)
        // const conn = await ws1.dial(sigRefs.signallingAddr)
        // console.log('connect')
        // const data = Buffer.from('some data')
        // const values = await pipe(
        //     [data],
        //     conn,
        //     all
        // )
        // console.log(`Value: ${values.toString()}`)
        //await listener1.close()
        //await listener2.close()
    }
    render(){
        return(
            <div style={{width:'100%',height:'100%'}}>
                <Select visible={this.state.showSelect} ok={userId=>{
                    global.ws.dial(new Multiaddr('/ip4/47.241.176.115/tcp/13579/wss/p2p-webrtc-star/p2p/'+userId)).then(conn=>{
                        this.state.peoples.push({id:userId,name:'新用户',conn:conn,mess:[]})
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
                            <Message people={this.state.people}></Message>
                        </div>
                    </div>
                    </Content>
                </Layout>
            </div>
        )
    }
}
export default Home