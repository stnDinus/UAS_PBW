const usernameEl = document.querySelector("#username");
const usernameWarning = document.querySelector("#usernameWarning");
checkUsername = async () => {
  const value = usernameEl.value;
  //cek kosong
  if (!value.length) {
    usernameWarning.textContent = "Username tidak boleh kosong";
    return false;
  }
  //cek panjang username
  if (value.length > 12) {
    usernameWarning.textContent = "Username harus kurang dari 12 karakter";
    return false;
  }
  //cek username terpakai
  const response = await fetch("/user/checkUsernameStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: value,
    }),
  });
  switch (response.status) {
    case 406:
      usernameWarning.textContent = "Username sudah terpakai";
      return false;
    default:
      usernameWarning.textContent = "";
      return true;
  }
};
usernameEl.addEventListener("change", checkUsername);

const passwordEl = document.querySelector("#password");
const passwordWarning = document.querySelector("#passwordWarning");
checkPassword = () => {
  const password = passwordEl.value;
  //cek kosong
  if (!password.length) {
    passwordWarning.textContent = "Password tidak boleh kosong";
    return false;
  }
  //cek panjang password
  if (password.length <= 6) {
    passwordWarning.textContent = "Password harus lebih dari 6 karakter";
    return false;
  }
  if (password.length > 20) {
    passwordWarning.textContent = "Password maksimal 20 karakter";
    return false;
  }
  //cek angka
  if (!password.match(/[0-9]/g)) {
    passwordWarning.textContent = "Password harus mengandung angka";
    return false;
  }
  //cek huruf besar
  if (!password.match(/[A-Z]/g)) {
    passwordWarning.textContent = "Password harus mengandung huruf besar";
    return false;
  }
  //cek huruf kecil
  if (!password.match(/[a-z]/g)) {
    passwordWarning.textContent = "Password harus mengandung huruf kecil";
    return false;
  }
  passwordWarning.textContent = "";
  return true;
};
passwordEl.addEventListener("input", checkPassword);

const confirmPasswordEl = document.querySelector("#confirmPassword");
const confirmPasswordWarning = document.querySelector(
  "#confirmPasswordWarning"
);
confirmPass = () => {
  const password = passwordEl.value;
  const confirmPassword = confirmPasswordEl.value;
  //cek pasword sama
  if (password === confirmPassword) {
    confirmPasswordWarning.textContent = "";
    return true;
  } else {
    confirmPasswordWarning.textContent = "Password tidak sama";
    return false;
  }
};
confirmPasswordEl.addEventListener("input", confirmPass);

signUp = async () => {
  console.log(await checkUsername(), checkPassword(), confirmPass());
  if ((await checkUsername()) && checkPassword() && confirmPass()) {
    const username = usernameEl.value;
    const password = passwordEl.value;

    const response = await fetch("/user/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
  }
};
document.querySelector("#signUp").addEventListener("click", signUp);
