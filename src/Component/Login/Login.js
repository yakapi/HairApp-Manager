import React from 'react'
import {Link} from 'react-router-dom'
import Saloon from "../Saloon/Saloon"
class Login extends React.Component{
  login_auth = (e) => {
    e.preventDefault()
    console.log(e.target[2]);
    let data_to_send = {
      "call": e.target[2].value,
      "name": e.target[0].value,
      "password": e.target[1].value
    }
    fetch('http://api-coiffure.victorbarlier.fr/boss_info.php',{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      if (data.success == true) {
        let save_boss = this.props.setUserCookie
        let date = new Date()
        date.setDate(date.getDate()+1)
        save_boss("name", e.target[0].value, {path: '/', maxAge: 3600, expire: date})
        save_boss("password", e.target[1].value, {path: '/', maxAge: 3600, expire: date})
        this.props.state_login()
      }
    }).catch((error)=>{
      console.log('error fetch');
    })
  }
  render(){
    return(
      <div>
        {this.props.user_log ? <Saloon state_logoff={this.props.state_logoff} /> : <ConnectForm login_auth={this.login_auth}/>}
      </div>
    )
  }
}
export default Login

function ConnectForm({login_auth}){
  return(
    <div className="ConnectBossContainer bg">
    <form className="neon boss_form" onSubmit={login_auth} >
    <h1 className="man-title">Manager</h1>
    <input type="text" name="boss_name" placeholder="login" />
    <input type="password" name="boss_password" placeholder="password" />
    <input type="hidden" name="call_boss" value="boss_info"/>
    <button type="submit" className="btn btn-primary -btn-block btn-large" name="boss_log">Connexion</button>
    </form>
    </div>
  )
}
