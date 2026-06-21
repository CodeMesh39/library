import { useState } from "react";
import axios from "axios";

function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return alert("Passwords do not match!");
        try {
            const res = await axios.put(`${API_URL}/api/change-password`, {
                email: user?.email, currentPassword, newPassword
            });
            alert(res.data.message);
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        } catch (err) {
            alert(err.response?.data?.message || "Error updating password");
        }
    };

    return (
        <div style={{
            padding:"20px", border:"1px solid #ddd", borderRadius:"8px", maxWidth:"340px", 
            margin:"40px auto", fontFamily:"sans-serif", boxShadow:"0 4px 10px rgba(0,0,0,0.05)"
        }}>
            <h2 style={{ textAlign:"center", margin:"0 0 15px" }}>Profile</h2>
            <p><strong>Name:</strong> {user?.fullName}</p>
            <p style={{ marginBottom:"20px" }}><strong>Email:</strong> {user?.email}</p>
            <hr style={{ border:"0", borderTop:"1px solid #eee", margin:"20px 0" }} />
            <h4 style={{ margin:"0 0 15px" }}>Change Password</h4>
            <form onSubmit={handleChangePassword} style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required style={styles.input} />
                <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={styles.input} />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={styles.input} />
                <button type="submit" style={{ padding:"10px", background:"#007bff", color:"#fff", border:"none", borderRadius:"4px", fontWeight:"bold", cursor:"pointer" }}>Update</button>
            </form>
        </div>
    );
}

const styles = {
    input: { padding:"10px", border:"1px solid #ccc", borderRadius:"4px", fontSize:"14px" }
};

export default Profile;