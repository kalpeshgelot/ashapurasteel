// contact-script.js
// આ સ્ક્રિપ્ટ માત્ર Contact Us પેજ માટે જ કામ કરશે.

document.addEventListener('DOMContentLoaded', function () {

    // ૧. મોબાઇલ મેનુ ઓપન/ક્લોઝ
    const mobileBtn = document.getElementById('cuMobileMenuBtn');
    const navLinks = document.getElementById('cuNavLinks');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', function () {
            navLinks.classList.toggle('cu-show');
        });
    }
});

// ૨. ફોર્મ ડેટા ભેગો કરવાનું ફંક્શન
function getFormData() {
    const name = document.getElementById('cuName').value.trim();
    const company = document.getElementById('cuCompany').value.trim();
    const phone = document.getElementById('cuPhone').value.trim();
    const subject = document.getElementById('cuSubject').value.trim();
    const message = document.getElementById('cuMessage').value.trim();

    if (!name || !phone || !subject || !message) {
        alert("Please fill out all mandatory (*) fields.");
        return null;
    }

    return { name, company, phone, subject, message };
}

// ૩. WhatsApp પર મેસેજ મોકલવા માટે
window.sendFormToWhatsApp = function () {
    const data = getFormData();
    if (!data) return;

    let waMessage = `*New Inquiry from Website*\n\n`;
    waMessage += `*Name:* ${data.name}\n`;
    if (data.company) waMessage += `*Company:* ${data.company}\n`;
    waMessage += `*Phone:* ${data.phone}\n`;
    waMessage += `*Requirement:* ${data.subject}\n\n`;
    waMessage += `*Message:* \n${data.message}`;

    const waLink = `https://wa.me/916359063984?text=${encodeURIComponent(waMessage)}`;
    window.open(waLink, '_blank');
};

// ૪. Email પર મેસેજ મોકલવા માટે
window.sendFormToEmail = function () {
    const data = getFormData();
    if (!data) return;

    const emailTo = "kalpeshjagdishbhai8@gmail.com";
    const emailSubject = `Website Inquiry: ${data.subject} (From: ${data.name})`;

    let emailBody = `New Inquiry Details:\n\n`;
    emailBody += `Name: ${data.name}\n`;
    if (data.company) emailBody += `Company/Shop: ${data.company}\n`;
    emailBody += `Phone: ${data.phone}\n\n`;
    emailBody += `Message:\n${data.message}\n`;

    const mailLink = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailLink;
};