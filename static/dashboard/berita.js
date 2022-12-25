deleteBerita = async (rowid) => {
  const response = await fetch("/berita", {
    method: "DELETE",
    headers: {
      authorization: localStorage["token"],
      "Content-Type": "text/plain",
    },
    body: rowid,
  });
};

renderBerita = async () => {
  const table = document.querySelector("tbody#berita");
  table.textContent = "";

  const response = await fetch("/berita", {
    method: "GET",
  });

  (await response.json()).forEach((el) => {
    const row = table.insertRow(-1);
    const rowid = row.insertCell(0);
    const judul = row.insertCell(1);
    const kategori = row.insertCell(2);
    const isi = row.insertCell(3);
    const del = row.insertCell(4);

    rowid.textContent = el.rowid;
    judul.textContent = el.judul;
    kategori.textContent = el.kategori;
    isi.textContent = el.isi;
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      deleteBerita(el.rowid);
      renderBerita();
    });
  });
};
renderBerita();

const judulEl = document.querySelector("#judul");
const kategoriEl = document.querySelector("#kategori");
const isiEl = document.querySelector("#isi");
const submitEl = document.querySelector("#submit");
submit = async () => {
  const judul = judulEl.value;
  const kategori = kategoriEl.value;
  const isi = isiEl.value;

  const response = await fetch("/berita", {
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
  if (response.status === 200) {
    renderBerita();
  }
};
submitEl.addEventListener("click", submit);
