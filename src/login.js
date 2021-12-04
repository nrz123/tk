import React from 'react'
import 'antd/dist/antd.css'
import './login.css'
import { Form, Input, Button} from 'antd'
const { TextArea } = Input;
const PeerId = require('peer-id')
export default function Login(props){
    const [form] = Form.useForm()
    return(
        <div style={{
            width:'100%',
            heiht:'100%',
            position: 'relative'
        }}>
            <Form
                form={form}
                initialValues={{
                    remember: true,
                }}
                onFinish={values=>{
                    const{privKey}=values
                    if(!privKey)return
                    props.history.push({
                        pathname: 'home',
                        state: {privKey: privKey}
                    })
                }}
                style={{
                    position:'absolute',
                    left:'50%',
                    transform: 'translateX(-50%)',
                    top:'20px',
                    width:'800px'
                }}
            >
                <Form.Item name="privKey">
                    <TextArea style={{height:'400px'}}
                        placeholder="请输入密钥"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{width:"100%"}}>
                        登录
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button style={{width:"100%"}} onClick={()=>{
                        PeerId.create().then(id=>{
                            // console.log(id.toJSON().privKey)
                            // console.log(Buffer.from(id.toJSON().privKey,'base64'))
                            // PeerId.createFromPrivKey(id.privKey.bytes).then(id=>{
                            //     console.log(id.toJSON())
                            // })
                            form.setFieldsValue({privKey: id.toJSON().privKey})
                        })
                    }}>
                        新用户
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
