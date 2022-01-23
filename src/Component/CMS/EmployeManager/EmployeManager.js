import React from "react"
import {Link, useLocation, useParams } from 'react-router-dom'
import AdminBoard from "../../AdminBoard/AdminBoard"
import ManagerView from '../ManagerView/ManagerView'

export default function EmployeManager({state_logoff, setUserCookie}){
  const location_saloon = useLocation()
  let id_saloon = location_saloon.state.idSaloon
  return(
    <EmployeEngine saloonId={id_saloon} state_logoff={state_logoff} setUserCookie={setUserCookie}/>
  )
}
class EmployeEngine extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      "modal_state": false,
      "employe_data": null
    }
  }
  open_modal_e = (e) => {
    this.setState({"modal_state": true})
    console.log('fuck');
  }
  close_modal_e = (e) => {
    this.setState({"modal_state": false})
  }
  getAll_Employe = (e) => {
    let data_to_send = {
      "call": "get_all",
      "id_saloon": this.props.saloonId
    }
    fetch('http://api-coiffure.victorbarlier.fr/personnel.php',{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      this.setState({"employe_data": data})
    })
  }
  add_employe = (e) => {
    e.preventDefault()
    let data_to_send = {
      "call": "add",
      "name": e.target[0].value,
      "nickname": e.target[1].value,
      "poste": e.target[2].value,
      "contrat": e.target[3].value,
      "color": e.target[4].value,
      "id_saloon": e.target[7].value
    }
    fetch('http://api-coiffure.victorbarlier.fr/personnel.php',{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      if (data.success) {
        this.getAll_Employe()
        this.close_modal_e()
      }
    })
  }
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
    this.getAll_Employe()
  }
  render(){
    return(
      <div>
        <EmployeContent getAllEmploye={this.getAll_Employe} employeData={this.state.employe_data} addEmploye={this.add_employe} closeModal={this.close_modal_e} openModal={this.open_modal_e} modalState={this.state.modal_state} stateLogoff={this.props.state_logoff} setUserCookie={this.props.setUserCookie}/>
      </div>
    )
  }
}

function EmployeContent({getAllEmploye, employeData, addEmploye, openModal, closeModal, modalState, stateLogoff, setUserCookie}){
  const location = useLocation()
  let id_saloon = location.state.idSaloon
  let { saloon } = useParams()
  console.log(id_saloon);
  let saloon_path = "/" + saloon
  return(
    <div className="bg CMSContainer">
      <AdminBoard saloon_name={saloon} stateLogoff={stateLogoff} setUserCookie={setUserCookie}/>
      <ManagerView view="employe" getAllProduct={getAllEmploye} productData={employeData} openModal={openModal} saloon_name={saloon} saloonId={id_saloon} />
      {modalState ? <EmployeModal addEmploye={addEmploye} saloonId={id_saloon} closeModal={closeModal} /> : ""}
    </div>
  )
}

function EmployeModal({addEmploye, saloonId, closeModal}){
  return(
    <div className="ProductModalContainer">
      <form onSubmit={addEmploye} id="ProductModalContainer" className="AddProductForm" >
        <h3 className="titleModal">Ajouter un salarié</h3>
          <div className="AddProductFormLine">
            <label htmlFor="addProductName">Nom</label>
            <input id="addProductName" type="text" name="addPName" placeholder="Nom du salarié" />
            <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductRef">Prénom</label>
            <input id="addProductRef" type="text" name="addPNickname" placeholder="Prénom du salarié" />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductPrice">Poste</label>
            <input id="addProductPrice" type="text" name="addPPoste" placeholder="Poste du salarié" />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductTime">Contrat</label>
            <input id="addProductTime" type="text" name="addPContrat" placeholder="Type de contrat" />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductFix">Couleur</label>
            <input id="addProductFix" className="colorput" type="color" name="addPColor"  />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine AddSubmitLine">
            <button onClick={closeModal} type="button" className="but_stop" >annuler</button>
            <button type="submit" className="btn_select addsub" >ajouter</button>
          </div>
          <input type="hidden" name="saloon_id" value={saloonId} />
          <input type="hidden" name="call" value="add_employe" />
      </form>
    </div>
  )
}
