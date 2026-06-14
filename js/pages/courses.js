import{api} from "../services/api.js";
import { course } from "../models/course.js";
const rowsPerPage=5;
let currentPage=1;
let courses=[];
let currentEditId=null;
const CourseTable=document.getElementById("coursesTable");
const prevBtn = document.getElementById("coursePrevPage");
const nextBtn = document.getElementById("courseNextPage");
const pageInfo = document.getElementById("coursePageInfo");
export async function loadCourse() {
    const data=await api.get("courses");
     courses=data.map(s=>new course(s.id, s.course_name, s.instructor));

    renderTable();//!
}
function renderTable() {
    CourseTable.innerHTML = "";
    if (!courses || courses.length === 0) return;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = courses.slice(start, end);

    pageData.forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.instructor}</td>
            <td>
                <button class="edit-btn" data-id="${c.id}">Edit</button>
                <button class="delete-btn" data-id="${c.id}">Delete</button>
            </td>
        `;
        CourseTable.append(tr);
    });

    CourseTable.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.dataset.id;
            openCourseEditModal(id);
        });
    });

    CourseTable.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.dataset.id;
            deleteCourse(id);
        });
    });

    updatePagination();
}


document.getElementById("addCourseBtn").addEventListener("click", () => {
    document.getElementById("addCourseId").value = "";
    document.getElementById("addCourseName").value = "";
    document.getElementById("addCourseInstructor").value = "";
    document.getElementById("addCourseModal").style.display = "block";
});

window.openCourseEditModal = function(id) {
    const foundCourse = courses.find(s => s.id == id);
    if (!foundCourse) return alert("Course not found");

    currentEditId = id;
    document.getElementById("editCourseId").value = foundCourse.id;
    document.getElementById("editCourseName").value = foundCourse.name;
    document.getElementById("editCourseInstructor").value = foundCourse.instructor;
    document.getElementById("editCourseModal").style.display = "block";
};
window.deleteCourse = async (id) => {
    if (confirm("Are you sure to delete this course?")) {
        await api.delete(`courses/${id}`);
        loadCourse(); 
    }
};

document.getElementById("saveEditCourseBtn").addEventListener("click", async () => {
    if (!currentEditId) return;
    
    const updatedData = {
        id: document.getElementById("editCourseId").value,
        name: document.getElementById("editCourseName").value,
        instructor: document.getElementById("editCourseInstructor").value
    };

    try {
        await api.put(`courses/${currentEditId}`, updatedData);
        document.getElementById("editCourseModal").style.display = "none";
        currentEditId = null;
        loadCourse(); 
    } catch (error) {
        console.error("Failed to update:", error);
    }
});
document.getElementById("closeEditCourseBtn").addEventListener("click", () => {
    document.getElementById("editCourseModal").style.display = "none";
    currentEditId = null;
});

function updatePagination() {
    const totalPages = Math.ceil(courses.length / rowsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

prevBtn.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderTable(); } });
nextBtn.addEventListener("click", () => { 
    const totalPages = Math.ceil(courses.length / rowsPerPage);
    if (currentPage < totalPages) { currentPage++; renderTable(); } 
});
//!add course
document.getElementById("addCourseBtn").addEventListener("click", () => {
if (document.getElementById("coursesDiv").style.display === "block") {
        document.getElementById("addCourseId").value = "";
        document.getElementById("addCourseName").value = "";
        document.getElementById("addCourseInstructor").value = "";
        document.getElementById("addCourseModal").style.display = "block";
    }
});

document.getElementById("closeAddCourseBtn").addEventListener("click", () => {
    document.getElementById("addCourseModal").style.display = "none";
});


document.getElementById("confirmAddCourseBtn").addEventListener("click", async () => {
    const newCourse = {
        id: document.getElementById("addCourseId").value,
        name: document.getElementById("addCourseName").value,
        instructor: document.getElementById("addCourseInstructor").value
    };

    if(!newCourse.name || !newCourse.id) return alert("Please fill in ID and Name");

    try {
        await api.post("courses", newCourse);
        document.getElementById("addCourseModal").style.display = "none";
        loadCourse(); 
    } catch (error) {
        console.error("Error adding Course:", error);
    }
});


window.addEventListener('DOMContentLoaded', loadCourse);
