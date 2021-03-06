import React from 'react'
import PropTypes from 'prop-types'
import FullCalendar from '@fullcalendar/react'
import TimeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'

class PlanningManagerView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      bh:  [
            {
              daysOfWeek: [ 1, 2, 3, 4, 5 ], // Lundi... ,
              startTime: '08:00', // 8am
              endTime: '18:00' // 6pm
            },
            {
              daysOfWeek: [6, 0], // Samedi, Dimanche
              startTime: '13:00', // 10am
              endTime: '17:00' // 4pm
            }
          ],
      break_start: '12:00:00',
      break_end: '13:00:00',
      type_event: "service",
      pointer: [
        {
          title: 'All Day Event',
          start: '2022-01-25T09:00:00+01:00',
          end: '2022-01-25T10:00:00+01:00',
          color: 'red'
        },
        {
          title: 'Long Event',
          start: '2022-01-23',
          end: '2022-02-10',
          color: 'purple' // override!
        }
      ],
      ressource_employe: "",
      ressource_selected: []
    }
  }
  componentDidMount(){
    let data_to_send = {
      "call": "get_all",
      "id_saloon": this.props.saloonId
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
      let ressource_selected = []
      for (var i = 0; i < data.length; i++) {
        ressource_selected.push(data[i].id)
      }
      this.setState({"ressource_selected": ressource_selected})
      this.setState({"ressource_employe": data})
    })
    this.getEventWeek()
  }
  getEventWeek = (e) => {
    console.log("HELLLO FUCKING WORLDDDDDDDDDDDDDDDDDD");
    let obj_date = new Date()
    // obj_date.getDate()
    let enter_week_calendar
    let finish_week_calendar
    let month_calendar
    let month = obj_date.getMonth() + 1
    if (obj_date.getMonth() < 10) {
      month_calendar = "0" + month
    }else {
      month_calendar = month
    }
    if (obj_date.getDay() != 0) {
      let ent_date = obj_date.getDay() - 1
      enter_week_calendar = obj_date.getDate() - ent_date
      finish_week_calendar = enter_week_calendar + 6
    }else {
      let ent_date = obj_date.getDay() - 6
      enter_week_calendar = obj_date.getDate() - ent_date
      finish_week_calendar = enter_week_calendar + 6
    }
    let date_week_enter = obj_date.getFullYear()+"-"+month_calendar+"-"+enter_week_calendar
    let date_week_finish = obj_date.getFullYear()+"-"+month_calendar+"-"+finish_week_calendar
    let data_to_send = {
      "call": "get_event_week",
      "start": date_week_enter,
      "end": date_week_finish,
      "saloonId": this.props.saloonId
    }
    fetch("http://api-coiffure.victorbarlier.fr/events.php",{
      method: 'post',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
    }).then(response => response.json()).then(data => {
      console.log(data);
      let pointer_array = []
      for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        let split_start = data[i].events_start.split(" ");
        let split_end = data[i].events_end.split(" ");
        let start_evt = split_start[0]+"+"+split_start[1]
        let end_evt = split_end[0]+"+"+split_end[1]
        let pointer_row = {
          "title": data[i].name_employe,
          "start": start_evt,
          "end": end_evt,
          "color": data[i].employe_color
        }
        pointer_array.push(pointer_row)
      }
      this.setState({"pointer": pointer_array})
      console.log(this.state.pointer);
    })
    console.log(date_week_enter);
    console.log(date_week_finish);
  }
  selectRessource = (e) => {
    e.target.classList.toggle('selected_ressource')
    let new_array = []
    if (e.target.classList.contains('selected_ressource')) {
      for (var i = 0; i < this.state.ressource_selected.length; i++) {
        new_array.push(this.state.ressource_selected[i])
      }
      new_array.push(e.target.dataset.id)
    }else {
      for (var i = 0; i < this.state.ressource_selected.length; i++) {
        if (this.state.ressource_selected[i] != e.target.dataset.id) {
          new_array.push(this.state.ressource_selected[i])
        }
      }
    }
    this.setState({"ressource_selected": new_array})
  }
  typeClick = (e) => {
    if (this.state.type_event != e.target.dataset.type) {
      this.setState({"type_event": e.target.dataset.type})
    }
  }
  dateClick = (e) => {
    console.log(e);
    //Si on Clique sur Tous les jours
    if (e.allDay) {
      console.log("clique tous les jours");
      console.log(e.date);
      let day_start = e.dateStr+"T"+this.state.bh[0].startTime+":00+01:00"
      let break_start = e.dateStr+"T"+this.state.break_start+"+01:00"
      let break_end = e.dateStr+"T"+this.state.break_end+"+01:00"
      let day_end = e.dateStr+"T"+this.state.bh[0].endTime+":00+01:00"
      let day_string = String(e.date)
      let day_array = day_string.split(" ")
      if (day_array[0] != "Sat" || day_array[0] != "Sun") {
        let array_type
        if (this.state.type_event == "service") {
          array_type = {
            "name": "service",
            "id": 0,
            "color": "lightgrey"
          }
        }else if (this.state.type_event == "vacance") {
          array_type = {
            "name": "vacance",
            "id": 1,
            "color": "green"
          }
        }else if (this.state.type_event == "maladie") {
          array_type = {
            "name": "maladie",
            "id": 2,
            "color": "red"
          }
        }
        let array_employe = this.state.ressource_employe
        for (var i = 0; i < array_employe.length; i++) {
          let array_all_day = [{
            "saloon_id": this.props.saloonId,
            "name_employe": array_employe[i].name,
            "nickname_employe": array_employe[i].nickname,
            "employe_id": array_employe[i].id,
            "employe_color": array_employe[i].color,
            "type": array_type.name,
            "type_id": array_type.id,
            "type_border": array_type.color,
            "start": day_start,
            "end": break_start,
            "date": e.dateStr
          },{
            "saloon_id": this.props.saloonId,
            "name_employe": array_employe[i].name,
            "nickname_employe": array_employe[i].nickname,
            "employe_id": array_employe[i].id,
            "employe_color": array_employe[i].color,
            "type": array_type.name,
            "type_id": array_type.id,
            "type_border": array_type.color,
            "start": break_end,
            "end": day_end,
            "date": e.dateStr
          }]
          for (var u = 0; u < array_all_day.length; u++) {
            let data_to_send = {
              "call": "add",
              "saloon_id": array_all_day[u].saloon_id,
              "name_employe": array_all_day[u].name_employe,
              "nickname_employe": array_all_day[u].nickname,
              "employe_id": array_all_day[u].employe_id,
              "employe_color": array_all_day[u].employe_color,
              "type": array_all_day[u].type,
              "type_id": array_all_day[u].type_id,
              "type_border": array_all_day[u].type_border,
              "start": array_all_day[u].start,
              "end": array_all_day[u].end,
              "date": array_all_day[u].date
            }
            fetch('http://api-coiffure.victorbarlier.fr/events.php',{
              method: 'post',
              credentials: 'include',
              headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              body: Object.entries(data_to_send).map(([k,v])=>{return k+'='+v}).join('&')
            }).then(response => response.json()).then(data => {
              console.log(data);
            })
          }
        }
      }else {
        console.log('ni samedi ni dimanche');
      }
    }else {
      console.log("clique sur un horaire");
    }
  }
  selectDate = (e) => {
    console.log("date selected");
    console.log(e);
  }
  printEvent = (e) => {
    console.log('print event');

  }
  render () {
    return(
      <div className="PlanningManagerContainer">
        <div className="PlanningBoard">
          <SelectEmploye selectRessource={this.selectRessource} ressourceSelected={this.state.ressource_selected} ressourceEmploye={this.state.ressource_employe}/>
          <TypeEvent click={this.typeClick} type={this.state.type_event} />
        </div>
        <div id="Planning" className="PlanningManagerView">
          <FullCalendar locale={frLocale} plugins={[ TimeGridPlugin, interactionPlugin ]} events={this.state.pointer} businessHours={this.state.bh} selectable="true" select={this.selectDate} dateClick={this.dateClick} initialView="timeGridWeek" />
        </div>
      </div>
    )
  }
}

