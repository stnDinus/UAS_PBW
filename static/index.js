$(document).ready(async () => {
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
        const modal = $("<div id='modal'></div>");

        const container = $(
          "<div class='bg-dark text-light rounded-lg container'></div>"
        );

        const kembali = $(
          '<button class="btn btn-danger"><i class="bi bi-arrow-left mr-3"></i>Kembali</button>'
        );
        kembali.on("click", () => {
          modal.remove();
        });

        const judul = $(`<h1 class="my-3 ml-3">${el.judul}</h1>`);

        const kategori = $(
          `<div class="badge badge-secondary my-3">${el.kategori}</div>`
        );

        const isi = $(`<p class='my-3'>${el.isi}</p>`);

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
              beritaId: el.id,
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
            await fetch(`/komentar?beritaId=${el.id}`)
          ).json();

          komentarContainer.append($(`<h4>${komentar.length} komentar</h4>`));

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
});
