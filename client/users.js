import "bulma/css/bulma.css";
import axios from "axios";

async function updateTable() {
  const tableBody = document.getElementById("table-body");
  const activeUsers = (await axios.get("/fetch-users")).data;
  for (const user of activeUsers) {
    const row = document.createElement("tr");
    const id = document.createElement("th");
    id.innerHTML = user.id;
    id.style.verticalAlign = "middle";
    row.appendChild(id);

    const username = document.createElement("td");
    username.innerHTML = user.username;
    username.style.verticalAlign = "middle";
    row.appendChild(username);

    const logo = document.createElement("td");
    const profilePicture = document.createElement("img");
    profilePicture.src = user.logo;
    logo.appendChild(profilePicture);
    logo.style.textAlign = "center";
    row.appendChild(logo);
    tableBody.appendChild(row);
  }
}
window.onload = async () => {
  await updateTable();
  const fact = document.getElementById("random-fact");
  const info = (await axios.get(
    "https://uselessfacts.jsph.pl/random.json?language=en"
  )).data;
  fact.innerHTML = `${info.text} (<a href="${info.source_url}">source</a>)`;
};
