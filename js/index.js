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
        username: 'miasmith81',
        featuredRepos: ['capstone-project', 'portfolio-project'] // Add your specific repo names here
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

    /**
     * Format date to a readable string
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    static formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    /**
     * Format repository name for display
     * @param {string} name - Repository name
     * @returns {string} Formatted name
     */
    static formatRepoName(name) {
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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
            
            // Debug: Look for capstone project specifically
            this.findRepository(repositories, 'capstone');
            
            // Sort repositories to prioritize featured ones
            const sortedRepos = this.sortRepositories(repositories);
            this.displayRepositories(sortedRepos, projectsList);
        } catch (error) {
            Utils.showError(`Failed to load GitHub repositories: ${error.message}`);
        }
    }

    /**
     * Fetches repositories from GitHub API
     * @returns {Promise<Array>} Array of repository objects
     */
    static async fetchRepositories() {
        const response = await fetch(`https://api.github.com/users/${CONFIG.github.username}/repos`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repositories = await response.json();
        console.log('GitHub repositories:', repositories);
        return repositories;
    }

    /**
     * Debug function to check for specific repository
     * @param {Array} repositories - Array of repositories
     * @param {string} repoName - Name of repository to find
     */
    static findRepository(repositories, repoName) {
        const found = repositories.find(repo => 
            repo.name.toLowerCase().includes(repoName.toLowerCase())
        );
        
        if (found) {
            console.log(`Found repository: ${found.name}`, found);
        } else {
            console.log(`Repository containing '${repoName}' not found`);
            console.log('Available repositories:', repositories.map(r => r.name));
        }
        
        return found;
    }

    /**
     * Sort repositories to prioritize featured ones
     * @param {Array} repositories - Array of repository objects
     * @returns {Array} Sorted repositories
     */
    static sortRepositories(repositories) {
        return repositories.sort((a, b) => {
            const aFeatured = CONFIG.github.featuredRepos.includes(a.name);
            const bFeatured = CONFIG.github.featuredRepos.includes(b.name);
            
            if (aFeatured && !bFeatured) return -1;
            if (!aFeatured && bFeatured) return 1;
            
            // If both are featured or both are not featured,
            // sort by last updated date
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
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
            const repo = repositories[i];
            const isFeatured = CONFIG.github.featuredRepos.includes(repo.name);
            
            const project = document.createElement('li');
            project.className = `project-item${isFeatured ? ' featured' : ''}`;
            
            const formattedName = Utils.formatRepoName(repo.name);
            const updatedDate = Utils.formatDate(repo.updated_at);
            
            project.innerHTML = `
                <div class="project-content">
                    ${isFeatured ? '<span class="featured-badge">Featured Project</span>' : ''}
                    <h3 class="project-title">${Utils.sanitizeHTML(formattedName)}</h3>
                    <p class="project-description">${Utils.sanitizeHTML(repo.description || 'No description available')}</p>
                    <div class="project-meta">
                        ${repo.language ? `<span class="project-language">${Utils.sanitizeHTML(repo.language)}</span>` : ''}
                        ${repo.stargazers_count ? `<span class="project-stars">⭐ ${repo.stargazers_count}</span>` : ''}
                        <span class="project-updated">Updated: ${updatedDate}</span>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">View Repository</a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">Live Demo</a>` : ''}
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
        
        console.log('Portfolio application initialized successfully');
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PortfolioApp.initializeComponents();
});