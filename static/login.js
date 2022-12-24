const usernameEl = document.querySelector("#username");
const usernameWarning = document.querySelector("#usernameWarning");
checkUsername = () => {
  const value = usernameEl.value;
  if (value.length > 12) {
    usernameWarning.textContent = "Username harus kurang dari 12 karakter";
    return;
  }
  fetch("/user/checkUsername", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: value,
    }),
  }).then((response) => {
    switch (response.status) {
      case 406:
        usernameWarning.textContent = "Username sudah terpakai";
        break;
      default:
        usernameWarning.textContent = "";
    }
  });
};
usernameEl.addEventListener("change", checkUsername);

const passwordEl = document.querySelector("#password");

login = () => {
  const username = usernameEl.value;
  const password = passwordEl.value;

  fetch("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
};
document.querySelector("#login").addEventListener("click", login);
