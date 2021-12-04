import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {ConfigProvider } from 'antd'
import Login from './login'
import Home from './home.js'
import zhCN from 'antd/es/locale/zh_CN'
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router >
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/home" component={Home} />
      </Router>
    </ConfigProvider>
  )
}
export default App