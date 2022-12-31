$(document).ready(() => {
  const root = $("#root");

  const navButtons = $("nav>.button");

  navButtons.on("click", function () {
    navButtons.removeClass("bg-primary");
    $(this).addClass("bg-primary");
    root.text("");
    switch ($(this).attr("value")) {
      case "berita":
        renderBerita();
        break;
      case "galeri":
        renderGaleri();
        break;
    }
  });

  const renderBerita = async () => {
    const tbody = $("<tbody></tbody>");
    const table = $(
      "<table class='table table-bordered table-hover table-dark text-light rounded-lg'></table>"
    ).append(
      `<thead>
        <tr>
          <th class="text-right">#</th>
          <th>Judul</th>
          <th>Kategori</th>
          <th class="text-center" style='width: 3em;'>Delete</th>
        </thead>`,
      tbody
    );

    root.append(table);

    //render isi tabel
    const renderTbody = async () => {
      const response = await (
        await fetch("/berita", {
          method: "GET",
        })
      ).json();

      tbody.text("");

      response.forEach((el) => {
        const tr = $(`<tr ></tr>`);

        const id = $(`<th class="text-right">${el.id}</th>`);
        const judul = $(`<td style="cursor: pointer;">${el.judul}</td>`);
        judul.on("click", () => renderBeritaId(el.id));
        const kategori = $(`<td>${el.kategori}</td>`);
        const del = $(`<td class="d-flex justify-content-center"></td>`).append(
          $(
            "<button class='btn btn-danger'><i class='bi bi-trash'></i></button>"
          ).on("click", async () => {
            await fetch("/berita", {
              method: "DELETE",
              headers: {
                authorization: localStorage["token"],
                "Content-Type": "text/plain",
              },
              body: el.id,
            });
            renderTbody();
          })
        );

        tr.append(id, judul, kategori, del);

        tbody.append(tr);
      });
    };
    renderTbody();

    //berita baru
    const form = $("<div></div>");

    const groupJudul = $("<div class='form-group'></div>");
    const labelJudul = $("<label for='judul'>Judul</label>");
    const inputJudul = $(
      "<input id='judul' class='form-control' type='text' placeholder='Judul berita'>"
    );
    groupJudul.append(labelJudul, inputJudul);

    const groupKategori = $('<div class="form-group"></div>');
    const labelKategori = $('<label for="kategori">Kategori</label>');
    const selectKategori = $(
      '<select id="kategori" class="custom-select"></select>'
    );
    const response = await (
      await fetch("/berita/kategori", {
        method: "GET",
      })
    ).json();
    response.forEach((el) => {
      selectKategori.append(
        $(
          `<option value=${el.kategori}>${
            el.kategori.charAt(0).toUpperCase() + el.kategori.slice(1)
          }</option>`
        )
      );
    });
    groupKategori.append(labelKategori, selectKategori);

    const groupIsi = $('<div class="form-group"></div>');
    const labelIsi = $('<label for="isi">Isi Berita</label>');
    const textareaIsi = $(
      '<textarea class="form-control" id="isi" rows="10"></textarea>'
    );
    groupIsi.append(labelIsi, textareaIsi);

    const submitButton = $('<button class="btn btn-primary">Submit</button>');
    submitButton.on("click", async () => {
      const judul = inputJudul.val();
      const kategori = selectKategori.val();
      const isi = textareaIsi.val();

      await fetch("/berita", {
        method: "POST",
        headers: {
          authorization: localStorage["token"],
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judul: judul,
          kategori: kategori,
          isi: isi,
        }),
      });
      renderTbody();
    });

    form.append(groupJudul, groupKategori, groupIsi, submitButton);

    root.append(form);
  };

  const renderBeritaId = async (id) => {
    const berita = await (await fetch(`/berita/${id}`)).json();

    root.text("");

    const kembali = $(
      '<button class="btn btn-danger"><i class="bi bi-arrow-left mr-3"></i>Kembali</button>'
    );
    kembali.on("click", () => {
      root.text("");
      renderBerita();
    });
    root.append(
      $(
        "<header class='d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary'></header>"
      ).append(kembali, "<span class='h1 px-3'>Edit Berita</span>")
    );

    const form = $("<div></div>");

    const groupJudul = $("<div class='form-group'></div>");
    const labelJudul = $("<label for='judul'>Judul</label>");
    const inputJudul = $(
      "<input id='judul' class='form-control' type='text' placeholder='Judul berita'>"
    );
    inputJudul.val(berita.judul);
    groupJudul.append(labelJudul, inputJudul);

    const groupKategori = $('<div class="form-group"></div>');
    const labelKategori = $('<label for="kategori">Kategori</label>');
    const selectKategori = $(
      '<select id="kategori" class="custom-select"></select>'
    );
    const response = await (
      await fetch("/berita/kategori", {
        method: "GET",
      })
    ).json();
    response.forEach((el) => {
      selectKategori.append(
        $(
          `<option value=${el.kategori}>${
            el.kategori.charAt(0).toUpperCase() + el.kategori.slice(1)
          }</option>`
        )
      );
    });
    selectKategori.val(berita.kategori);
    groupKategori.append(labelKategori, selectKategori);

    const groupIsi = $('<div class="form-group"></div>');
    const labelIsi = $('<label for="isi">Isi Berita</label>');
    const textareaIsi = $(
      `<textarea class="form-control" id="isi" rows="10">${berita.isi}</textarea>`
    );
    groupIsi.append(labelIsi, textareaIsi);

    const update = $('<button class="btn btn-primary">Update</button>');
    update.on("click", async () => {
      await fetch(`/berita/${id}`, {
        method: "PUT",
        headers: {
          authorization: localStorage["token"],
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judul: inputJudul.val(),
          kategori: selectKategori.val(),
          isi: textareaIsi.val(),
        }),
      });
    });

    form.append(groupJudul, groupKategori, groupIsi, update);

    //render komentar
    const renderKomentar = async () => {
      const container = $("<div class='mt-3'></div>");

      const komentar = await (await fetch(`/komentar?beritaId=${id}`)).json();

      container.append($(`<h4>${komentar.length} komentar</h4>`));

      komentar.forEach((el) => {
        const komen = $(
          "<div class='d-flex justify-content-between align-items-start mb-3 p-2 rounded-lg bg-secondary'></div>"
        );

        const oleh = $(`<div class="font-weight-bold">${el.oleh}</div>`);
        const isi = $(`<div>${el.isi}</div>`);
        const waktu = $(`<div class='ml-2 font-italic'>@${el.waktu}</div>`);
        komen.append(
          $("<div></div>").append(
            $("<div class='d-flex'></div>").append(oleh, waktu),
            isi
          ),
          $(
            '<button class="btn ml-3 btn-danger"><i class="bi bi-trash"></i></button>'
          ).on("click", async () => {
            await fetch(`/komentar/${el.rowid}`, {
              method: "DELETE",
              headers: {
                authorization: localStorage["token"],
              },
            });
            container.text("");
            renderKomentar();
          })
        );

        container.append(komen);
      });

      root.append(container);
    };
    renderKomentar();

    root.append(form);
  };

  const gambarBaru = async () => {
    const header = $(
      `<header class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary"></header>`
    );
    const kembali = $(
      `<button class="btn btn-danger"><i class="bi bi-arrow-left mr-3"></i>Kembali</button>`
    ).on("click", () => {
      $("#root").text("");
      renderGaleri();
    });
    header.append(kembali, $(`<span class="h1 px-3">Gambar Baru</span>`));

    let imageFile;

    const setFileAsBackground = () => {
      const imgURL = URL.createObjectURL(imageFile);
      dropArea.css("background-image", `url(${imgURL})`);
    };

    const dropArea = $(
      `<div class="w-100 h-50 rounded-lg border-secondary drop-area"></div>`
    )
      .on("dragover", (event) => {
        event.stopPropagation();
        event.preventDefault();
      })
      .on("drop", (event) => {
        event.stopPropagation();
        event.preventDefault();
        const fileList = event.originalEvent.dataTransfer.files;
        if ((fileList.length = 1 && /^image/.test(fileList[0].type))) {
          imageFile = fileList[0];
          setFileAsBackground();
        }
      });

    const fileInput = $(
      `<input id="fileInput" type="file" accept="image/*" class="custom-file-input w-100 h-100" style="cursor: pointer;">`
    ).on("change", (e) => {
      const file = e.target.files[0];
      if (/^image/.test(file.type)) {
        imageFile = file;
        setFileAsBackground();
      }
    });

    dropArea.append(fileInput);

    const form = $("<div class='mt-3'></div>");

    const groupNama = $("<div class='form-group'></div>");
    const labelNama = $("<label for='judul'>Nama</label>");
    const inputNama = $(
      "<input id='judul' class='form-control' type='text' placeholder='Nama Gambar'>"
    );
    groupNama.append(labelNama, inputNama);

    const groupDeskripsi = $("<div class='form-group'></div>");
    const labelDesripsi = $("<label for='judul'>Deskripsi</label>");
    const inputDeskripsi = $(
      "<input id='judul' class='form-control' type='text' placeholder='Deskripsi Gambar'>"
    );
    groupDeskripsi.append(labelDesripsi, inputDeskripsi);

    const submit = $(`<button class="btn btn-primary">Submit</button>`).on(
      "click",
      async () => {
        const nama = inputNama.val();
        const deskripsi = inputDeskripsi.val();

        //cek input kosong
        if (!nama) {
          console.log("nama kosong");
          return;
        }
        if (!deskripsi) {
          console.log("deskripsi kosong");
          return;
        }
        if (!imageFile) {
          console.log("gambar kosong");
          return;
        }

        const fr = new FileReader();
        fr.readAsDataURL(imageFile);
        fr.onload = async () => {
          //image
          const imageData = fr.result;

          //thumbnail
          const canvas = $(`<canvas width=480 height=270></canvas>`)[0];
          const ctx = canvas.getContext("2d");
          const img = await createImageBitmap(imageFile);

          let w = img.width;
          let h = img.height;
          const ratio = w / h;

          w = 480;
          h = 480 * ratio;

          ctx.drawImage(img, 0, (280 - h) / 2, w, h);
          const thumbnail = canvas.toDataURL();

          fetch("/galeri/new", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: localStorage["token"],
            },
            body: JSON.stringify({
              nama: nama,
              image: imageData,
              thumbnail: thumbnail,
              deskripsi: deskripsi,
            }),
          });
        };
      }
    );

    form.append(groupNama, groupDeskripsi, submit);

    root.append(header, dropArea, form);
  };

  const renderGaleri = async () => {
    const container = $(
      `<div class="d-flex flex-wrap justify-content-center"></div>`
    );

    const thumbnails = await (await fetch("/galeri")).json();

    thumbnails.forEach((thumbnail) => {
      const card = $(
        `<div class="card w-25 m-3 bg-dark" style="cursor: pointer;"></div>`
      ).on("click", () => renderGambar(thumbnail.rowid));
      const cardImage = $(
        `<img class="card-img-top bg-black" src="${thumbnail.thumbnail}">`
      );
      const cardBody = $(`<div class="card-body"></div>`);
      const cardTitle = $(
        `<div class="d-flex justify-content-between align-items-center card-title border-secondary border-bottom pb-2 h5">${thumbnail.nama}</div>`
      );
      const cardText = $(
        `<div class="card-text text-muted">${thumbnail.deskripsi.slice(0, 40)}${
          thumbnail.deskripsi.length > 40 ? "..." : ""
        }</div>`
      );
      //hapus gambar
      const cardDelete = $(
        `<button class="btn btn-danger"><i class='bi bi-trash'></i></button>`
      ).on("click", async () => {
        await fetch(`/galeri/${thumbnail.rowid}`, {
          method: "DELETE",
          headers: {
            authorization: localStorage["token"],
          },
        });
        $("#root").text("");
        renderGaleri();
      });
      cardTitle.append(cardDelete);
      cardBody.append(cardTitle, cardText);
      card.append(cardImage, cardBody);
      container.append(card);
    });

    //tombol gambar baru
    const card = $(
      `<div class="gambar-baru card w-25 m-3 d-flex justify-content-center align-items-center"><i class="bi bi-file-plus h1"></i>Gambar Baru</div>`
    ).on("click", () => {
      $("#root").text("");
      gambarBaru();
    });
    container.append(card);

    $("#root").append(container);
  };

  const renderGambar = async (id) => {
    $("#root").text("");

    const response = await (await fetch(`/galeri/${id}`)).json();

    const header = $(
      `<header class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary"></header>`
    );
    const kembali = $(
      `<button class="btn btn-danger"><i class="bi bi-arrow-left mr-3"></i>Kembali</button>`
    ).on("click", () => {
      $("#root").text("");
      renderGaleri();
    });
    header.append(kembali, $(`<span class="h1 px-3">Update Gambar</span>`));

    const gambar = $(`<img src="${response.image}" class="w-100">`);

    const form = $("<div></div>");
    const groupNama = $("<div class='form-group'></div>");
    const labelNama = $("<label for='judul'>Nama</label>");
    const inputNama = $(
      "<input id='judul' class='form-control' type='text' placeholder='Nama Gambar'>"
    ).val(response.nama);
    groupNama.append(labelNama, inputNama);
    const groupDeskripsi = $("<div class='form-group'></div>");
    const labelDesripsi = $("<label for='judul'>Deskripsi</label>");
    const inputDeskripsi = $(
      "<input id='judul' class='form-control' type='text' placeholder='Deskripsi Gambar'>"
    ).val(response.deskripsi);
    groupDeskripsi.append(labelDesripsi, inputDeskripsi);
    const update = $(`<button class="btn btn-primary">Update</button>`).on(
      "click",
      async () => {
        const nama = inputNama.val();
        const deskripsi = inputDeskripsi.val();

        //cek kosong
        if (!nama) {
          console.log("nama kosong");
          return;
        }
        if (!deskripsi) {
          console.log("deskripsi kosong");
          return;
        }

        await fetch(`/galeri/${response.rowid}`, {
          method: "PUT",
          headers: {
            authorization: localStorage["token"],
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama: nama,
            deskripsi: deskripsi,
          }),
        });
      }
    );
    form.append(groupNama, groupDeskripsi, update);

    $("#root").append(header, gambar, form);
  };

  navButtons[1].click();
});
