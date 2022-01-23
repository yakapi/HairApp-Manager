import React from 'react'
import {Link, useLocation, useParams } from 'react-router-dom'
import AdminBoard from "../AdminBoard/AdminBoard"

class CMS extends React.Component{
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
      <ContentManagment stateLogoff={this.props.state_logoff} setUserCookie={this.props.setUserCookie}/>
    )
  }
}
export default CMS

function ContentManagment({stateLogoff, setUserCookie}){
  const location = useLocation()
  let id_saloon = location.state.idSaloon
  let { saloon } = useParams()
  console.log(saloon);
  let saloon_path = "/" + saloon
  return(
    <div className="bg CMSContainer">
      <AdminBoard saloon_name={saloon} stateLogoff={stateLogoff} setUserCookie={setUserCookie}/>
      <BoardManagment saloon_path={saloon_path}  saloonId={id_saloon}/>
    </div>
  )
}
function BoardManagment({saloon_path, saloonId}){
  let product_path = saloon_path + "/service"
  let planning_path = saloon_path + "/planning"
  let employe_path = saloon_path + "/personnel"
  return(
    <div className="BoardManagmentContainer">
      <div className="BoardManagmentContent">
        <Link to={product_path} state={{idSaloon: saloonId}}>
        <div className="button-wrap">
            <button className="button_saloon" type="button">Services<span>Gérer les services</span></button>
        </div>
        </Link>
        <Link to={planning_path} state={{idSaloon: saloonId}}>
        <div className="button-wrap">
          <button className="button_saloon" type="button">Planning<span>Gérer les plannings</span></button>
        </div>
        </Link>
        <Link to={employe_path} state={{idSaloon: saloonId}}>
        <div className="button-wrap">
            <button className="button_saloon" type="button">Personnel<span>Gérer le personnel</span></button>
        </div>
        </Link>
      </div>
    </div>
  )
}
