import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {useCookies} from "react-cookie"
import Login from "../Login/Login"
import Saloon from "../Saloon/Saloon"
import CMS from "../CMS/CMS"
import ProductManager from "../CMS/ProductManager/ProductManager"
import PlanningManager from "../CMS/PlanningManager/PlanningManager"
import EmployeManager from "../CMS/EmployeManager/EmployeManager"

class Engine extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      "user_log": false
    }
  }
  state_login = (e) => {
    this.setState({"user_log": true})
  }
  state_logoff = (e) => {
    this.setState({"user_log": false})
  }
  render(){
    return(
      <Router>
        <EngineRouter user_log={this.state.user_log} state_login={this.state_login} state_logoff={this.state_logoff}/>
      </Router>
    )
  }
}
export default Engine

function EngineRouter({user_log, state_login, state_logoff}){
  console.log('test');
  let location = useLocation()
  let [userCookie, setUserCookie] = useCookies(['boss'])
  // console.log(JSON.parse(document.cookie));

  return(
    <Routes location={location}>
      <Route path="/" exact element={<Login user_log={user_log} setUserCookie={setUserCookie} state_login={state_login} state_logoff={state_logoff}/>}/>
      <Route path="/:saloon" element={user_log ? <CMS state_logoff={state_logoff} setUserCookie={setUserCookie} /> : <Navigate to="/" />}/>
      <Route path="/:saloon/service" element={user_log ? <ProductManager setUserCookie={setUserCookie} state_logoff={state_logoff} /> : <Navigate to="/" />}/>
      <Route path="/:saloon/planning" element={user_log ? <PlanningManager setUserCookie={setUserCookie} state_logoff={state_logoff} /> : <Navigate to="/" />}/>
      <Route path="/:saloon/personnel" element={user_log ? <EmployeManager setUserCookie={setUserCookie} state_logoff={state_logoff} /> : <Navigate to="/" />}/>
    </Routes>
  )
}
