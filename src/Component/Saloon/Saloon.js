import React from 'react'
import {Link, useHistory} from 'react-router-dom'


class Saloon extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      "modal": false,
      "saloon": null
    }
  }
  open_modal_saloon = (e)=>{
    this.setState({"modal": true})
  }
  close_modal_saloon = (e) => {
    this.setState({"modal": false})
  }
  saloon_available = (e) => {
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
    }).then(response => response.json()).then(data =>{
      this.setState({"saloon": data})
    })
  }
  componentDidMount(){
      console.log('mount');
      this.saloon_available()
  }
  render(){
    return(
      <div className="ConnectBossContainer bg">
        <div className="SaloonContainer">
          <GetSaloon saloon={this.state.saloon}/>
          <AddSaloon open_modal={this.open_modal_saloon}/>
          {this.state.modal ? <ModalSaloon saloon_available={this.saloon_available} close_modal={this.close_modal_saloon}/> : ""}
        </div>
      </div>
    )
  }
}
export default Saloon

function AddSaloon({open_modal}){
  return(
    <div>
      <div className="button-wrap">
        <button onClick={open_modal} id="plous" className="button_saloon plous" type="button">+<span>Ajoutez un salon</span></button>
      </div>
    </div>
  )
}
function GetSaloon({saloon}){
  if (saloon !== null) {
    return(
      <div className="SaloonAvailableBoard">
      {saloon.map((single_saloon) => (
        <Link key={single_saloon.id+single_saloon.name} test="test" to={single_saloon.path} state={{idSaloon: single_saloon.id}}>
        <div className="button-wrap">
            <button className="button_saloon" type="button">{single_saloon.name}<span>Ouvrir le Salon</span></button>
        </div>
        </Link>
      ))}
      </div>
    )
  }else {
    return(
      <div className="SaloonAvailableBoard"></div>
    )
  }
}
function ModalSaloon({close_modal, saloon_available}){
  let add_saloon = (e) => {
    e.preventDefault()
    console.log(e.target[1]);
    let data_to_send = {
      "call": e.target[0].value,
      "name": e.target[1].value,
      "path": "/"+e.target[1].value
    }
    fetch('https://api-coiffure.victorbarlier.fr/saloon.php',{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      console.log(data);
      if (data.success === true) {
        saloon_available()
        close_modal()
      }
    })
    console.log('hello');
  }
  return(
    <div className="ModalSaloonZone">
      <div className="ModalSaloonContainer">
        <form onSubmit={add_saloon}>
          <h3>Ajouter un salon</h3>
          <input type="hidden" name="call_saloon" value="add_saloon" />
          <div className="ModalSaloonLine">
            <label htmlFor="saloon_name">Nommer le salon:</label>
            <input id="saloon_name" type="text" name="saloon_name" />
          </div>
          <div className="ModalSaloonLine Saloon_sub">
            <button onClick={close_modal} type="button" className="but_stop Saloon_stop">Annuler</button>
            <button type="submit" className="btn_select">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  )
}
