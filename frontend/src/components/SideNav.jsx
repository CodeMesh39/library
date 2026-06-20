import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function SideNav(){
    const Navigate=useNavigate();
    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Navigate("/login");
    };
    return(
        <div style={{width:"220px",backgroundColor:"#333231",minHeight:"80vh",padding:"20px"}}>
            <Link to="/dashboard" style={{color:"white",display:"block",marginBottom:"15px",textDecoration:"None",padding:"20px",fontSize:"20px"}}>
            Dashboard
            </Link>

            <Link to="/dashboard/courses" style={{color:"white",display:"block",marginBottom:"15px",textDecoration:"None",padding:"20px",fontSize:"20px"}}>
            Books
            </Link>

            <Link to="/dashboard/issued" style={{color:"white",display:"block",marginBottom:"15px",textDecoration:"None",padding:"20px",fontSize:"20px"}}>
            Issued Books
            </Link>

            <Link to="/dashboard/profile" style={{color:"white",display:"block",marginBottom:"15px",textDecoration:"None",padding:"20px",fontSize:"20px"}}>
            Profile
            </Link>

            <button onClick={handleLogout}  >Logout</button>
        </div>
    );
}
export default SideNav;