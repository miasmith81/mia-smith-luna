/**
 * Portfolio Website Configuration
 */
const CONFIG = {
    timing: {
        thankYouMessageDuration: 5000 // Duration in milliseconds
    },
    selectors: {
        messageForm: 'form[name="leave_message"]',
        messageSection: '#messages',
        messageList: '#message-list',
        skillsSection: '#skills',
        skillsList: '#skills ul',
        projectsSection: '#projects',
        projectsList: '.projects-grid'
    },
    github: {
        username: 'miasmith81' // GitHub username for repository fetching
    }
};

/**
 * Utility functions
 */
class Utils {
    /**
     * Sanitize HTML content to prevent XSS
     * @param {string} html - HTML content to sanitize
     * @returns {string} - Sanitized HTML
     */
    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Show error message in console and optionally to user
     * @param {string} message - Error message
     */
    static showError(message) {
        console.error(message);
        // TODO: Implement user-facing error handling if needed
    }
}

/**
 * Message form handler
 */
class MessageHandler {
    static init() {
        this.form = document.querySelector(CONFIG.selectors.messageForm);
        this.section = document.querySelector(CONFIG.selectors.messageSection);
        this.list = document.querySelector(CONFIG.selectors.messageList);

        if (this.section) {
            this.section.style.display = 'none';
        }

        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    static handleSubmit(event) {
        event.preventDefault();
        
        const userName = event.target.usersName.value.trim();
        const userEmail = event.target.usersEmail.value.trim();
        const userMessage = event.target.usersMessage.value.trim();
        
        console.log(userName, userEmail, userMessage);
        
        if (!this.validateForm(userName, userEmail)) return;
        
        this.clearThankYouMessages();
        
        if (userMessage) {
            this.createMessageListItem(userName, userEmail, userMessage);
            if (this.section) {
                this.section.style.display = 'block';
            }
            this.showThankYouMessage(
                `Thank you ${userName} for your message and visiting my portfolio page. I will get back to you as soon as possible and have a wonderful day.`
            );
        } else {
            this.showThankYouMessage(
                `Thank you ${userName} for visiting my portfolio page and have a wonderful day.`
            );
        }
        
        event.target.reset();
    }

    static validateForm(userName, userEmail) {
        if (!userName) {
            alert('Please enter your name');
            return false;
        }
        
        if (!userEmail) {
            alert('Please enter your email');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            alert('Please enter a valid email address');
            return false;
        }
        
        return true;
    }

    static createMessageListItem(name, email, message) {
        if (!this.list) return;
        
        const li = document.createElement('li');
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${email}`;
        emailLink.textContent = name;
        
        const messageText = document.createElement('span');
        messageText.className = 'message-text';
        messageText.textContent = message;
        
        const editButton = document.createElement('button');
        editButton.textContent = 'edit';
        editButton.type = 'button';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', () => this.handleEdit(messageText));
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'remove';
        removeButton.type = 'button';
        removeButton.className = 'remove-btn';
        removeButton.addEventListener('click', () => {
            li.remove();
            this.checkListVisibility();
        });
        
        messageContent.append(emailLink, messageText, editButton, removeButton);
        li.appendChild(messageContent);
        this.list.appendChild(li);
    }

    static handleEdit(messageText) {
        const currentMessage = messageText.textContent;
        const newMessage = prompt('Edit your message:', currentMessage);
        if (newMessage !== null && newMessage.trim() !== '') {
            messageText.textContent = newMessage.trim();
        }
    }

    static showThankYouMessage(messageText) {
        const thankYouDiv = document.createElement('div');
        thankYouDiv.className = 'thank-you-message';
        thankYouDiv.setAttribute('role', 'alert');
        thankYouDiv.setAttribute('aria-live', 'polite');
        
        const paragraph = document.createElement('p');
        paragraph.textContent = messageText;
        thankYouDiv.appendChild(paragraph);
        
        if (this.form && this.form.parentNode) {
            this.form.parentNode.insertBefore(thankYouDiv, this.form.nextSibling);
        }
        
        setTimeout(() => {
            if (thankYouDiv.parentNode) {
                thankYouDiv.remove();
            }
        }, CONFIG.timing.thankYouMessageDuration);
    }

    static clearThankYouMessages() {
        document.querySelectorAll('.thank-you-message').forEach(msg => msg.remove());
    }

    static checkListVisibility() {
        if (this.section && this.list) {
            this.section.style.display = this.list.children.length > 0 ? 'block' : 'none';
        }
    }
}

/**
 * Skills section handler
 */
class SkillsHandler {
    static skills = [
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

    static init() {
        const skillsSection = document.querySelector(CONFIG.selectors.skillsSection);
        if (!skillsSection) return;

        const skillsList = skillsSection.querySelector('ul');
        if (!skillsList) return;

        skillsList.innerHTML = '';
        
        this.skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            skillsList.appendChild(li);
        });
    }
}

/**
 * Footer handler
 */
class FooterHandler {
    static init() {
        if (document.querySelector('footer')) return;
        
        const footer = document.createElement('footer');
        Object.assign(footer.style, {
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            marginTop: '40px',
            fontSize: '16px',
            fontWeight: '400',
            width: '100%'
        });
        
        const copyright = document.createElement('p');
        copyright.innerHTML = `© ${new Date().getFullYear()} Mia Smith`;
        
        footer.appendChild(copyright);
        document.body.appendChild(footer);
    }
}

/**
 * GitHub repositories handler
 */
class GitHubHandler {
    /**
     * Fetches and displays GitHub repositories
     */
    static async init() {
        try {
            const projectSection = document.querySelector(CONFIG.selectors.projectsSection);
            const projectsList = document.querySelector(CONFIG.selectors.projectsList);
            
            if (!projectSection || !projectsList) {
                Utils.showError('Projects section not found');
                return;
            }

            const repositories = await this.fetchRepositories();
            this.displayRepositories(repositories, projectsList);
        } catch (error) {
            Utils.showError(`Failed to load GitHub repositories: ${error.message}`);
        }
    }

    /**
     * Fetches repositories from GitHub API
     * @returns {Promise<Array>} Array of repository objects
     */
    static async fetchRepositories() {
        const response = await fetch(`https://api.github.com/users/${CONFIG.github.miasmith81}/repos`);
                
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
                
        const repositories = await response.json();
        console.log('GitHub repositories:', repositories);
        return repositories;
    }

    /**
     * Displays repositories in the projects list
     * @param {Array} repositories - Array of repository objects
     * @param {HTMLElement} projectsList - Container element for projects
     */
    static displayRepositories(repositories, projectsList) {
        // Clear existing content
        projectsList.innerHTML = '';

        for (let i = 0; i < repositories.length; i++) {
            const project = document.createElement('li');
            project.className = 'project-item';
            project.innerHTML = `
                <div class="project-content">
<h3 class="project-title">${Utils.sanitizeHTML(repositories[i].miasmith81)}</h3>
                    <p class="project-description">${Utils.sanitizeHTML(repositories[i].description || 'No description available')}</p>
                    <div class="project-links">
                        <a href="${repositories[i].html_url}" target="_blank" rel="noopener noreferrer" class="project-link">View Repository</a>
                        ${repositories[i].homepage ? `<a href="${repositories[i].homepage}" target="_blank" rel="noopener noreferrer" class="project-link">Live Demo</a>` : ''}
                    </div>
                </div>
            `;
            projectsList.appendChild(project);
        }
    }
}

/**
 * Main portfolio application
 */
class PortfolioApp {
    static initializeComponents() {
        // Initialize message handling
        MessageHandler.init();
        
        // Initialize skills section
        SkillsHandler.init();
        
        // Initialize footer
        FooterHandler.init();

        // Initialize GitHub repositories
        GitHubHandler.init();

        // Initialize ARTIC carousel
        this.articCarousel = new ArticCarousel();
        this.articCarousel.init();
        
        console.log('Portfolio application initialized successfully');
    }

