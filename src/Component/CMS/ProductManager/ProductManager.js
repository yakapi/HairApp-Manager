import React from "react"
import {Link, useLocation, useParams } from 'react-router-dom'
import AdminBoard from "../../AdminBoard/AdminBoard"
import ManagerView from '../ManagerView/ManagerView'

export default function ProductManager({state_logoff, setUserCookie}){
  const location_saloon = useLocation()
  let id_saloon = location_saloon.state.idSaloon
  return(
    <ProductEngine saloonId={id_saloon} state_logoff={state_logoff} setUserCookie={setUserCookie}/>
  )
}
class ProductEngine extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      "modal_state": false,
      "product_data": null
    }
  }
  getAll_product = (e) => {
    let data_to_send = {
      "call": "getAll_product",
      "type": "all",
      "id_saloon": this.props.saloonId
    }
    fetch('http://api-coiffure.victorbarlier.fr/product.php',{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      let data_product = {
        "select_type": "all",
        "data": data
      }
      this.setState({"product_data": data_product})

    })
  }
  getWomen_product = (e) => {
    let data_to_send = {
      "call": "getAll_product",
      "type": "women",
      "id_saloon": this.props.saloonId
    }
    fetch('http://api-coiffure.victorbarlier.fr/product.php',{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      let data_product = {
        "select_type": "women",
        "data": data
      }
      this.setState({"product_data": data_product})

    })
  }
  getMen_product = (e) => {
    let data_to_send = {
      "call": "getAll_product",
      "type": "men",
      "id_saloon": this.props.saloonId
    }
    fetch('http://api-coiffure.victorbarlier.fr/product.php',{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      let data_product = {
        "select_type": "men",
        "data": data
      }
      this.setState({"product_data": data_product})

    })
  }
  getKid_product = (e) => {
    let data_to_send = {
      "call": "getAll_product",
      "type": "kid",
      "id_saloon": this.props.saloonId
    }
    fetch('http://api-coiffure.victorbarlier.fr/product.php',{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      let data_product = {
        "select_type": "kid",
        "data": data
      }
      this.setState({"product_data": data_product})

    })
  }
  click_womenProduct = (e) => {
    this.getWomen_product()
  }
  click_allProduct = (e) => {
    this.getAll_product()
  }
  click_menProduct = (e) => {
    this.getMen_product()
  }
  click_kidProduct = (e) => {
    this.getKid_product()
  }
  add_product = (e) => {
    function isEmpty(str) {
      return (!str || str.length === 0 );
    }
    e.preventDefault()
    let error_array = document.querySelectorAll('.errorForm')
    console.log(error_array);
    console.log(e.target[6]);
    let error_state = true
    for (var i = 0; i < error_array.length; i++) {
      if (!isEmpty(error_array[i].innerHTML)) {
        error_array[i].innerHTML = null
      }
      if (isEmpty(e.target[i].value)) {
        error_array[i].innerHTML = "Veuillez remplir le champ"
        if (error_state == true) {
          error_state = false
        }
      }
    }
    if (error_state) {
      let data_to_send = {
        "call": "add_product",
        "name": e.target[0].value,
        "ref": e.target[1].value,
        "price": e.target[2].value,
        "time": e.target[3].value,
        "pose": e.target[4].value,
        "type": e.target[5].value,
        "id_saloon": e.target[8].value,
        "id_icon": "37",
        "path_icon": "https://api-coiffure.victorbarlier.fr/data-icon/integrate/integrate26.svg"
      }
      fetch('http://api-coiffure.victorbarlier.fr/product.php',{
        method: 'post',
        credentials: 'include',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
      }).then(response => response.json()).then(data => {
        let product_modal = document.getElementById('ProductModalContainer')
        let success_modal = document.createElement('div')
        let success_modal_css = {top: 0, height: "100%", width: "100%", position: "absolute", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000}
        Object.assign(success_modal.style, success_modal_css)
        let success_container = document.createElement('p')
        success_container.innerHTML = "Ajout effectué..."
        let success_container_css = {fontWeight: "bold", fontSize: "18px", padding: "25px 35px", background: "white", border: "1px solid lightgrey", boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)", borderRadius: "7px", textAlign: 'center'}
        Object.assign(success_container.style, success_container_css)
        success_modal.appendChild(success_container)
        product_modal.appendChild(success_modal)
        setTimeout(()=>{
          success_modal.remove()
          this.setState({"modal_state": false})
          this.getAll_product()
        },500)
      })
    }
  }
  open_modal = (e) => {
    this.setState({"modal_state": true})
    console.log('open');
  }
  close_modal = (e) => {
    this.setState({"modal_state": false})
  }
  componentDidMount(){
    this.getAll_product()
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
        <ProductContent getKidProduct={this.getKid_product} getMenProduct={this.getMen_product} getWomenProduct={this.getWomen_product} getAllProduct={this.getAll_product} clickKidProduct={this.click_kidProduct} clickMenProduct={this.click_menProduct} clickAllProduct={this.click_allProduct} clickWomenProduct={this.click_womenProduct} productData={this.state.product_data} addProduct={this.add_product} openModal={this.open_modal} closeModal={this.close_modal} modalState={this.state.modal_state} stateLogoff={this.props.state_logoff} setUserCookie={this.props.setUserCookie}/>
      </div>
    )
  }
}