export default PlanningManagerView;

function TypeEvent({type, click}){
  let init_style ={
    cursor: "pointer"
  }
  let sel_style = {
    background: "linear-gradient(to bottom, #33bdef 5%, #019ad2 100%)",
    backgroundColor:"#33bdef",
    color: "white",
    cursor: "default"
  }
  let service_style = init_style
  let vacance_style = init_style
  let maladie_style = init_style
  if (type == "service") {
    service_style = sel_style
  }else if (type == "vacance") {
    vacance_style = sel_style
  }else if (type == "maladie") {
    maladie_style = sel_style
  }
  return(
    <div className="TypeBoard SelectTypeContainer">
      <div className="SelectTypeProduct">
        <p onClick={click} className="select_btn ray" data-type="service" style={service_style}>Service</p>
        <p onClick={click} className="select_btn ray" data-type="vacance" style={vacance_style}>Vacance</p>
        <p onClick={click} className="select_btn ray" data-type="maladie" style={maladie_style}>Maladie</p>
      </div>
    </div>
  )
}
function SelectEmploye({selectRessource ,ressourceEmploye, ressourceSelected}){
  function isEmpty(str) {
    return (!str || str.length === 0 );
  }
  let ressourceArray = []
  if (!isEmpty(ressourceEmploye)) {
    ressourceArray = ressourceEmploye
  }
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
  if (ressourceSelected == "all") {
    all_style = sel_style
  }
  return(
    <div className="SelectTypeContainer">
      <div className="SelectTypeProduct">
        {ressourceArray.map((ressource) => (
          <p className="select_btn selected_ressource ray" style={init_style} onClick={selectRessource} data-id={ressource.id} key={ressource.id+ressource.name}>{ressource.name}</p>
        ))}

      </div>
    </div>
  )
}
