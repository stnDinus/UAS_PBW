const usernameEl = document.querySelector("#username");
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
