/**
 * Portfolio Website - Main JavaScript
 * Handles message form functionality with conditional display
 */

// ==========================================
// CONFIGURATION
// ==========================================
const PORTFOLIO_CONFIG = {
    selectors: {
        messageForm: 'form[name="leave_message"]',
        messageList: '#message-list',
        messagesSection: '#messages',
        skillsSection: '#skills'
    },
    classes: {
        messageContent: 'message-content',
        messageText: 'message-text',
        removeBtn: 'remove-btn',
        editBtn: 'edit-btn',
        thankYouMessage: 'thank-you-message'
    },
    messages: {
        withMessage: (name) => `Thank you ${name} for your message and visiting my portfolio page. I will get back to you as soon as possible and have a wonderful day.`,
        withoutMessage: (name) => `Thank you ${name} for visiting my portfolio page and have a wonderful day.`
    },
    timing: {
        thankYouDuration: 5000
    }
};

// ==========================================
// BASIC MESSAGE FORM IMPLEMENTATION
// ==========================================
function initializeMessageForm() {
    const form = document.querySelector(PORTFOLIO_CONFIG.selectors.messageForm);
    const section = document.getElementById('messages');
    const list = section ? section.querySelector(PORTFOLIO_CONFIG.selectors.messageList) : null;

    // Hide messages section initially
    if (section) {
        section.style.display = 'none';
    }

    if (form && list && section) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values as per assignment
            const userName = event.target.usersName.value.trim();
            const userEmail = event.target.usersEmail.value.trim();
            const userMessage = event.target.usersMessage.value.trim();
            
            // Log values as required
            console.log(userName, userEmail, userMessage);
            
            // Validate required fields
            if (!userName || !userEmail) {
                alert('Please fill in name and email');
                return;
            }
            
            // Clear existing thank you messages
            const existingThankYou = document.querySelectorAll(`.${PORTFOLIO_CONFIG.classes.thankYouMessage}`);
            existingThankYou.forEach(msg => msg.remove());
            
            // Check if user provided a message
            if (userMessage) {
                // User provided a message - add to list and show section
                const newMessage = document.createElement('li');
                newMessage.innerHTML = `
                    <div class="${PORTFOLIO_CONFIG.classes.messageContent}">
                        <a href="mailto:${userEmail}">${userName}</a>
                        <span class="${PORTFOLIO_CONFIG.classes.messageText}">${userMessage}</span>
                    </div>
                `;
                
                // Create edit button
                const editButton = document.createElement('button');
                editButton.innerText = 'edit';
                editButton.type = 'button';
                editButton.className = PORTFOLIO_CONFIG.classes.editBtn;
                editButton.addEventListener('click', function() {
                    const messageSpan = this.closest('li').querySelector(`.${PORTFOLIO_CONFIG.classes.messageText}`);
                    const newText = prompt('Edit your message:', messageSpan.textContent);
                    if (newText !== null && newText.trim() !== '') {
                        messageSpan.textContent = newText.trim();
                    }
                });
                
                // Create remove button
                const removeButton = document.createElement('button');
                removeButton.innerText = 'remove';
                removeButton.type = 'button';
                removeButton.className = PORTFOLIO_CONFIG.classes.removeBtn;
                removeButton.addEventListener('click', function() {
                    this.closest('li').remove();
                    checkMessageList(section, list);
                });
                
                // Add buttons to message
                const messageContent = newMessage.querySelector(`.${PORTFOLIO_CONFIG.classes.messageContent}`);
                messageContent.appendChild(editButton);
                messageContent.appendChild(removeButton);
                
                // Add message to list
                list.appendChild(newMessage);
                
                // Show messages section
                section.style.display = 'block';
                
                // Show thank you message with message
                showThankYouMessage(PORTFOLIO_CONFIG.messages.withMessage(userName), form);
            } else {
                // No message provided - just show thank you
                showThankYouMessage(PORTFOLIO_CONFIG.messages.withoutMessage(userName), form);
                // Keep messages section hidden
            }
            
            // Reset form
            event.target.reset();
        });
    }
}

// Function to check message list visibility
function checkMessageList(section, list) {
    if (section && list) {
        section.style.display = 
            list.children.length > 0 ? 'block' : 'none';
    }
}

// Function to show thank you message
function showThankYouMessage(message, form) {
    const thankYouDiv = document.createElement('div');
    thankYouDiv.className = PORTFOLIO_CONFIG.classes.thankYouMessage;
    thankYouDiv.setAttribute('role', 'alert');
    thankYouDiv.setAttribute('aria-live', 'polite');
    
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    thankYouDiv.appendChild(paragraph);
    
    // Insert after the form
    if (form && form.parentNode) {
        form.parentNode.insertBefore(thankYouDiv, form.nextSibling);
    }
    
    // Remove after duration
    setTimeout(() => {
        if (thankYouDiv.parentNode) {
            thankYouDiv.remove();
        }
    }, PORTFOLIO_CONFIG.timing.thankYouDuration);
}

// ==========================================
// SKILLS SECTION HANDLER
// ==========================================
function initializeSkills() {
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

    const skillsSection = document.querySelector('#skills');
    if (!skillsSection) return;

    const skillsList = skillsSection.querySelector('ul');
    if (!skillsList) return;

    // Clear and populate skills list
    skillsList.innerHTML = '';
    skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
    });
}

// ==========================================
// FOOTER GENERATOR
// ==========================================
function createFooter() {
    // Check if footer already exists
    if (document.querySelector('footer')) {
        return;
    }

    const footer = document.createElement('footer');
    footer.style.cssText = `
        text-align: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        margin-top: 40px;
        font-size: 16px;
        font-weight: 400;
        width: 100%;
    `;

    const copyright = document.createElement('p');
    const currentYear = new Date().getFullYear();
    copyright.innerHTML = `© ${currentYear} Mia Smith`;
    footer.appendChild(copyright);

    document.body.appendChild(footer);
}

// ==========================================
// INITIALIZE APPLICATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize message form
    initializeMessageForm();
    
    // Initialize skills section
    initializeSkills();
    
    // Create footer
    createFooter();
    
    console.log('Portfolio application initialized successfully');
});