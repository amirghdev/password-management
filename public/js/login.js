let username = document.querySelector("#username");
let password = document.querySelector("#password");
let loginForm = document.querySelector("#login");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await auth.login(username.value, password.value);
  setTimeout(() => {
    if (localStorage.getItem("action") === "done") {
      localStorage.setItem("action", "false");
      location.replace("../html/home.html");
    }
  }, 1000);
});
