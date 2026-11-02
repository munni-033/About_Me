document.addEventListener("DOMContentLoaded", function () {

    const intro = document.createElement("div");
    intro.className = "sparkle-intro";

    const totalSparkles = 100;

    for (let i = 0; i < totalSparkles; i++) {
        const sparkle = document.createElement("span");

        // Titik awal menyebar di seluruh layar
        sparkle.style.left = Math.random() * 100 + "%";
        sparkle.style.top = Math.random() * 100 + "%";

        // Ukuran percikan bervariasi
        const size = Math.random() * 4 + 2;

        sparkle.style.width = size + "px";
        sparkle.style.height = size + "px";

        // Gerakan dimulai sedikit berbeda agar natural
        sparkle.style.animationDelay = Math.random() * 0.6 + "s";

        intro.appendChild(sparkle);
    }

    document.body.appendChild(intro);

    setTimeout(() => {
        intro.remove();
    }, 2500);

});