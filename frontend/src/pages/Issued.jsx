import {useState,useEffect} from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Issued(){
  const [books,setBooks]=useState([]);
  const [courses,setCourses]=useState([]);
  const [filter,setFilter]=useState("Issued");
  const [selectedCourseId,setSelectedCourseId]=useState("");
  const [borrowerId,setBorrowerId]=useState("");
  useEffect(()=>{
    fetchBooks();
    fetchCourses();
  },[]);
  const fetchBooks=async()=>{
    try{
      const res=await axios.get(`${API_URL}/api/all-books`);
      setBooks(res.data);
    }catch(err){
      console.log(err);
    }
  };
  const fetchCourses=async()=>{
    try{
      const res=await axios.get(`${API_URL}/api/courses`);
      setCourses(res.data);
    }catch(err){
      console.log(err);
    }
  };
  const handleIssueBook=async(e)=>{
    e.preventDefault();
    if(!selectedCourseId){alert("Please select a book");return;}
    if(!borrowerId){alert("Please enter a Borrower ID");return;}
    const selectedCourse=courses.find(c=>c._id===selectedCourseId);
    if(!selectedCourse)return;
    try{
      await axios.post(`${API_URL}/api/all-books`,{title:selectedCourse.title,borrowerId,status:"Issued"});
      alert("Book Issued Successfully!");
      setSelectedCourseId("");
      setBorrowerId("");
      fetchBooks();
    }catch(err){
      console.log(err);
      alert(err.response?.data?.message||"Backend failed to save the book");
    }
  };
  const handleUpdateStatus=async(id,newStatus)=>{
    try{
      await axios.put(`${API_URL}/api/all-books/${id}`,{status:newStatus});
      fetchBooks();
    }catch(err){
      console.log(err);
    }
  };
  const filteredBooks=books.filter(book=>book.status===filter);
  return(
    <div className="container-fluid mt-4">
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Issue New Book Form</h5>
        <form onSubmit={handleIssueBook} className="row g-2 align-items-center">
          <div className="col-md-5">
            <select className="form-select" value={selectedCourseId} onChange={(e)=>setSelectedCourseId(e.target.value)}>
              <option value="">Select a Book from Catalog</option>
              {courses.map(course=>(
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <input type="text" className="form-control" placeholder="Borrower ID (e.g., STU101)" value={borrowerId} onChange={(e)=>setBorrowerId(e.target.value)}/>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Issue Book</button>
          </div>
        </form>
      </div>
      <div className="d-flex gap-2 mb-4">
        <button type="button" className={`btn ${filter==="Issued"?"btn-success":"btn-outline-success"}`} onClick={()=>setFilter("Issued")}>Issued Books</button>
        <button type="button" className={`btn ${filter==="Not Returned"?"btn-danger":"btn-outline-danger"}`} onClick={()=>setFilter("Not Returned")}>Not Returned Books</button>
      </div>
      <h3>{filter} List</h3>
      <div className="table-responsive mt-3">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Book Title</th>
              <th>Borrower ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book=>(
              <tr key={book.id||book._id}>
                <td>{book.id||book._id}</td>
                <td>{book.title}</td>
                <td>{book.borrowerId||book.borrower}</td>
                <td>
                  <span className={`badge ${filter==="Issued"?"bg-success":"bg-danger"}`}>{book.status}</span>
                </td>
                <td>
                  {filter==="Issued"&&<button type="button" className="btn btn-sm btn-danger" onClick={()=>handleUpdateStatus(book.id||book._id,"Not Returned")}>Mark Overdue</button>}
                  {filter==="Not Returned"&&<button type="button" className="btn btn-sm btn-secondary" onClick={()=>handleUpdateStatus(book.id||book._id,"Returned")}>Mark Returned</button>}
                </td>
              </tr>
            ))}
            {filteredBooks.length===0&&(
              <tr>
                <td colSpan="5" className="text-center text-secondary">No books found in this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Issued;