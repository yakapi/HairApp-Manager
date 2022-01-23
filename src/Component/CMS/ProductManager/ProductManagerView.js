import React from 'react'
import PropTypes from 'prop-types'

class ProductManagerView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      "modal_update_product": {
        "state": false,
        "id": null,
        "type": null,
        "type_product": null,
        "ref": null,
        "time": null,
        "price": null,
        "pose": null,
        "name": null,
      },
      "modal_icon": {
        "state": false,
        "id": null,
        "path": null,
        "id_product": null
      }
    }
  }
  open_icon = (e) => {
    console.log(e.target.dataset.productid);
    let icon_state = {
      "state": true,
      "id": e.target.id,
      "path": e.target.src,
      "id_product": e.target.dataset.productid
    }
    this.setState({"modal_icon": icon_state})
  }
  close_icon = (e) => {
    let icon_state = {
      "state": false,
      "id": null,
      "path": null,
      "id_product": null
    }
    this.setState({"modal_icon": icon_state})
  }
  delete_product = (e) => {
    let data_to_send = {
      "id": e.target.value,
      "call": "del_product"
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
      if (data.success === true) {
        if (e.target.dataset.idtype == "all") {
          this.props.getAllProduct()
        }else if (e.target.dataset.idtype == "women") {
          this.props.getWomenProduct()
        }else if (e.target.dataset.idtype == "men") {
          this.props.getMenProduct()
        }else if (e.target.dataset.idtype == "kid") {
          this.props.getKidProduct()
        }
      }
    })
  }
  update_product = (e) => {
    e.preventDefault()
    console.log("UPDATE");
    let data_to_send = {
      "call": "upd",
      "id": this.state.modal_update_product.id,
      "name": e.target[0].value,
      "ref": e.target[1].value,
      "price": e.target[2].value,
      "time": e.target[3].value,
      "pose": e.target[4].value,
      "type": e.target[5].value,
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
      console.log(data);
      if (data.success === true) {
        if (this.state.modal_update_product.type_product == "all") {
          this.props.getAllProduct()
        }else if (this.state.modal_update_product.type_product == "women") {
          this.props.getWomenProduct()
        }else if (this.state.modal_update_product.type_product == "men") {
          this.props.getMenProduct()
        }else if (this.state.modal_update_product.type_product == "kid") {
          this.props.getKidProduct()
        }
        this.close_modal_update_product()
      }else {
        alert('erreur modification')
      }
    })
    console.log(this.state.modal_update_product.id);
  }
  open_modal_update_product = (e) => {
    console.log(e);
    let data_to_send = {
      "call": "getSingle_product",
      "id": e.target.value
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
      console.log(data);
      console.log(e.target.dataset.idtype);
      let data_state = {
        "state": true,
        "id": data[0].id,
        "type": data[0].type,
        "type_product": e.target.dataset.idtype,
        "ref": data[0].ref,
        "time": data[0].time,
        "price": data[0].price,
        "pose": data[0].pose,
        "name": data[0].name,
      }
      this.setState({"modal_update_product": data_state})
    })
  }
  close_modal_update_product = (e) => {
    let data_state = {
      "state": false,
      "id": null,
      "type": null,
      "type_product": null,
      "ref": null,
      "time": null,
      "price": null,
      "pose": null,
      "name": null,
    }
    this.setState({"modal_update_product": data_state})
  }
  render () {
    return(
      <div className="ProductManagerView">
        <ProductManagerViewEngine openIcon={this.open_icon} openUpdateProduct={this.open_modal_update_product} deleteProduct={this.delete_product} clickKidProduct={this.props.clickKidProduct} clickAllProduct={this.props.clickAllProduct} clickMenProduct={this.props.clickMenProduct} clickWomenProduct={this.props.clickWomenProduct} openModal={this.props.openModal} productData={this.props.productData}/>
          {this.state.modal_update_product.state ? <ModalUpdateProduct updateProduct={this.update_product} lastFormValue={this.state.modal_update_product} closeModal={this.close_modal_update_product} saloonId={this.props.saloonId} /> : ""}
          {this.state.modal_icon.state ? <ModalIcon getAllProduct={this.props.getAllProduct} getAllWomen={this.props.getWomenProduct} getAllMen={this.props.getMenProduct} getAllKid={this.props.getKidProduct} productData={this.props.productData} iconInfo={this.state.modal_icon} closeIcon={this.close_icon} /> : ""}
    </div>
    )
  }
}

