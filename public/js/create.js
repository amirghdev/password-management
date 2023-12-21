let createForm = document.querySelector("#create"),
  title = document.querySelector("#title"),
  password = document.querySelector("#password");

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await passwords.create(title.value, password.value);
  setTimeout(() => {
    if (localStorage.getItem("action") === "done") {
      localStorage.setItem("action", "false");
      location.href = "../html/home.html";
    }
  }, 1000);
});
