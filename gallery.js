
document.addEventListener("DOMContentLoaded", function () {

    const gallery = document.querySelector("#gallery .gallery-grid");
    if (!gallery) return;

    const cards = Array.from(gallery.querySelectorAll(".gallery-item"));
    if (cards.length < 2) return;

    let current = 0;
    let timer;
    let startX = 0;
    let dragging = false;

    function showGallery() {
        const mobile = window.innerWidth <= 650;
        const spacing = mobile ? 115 : 165;

        cards.forEach((card, index) => {
            let position = index - current;

            if (position > cards.length / 2) position -= cards.length;
            if (position < -cards.length / 2) position += cards.length;

            const distance = Math.abs(position);

            card.style.setProperty("--x", `${position * spacing}px`);
            card.style.setProperty("--z", distance === 0 ? "100px" : "0px");
            card.style.setProperty("--r", `${position * -22}deg`);
            card.style.setProperty("--s", distance === 0 ? "1" : "0.78");
            card.style.setProperty("--o", distance > 1 ? "0.35" : "1");
            card.style.setProperty("--layer", 10 - distance);

            card.classList.toggle("is-active", position === 0);
        });
    }

    function next() {
        current = (current + 1) % cards.length;
        showGallery();
    }

    function previous() {
        current = (current - 1 + cards.length) % cards.length;
        showGallery();
    }

    function startAuto() {
        clearInterval(timer);
        timer = setInterval(next, 3000);
    }

    // Klik foto untuk menampilkannya di tengah
    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            current = index;
            showGallery();
            startAuto();
        });
    });

    // Geser dengan mouse atau jari
    gallery.addEventListener("pointerdown", (e) => {
        dragging = true;
        startX = e.clientX;
        clearInterval(timer);
    });

    gallery.addEventListener("pointerup", (e) => {
        if (!dragging) return;

        const difference = e.clientX - startX;

        if (difference < -40) next();
        if (difference > 40) previous();

        dragging = false;
        startAuto();
    });

    gallery.addEventListener("pointercancel", () => {
        dragging = false;
        startAuto();
    });

    showGallery();
    startAuto();

    window.addEventListener("resize", showGallery);

});
