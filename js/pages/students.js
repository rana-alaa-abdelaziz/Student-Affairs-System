import { api } from "../services/api.js";
import { Student } from "../models/students.js";

const rowsPerPage = 5;
let currentPage = 1;
let students = [];
let currentEditId = null; 

const studentsTable = document.getElementById("studentsTable");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

export async function loadStudent() {
    const data = await api.get("students");
    students = data.map(s => new Student(s.id, s.name, s.phone, s.course, s.instructorName));
    renderTable();
}

function renderTable() {
    studentsTable.innerHTML = "";
    if (!students || students.length === 0) return;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = students.slice(start, end);

    pageData.forEach((s) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.phone}</td>
            <td>${s.course}</td>
            <td>${s.instructorName}</td>
            <td>
                <button onclick="openEditModal(${s.id})">Edit</button>
                <button onclick="deleteStudent(${s.id})">Delete</button>
            </td>
        `;
        studentsTable.appendChild(tr);
    });
    updatePagination();
}

window.openEditModal = function(id) {
    const student = students.find(s => s.id == id);
    if (!student) return alert("Student not found");

    currentEditId = id;
    document.getElementById("editName").value = student.name;
    document.getElementById("editPhone").value = student.phone;
    document.getElementById("editCourse").value = student.course;
    document.getElementById("editInstructor").value = student.instructorName;
    document.getElementById("editModal").style.display = "block";
};

window.deleteStudent = async (id) => {
    if (confirm("Are you sure to delete this student?")) {
        await api.delete(`students/${id}`);
        loadStudent();
    }
};

document.getElementById("saveEditBtn").addEventListener("click", async () => {
    if (!currentEditId) return;
    
    const updatedData = {
        name: document.getElementById("editName").value,
        phone: document.getElementById("editPhone").value,
        course: document.getElementById("editCourse").value,
        instructorName: document.getElementById("editInstructor").value
    };

    try {
        await api.put(`students/${currentEditId}`, updatedData);
        document.getElementById("editModal").style.display = "none";
        currentEditId = null;
        loadStudent(); 
    } catch (error) {
        console.error("Failed to update:", error);
    }
});

document.getElementById("closeEditBtn").addEventListener("click", () => {
    document.getElementById("editModal").style.display = "none";
    currentEditId = null;
});

function updatePagination() {
    const totalPages = Math.ceil(students.length / rowsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

prevBtn.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderTable(); } });
nextBtn.addEventListener("click", () => { 
    const totalPages = Math.ceil(students.length / rowsPerPage);
    if (currentPage < totalPages) { currentPage++; renderTable(); } 
});
//!add student

document.getElementById("addStudentBtn").addEventListener("click", () => {
    document.getElementById("addId").value = "";
    document.getElementById("addName").value = "";
    document.getElementById("addPhone").value = "";
    document.getElementById("addCourse").value = "";
    document.getElementById("addInstructor").value = "";
    
    document.getElementById("addModal").style.display = "block";
});

document.getElementById("closeAddBtn").addEventListener("click", () => {
    document.getElementById("addModal").style.display = "none";
});

document.getElementById("confirmAddBtn").addEventListener("click", async () => {
    const newStudent = {
        id: document.getElementById("addId").value,
        name: document.getElementById("addName").value,
        phone: document.getElementById("addPhone").value,
        course: document.getElementById("addCourse").value,
        instructorName: document.getElementById("addInstructor").value
    };

    if(!newStudent.name || !newStudent.id) return alert("Please fill in ID and Name");

    try {
        await api.post("students", newStudent);
        document.getElementById("addModal").style.display = "none";
        loadStudent(); 
    } catch (error) {
        console.error("Error adding student:", error);
    }
});

window.addEventListener('DOMContentLoaded', loadStudent);