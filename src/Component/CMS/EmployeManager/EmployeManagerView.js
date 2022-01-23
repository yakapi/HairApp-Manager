import React from 'react'
import PropTypes from 'prop-types'

class EmployeManagerView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      "modal_update_state": false,
      "modal_update_data": {
        "id": null,
        "name": null,
        "nickname": null,
        "contrat": null,
        "color": null,
        "id_saloon": null,
        "poste": null,
      }
    }
  }
  delete_employe = (e) => {
    let data_to_send = {
      "call": "delete",
      "id": e.target.value
    }
    fetch("http://api-coiffure.victorbarlier.fr/personnel.php",{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      if (data.success) {
        this.props.getAllEmploye()
      }
    })
  }
  update_modal = (e) => {
      e.preventDefault()
      let data_to_send = {
        "call": "update",
        "name": e.target[0].value,
        "nickname": e.target[1].value,
        "poste": e.target[2].value,
        "contrat": e.target[3].value,
        "color": e.target[4].value,
        "id": e.target[7].value
      }
      fetch('http://api-coiffure.victorbarlier.fr/personnel.php',{
        method: 'post',
        credentials: 'include',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
      }).then(response => response.json()).then(data => {
        if (data.success) {
          this.props.getAllEmploye()
          this.close_update_modal()
        }
      })

  }

  open_update_modal = (e) => {
    let data_to_send = {
      "call": "single",
      "id": e.target.value
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
      this.setState({"modal_update_data": data[0]})
      this.setState({"modal_update_state": true})
    })
  }
  close_update_modal = (e) => {
    let close_update = {
      "id": null,
      "name": null,
      "nickname": null,
      "contrat": null,
      "color": null,
      "id_saloon": null,
      "poste": null,
    }
    this.setState({"modal_update_data": close_update})
    this.setState({"modal_update_state": false})
  }
  render () {
    return(
      <div className="ProductManagerView">
        <EmployeManagerViewEngine deleteEmploye={this.delete_employe} openModalUpdate={this.open_update_modal} employeData={this.props.employeData} openModal={this.props.openModal} />
        {this.state.modal_update_state ? <ModalUpdateEmploye updateModal={this.update_modal} closeUpdate={this.close_update_modal} updateData={this.state.modal_update_data}/> : ""}
    </div>
    )
  }
}

export default EmployeManagerView;

function EmployeManagerViewEngine({deleteEmploye, openModal, openModalUpdate, employeData}){
  let card_array = [];
  function isEmpty(str) {
    return (!str || str.length === 0 );
  }
  if (!isEmpty(employeData)) {
    card_array = employeData
  }
  return(
    <div className="ProductManagerViewEngine">
      <div className="ViewHeader">
        <div className="ViewHeaderLeft">
          <p>Gestion du personnel</p>
        </div>
        <div>
          <button onClick={openModal} type="button" className="btn_select">Ajouter un salarié</button>
        </div>
      </div>
      <div className="ProdBoard">
        {card_array.map((product_card) =>(
          <div key={product_card.name+product_card.id} className="ProductCard">
          <div className="ProductCardLeft">
          <div className="ProductIcon" >
          <div className="enc_Employe" style={{background: product_card.color}} >
          </div>
          </div>
          <div className="EmployeReference">
          <p className="secTitle">Nom:</p>
          <p className="secValue">{product_card.name}</p>
          </div>
          <div className="ProductName">
          <p className="secTitle">Prénom:</p>
          <p className="secValue">{product_card.nickname}</p>
          </div>
          </div>
          <div className="ProductCardRight">
          <div className="ProductPrice">
          <p className="secTitle">Poste:</p>
          <p className="secValue">{product_card.poste}</p>
          </div>
          <div className="ProductTime">
          <p className="secTitle">Contrat:</p>
          <p className="secValue">{product_card.contrat}</p>
          </div>
          <div className="ProductAction">
          <button onClick={openModalUpdate} type="button" value={product_card.id} className="btn_select">modifier</button>
          <button onClick={deleteEmploye} type="button" value={product_card.id} className="but_stop">supprimer</button>
          </div>
          </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ModalUpdateEmploye({updateModal, updateData, closeUpdate}){
  return(
    <div className="ModalUpdateProduct">
      <form onSubmit={updateModal} id="ProductModalContainer" className="AddProductForm" >
        <h3 className="titleModal">Modifier les infos</h3>
          <div className="AddProductFormLine">
            <label htmlFor="addProductName">Nom</label>
            <input id="addProductName" type="text" name="addProductName" placeholder="Nom du salarié" defaultValue={updateData.name}/>
            <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductRef">Prénom</label>
            <input id="addProductRef" type="text" name="addProductRef" placeholder="Prénom du salarié" defaultValue={updateData.nickname} />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductPrice">Poste</label>
            <input id="addProductPrice" type="text" name="addProductPrice" placeholder="Poste du salarié" defaultValue={updateData.poste} />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductTime">Contrat</label>
            <input id="addProductTime" type="text" name="addProductTime" placeholder="Contrat du salarié" defaultValue={updateData.contrat}/>
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductFix">Couleur</label>
            <input id="addProductFix" className="colorput" type="color" name="addPColor" defaultValue={updateData.color} />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine AddSubmitLine">
            <button onClick={closeUpdate}   type="button" className="but_stop" >annuler</button>
              <button type="submit" className="btn_select addsub" >ajouter</button>
          </div>
          <input type="hidden" name="id" value={updateData.id}/>
      </form>
    </div>
  )
}