function ProductContent({getAllProduct, getMenProduct, getWomenProduct, getKidProduct, clickWomenProduct,clickMenProduct, clickAllProduct, clickKidProduct, productData, addProduct, stateLogoff, setUserCookie, modalState, openModal, closeModal}){
  const location = useLocation()
  let id_saloon = location.state.idSaloon
  let { saloon } = useParams()
  console.log(saloon);
  let saloon_path = "/" + saloon
  return(
    <div className="bg CMSContainer">
      <AdminBoard saloon_name={saloon} stateLogoff={stateLogoff} setUserCookie={setUserCookie}/>
      <ManagerView view="product" getKidProduct={getKidProduct} getMenProduct={getMenProduct} getWomenProduct={getWomenProduct} getAllProduct={getAllProduct} clickKidProduct={clickKidProduct} clickAllProduct={clickAllProduct} clickMenProduct={clickMenProduct} clickWomenProduct={clickWomenProduct} saloon_name={saloon} saloonId={id_saloon} openModal={openModal} productData={productData}/>
      {modalState ? <ProductModal saloonId={id_saloon} addProduct={addProduct} closeModal={closeModal} /> : ""}
    </div>
  )
}
function ProductModal({closeModal, addProduct, saloonId}){
  return(
    <div className="ProductModalContainer">
      <form id="ProductModalContainer" className="AddProductForm" onSubmit={addProduct}>
        <h3 className="titleModal">Ajouter un service</h3>
          <div className="AddProductFormLine">
            <label htmlFor="addProductName">Nom du produit</label>
            <input id="addProductName" type="text" name="addProductName" placeholder="Nom du produit" />
            <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductRef">Ref Produit</label>
            <input id="addProductRef" type="text" name="addProductRef" placeholder="Référence du produit" />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductPrice">Prix du produit</label>
            <input id="addProductPrice" type="text" name="addProductPrice" placeholder="Prix du produit" />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductTime">Durée</label>
            <input id="addProductTime" type="text" name="addProductTime" placeholder="Durée en minutes" />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductFix">Temps de Pose</label>
            <input id="addProductFix" type="text" name="addProductFix" placeholder="Temps en minutes" />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductType">Type</label>
            <select id="addProductType" name="addProductType">
              <option value="">--Choisir une option</option>
                <option value="women">Femme</option>
                  <option value="men">Homme</option>
                    <option value="kid">Enfant</option>
            </select>
            <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine AddSubmitLine">
            <button onClick={closeModal} type="button" className="but_stop" >annuler</button>
            <button type="submit" className="btn_select addsub" >ajouter</button>
          </div>
          <input type="hidden" name="saloon_id" value={saloonId} />
      </form>
    </div>
  )
}
