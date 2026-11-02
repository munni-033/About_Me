
document.addEventListener("DOMContentLoaded", function () {

    // MOBILE NAVIGATION
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("open");
            menuToggle.textContent =
                navLinks.classList.contains("open") ? "×" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("open");
                menuToggle.textContent = "☰";
            });
        });
    }

    // MOVIE FILTER
    const filterButtons = document.querySelectorAll(".filter-btn");
    const movieCards = document.querySelectorAll(".movie-card");

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const selectedFilter = button.dataset.filter;

            movieCards.forEach(function (card) {
                const shouldShow =
                    selectedFilter === "all" ||
                    card.dataset.category === selectedFilter;

                card.style.display = shouldShow ? "" : "none";
            });
        });
    });

    // SCROLL REVEAL
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(function (element) {
            observer.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });
    }

    // ONLY ONE SONG PLAYS AT A TIME
    const audioPlayers = document.querySelectorAll(".song audio");

    audioPlayers.forEach(function (player) {
        player.addEventListener("play", function () {
            audioPlayers.forEach(function (otherPlayer) {
                if (otherPlayer !== player) {
                    otherPlayer.pause();
                }
            });
        });
    });

    // MOUSE FOLLOWING GLOW
    const cursorGlow = document.querySelector(".cursor-glow");

    if (cursorGlow) {
        window.addEventListener("mousemove", function (event) {
            cursorGlow.style.left = event.clientX + "px";
            cursorGlow.style.top = event.clientY + "px";
        });
    }

});

// 3D FLOWER GALLERY INTERACTION

const flowerScene = document.getElementById("about3D");

if (flowerScene) {
    flowerScene.style.transition = "transform 0.3s ease";

    flowerScene.addEventListener("mousemove", function (event) {
        const rect = flowerScene.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 10;
        const rotateX = (0.5 - y) * 10;

        flowerScene.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    flowerScene.addEventListener("mouseleave", function () {
        flowerScene.style.transform =
            "rotateX(0deg) rotateY(0deg)";
    });
}


/* =====================================
   PIECES OF ME — 3D COVERFLOW GALLERY
===================================== */

document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector("#gallery .gallery-grid");

    if (!gallery) return;

    const cards = Array.from(
        gallery.querySelectorAll(".gallery-item")
    );

    if (cards.length < 2) return;

    // Pengaturan carousel
    let activeIndex = 0;
    let autoPlay;
    let isDragging = false;
    let startX = 0;
    let dragDistance = 0;
    let moved = false;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const autoDelay = 3500;

    // Mengatur posisi setiap kartu
    function updateGallery() {
        const isMobile = window.innerWidth <= 650;
        const spacing = isMobile ? 135 : 190;

        cards.forEach((card, index) => {
            let offset = index - activeIndex;

            // Memilih jarak terdekat dalam lingkaran
            if (offset > cards.length / 2) {
                offset -= cards.length;
            }

            if (offset < -cards.length / 2) {
                offset += cards.length;
            }

            const distance = Math.abs(offset);

            const x = offset * spacing;
            const z = distance === 0 ? 100 : distance === 1 ? 0 : -100;
            const rotate = offset * -25;
            const scale = distance === 0 ? 1 : distance === 1 ? 0.82 : 0.65;
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.85 : 0.35;

            card.style.setProperty("--card-x", `${x}px`);
            card.style.setProperty("--card-z", `${z}px`);
            card.style.setProperty("--card-rotate", `${rotate}deg`);
            card.style.setProperty("--card-scale", scale);
            card.style.setProperty("--card-opacity", opacity);
            card.style.setProperty("--card-layer", 10 - distance);

            card.style.setProperty(
                "--card-pointer",
                distance <= 1 ? "auto" : "none"
            );

            card.classList.toggle("is-active", distance === 0);

            card.setAttribute(
                "aria-label",
                `Foto ${index + 1}${distance === 0 ? ", sedang ditampilkan" : ""}`
            );
        });
    }

    // Pindah ke foto berikutnya
    function nextSlide() {
        activeIndex = (activeIndex + 1) % cards.length;
        updateGallery();
    }

    // Pindah ke foto sebelumnya
    function previousSlide() {
        activeIndex =
            (activeIndex - 1 + cards.length) % cards.length;

        updateGallery();
    }

    // Menghentikan dan menjalankan otomatis
    function stopAutoPlay() {
        clearInterval(autoPlay);
    }

    function startAutoPlay() {
        stopAutoPlay();

        if (reduceMotion || document.hidden) return;

        autoPlay = setInterval(nextSlide, autoDelay);
    }

    // Klik foto samping untuk menjadikannya foto utama
    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            if (moved) return;

            activeIndex = index;
            updateGallery();
            startAutoPlay();
        });
    });

    // Geser menggunakan mouse atau layar sentuh
    gallery.addEventListener("pointerdown", (event) => {
        isDragging = true;
        moved = false;
        startX = event.clientX;
        dragDistance = 0;

        stopAutoPlay();
    });

    gallery.addEventListener("pointermove", (event) => {
        if (!isDragging) return;

        dragDistance = event.clientX - startX;

        if (Math.abs(dragDistance) > 12) {
            moved = true;
        }
    });

    function endDrag() {
        if (!isDragging) return;

        isDragging = false;

        if (Math.abs(dragDistance) > 45) {
            if (dragDistance < 0) {
                nextSlide();
            } else {
                previousSlide();
            }
        }

        // Mencegah klik setelah gesture geser
        setTimeout(() => {
            moved = false;
        }, 100);

        startAutoPlay();
    }

    gallery.addEventListener("pointerup", endDrag);
    gallery.addEventListener("pointercancel", endDrag);

    gallery.addEventListener("pointerleave", () => {
        if (isDragging) endDrag();
    });

    // Berhenti otomatis ketika kursor masuk Gallery
    gallery.addEventListener("mouseenter", stopAutoPlay);
    gallery.addEventListener("mouseleave", startAutoPlay);

    // Berhenti ketika tab browser tidak aktif
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    // Navigasi keyboard
    gallery.setAttribute("tabindex", "0");

    gallery.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            nextSlide();
            startAutoPlay();
        }

        if (event.key === "ArrowLeft") {
            previousSlide();
            startAutoPlay();
        }
    });

    // Mulai carousel
    updateGallery();
    startAutoPlay();

    // Perbarui ukuran saat layar berubah
    window.addEventListener("resize", updateGallery);
});
