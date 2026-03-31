const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\boyep\\OneDrive\\Desktop\\Project\\rentafriend';
const files = [
    'index.html', 'about.html', 'services.html', 'register.html', 'rent.html', 'contact.html',
    'js/main.js', 'js/register.js', 'js/rent.js',
    'package.json'
];

files.forEach(file => {
    let p = path.join(dir, file);
    if (!fs.existsSync(p)) return;

    let content = fs.readFileSync(p, 'utf8');

    // Replacements
    content = content.replace(/RentAFriend/g, 'Walk With Me');
    content = content.replace(/rentafriend/g, 'walkwithme'); // mostly for keys and classnames
    content = content.replace(/Rent A Friend/gi, 'Walk With Me');
    content = content.replace(/RentA<span>Friend<\/span>/gi, 'WalkWith<span>Me</span>');
    content = content.replace(/fa-people-carry/g, 'fa-walking');
    content = content.replace(/walkwithme-fbd\.com/g, 'walkwithme-fbd.com');

    // Motive additions
    if (file === 'index.html') {
        content = content.replace(
            /<h1>Don't Explore<br>Faridabad <span class="highlight">Alone.<\/span><\/h1>/,
            "<h1>Don't Explore<br>Faridabad <span class=\"highlight\">Alone.</span></h1>\n            <h3 style=\"color: #fff; font-family: var(--font-display); font-size: 1.8rem; margin-bottom: 15px; font-weight: 500;\">Never Be Alone.</h3>"
        );
    }

    // Add to footer text in all files
    content = content.replace(
        /<p class="footer-text">A 100% free community/gi,
        '<p class="footer-text"><strong style="color: var(--color-amber);">Never Be Alone.</strong> A 100% free community'
    );

    // Some CSS fixes (if any string replaces touched css files - not expected here though)

    fs.writeFileSync(p, content, 'utf8');
});

console.log('Rebrand successful.');
