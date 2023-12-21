let generateForm = document.querySelector("#generate"),
  title = document.querySelector("#title");

generateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await passwords.generate(title.value);
  setTimeout(() => {
    if (localStorage.getItem("action") === "done") {
      localStorage.setItem("action", "false");
      location.href = "../html/home.html";
    }
  }, 1000);
});
