import {useState,useEffect} from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Dashboard(){
  const [courseCount,setCourseCount]=useState(0);
  const [issuedCount,setIssuedCount]=useState(0);
  const [pendingCount,setPendingCount]=useState(0);
  const [overdueCount,setOverdueCount]=useState(0);
  useEffect(()=>{
    fetchCourseCount();
    fetchLibraryCounts();
  },[]);
  const fetchCourseCount=async()=>{
    try{
      const response=await axios.get(`${API_URL}/api/course-count`);
      setCourseCount(response.data.totalCourses);
    }catch(error){
      console.log(error);
    }
  };
  const fetchLibraryCounts=async()=>{
    try{
      const response=await axios.get(`${API_URL}/api/all-books`);
      const books=response.data;
      setIssuedCount(books.filter(b=>b.status==="Issued").length);
      setPendingCount(books.filter(b=>b.status==="Pending").length);
      setOverdueCount(books.filter(b=>b.status==="Not Returned").length);
    }catch(error){
      console.log(error);
    }
  };
  return(
    <div className="container-fluid mt-2">
      <div className="row align-items-center mb-5">
        <div className="col-lg-6">
          <div className="fw-bold">
            <h3 style={{color:"#b88b51",marginBottom:"20px"}}>Your Gateway to Unlimited Knowledge</h3>
          </div>
          <p className="mt-3 text-secondary">Welcome to Digital Knowledge Center, a modern library management platform designed to provide seamless access to books, digital resources, and learning materials. Explore, discover, and manage knowledge efficiently through a user-friendly system that connects readers with a world of information, empowering lifelong learning and academic excellence.</p>
          <p className="mt-3 text-secondary ml-4">Whether you are looking to borrow academic journals, dive into literature, or utilize collaborative tools, our platform streamlines your journey. With advanced search and 24/7 digital access, we bridge the gap between traditional reading and modern convenience—putting knowledge just a click away.</p>        
        </div>
        <div className="col-lg-6 text-center">
          <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" className="img-fluid rounded" style={{maxHeight:"400px",objectFit:"cover"}} alt="Library"/>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card h-100 text-info shadow">
            <div className="card-body">
              <h5>Total Books</h5>
              <h2 className="text-black">{courseCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 text-success shadow">
            <div className="card-body">
              <h5>Issued Books</h5>
              <h2 className="text-dark">{issuedCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 text-warning shadow">
            <div className="card-body">
              <h5>Pending Books</h5>
              <h2 className="text-dark">{courseCount-issuedCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 text-danger shadow">
            <div className="card-body">
              <h5>Not Returned Books</h5>
              <h2 className="text-dark">{overdueCount}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;