export default ProductManagerView;

function ProductManagerViewEngine({openIcon, openUpdateProduct, deleteProduct, openModal, productData, clickWomenProduct, clickMenProduct, clickAllProduct, clickKidProduct}){
  let init_style ={
    cursor: "pointer"
  }
  let sel_style = {
    background: "linear-gradient(to bottom, #33bdef 5%, #019ad2 100%)",
    backgroundColor:"#33bdef",
    color: "white",
    cursor: "default"
  }
  let all_style = init_style
  let women_style = init_style
  let men_style = init_style
  let kid_style = init_style
  let id_delete = null
  let card_array = [];
  function isEmpty(str) {
    return (!str || str.length === 0 );
  }
  if (!isEmpty(productData)) {
    id_delete = productData.select_type
    if (productData.select_type == 'all') {
      all_style = sel_style
    }else if (productData.select_type == 'women') {
      women_style = sel_style
    }else if (productData.select_type == "men") {
      men_style = sel_style
    }else if (productData.select_type == "kid") {
      kid_style = sel_style
    }
    card_array = productData.data
  }
  return(
    <div className="ProductManagerViewEngine">
      <div className="ViewHeader">
        <div className="ViewHeaderLeft">
          <p>Gestion des services</p>
        </div>
        <div>
          <button onClick={openModal} type="button" className="btn_select">Ajouter un service</button>
        </div>
      </div>
      <div className="SelectTypeContainer">
        <div className="SelectTypeProduct">
          <p onClick={clickAllProduct} className="select_btn ray" style={all_style}>Tous</p>
          <p onClick={clickWomenProduct} className="select_btn ray" style={women_style}>Femme</p>
          <p onClick={clickMenProduct} className="select_btn ray" style={men_style}>Homme</p>
          <p onClick={clickKidProduct} className="select_btn" style={kid_style}>Enfant</p>
        </div>
      </div>
      <div className="ProdBoard">
        {card_array.reverse().map((product_card) =>(
          <div key={product_card.name+product_card.id} className="ProductCard">
          <div className="ProductCardLeft">
          <div className="ProductIcon" onClick={openIcon}>
          <div className="enc_ProductIcon">
            <img id={product_card.id_icon} data-productid={product_card.id} src={product_card.path_icon} />
          </div>
          </div>
          <div className="ProductReference">
          <p className="secTitle">Ref:</p>
          <p className="secValue">{product_card.ref}</p>
          </div>
          <div className="ProductName">
          <p className="secTitle">Service:</p>
          <p className="secValue">{product_card.name}</p>
          </div>
          </div>
          <div className="ProductCardRight">
          <div className="ProductPrice">
          <p className="secTitle">Prix:</p>
          <p className="secValue">{product_card.price} <span>€</span></p>
          </div>
          <div className="ProductTime">
          <p className="secTitle">Durée:</p>
          <p className="secValue">{product_card.time} <span>minutes</span></p>
          </div>
          <div className="ProductPose">
          <p className="secTitle">Temps de pose:</p>
          <p className="secValue">{product_card.pose} <span>minutes</span></p>
          </div>
          <div className="ProductAction">
          <button onClick={openUpdateProduct} data-idtype={id_delete} type="button" value={product_card.id} className="btn_select">modifier</button>
          <button onClick={deleteProduct} data-idtype={id_delete} type="button" value={product_card.id} className="but_stop">supprimer</button>
          </div>
          </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ModalUpdateProduct({updateProduct, saloonId, closeModal, lastFormValue}){
  console.log(lastFormValue);
  let women_selected = {}
  let men_selected = {}
  let kid_selected = {}
  if (lastFormValue.type == "women") {
    women_selected['selected'] = "selected"
  }else if (lastFormValue.type == "men") {
    men_selected['selected'] = "selected"
  }else if (lastFormValue.type == "kid") {
    kid_selected['selected'] = "selected"
  }
  return(
    <div className="ModalUpdateProduct">
      <form id="ProductModalContainer" className="AddProductForm" onSubmit={updateProduct} >
        <h3 className="titleModal">Modifier un service</h3>
          <div className="AddProductFormLine">
            <label htmlFor="addProductName">Nom du service</label>
            <input id="addProductName" type="text" name="addProductName" placeholder="Nom du service" defaultValue={lastFormValue.name}/>
            <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductRef">Ref service</label>
            <input id="addProductRef" type="text" name="addProductRef" placeholder="Référence du service" defaultValue={lastFormValue.ref} />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductPrice">Prix du service</label>
            <input id="addProductPrice" type="text" name="addProductPrice" placeholder="Prix du service" defaultValue={lastFormValue.price} />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductTime">Durée</label>
            <input id="addProductTime" type="text" name="addProductTime" placeholder="Durée en minutes" defaultValue={lastFormValue.time} />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductFix">Temps de Pose</label>
            <input id="addProductFix" type="text" name="addProductFix" placeholder="Temps en minutes" defaultValue={lastFormValue.pose} />
              <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine">
            <label htmlFor="addProductType">Type</label>
            <select id="addProductType" name="addProductType">
              <option value="">--Choisir une option</option>
                <option value="women" {...women_selected} >Femme</option>
                  <option value="men" {...men_selected} >Homme</option>
                    <option value="kid" {...kid_selected} >Enfant</option>
            </select>
            <p className="errorForm"></p>
          </div>
          <div className="AddProductFormLine AddSubmitLine">
            <button onClick={closeModal}  type="button" className="but_stop" >annuler</button>
              <button type="submit" className="btn_select addsub" >ajouter</button>
          </div>
          <input type="hidden" name="saloon_id" value={saloonId} />
      </form>
    </div>
  )
}
class ModalIcon extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      "icon_data": null,
      "selected_icon": {
        "id": this.props.iconInfo.id,
        "path": this.props.iconInfo.path
      },
      "type_icon": true
    }
  }
  select_icon = (e) => {
    console.log("product Data");
    console.log(this.props.productData);
    console.log("id product");
    console.log(this.props.iconInfo.id_product);
    let data_to_send = {
      "call": "upd_icon",
      "id_icon": this.state.selected_icon.id,
      "path_icon": this.state.selected_icon.path,
      "id_product": this.props.iconInfo.id_product,
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
      console.log(data);
      if (data.success == true) {
        if (this.props.productData.select_type == "all") {
          console.log('GET all ');
          this.props.getAllProduct()
          this.props.closeIcon()
        }else if (this.props.productData.select_type == "men") {
          this.props.getAllMen()
          this.props.closeIcon()
          console.log('GET MEN ');
        }else if (this.props.productData.select_type == "women") {
          console.log("GET WOMEN");
          this.props.getAllWomen()
          this.props.closeIcon()
        }else if (this.props.productData.select_type == "kid") {
          this.props.getAllKid()
          this.props.closeIcon()
        }
      }
    })

  }
  choose_icon = (e) => {
    let choosed_icon = {
      "id": e.target.id,
      "path": e.target.src
    }
    this.setState({"selected_icon": choosed_icon})
  }
  toggle_type = (e) => {
    this.setState({"type_icon": !this.state.type_icon})
  }
  getAll_icon = (e) => {
    let data_to_send = {
      "call": "getAll_icon"
    }
    fetch('http://api-coiffure.victorbarlier.fr/icon.php',{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      console.log(data);
      let uploaded_array = []
      let integrate_array = []
      for (var i = 0; i < data.length; i++) {
        if (data[i].type == "integrate") {
          integrate_array.push(data[i])
        }else {
          uploaded_array.push(data[i])
        }
      }
      let data_icon = {
        "uploaded": uploaded_array,
        "integrate": integrate_array
      }
      this.setState({"icon_data": data_icon})
    })
  }
  componentDidMount(){
    this.getAll_icon()
  }
  render(){
    return(
      <ModalIconEngine getAllIcon={this.getAll_icon} selectIcon={this.select_icon} chooseIcon={this.choose_icon} selectedIcon={this.state.selected_icon} toggleType={this.toggle_type} typeIcon={this.state.type_icon} closeIcon={this.props.closeIcon} iconData={this.state.icon_data} />
    )
  }
}
function ModalIconEngine({getAllIcon, selectIcon, chooseIcon, toggleType, typeIcon, closeIcon, iconData, selectedIcon}){
  if (iconData == null) {
    return(
      <div className="ModalUpdateProduct"></div>
    )
  }else {
    let init_style ={
      cursor: "pointer"
    }
    let sel_style = {
      background: "linear-gradient(to bottom, #33bdef 5%, #019ad2 100%)",
      backgroundColor:"#33bdef",
      color: "white",
      cursor: "default"
    }
    let perso_style = init_style
    let integ_style = init_style
    if (typeIcon) {
      perso_style = sel_style
    }else {
      integ_style = sel_style
    }
    return(
      <div className="ModalUpdateProduct">
        <div className="AddIconForm">
          <div className="SelectIcon">
            <div className="HeaderIconForm">
              <div className="HeaderIconLeft">
                <h3 className="icon_select_title">Selectionner une icône :</h3>
                <div className="SelectTypeContainer slt_icon">
                  <div className="SelectTypeProduct">
                    <p onClick={toggleType} className="select_btn ray" style={perso_style}>Personnelles</p>
                    <p onClick={toggleType} className="select_btn ray" style={integ_style}>Intégrées</p>
                  </div>
                </div>
              </div>
              <div className="HeaderIconRight">
                <div className="enc_IconSelected">
                  <img src={selectedIcon.path}/>
                </div>
              </div>
            </div>
              {typeIcon ? <IconUploadedBoard chooseIcon={chooseIcon} iconData={iconData} /> : <IconIntegrateBoard chooseIcon={chooseIcon} iconData={iconData} />}
          </div>
          <h3 className="icon_select_title">Ajouter une icône :</h3>
          <DragAndDrop getAllIcon={getAllIcon} />
          <div className="AddIconSubLine">
            <button onClick={closeIcon} type="button" className="but_stop">annuler</button>
            <button onClick={selectIcon} type="button" className="btn_select s_icon">Enregistrer</button>
          </div>
        </div>
      </div>
    )
  }
}

function IconUploadedBoard({iconData, chooseIcon}){
  return(
    <div className="IconUploadedBoard">
      {iconData.uploaded.map((uploaded_icon)=> (
        <div onClick={chooseIcon} key={uploaded_icon.id+uploaded_icon.type} className="IconCard">
          <div className="enc_IconCard">
            <img id={uploaded_icon.id} src={uploaded_icon.path} />
          </div>
        </div>
      ))}
    </div>
  )
}
function IconIntegrateBoard({iconData, chooseIcon}){
  return(
    <div className="IconIntegrateBoard">
      {iconData.integrate.map((integrate_icon)=> (
        <div onClick={chooseIcon} key={integrate_icon.id+integrate_icon.type} className="IconCard">
          <div className="enc_IconCard">
            <img id={integrate_icon.id} src={integrate_icon.path} />
          </div>
        </div>
      ))}
    </div>
  )
}
class DragAndDrop extends React.Component{
  componentDidMount(){
    console.log(this.props.getAllIcon);
    let dropArea = document.getElementById('drop-area')
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })
    ;['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })

    function highlight(e) {
      dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
      dropArea.classList.remove('highlight')
    }

    function preventDefaults (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    dropArea.addEventListener('drop', handleDrop, false)
    dropArea.getIcon = this.props.getAllIcon
    function handleDrop(e){
      let getIcon = e.currentTarget.getIcon
      e.target.parentElement.children[0].files = e.dataTransfer.files
      let dropData = new FormData(e.target.parentElement)
      fetch('http://api-coiffure.victorbarlier.fr/icon_upload.php',{
        method: 'post',
        body: dropData
      }).then(response => response.json()).then(data => {
        console.log(data);
        if (data.success) {
          getIcon()

        }
      })
    }
  }
  sub_file = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let formData = new FormData(e.target.parentElement)
    fetch('http://api-coiffure.victorbarlier.fr/icon_upload.php',{
      method: 'post',
      body: formData
    }).then(response => response.json()).then(data => {
      if (data.success) {
        this.props.getAllIcon()
      }
    })
  }

  render(){
    return(
      <div id="drop-area" className="AddIconDrop">
          <form draggable="true" className="my-form" encType="multipart/form-data">
            <input onChange={this.sub_file} type="file" id="fileElem" accept="image/*"  name="upfile" />
            <label htmlFor="fileElem">Sélectionner ou glisser un ficher</label>
          </form>
        </div>
      )
  }
}
