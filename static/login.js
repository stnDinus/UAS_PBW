const usernameEl = document.querySelector("#username");
const passwordEl = document.querySelector("#password");

login = async () => {
  const username = usernameEl.value;
  const password = passwordEl.value;

  const response = await fetch("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  switch (response.status) {
    case 200:
      localStorage["token"] = await response.text();
      break;
    case 406:
      console.log("Username atau Password salah");
      break;
    default:
      console.error("Server Error");
  }
};
document.querySelector("#login").addEventListener("click", login);
