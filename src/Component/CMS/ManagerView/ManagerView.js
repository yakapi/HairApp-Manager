import React from 'react'
import ProductManagerView from '../ProductManager/ProductManagerView'
import PlanningManagerView from '../PlanningManager/PlanningManagerView'
import EmployeManagerView from '../EmployeManager/EmployeManagerView'
import { Link } from 'react-router-dom'

export default function ManagerView({getAllProduct, getKidProduct, getMenProduct, getWomenProduct, clickKidProduct ,clickAllProduct ,clickMenProduct, clickWomenProduct, view, saloon_name, saloonId, openModal, productData}){
  let path = "/" + saloon_name
  if (view === "product") {
    return(
      <div className="ManagerView">
        <div className="ManagerScreen">
          <div className="ScreenPanel">
            <div className="ScreenPanelContent">
              <Link to={path} state={{idSaloon: saloonId}}>
                <div className="ScreenPanelBtn">
                  <p>x</p>
                </div>
              </Link>
            </div>
          </div>
          <ProductManagerView getKidProduct={getKidProduct} getMenProduct={getMenProduct} getWomenProduct={getWomenProduct} getAllProduct={getAllProduct} openModal={openModal} clickKidProduct={clickKidProduct} clickAllProduct={clickAllProduct} clickMenProduct={clickMenProduct} clickWomenProduct={clickWomenProduct} saloonId={saloonId} productData={productData}/>
        </div>
      </div>
    )
  }
  if (view === "planning") {
    return(
      <div className="ManagerView">
        <div className="ManagerScreen">
          <div className="ScreenPanel">
            <div className="ScreenPanelContent">
              <Link to={path} state={{idSaloon: saloonId}}>
                <div className="ScreenPanelBtn">
                  <p>x</p>
                </div>
              </Link>
            </div>
          </div>
          <PlanningManagerView openModal={openModal} saloonId={saloonId} />
        </div>
      </div>
    )
  }
  if (view === "employe") {
    return(
      <div className="ManagerView">
        <div className="ManagerScreen">
          <div className="ScreenPanel">
            <div className="ScreenPanelContent">
              <Link to={path} state={{idSaloon: saloonId}}>
                <div className="ScreenPanelBtn">
                  <p>x</p>
                </div>
              </Link>
            </div>
          </div>
          <EmployeManagerView getAllEmploye={getAllProduct} employeData={productData} openModal={openModal} saloonId={saloonId} />
        </div>
      </div>
    )
  }
}
