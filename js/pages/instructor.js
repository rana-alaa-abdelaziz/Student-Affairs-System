import{api} from "../services/api.js";
import { instructor } from "../models/instructor.js";
const rowsPerPage=4;
let currentPage=1;
let instructors=[];
let currentEditId=null;
const instructorTable=document.getElementById("instructorsTable");
const prevBtn = document.getElementById("instPrevPage");
const nextBtn = document.getElementById("instNextPage");
const pageInfo = document.getElementById("instPageInfo");
export async function loadinstructor() {
    const data=await api.get("instructors");
     instructors=data.map(s=>new instructor(s.id, s.name, s.department,s.email,s.course,s.phone));
    renderTable();
}
 
function renderTable() {
    instructorTable.innerHTML = "";
    if (!instructors || instructors.length === 0) return;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = instructors.slice(start, end);

    pageData.forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.department}</td>
            <td>${c.email}</td>
            <td>${c.course}</td>
            <td>${c.phone}</td>
            <td>
                <button class="edit-btn" data-id="${c.id}">Edit</button>
                <button class="delete-btn" data-id="${c.id}">Delete</button>
            </td>
        `;
        instructorTable.append(tr);
        
    });

    instructorTable.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.dataset.id;
            openCourseEditModal(id);
        });
    });

    instructorTable.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.dataset.id;
            deleteCourse(id);
        });
    });

    updatePagination();
}


document.getElementById("addInstBtn").addEventListener("click", () => {
    document.getElementById("addinstId").value = "";
    document.getElementById("addinstName").value = "";
    document.getElementById("addinstemail").value = "";
     document.getElementById("addinstdepartment").value = "";
      document.getElementById("addinstcourses").value = "";
       document.getElementById("addinstphone").value = "";
    document.getElementById("addinstModal").style.display = "block";
});

window.openCourseEditModal = function(id) {
    const foundinst = instructors.find(s => s.id == id);
    if (!foundinst) return alert("Instructor not found");

    currentEditId = id;
    document.getElementById("editinstId").value = foundinst.id;
    document.getElementById("editinstName").value = foundinst.name;
    document.getElementById("editinstemail").value = foundinst.instructor;
    document.getElementById("editinstdepartment").value = foundinst.instructor;
    document.getElementById("editinstcourses").value = foundinst.instructor;
    document.getElementById("editinstphone").value = foundinst.instructor;

    document.getElementById("editinstModal").style.display = "block";
};
window.deleteInstructor= async (id) => {
    if (confirm("Are you sure to delete this instructor?")) {
        await api.delete(`instructors/${id}`);
        loadinstructor(); 
    }
};

document.getElementById("saveEditinstBtn").addEventListener("click", async () => {
    if (!currentEditId) return;
    
    const updatedData = {
        id:  document.getElementById("editinstId").value,
        name:  document.getElementById("editinstName").value,
        email:document.getElementById("editinstemail").value ,
        department:    document.getElementById("editinstdepartment").value,
        course:    document.getElementById("editinstcourses").value,
        phone:document.getElementById("editinstModal")
    };

    try {
        await api.put(`instructor/${currentEditId}`, updatedData);
        document.getElementById("editinstModal").style.display = "none";
        currentEditId = null;
        loadinstructor(); 
    } catch (error) {
        console.error("Failed to update:", error);
    }
});
document.getElementById("closeEditinstBtn").addEventListener("click", () => {
    document.getElementById("editinstModal").style.display = "none";
    currentEditId = null;
});

function updatePagination() {
    const totalPages = Math.ceil(instructors.length / rowsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

prevBtn.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderTable(); } });
nextBtn.addEventListener("click", () => { 
    const totalPages = Math.ceil(instructors.length / rowsPerPage);
    if (currentPage < totalPages) { currentPage++; renderTable(); } 
});
//!add course
document.getElementById("addinstModal").addEventListener("click", () => {
if (document.getElementById("instructorsDiv").style.display === "block") {
          document.getElementById("addinstId").value = "";
    document.getElementById("addinstName").value = "";
    document.getElementById("addinstemail").value = "";
     document.getElementById("addinstdepartment").value = "";
      document.getElementById("addinstcourses").value = "";
       document.getElementById("addinstphone").value = "";
        document.getElementById("addCourseModal").style.display = "block";
    }
});

document.getElementById("closeAddinstBtn").addEventListener("click", () => {
    document.getElementById("addinstModal").style.display = "none";
});


document.getElementById("confirmAddinstBtn").addEventListener("click", async () => {
    const newinst = {
      id:  document.getElementById("addinstId").value,
        name:  document.getElementById("addinstName").value,
        email:document.getElementById("addinstemail").value ,
        department:    document.getElementById("addinstdepartment").value,
        course:    document.getElementById("addinstcourses").value,
        phone:document.getElementById("addinstphone")
    };

    if(!newinst.name || !newinst.id) return alert("Please fill in ID and Name");

    try {
        await api.post("instructors", newinst);
        document.getElementById("addinstModal").style.display = "none";
        loadinstructor(); 
    } catch (error) {
        console.error("Error adding Course:", error);
    }
});


window.addEventListener('DOMContentLoaded', loadinstructor);
