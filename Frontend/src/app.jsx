import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";

// import './app.css'

// Components
import StickyNavbar from './components/NavigationBar'
import Signin from './components/Signin';
import RoomBooking from './components/Rooms'
import HodPage from "./components/Hodpage";
import PrincipalPage from "./components/PrinciplePage";
import Commitee from "./components/Student";
import UpcomingEvents from "./components/UpcommingEvents";
import SystemDashboard from "./components/SystemPage";
import Analysis from "./components/Analysis";
import CommitteeAnalysis from "./components/CommitteeAnalysis";
import EventsAndRegisteredUsers from "./components/RegisteredUsers";
import AllEventsData from "./components/AllEventsData";
import Adduser from "./components/Adduser";
import FormComponent from "./components/FormComponent";


export function App() {
  return (
    <>
    <Router>
      <StickyNavbar/>
      <Routes>
        <Route exact path='/signin' element={<Signin/>}/>
        <Route exact path='/hod' element={<HodPage/>}/>
        <Route exact path='/principle' element={<PrincipalPage/>}/>
        <Route exact path='/commitee' element={<Commitee/>}/>
        <Route exact path='/registerations' element={<EventsAndRegisteredUsers/>}/>
        <Route exact path='/student' element={<>hello ji</>}/>
        <Route exact path='/upcomingevents' element={<UpcomingEvents/>}/>
        <Route exact path='/' element={<AllEventsData/>}/>
        <Route exact path='/roombooking' element={<RoomBooking/>}/>
        <Route path="/roombooking/:eventId" element={<RoomBooking/>} />

        <Route exact path='/adduser' element={<Adduser/>}/>
        <Route exact path='/System' element={<SystemDashboard/>}/>
        <Route exact path='/proposalFormat' element={<FormComponent/>}/>
        <Route exact path='/principle/analysis' element={<Analysis/>}/>
        <Route exact path='/committee/analysis' element={<CommitteeAnalysis/>}/>
      </Routes>
    </Router>
    </>
  )
}
