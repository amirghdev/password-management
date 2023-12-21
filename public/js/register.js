let username = document.querySelector("#username");
let password = document.querySelector("#password");
let btn = document.querySelector("#registerBtn");
let registerForm = document.querySelector("#register");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await auth.register(username.value, password.value);
  setTimeout(() => {
    if (localStorage.getItem("action") === "done") {
      localStorage.setItem("action", "false");
      location.href = "../html/index.html";
    }
  }, 1000);
});
