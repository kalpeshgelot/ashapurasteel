// about-script.js
// આ સ્ક્રિપ્ટ માત્ર About Us પેજ માટે જ કામ કરશે, જૂના કોડ સાથે ક્લેશ નહીં થાય.

document.addEventListener('DOMContentLoaded', function () {

    const mobileBtn = document.getElementById('auMobileMenuBtn');
    const navLinks = document.getElementById('auNavLinks');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', function () {
            // 'au-show' ક્લાસ ઉમેરવાથી કે કાઢવાથી મોબાઈલ મેનુ ખુલશે/બંધ થશે.
            navLinks.classList.toggle('au-show');
        });
    }

});