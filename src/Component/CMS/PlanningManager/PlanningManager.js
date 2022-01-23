import React from "react"
import {Link, useLocation, useParams } from 'react-router-dom'
import AdminBoard from "../../AdminBoard/AdminBoard"
import ManagerView from '../ManagerView/ManagerView'

class PlanningManager extends React.Component{
  componentDidMount(){
    function isEmpty(str) {
      return (!str || str.length === 0 );
    }
    if(!isEmpty(document.cookie)){
      console.log(document.cookie);
      let user_cookie = {
        "call": "boss_info",
        "name": null,
        "password": null
      }
      let array_cookie = document.cookie.split("; ")
      console.log(array_cookie);
      for (var i = 0; i < array_cookie.length; i++) {
        let cookie_input = array_cookie[i].split("=")
        if (cookie_input[0] === "name") {
          user_cookie.name = cookie_input[1]
        }
        if (cookie_input[0] === "password") {
          user_cookie.password = cookie_input[1]
        }
      }
      fetch('http://api-coiffure.victorbarlier.fr/boss_info.php',{
        method: 'post',
        credentials: 'include',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: Object.entries(user_cookie).map(([k,v])=>{return k+'='+v}).join('&')
      }).then(response => response.json()).then(data => {
        if (!data.success) {
          this.props.state_logoff()
        }
      })
    }else {
      this.props.state_logoff()
    }
  }
  render(){
    return(
      <div>
        <PlanningContent stateLogoff={this.props.state_logoff} setUserCookie={this.props.setUserCookie}/>
      </div>
    )
  }
}
export default PlanningManager

function PlanningContent({stateLogoff, setUserCookie}){
  const location = useLocation()
  let id_saloon = location.state.idSaloon
  let { saloon } = useParams()
  console.log(saloon);
  let saloon_path = "/" + saloon
  return(
    <div className="bg CMSContainer">
      <AdminBoard saloon_name={saloon} stateLogoff={stateLogoff} setUserCookie={setUserCookie}/>
      <ManagerView view="planning" saloon_name={saloon} saloonId={id_saloon}/>
    </div>
  )
}
