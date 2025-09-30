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
 * Art Institute of Chicago API Service
 */
class ArticService {
    static ARTWORK_ID = 27992;
    static API_BASE = 'https://api.artic.edu/api/v1/artworks';
    static IMAGE_BASE = 'https://www.artic.edu/iiif/2';

    static async fetchArtwork() {
        try {
            console.log('Fetching artwork from ARTIC API...');
            const response = await fetch(`${this.API_BASE}/${this.ARTWORK_ID}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Artwork data received:', data);
            return data.data;
        } catch (error) {
            console.error('Error fetching artwork:', error);
            throw error;
        }
    }

    static getImageUrl(imageId, width = 843) {
        if (!imageId) return '';
        return `${this.IMAGE_BASE}/${imageId}/full/${width},/0/default.jpg`;
    }

    static displayArtwork(artwork) {
        console.log('Displaying artwork:', artwork);
        const container = document.getElementById('artic-artwork-container');
        
        if (!container) {
            console.error('ARTIC container not found!');
            return;
        }

        const title = artwork.title || 'Untitled';
        const artist = artwork.artist_display || 'Unknown Artist';
        const dateDisplay = artwork.date_display || 'Date unknown';
        const medium = artwork.medium_display || 'Medium not specified';
        const dimensions = artwork.dimensions || 'Dimensions not available';
        const creditLine = artwork.credit_line || '';
        const imageId = artwork.image_id;

        let htmlContent = '<div class="artic-content">';

        if (imageId) {
            const imageUrl = this.getImageUrl(imageId);
            htmlContent += `
                <div class="artic-image-wrapper">
                    <img src="${imageUrl}" 
                         alt="${title}" 
                         class="artic-image"
                         loading="lazy"
                         onerror="console.error('Image failed to load')">
                </div>
            `;
        }

        htmlContent += `
            <div class="artic-info">
                <h3 class="artic-title">${title}</h3>
                <p class="artic-artist">${artist}</p>
                <p class="artic-date">${dateDisplay}</p>
                
                <div class="artic-details">
                    <div class="artic-detail-item">
                        <span class="artic-detail-label">Medium:</span> ${medium}
                    </div>
                    <div class="artic-detail-item">
                        <span class="artic-detail-label">Dimensions:</span> ${dimensions}
                    </div>
                    ${creditLine ? `
                    <div class="artic-detail-item">
                        <span class="artic-detail-label">Credit:</span> ${creditLine}
                    </div>
                    ` : ''}
                </div>
                
                <a href="https://www.artic.edu/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="artic-link">
                    Visit Art Institute of Chicago
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
            </div>
        `;

        htmlContent += '</div>';
        container.innerHTML = htmlContent;
        console.log('Artwork displayed successfully');
    }

    static showError(message) {
        console.error('ARTIC Error:', message);
        const container = document.getElementById('artic-artwork-container');
        if (container) {
            container.innerHTML = `
                <div class="artic-error">
                    <p><strong>Error loading artwork:</strong></p>
                    <p>${message}</p>
                    <p>Please try refreshing the page.</p>
                </div>
            `;
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
        
        // Initialize ARTIC artwork
        PortfolioApp.initializeArticArtwork();
        
        console.log('Portfolio application initialized successfully');
    }

    /**
     * Initialize Art Institute of Chicago artwork display
     */
    static async initializeArticArtwork() {
        console.log('Initializing ARTIC artwork...');
        try {
            const artwork = await ArticService.fetchArtwork();
            ArticService.displayArtwork(artwork);
        } catch (error) {
            console.error('ARTIC initialization failed:', error);
            ArticService.showError('Failed to load artwork from Art Institute of Chicago API. Please check your internet connection.');
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PortfolioApp.initializeComponents();
});