    static cleanup() {
        if (this.articCarousel) {
            this.articCarousel = null;
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PortfolioApp.initializeComponents();
});

// Main form submission handler
if (messageForm) {
    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const userName = event.target.usersName.value.trim();
        const userEmail = event.target.usersEmail.value.trim();
        const userMessage = event.target.usersMessage.value.trim();
        
        // Log values as required by assignment
        console.log(userName, userEmail, userMessage);
        
        // Validate required fields
        if (!userName) {
            alert('Please enter your name');
            return;
        }
        
        if (!userEmail) {
            alert('Please enter your email');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Remove any existing thank you messages before creating new one
        const existingThankYouMessages = document.querySelectorAll('.thank-you-message');
        existingThankYouMessages.forEach(msg => msg.remove());
        
        // Process submission based on whether message was provided
        if (userMessage && userMessage.length > 0) {
            // User provided a message - create list item and show section
            createMessageListItem(userName, userEmail, userMessage);
            
            // Show the messages section
            if (messageSection) {
                messageSection.style.display = 'block';
            }
            
            // Show thank you message for submission WITH message
            showThankYouMessage(
                `Thank you ${userName} for your message and visiting my portfolio page. I will get back to you as soon as possible and have a wonderful day.`
            );
        } else {
            // No message provided - just show thank you, don't create list item
            // Messages section stays hidden
            
            // Show thank you message for submission WITHOUT message
            showThankYouMessage(
                `Thank you ${userName} for visiting my portfolio page and have a wonderful day.`
            );
        }
        
        // Reset the form
        event.target.reset();
    });
}

/**
 * Create a message list item with edit and remove buttons
 */
function createMessageListItem(name, email, message) {
    if (!messageList) return;
    
    // Create list item
    const li = document.createElement('li');
    
    // Create message content container
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Create email link
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:${email}`;
    emailLink.textContent = name;
    
    // Create message text span
    const messageText = document.createElement('span');
    messageText.className = 'message-text';
    messageText.textContent = message;
    
    // Create edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'edit';
    editButton.type = 'button';
    editButton.className = 'edit-btn';
    editButton.addEventListener('click', function() {
        const currentMessage = messageText.textContent;
        const newMessage = prompt('Edit your message:', currentMessage);
        if (newMessage !== null && newMessage.trim() !== '') {
            messageText.textContent = newMessage.trim();
        }
    });
    
    // Create remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'remove';
    removeButton.type = 'button';
    removeButton.className = 'remove-btn';
    removeButton.addEventListener('click', function() {
        li.remove();
        // Check if message list is empty and hide section if it is
        checkMessageListVisibility();
    });
    
    // Assemble the message content
    messageContent.appendChild(emailLink);
    messageContent.appendChild(messageText);
    messageContent.appendChild(editButton);
    messageContent.appendChild(removeButton);
    
    // Add content to list item
    li.appendChild(messageContent);
    
    // Add to message list
    messageList.appendChild(li);
}

/**
 * Show thank you message that auto-removes after 5 seconds
 */
function showThankYouMessage(messageText) {
    // Create thank you message div
    const thankYouDiv = document.createElement('div');
    thankYouDiv.className = 'thank-you-message';
    thankYouDiv.setAttribute('role', 'alert');
    thankYouDiv.setAttribute('aria-live', 'polite');
    
    // Create paragraph with message
    const paragraph = document.createElement('p');
    paragraph.textContent = messageText;
    thankYouDiv.appendChild(paragraph);
    
    // Insert after the form
    if (messageForm && messageForm.parentNode) {
        messageForm.parentNode.insertBefore(thankYouDiv, messageForm.nextSibling);
    }
    
    // Remove after 5 seconds
    setTimeout(function() {
        if (thankYouDiv.parentNode) {
            thankYouDiv.remove();
        }
    }, 5000);
}

/**
 * Check if messages section should be visible
 */
function checkMessageListVisibility() {
    if (messageSection && messageList) {
        if (messageList.children.length > 0) {
            messageSection.style.display = 'block';
        } else {
            messageSection.style.display = 'none';
        }
    }
}

// ==========================================
// SKILLS SECTION
// ==========================================

/**
 * Initialize skills section with predefined skills
 */
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

    // Clear existing content
    skillsList.innerHTML = '';
    
    // Add each skill as a list item
    skills.forEach(function(skill) {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
    });
}

// ==========================================
// FOOTER
// ==========================================

/**
 * Create and append footer to the page
 */
function createFooter() {
    // Check if footer already exists
    const existingFooter = document.querySelector('footer');
    if (existingFooter) return;
    
    // Create footer element
    const footer = document.createElement('footer');
    
    // Apply styles
    footer.style.textAlign = 'center';
    footer.style.padding = '20px';
    footer.style.background = 'rgba(0, 0, 0, 0.8)';
    footer.style.color = 'white';
    footer.style.marginTop = '40px';
    footer.style.fontSize = '16px';
    footer.style.fontWeight = '400';
    footer.style.width = '100%';
    
    // Create copyright paragraph
    const copyright = document.createElement('p');
    const currentYear = new Date().getFullYear();
    copyright.innerHTML = `© ${currentYear} Mia Smith`;
    
    // Add copyright to footer
    footer.appendChild(copyright);
    
    // Add footer to body
    document.body.appendChild(footer);
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize all components when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skills if section exists
    initializeSkills();
    
    // Create footer
    createFooter();
    
    // Log successful initialization
    console.log('Portfolio application initialized successfully');
});