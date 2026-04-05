// videos-script.js
// આ સ્ક્રિપ્ટ માત્ર Videos પેજ માટે જ કામ કરશે.

document.addEventListener('DOMContentLoaded', function () {

    // ૧. મોબાઇલ મેનુ ઓપન/ક્લોઝ
    const mobileBtn = document.getElementById('vidMobileMenuBtn');
    const navLinks = document.getElementById('vidNavLinks');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', function () {
            navLinks.classList.toggle('vid-show');
        });
    }

    // ૨. Hover to Play ફીચર (લેપટોપ માટે)
    // જ્યારે માઉસ વિડિઓ પર જશે ત્યારે પ્લે થશે, માઉસ હટશે ત્યારે પોઝ થશે.
    const allVideos = document.querySelectorAll('.vid-element');

    allVideos.forEach(video => {

        // માત્ર લેપટોપ/ડેસ્કટોપ પર (જ્યાં માઉસ હોય)
        video.addEventListener('mouseenter', function () {
            this.play().catch(error => {
                // Ignore auto-play errors in some strict browsers
                console.log("Hover auto-play prevented by browser.");
            });
        });

        video.addEventListener('mouseleave', function () {
            this.pause();
        });
    });

});