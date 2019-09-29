import axios from "axios";
import "bulma/css/bulma.css";

function updateInfo(user) {
  if (user.username) {
    const searchStatus = document.getElementById("search-status");
    searchStatus.classList.toggle("is-hidden", true);
    const info = document.getElementById("info");
    info.classList.toggle("is-hidden", false);
    const logo = document.getElementById("logo");
    logo.src = user.logo;
    const username = document.getElementById("username");
    username.innerHTML = user.username;
    const status = document.getElementById("status");
    status.innerHTML = user.isActive ? "Active User" : "Inactive User";
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    for (const attribute of Object.keys(user)) {
      const row = document.createElement("tr");
      const title = document.createElement("th");
      title.innerHTML = attribute;
      row.appendChild(title);
      const value = document.createElement("td");
      value.innerHTML = user[attribute];
      row.appendChild(value);
      tableBody.appendChild(row);
    }
  } else {
    const searchStatus = document.getElementById("search-status");
    searchStatus.classList.toggle("is-hidden", false);
    const info = document.getElementById("info");
    info.classList.toggle("is-hidden", true);
  }
}

async function findByID(id) {
  const user = (await axios.get(`/by-id?id=${id}`)).data;
  updateInfo(user);
}

async function findByUsername(id) {
  const user = (await axios.get(`/by-login?login=${id}`)).data;
  updateInfo(user);
}

function setup() {
  const searchByIDButton = document.getElementById("search-by-id");
  const searchByIDTerm = document.getElementById("id-search-term");
  searchByIDButton.onclick = () => findByID(searchByIDTerm.value);
  const searchByUsernameButton = document.getElementById("search-by-username");
  const searchByUsernameTerm = document.getElementById("username-search-term");
  searchByUsernameButton.onclick = () =>
    findByUsername(searchByUsernameTerm.value);
}
window.onload = setup;
