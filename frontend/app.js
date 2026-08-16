const API_URL = "/api/students";

const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");

async function loadStudents() {

    const response = await fetch(API_URL);
    const students = await response.json();

    studentList.innerHTML = "";

    students.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>
                <button onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        `;

        studentList.appendChild(row);
    });
}

studentForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        course: document.getElementById("course").value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });

    studentForm.reset();

    loadStudents();
});

async function deleteStudent(id) {

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadStudents();
}

loadStudents();