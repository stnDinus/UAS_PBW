$(document).ready(() => {
  const headerHeight = $("header").height();
  $("#root").css("height", `calc(100vh - ${headerHeight}px)`);

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

  renderBerita();
  renderVideo();
  renderGaleri();
});
