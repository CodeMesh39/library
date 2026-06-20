function Header(){
    const user=JSON.parse(localStorage.getItem("user"));
    return(
        <div className="topbar">
            <h2 style={{fontSize:"25px"}}>Library Management System</h2>
            <p style={{fontSize:"20px"}}>Welcome, {user?.fullName}</p>
        </div>
    );
}
export default Header;