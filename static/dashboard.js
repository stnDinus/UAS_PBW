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
        "<div class='d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary'></div>"
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

  navButtons[0].click();
});
