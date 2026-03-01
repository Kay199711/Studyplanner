import { Link } from 'react-router-dom';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { CgNotes } from "react-icons/cg";


function Sidebar() {
  return (
    <div>
        
        <Link to="/dashboard"><MdOutlineSpaceDashboard/>Dashboard</Link>
        <Link to="/calendar"><LuCalendarDays/>Calendar</Link>
        <Link to="/notes"><CgNotes/>Notes</Link> 
      
    </div>
  );
}

export default Sidebar;