import { api } from "../services/api.js";
import { Employee} from "../models/Employee.js";

const rowsPerPage = 4;
let currentPage = 1;
let employees = [];
let currentEditId = null; 

const employeeTable = document.getElementById("employeesTable");
const prevBtn = document.getElementById("EmpPrevPage");
const nextBtn = document.getElementById("EmpNextPage");
const pageInfo = document.getElementById("EmpPageInfo");

export async function loadEmployee() {
    currentPage = 1;
    const data = await api.get("employees");
    employees = data.map(s => new Employee(s.id, s.name, s.email, s.jobTitle, s.office,s.phone));
    renderTable();
}

function renderTable() {
    employeeTable.innerHTML = "";
    if (!employees || employees.length === 0) return;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = employees.slice(start, end);

    pageData.forEach((s) => {
        const tr = document.createElement("tr");
tr.innerHTML = `
    <td>${s.id}</td>
    <td>${s.name}</td>
    <td>${s.email}</td>
    <td>${s.jobTitle}</td>
    <td>${s.office}</td>
    <td>${s.phone}</td>
    <td>
        <button onclick="openEditModal(${s.id})">Edit</button>
        <button onclick="deleteEmployee(${s.id})">Delete</button>
    </td>
`;
        employeeTable.appendChild(tr);
    });
    updatePagination();
}

window.openEditModal = function(id) {
    const employee = employees.find(s => s.id == id);
    if (!employee) return alert("employee not found");

    currentEditId = id;
    document.getElementById("editEmpId").value = employee.id;
    document.getElementById("editEmpName").value = employee.name;
    document.getElementById("editEmpemail").value = employee.email;
    document.getElementById("editEmpjobTittle").value = employee.jobTitle;
    document.getElementById("editEmpoffice").value =employee.office;
    document.getElementById("editEmpphone").value = employee.phone;
    document.getElementById("editEmpModal").style.display = "block";
};

window.deleteEmployee = async (id) => {
    if (confirm("Are you sure to delete this employee?")) {
        await api.delete(`employees/${id}`);
        loadEmployee();
    }
};

document.getElementById("saveEditEmpBtn").addEventListener("click", async () => {
    if (!currentEditId) return;
    
    const updatedData = {
        id: document.getElementById("editEmpId").value,
        name: document.getElementById("editEmpName").value ,
        email: document.getElementById("editEmpemail").value, 
        jobTitle:  document.getElementById("editEmpjobTittle").value,
       office: document.getElementById("editEmpoffice").value,
        phone: document.getElementById("editEmpphone").value,
        instructorName: document.getElementById("editEmpModal").value
    };

    try {
        await api.put(`employees/${currentEditId}`, updatedData);
        document.getElementById("editEmpModal").style.display = "none";
        currentEditId = null;
        loadEmployee(); 
    } catch (error) {
        console.error("Failed to update:", error);
    }
});

document.getElementById("closeEditEmptBtn").addEventListener("click", () => {
    document.getElementById("editEmpModal").style.display = "none";
    currentEditId = null;
});

function updatePagination() {
    const totalPages = Math.ceil(employees.length / rowsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

prevBtn.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderTable(); } });
nextBtn.addEventListener("click", () => { 
    const totalPages = Math.ceil(employees.length / rowsPerPage);
    if (currentPage < totalPages) { currentPage++; renderTable(); } 
});
//!add student

document.getElementById("addEmpBtn").addEventListener("click", () => {
    document.getElementById("addEmpId").value = "";
    document.getElementById("addEmpName").value = "";
    document.getElementById("addEmpemail").value = "";
    document.getElementById("addEmpJob").value = "";
    document.getElementById("addEmpoffice").value = "";
    document.getElementById("addEmpphone").value = "";


    document.getElementById("addEmpModal").style.display = "block";
});

document.getElementById("closeAddEmpBtn").addEventListener("click", () => {
    document.getElementById("addEmpModal").style.display = "none";
});

document.getElementById("confirmAddEmpBtn").addEventListener("click", async () => {
    const newEmployee = {
        id: document.getElementById("addEmpId").value,
        name: document.getElementById("addEmpName").value ,
        email: document.getElementById("addEmpemail").value, 
        jobTitle:  document.getElementById("addEmpJob").value,
       office: document.getElementById("addEmpoffice").value,
        phone: document.getElementById("addEmpphone").value,
        // instructorName: document.getElementById("editEmpModal").value
    };

    if(!newEmployee.name || !newEmployee.id) return alert("Please fill in ID and Name");

    try {
        await api.post("employees", newEmployee);
        document.getElementById("addEmpModal").style.display = "none";
        loadEmployee(); 
    } catch (error) {
        console.error("Error adding Employee:", error);
    }
});

window.addEventListener('DOMContentLoaded', loadEmployee);