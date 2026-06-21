import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


function Courses() {
    const [courseThumbnail, setCourseThumbnail] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [numberOfBooks, setNumberOfBooks] = useState("");
    const [courses, setCourses] = useState([]);
    const [editId, setEditId] = useState(null);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/courses`);
            setCourses(response.data);
        } catch (error) {
            alert("Failed to fetch courses");
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseData = {
            courseThumbnail,
            title,
            description,
            author,
            numberOfBooks: Number(numberOfBooks)
        };
        try {
            if (editId) {
                const response = await axios.put(
                    `${API_URL}/api/courses/${editId}`,
                    courseData
                );
                alert(response.data.message);
                setEditId(null);
            } else {
                const response = await axios.post(
                    `${API_URL}/api/courses`,
                    courseData
                );
                alert(response.data.message);
            }
            setCourseThumbnail("");
            setTitle("");
            setDescription("");
            setAuthor("");
            setNumberOfBooks("");
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleEdit = (course) => {
        setEditId(course._id);
        setCourseThumbnail(course.courseThumbnail);
        setTitle(course.title);
        setDescription(course.description);
        setAuthor(course.author || "");
        setNumberOfBooks(course.numberOfBooks || "");
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (!confirmDelete) return;
        try {
            const response = await axios.delete(`${API_URL}/api/courses/${id}`);
            alert(response.data.message);
            fetchCourses();
        } catch (error) {
            alert("Failed to delete course");
        }
    };

    const clearForm = () => {
        setEditId(null);
        setCourseThumbnail("");
        setTitle("");
        setDescription("");
        setAuthor("");
        setNumberOfBooks("");
    };

    return (
        <div>
            <h2>Book CRUD</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Book Thumbnail Image URL"
                    value={courseThumbnail}
                    onChange={(e) => setCourseThumbnail(e.target.value)}
                />
                <br /><br />
                <input
                    type="text"
                    placeholder="Book Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br /><br />
                <input
                    type="text"
                    placeholder="Author Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <br /><br />
                <input
                    type="number"
                    placeholder="Number of Books"
                    value={numberOfBooks}
                    onChange={(e) => setNumberOfBooks(e.target.value)}
                    min="0"
                />
                <br /><br />
                <textarea
                    placeholder="Book Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <br /><br />
                <button type="submit">
                    {editId ? "Update Book" : "Add Book"}
                </button>
                {editId && (
                    <button type="button" onClick={clearForm} style={{ marginLeft: "4px" }}>
                        Cancel Edit
                    </button>
                )}
            </form>
            <hr />
            <h3>Book List</h3>
            {courses.length === 0 ? (
                <p>No books found</p>
            ) : (
                <div>
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                marginBottom: "15px",
                            }}
                        >
                            <img
                                src={course.courseThumbnail}
                                alt={course.title}
                                width="200"
                            />
                            <h3>{course.title}</h3>
                            <p><strong>Author:</strong> {course.author || "Unknown"}</p>
                            <p><strong>Available Copies:</strong> {course.numberOfBooks ?? 0}</p>
                            <p>{course.description}</p>
                            <button onClick={() => handleEdit(course)} style={{ marginLeft: "4px" }}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(course._id)} style={{ marginLeft: "4px" }}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Courses;