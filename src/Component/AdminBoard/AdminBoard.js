import React from 'react'
import SettingLogo from '../../assets/image/settings.svg'
import {Link, useHistory} from 'react-router-dom'

class AdminBoard extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      "saloons": null,
      "view_setting": false
    }
  }
  unLogged = (e) => {
    let reset_cookie = this.props.setUserCookie
    let date = new Date()
    date.setDate(date.getDate()+1)
    reset_cookie("name", "", {path: '/', maxAge: 60, expire: date})
    reset_cookie("password", "", {path: '/', maxAge: 60, expire: date})
    this.props.stateLogoff()
  }
  toggle_setting = (e) => {
    this.setState({"view_setting": !this.state.view_setting})
  }
  choose_saloon = (e) => {
    let data_to_send = {
      "call": "getAll_saloon"
    }
    fetch('http://api-coiffure.victorbarlier.fr/saloon.php',{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      this.setState({"saloons": data})
    })
  }
  componentDidMount(){
    this.choose_saloon()
  }
  render(){
    return(
      <div className="AdminBoardContainer">
        <div className="AdminContent">
          <div className="AdminSaloon">
          <div className="AdminDeco "></div>
          <div className="AdminInputContainer">
            <div className="AdminInputSheet">
              <div className="AdminSText">
                <p>Salon: <span>{this.props.saloon_name}</span></p>
              </div>
              <div className="SheetDeco"></div>
            </div>
            <div className="ChooSaloon">
              <SelectSaloon saloons={this.state.saloons} selectedSaloon={this.props.saloon_name}/>
            </div>
          </div>
          </div>
          <div className="AdminPanel">
            <div onClick={this.toggle_setting} className="PanelButton">
              <div className="enc_PanelButton">
                <img src={SettingLogo} />
              </div>
            </div>
          </div>
          {this.state.view_setting ? <SettingBoard unLogged={this.unLogged}/> : ""}
        </div>
      </div>
    )
  }
}
export default AdminBoard

function SelectSaloon({saloons, selectedSaloon}){
  if (saloons === null) {
    return(
      <div>
      </div>
    )
  }else {
    if (saloons.length > 1) {
      return(
        <div className="SelectSaloonBoard">
          {saloons.map((saloon)=>(
            <Link key={saloon.name+saloon.id} to={saloon.path} state={{idSaloon: saloon.id}}>
              <div className="SelecterContainer">
                <div className="SelecterText">
                  <p>{saloon.name}</p>
                </div>
                <ActivatedSaloon selectedSaloon={selectedSaloon} saloonChoice={saloon.name} />
              </div>
            </Link>
          ))}
        </div>
      )
    }else {
      return(
        <div>
        </div>
      )
    }
  }
}

function ActivatedSaloon({selectedSaloon, saloonChoice}){
  if (selectedSaloon === saloonChoice) {
    return(
      <div className="SelecterView sbg"></div>
    )
  }else {
    return(
      <div className="SelecterView"></div>
    )
  }
}
function SettingBoard({unLogged}){
  return(
    <div className="SettingBoard">
      <button onClick={unLogged} type="button" className="but_stop">Déconnexion</button>
    </div>
  )
}
