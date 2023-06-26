const cacheKey = "todoData";
let list_belum = [];
let list_sudah = [];

// fungsi untuk tambah task
function addTask() {
  const input_task = document.getElementById("input_task");
  const task = input_task.value.trim(); //menghapus spasi yang tdk perlu dlm string
  if (task !== "") {
    const id = +new Date();
    const input_date = document.getElementById("input_date").value;
    const date = formatTanggal(input_date);
    const newTask = { id, task, date, completed: false };
    list_belum.push(newTask);
    updateLocalStorage();
    hasilList_belum();
    input_task.value = "";
    document.getElementById("input_date").value = "";

    // untuk alert jika inputan tidak lengkap
  } else {
    alert("isi yang bener bang");
  }
}

// fungsi untuk tugas yang sudah selesai (include search)
function completeTask(id) {
  const taskIndex = list_belum.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    const completedTask = list_belum.splice(taskIndex, 1)[0];
    completedTask.completed = true;
    list_sudah.push(completedTask);
    updateLocalStorage();
    hasilList_belum();
    hasilList_sudah();
  }
}

// fungsi untuk tugas yang belum selesai (include search)
function uncompleteTask(id) {
  const taskIndex = list_sudah.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    const uncompletedTask = list_sudah.splice(taskIndex, 1)[0];
    uncompletedTask.completed = false;
    list_belum.push(uncompletedTask);
    updateLocalStorage();
    hasilList_belum();
    hasilList_sudah();
  }
}

// fungsi untuk delete task
function deleteTask(id) {
  const taskIndexBelum = list_belum.findIndex((task) => task.id === id);
  const taskIndexSudah = list_sudah.findIndex((task) => task.id === id);
  if (taskIndexBelum !== -1) {
    //untuk task yg belum
    list_belum.splice(taskIndexBelum, 1);
    updateLocalStorage();
    hasilList_belum();
  }
  if (taskIndexSudah !== -1) {
    //untuk task yg sudah
    list_sudah.splice(taskIndexSudah, 1);
    updateLocalStorage();
    hasilList_sudah();
  }
}

// update local storage
function updateLocalStorage() {
  const data = { list_belum, list_sudah };
  localStorage.setItem(cacheKey, JSON.stringify(data));
}

// fungsi untuk menampilkan list yang belum selesai + tombol
function hasilList_belum() {
  const list_belumElement = document.getElementById("list_belum");
  list_belumElement.innerHTML = "";
  list_belum.map((task) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${task.task} | ${task.date}`;
    const completeButton = document.createElement("button");
    completeButton.textContent = "Selesai";
    completeButton.addEventListener("click", () => completeTask(task.id));
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus";
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);
    list_belumElement.appendChild(listItem);
  });
}

// fungsi untuk menampilkan list yang sudah selesai + tombol
function hasilList_sudah() {
  const list_sudahElement = document.getElementById("list_sudah");
  list_sudahElement.innerHTML = "";
  list_sudah.map((task) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${task.task} | ${task.date}`;
    const uncompleteButton = document.createElement("button");
    uncompleteButton.textContent = "Belum Selesai";
    uncompleteButton.addEventListener("click", () => uncompleteTask(task.id));
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus";
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    listItem.appendChild(uncompleteButton);
    listItem.appendChild(deleteButton);
    list_sudahElement.appendChild(listItem);
  });
}

// fungsi untuk memformat tanggal agar dd/mm/yyyy
function formatTanggal(dateString) {
  const dateParts = dateString.split("-");
  const day = dateParts[2].padStart(2, "0");
  const month = dateParts[1].padStart(2, "0");
  const year = dateParts[0];
  return `${day}-${month}-${year}`;
}

// fungsi untuk search task
function searchTask() {
  const searchInput = document
    .getElementById("search_input")
    .value.trim()
    .toLowerCase();
  const taskFilter = list_belum.filter((task) =>
    task.task.toLowerCase().includes(searchInput)
  );
  hasilFilter(taskFilter);
}

// fungsi untuk memfilter rask
function hasilFilter(taskFilter) {
  const taskFilterElement = document.getElementById("task_filter");
  taskFilterElement.innerHTML = "";
  taskFilter.map((task) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${task.task} - ${task.date}`;
    const completeButton = document.createElement("button");
    completeButton.textContent = "Selesai";
    completeButton.addEventListener("click", () => completeTask(task.id));
    listItem.appendChild(completeButton);
    taskFilterElement.appendChild(listItem);
  });
}

// Mengambil data dari cache storage
const data = JSON.parse(localStorage.getItem(cacheKey));
if (data) {
  list_belum = data.list_belum || [];
  list_sudah = data.list_sudah || [];
}
hasilList_belum();
hasilList_sudah();
