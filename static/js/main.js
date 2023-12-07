(function () {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  let navbarlinks = select("#navbar .scrollto", true);

  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };

  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();
        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  // Convert jQuery code to vanilla JavaScript
  on("click", "#prediksi_submit", function (e) {
    console.log("Tombol dipencet");

    e.preventDefault();
    console.log("Prevent Default");

    var file_data = select("#input_gambar").files[0];
    var pics_data = new FormData();
    pics_data.append("file", file_data);

    setTimeout(function () {
      try {
        fetch("/api/Deteksi", {
          method: "POST",
          body: pics_data,
        })
          .then((response) => response.json())
          .then((res) => {
            const res_data_prediksi = res["prediksi"];
            const res_gambar_prediksi = res["gambar_prediksi"];
            generate_prediksi(res_data_prediksi, res_gambar_prediksi);
          })
          .catch((error) => {
            console.error("Error in fetch request:", error);
          });
      } catch (error) {
        console.error("Error in fetch request:", error);
      }
    }, 500);
  });

  function generate_prediksi(data_prediksi, image_prediksi) {
    var str = "";
    if (image_prediksi == "(none)") {
      str += "<h5>Ternyata Hasilnya</h5>";
      str += "<br/>";
      str += "<h3>silahkan masukkan gambar</h3>";
    } else {
      str += "<h5>Ternyata Hasilnya</h5>";
      str += "<img src='" + image_prediksi + "' width='200'></img>";
      str += "<br/>";
      str += "<p>" + data_prediksi + "</p>";
    }

    select("#hasil_prediksi").innerHTML = str;
  }
})();
