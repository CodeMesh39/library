function Footer(){
    const user=JSON.parse(localStorage.getItem("user"));
    return(
        <div style={{padding:"8px",backgroundColor:"#0b71c4",textAlign:"center"}}>
            <h4>@2026 Copy Rights : Library management system</h4>
            <p style={{fontSize:"10px"}}>{user?.email}</p>
        </div>
    );
}
export default Footer;