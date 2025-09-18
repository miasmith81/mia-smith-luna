// Get the skills section using getElementById
const skillsSection = document.getElementById('skills');

// Get the unordered list within the skills section
const skillsList = skillsSection.getElementsByTagName('ul')[0];

// Create skills array
const skills = [
    "HTML5 & Semantic Markup",
    "CSS3 & Modern Layouts",
    "JavaScript (ES6+)",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "RESTful APIs",
    "Git Version Control",
    "Responsive Design",
    "Web Accessibility",
    "MERN Stack"
];

// Create and append skill items
skills.forEach(skillText => {
    const skill = document.createElement('li');
    skill.textContent = skillText;
    skillsList.appendChild(skill);
});

// Create a footer element since it doesn't exist in HTML
const footer = document.createElement('footer');

// Create a new paragraph element for the copyright
const copyright = document.createElement('p');

// Set the copyright text with the Unicode copyright symbol
copyright.innerHTML = `© ${thisYear} Mia Smith`;

// Add the copyright paragraph to the footer
footer.appendChild(copyright);

// Style the footer
footer.style.textAlign = 'center';
footer.style.padding = '20px';
footer.style.background = 'rgba(0, 0, 0, 0.8)';
footer.style.color = 'white';
footer.style.marginTop = '40px';
footer.style.fontSize = '16px';
footer.style.fontWeight = '400';
footer.style.width = '100%';

// Add the footer to the end of the body
document.body.appendChild(footer);