let username = localStorage.getItem("username");

let welcome = document.querySelector(".welcome");
let exitBtn = document.querySelector(".exit");
let createBtn = document.querySelector(".create");
let generateBtn = document.querySelector(".generate");
let passwordsContainer = document.querySelector("#passwords-container");
welcome.textContent = `Welcome ${username}`;

exitBtn.addEventListener("click", () => {
  localStorage.clear();
  location.replace("../html/index.html");
});

generateBtn.addEventListener("click", () => {
  location.href = "../html/generate.html";
});

createBtn.addEventListener("click", () => {
  location.href = "../html/create.html";
});

window.addEventListener("DOMContentLoaded", async () => {
  await passwords.get();
  setTimeout(() => {
    let userPasswords = localStorage.getItem("passwords");
    userPasswords = JSON.parse(userPasswords);
    userPasswords.forEach((password) => {
      passwordsContainer.innerHTML += `
      <div class="password-item mt-3" id="${password.id}">
            <p class="mb-0">
              ${password.title} : ${password.password}
            </p>              
            <div data-id="">
              <button class="btn btn-outline-danger removeBtn" data-id="${password.id}">
                remove
              </button>
            </div>
          </div>
      `;
    });

    let removeBtns = document.querySelectorAll(".removeBtn");
    let changeBtns = document.querySelectorAll(".changeBtn");

    removeBtns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        let id = e.target.getAttribute("data-id");
        await passwords.remove(id);
        let div = document.querySelector(`#${id}`);
        console.log(div);
        div.classList.add("d-none");
      });
    });
  }, 1000);
});
