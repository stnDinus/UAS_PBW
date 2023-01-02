$(document).ready(() => {
  const headerHeight = $("header").height();
  $("#root").css("height", `calc(100vh - ${headerHeight}px)`);

  const checkUsername = async (el, small) => {
    const value = el.val();
    //cek kosong
    if (!value.length) {
      small.text("Username tidak boleh kosong");
      return false;
    }
    //cek panjang username
    if (value.length > 12) {
      small.text("Username tidak boleh lebih dari 12 karakter");
      return false;
    }
    //cek username terpakai
    const response = await fetch(`/user/${value}`, {
      method: "POST",
    });
    switch (response.status) {
      case 406:
        small.text("");
        return true;
      default:
        small.text("Username sudah terpakai");
        return false;
    }
  };

  const checkPassword = (el, small) => {
    const password = el.val();
    //cek kosong
    if (!password.length) {
      small.text("Password tidak boleh kosong");
      return false;
    }
    //cek panjang password
    if (password.length <= 6) {
      small.text("Password harus lebih dari 6 karakter");
      return false;
    }
    if (password.length > 20) {
      small.text("Password maksimal 20 karakter");
      return false;
    }
    //cek angka
    if (!password.match(/[0-9]/g)) {
      small.text("Password harus mengandung angka");
      return false;
    }
    //cek huruf besar
    if (!password.match(/[A-Z]/g)) {
      small.text("Password harus mengandung huruf besar");
      return false;
    }
    //cek huruf kecil
    if (!password.match(/[a-z]/g)) {
      small.text("Password harus mengandung huruf kecil");
      return false;
    }
    small.text("");
    return true;
  };

  const confirmPass = (passEl, conEl, small) => {
    const password = passEl.val();
    const confirmPassword = conEl.val();
    //cek pasword sama
    if (password === confirmPassword) {
      small.text("");
      return true;
    } else {
      small.text("Password tidak sama");
      return false;
    }
  };

  const renderLogIn = (container, modal) => {
    container.text("");
    const username = $(
      `<input id="username" class="form-control" type="text" placeholder="Username">`
    );
    const password = $(
      `<input id="password" class="form-control" type="password" placeholder="Password">`
    );
    const login = $(`<button class="btn bg-blue">Log In</button>`).on(
      "click",
      async () => {
        const response = await (
          await fetch("/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: username.val(),
              password: password.val(),
            }),
          })
        ).text();
        localStorage["token"] = response;
        modal.remove();
        renderUser();
      }
    );
    container.append(
      $(
        `<div class="form-group"><label for="username">Username</label></div>`
      ).append(username),
      $(
        `<div class="form-group"><label for="password">Password</label></div>`
      ).append(password),
      $(`<div class="form-group"></div>`).append(login)
    );
  };

  const renderSignUp = (container, modal) => {
    container.text("");
    const username = $(
      `<input id="username" class="form-control" type="text" placeholder="Username">`
    ).on("change", () => checkUsername(username, usernameSmall));
    const usernameSmall = $(`<small></small>`);

    const password = $(
      `<input id="password" class="form-control" type="password" placeholder="Password">`
    ).on("input", () => {
      checkPassword(password, passwordSmall);
      confirmPass(password, confirmPassword, confirmSmall);
    });
    const passwordSmall = $(`<small></small>`);

    const confirmPassword = $(
      `<input id="confirmPassword" class="form-control" type="password" placeholder="Confirm Password">`
    ).on("input", () => confirmPass(password, confirmPassword, confirmSmall));
    const confirmSmall = $(`<small></small>`);

    const signUp = $(`<button class="btn bg-blue">Sign Up</button>`).on(
      "click",
      async () => {
        const usernameStatus = await checkUsername(username, usernameSmall);
        const passwordStatus = checkPassword(password, passwordSmall);
        const confirmStatus = confirmPass(
          password,
          confirmPassword,
          confirmSmall
        );

        console.log(usernameStatus, passwordStatus, confirmStatus);

        if (usernameStatus && passwordStatus && confirmStatus) {
          const response = await fetch("/user/new", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username.val(),
              password: password.val(),
            }),
          });
          modal.remove();
        }
      }
    );
    container.append(
      $(
        `<div class="form-group"><label for="username">Username</label></div>`
      ).append(username, usernameSmall),
      $(
        `<div class="form-group"><label for="password">Password</label></div>`
      ).append(password, passwordSmall),
      $(
        `<div class="form-group"><label for="confirmPassword">Confirm Password</label></div>`
      ).append(confirmPassword, confirmSmall),
      $(`<div class="form-group"></div>`).append(signUp)
    );
  };

  const renderUser = async () => {
    const userDiv = $(`header .user`);
    //check logged in
    if (localStorage["token"]) {
      //logged in
    } else {
      //!loggedn in
      const masukBtn = $(`<button class="btn bg-blue">Masuk</button>`).on(
        "click",
        async () => {
          const modal = $("<div id='modal' class='overflow-auto'></div>").on(
            "click",
            function (e) {
              if (e.target === this) {
                modal.remove();
              }
            }
          );

          const container = $(
            `<div class="rounded-lg p-4 bg-dark d-flex flex-column" style="width: 400px; height: fit-content;"></div>`
          );
          const nav = $(`<nav class="btn-group btn-group-toggle"></nav>`);
          const loginBtn = $(`<button class="btn bg-blue">Log In</button>`).on(
            "click",
            () => renderLogIn(content, modal)
          );
          const signUpBtn = $(
            `<button class="btn bg-blue">Sign Up</button>`
          ).on("click", () => renderSignUp(content, modal));
          nav.append(loginBtn, signUpBtn);
          const content = $(`<div></div>`);

          container.append(nav, content);
          modal.append(container);
          $(`body`).append(modal);
          loginBtn.click();
        }
      );
      userDiv.append(masukBtn);
    }
  };

  const renderBerita = async () => {
    const berita = await (await fetch("/berita")).json();
    berita.forEach((el) => {
      const card = $("<div class='card bg-dark'></div>");

      const cardBody = $("<div class='card-body'></div>");

      const cardTitle = $(`<h5 class="card-title">${el.judul}</h5>`);
      const cardSubtitle = $(
        `<h6 class="card-subtitle mb-2 text-muted">${el.kategori}</h6>`
      );
      const cardText = $(`<p class="card-text">${el.isi}</p>`);
      const cardButton = $(`<button class="btn">Baca</button>`).on(
        "click",
        async () => {
          const berita = await (await fetch(`/berita/${el.id}`)).json();

          const modal = $("<div id='modal' class='overflow-auto'></div>").on(
            "click",
            function (e) {
              if (e.target === this) {
                modal.remove();
              }
            }
          );

          const container = $(
            "<div class='bg-dark text-light overflow-auto rounded-lg container'></div>"
          );

          const kembali = $(
            '<button class="btn btn-danger"><i class="bi bi-arrow-left mr-3"></i>Kembali</button>'
          );
          kembali.on("click", () => modal.remove());

          const judul = $(`<h1 class="my-3 ml-3">${berita.judul}</h1>`);

          const kategori = $(
            `<div class="badge badge-secondary my-3">${berita.kategori}</div>`
          );

          const isi = $(`<p class='my-3'">${berita.isi}</p>`);

          const isiKomentar = $(
            '<textarea id="komentarBaru" class="w-100"></textarea>'
          );
          const buttonKomentar = $(
            '<button class="btn btn-primary mt-3">Kirim</button>'
          ).on("click", async () => {
            await fetch(`/komentar/new`, {
              method: "POST",
              headers: {
                authorization: localStorage["token"],
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                beritaId: berita.id,
                isi: isiKomentar.val(),
              }),
            });
            komentarContainer.text("");
            renderKomentar();

            isiKomentar.val("");
          });
          const komentarBaru = $(
            `<div class='d-flex flex-column align-items-start'></div>`
          ).append(
            $('<label for="komentarBaru">Komentar: </label>'),
            isiKomentar,
            buttonKomentar
          );

          const komentarContainer = $(`<div class='mt-3'></div>`);
          const renderKomentar = async () => {
            const komentar = await (
              await fetch(`/komentar?beritaId=${berita.id}`)
            ).json();

            komentarContainer.append($(`<h4>${komentar.length} komentar</h4>`));

            komentar.forEach((el) => {
              const komen = $(
                "<div class='d-flex justify-content-between align-items-start mb-3 p-2 rounded-lg bg-secondary'></div>"
              );

              const oleh = $(`<div class="font-weight-bold">${el.oleh}</div>`);
              const isi = $(`<div>${el.isi}</div>`);
              const waktu = $(
                `<div class='ml-2 font-italic'>@${el.waktu}</div>`
              );
              komen.append(
                $("<div></div>").append(
                  $("<div class='d-flex'></div>").append(oleh, waktu),
                  isi
                )
              );

              komentarContainer.append(komen);
            });
          };
          renderKomentar();
          container.append(
            $(
              "<div class='d-flex align-items-center border-bottom border-bottom border-secondary'></div>"
            ).append(kembali, judul),
            kategori,
            isi,
            komentarBaru,
            komentarContainer
          );

          modal.append(container);

          $("body").append(modal);
        }
      );

      cardBody.append(cardTitle, cardSubtitle, cardText, cardButton);

      card.append(cardBody);

      $("#isiBerita").append(card);
    });
  };

  const renderGaleri = async () => {
    const isiGaleri = $(`#isiGaleri`);

    const images = await (await fetch(`/galeri`)).json();

    images.forEach((image) => {
      const card = $(
        `<div class="card bg-dark m-2 overflow-hidden" style="width: 300px"></div>`
      );
      const cardImage = $(
        `<img src="${image.thumbnail}" class="card-image bg-black">`
      );
      const cardBody = $(`<div class="card-body"></div>`);
      const cardTitle = $(`<h5 class="card-title">${image.nama}</h5>`);
      const cardText = $(
        `<p class="card-text">${image.deskripsi.slice(0, 40)}${
          image.deskripsi.length > 40 ? "..." : ""
        }</p>`
      );
      const lihat = $(`<button class="btn bg-blue">Lihat</button>`).on(
        "click",
        async () => {
          const response = await (await fetch(`/galeri/${image.rowid}`)).json();

          const modal = $("<div id='modal' class='overflow-auto'></div>").on(
            "click",
            function (e) {
              if (e.target === this) {
                modal.remove();
              }
            }
          );

          const container = $(
            "<div class='bg-dark text-light overflow-auto rounded-lg container'></div>"
          );

          const kembali = $(
            '<button class="btn btn-danger"><i class="bi bi-arrow-left mr-3"></i>Kembali</button>'
          );
          kembali.on("click", () => modal.remove());
          const nama = $(`<h1 class="my-3 ml-3">${response.nama}</h1>`);
          const deskripsi = $(
            `<p class="deskripsi font-italic">"${response.deskripsi}"</p>`
          );
          const imageEl = $(`<img src="${response.image}" class="w-100 my-3">`);

          container.append(
            $(
              "<div class='d-flex align-items-center border-bottom border-bottom border-secondary'></div>"
            ).append(kembali, nama),
            imageEl,
            deskripsi
          );

          modal.append(container);

          $("body").append(modal);
        }
      );

      cardBody.append(cardTitle, cardText, lihat);
      card.append(cardImage, cardBody);
      isiGaleri.append(card);
    });
  };

  const renderVideo = async () => {
    (await (await fetch("/video")).json()).forEach((video) => {
      $(`#isiVideo`).append(
        `<iframe class="m-3" src="https://www.youtube-nocookie.com/embed/${video.id}" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 321px; height: 180px;"></iframe>`
      );
    });
  };

  const renderPengaduan = async () => {
    const judulLabel = $(`<label for="pgdnJudul">Judul</label>`);
    const judulInput = $(
      `<input class="form-control" id="pgdnJudul" type="text" placeholder="Judul Pengaduan">`
    );
    const judulGroup = $(`<div class="form-group"></div>`).append(
      judulLabel,
      judulInput
    );
    const kategoriLabel = $(`<label for="pgdnKategori">Kategori</label>`);
    const kategoriSelect = $(`
    <select class="form-control" id="pgdnKategori">
      <option value="agama">Agama</option>
      <option value="keshatan">Kesehatan</option>
      <option value="keuangan">Keuangan</option>
      <option value="kecelakaan">Kecelakaan</option>
      <option value="politik">Politik</option>
      <option value="pendidikan">Pendidikan</option>
      <option value="kebudayaan">Kebudayaan</option>
    </select>`);
    const kategoriGroup = $(`<div class="form-group"></div>`).append(
      kategoriLabel,
      kategoriSelect
    );
    const isiLabel = $(`<label for="pgdnIsi">Isi</label>`);
    const isiTextArea = $(
      `<textarea class="form-control" id="pgdnIsi" rows="10" placeholder="Isi Pengaduan"></textarea>`
    );
    const isiGroup = $(`<div class="form-group"></div>`).append(
      isiLabel,
      isiTextArea
    );
    const tanggalLabel = $(`<label for="pgdnTanggal">Tanggal</label>`);
    const tanggalInput = $(
      `<input class="form-control" id="pgdnTanggal" type="date">`
    );
    const tanggalGroup = $(`<div class="form-group"></div>`).append(
      tanggalLabel,
      tanggalInput
    );
    const anonimLabel = $(`<label for="pgdnAnonim" class="m-0">Anonim</label>`);
    const anonimInput = $(`<input id="pgdnAnonim" type="checkbox">`);
    const lapor = $(`<button class="ml-3 btn btn-warning">Lapor</button>`).on(
      "click",
      async () => {
        const response = await fetch("/pengaduan/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage["token"],
          },
          body: JSON.stringify({
            judul: judulInput.val(),
            kategori: kategoriSelect.val(),
            isi: isiTextArea.val(),
            tanggal: tanggalInput.val(),
            anonim: anonimInput[0].checked,
          }),
        });
      }
    );
    const laporGroup = $(
      `<div class="d-flex align-items-center justify-content-end gap-3"></div>`
    ).append(anonimLabel, anonimInput, lapor);

    $(`#isiPengaduan`).append(
      judulGroup,
      kategoriGroup,
      isiGroup,
      tanggalGroup,
      laporGroup
    );
  };

  renderUser();
  renderBerita();
  renderVideo();
  renderGaleri();
  renderPengaduan();
});
