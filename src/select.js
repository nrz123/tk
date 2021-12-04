import React from 'react'
import 'antd/dist/antd.css'
import { Input, Modal} from 'antd'
class Select extends React.Component {
    constructor(props) {
        super(props)
        this.state={}
    }
    render(){
        return(
            <Modal title={"添加朋友"} visible={this.props.visible} onOk={()=>{
                this.props.ok(this.state.userId)
                this.props.close()
            }} onCancel={this.props.close}>
                <Input value={this.state.userId} onChange={e=>{
                    this.setState({userId:e.target.value})
                }}></Input>
            </Modal>
        )
    }
}
export default Select