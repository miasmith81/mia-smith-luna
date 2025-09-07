/**
 * Configuration object containing all constants and selectors
 * @const {Object}
 */
const CONFIG = {
    selectors: {
        messageForm: 'form[name="leave_message"]',
        messageList: '#message-list',
        messagesSection: '#messages',
        skillsSection: '#skills',
        skillsList: '#skills ul',
        formFields: {
            name: '#usersName',
            email: '#usersEmail',
            message: '#usersMessage'
        }
    },
    classes: {
        messageItem: 'message-item',
        messageContent: 'message-content',
        messageSender: 'message-sender',
        messageText: 'message-text',
        removeBtn: 'remove-btn',
        thankYouMessage: 'thank-you-message',
        glassContainer: 'glass-container'
    },
    validation: {
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    timing: {
        thankYouMessageDuration: 5000
    },
    footerStyles: {
        textAlign: 'center',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        marginTop: '40px',
        fontSize: '16px',
        fontWeight: '400',
        width: '100%'
    }
};

/**
 * Utility class containing static helper methods
 */
class Utils {
    /**
     * Sanitizes HTML string to prevent XSS
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    static sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Validates email format
     * @param {string} email - Email to validate
     * @returns {boolean} Whether email is valid
     */
    static isValidEmail(email) {
        return CONFIG.validation.emailRegex.test(email);
    }

    /**
     * Shows error message in console
     * @param {string} message - Error message
     */
    static showError(message) {
        console.warn(message);
    }

    /**
     * Applies styles to an element
     * @param {HTMLElement} element - Element to style
     * @param {Object} styles - Styles to apply
     */
    static applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }

    /**
     * Gets current year
     * @returns {number} Current year
     */
    static getCurrentYear() {
        return new Date().getFullYear();
    }
}

/**
 * Form validation class
 */
class FormValidator {
    /**
     * Validates form data
     * @param {Object} formData - Form data to validate
     * @returns {Object} Validation result with isValid and errors
     */
    static validate(formData) {
        const errors = [];

        if (!formData.name || !formData.name.trim()) {
            errors.push('Name is required');
        }

        if (!formData.email || !formData.email.trim()) {
            errors.push('Email is required');
        } else if (!Utils.isValidEmail(formData.email)) {
            errors.push('Invalid email format');
        }

        // Message field is optional, no validation needed

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

/**
 * Skills section handler
 */
class SkillsHandler {
    /**
     * Initializes skills section
     * @param {string[]} skills - Array of skills
     */
    static init(skills) {
        const skillsSection = document.querySelector(CONFIG.selectors.skillsSection);
        const skillsList = skillsSection?.querySelector('ul');
        
        if (skillsList) {
            const fragment = document.createDocumentFragment();
            skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                fragment.appendChild(li);
            });
            skillsList.appendChild(fragment);
        }
    }
}

/**
 * Footer handler
 */
class FooterHandler {
    /**
     * Creates and appends footer
     */
    static init() {
        const footer = document.createElement('footer');
        const copyright = document.createElement('p');
        copyright.innerHTML = `© ${Utils.getCurrentYear()} Mia Smith`;
        footer.appendChild(copyright);
        Utils.applyStyles(footer, CONFIG.footerStyles);
        document.body.appendChild(footer);
    }
}

/**
 * Handles message form functionality including submission, validation, and display
 */
class MessageFormHandler {
    /**
     * Initialize the message form handler
     */
    constructor() {
        this.messageForm = null;
        this.messageList = null;
        this.messagesSection = null;
        this.boundHandleSubmission = this.handleFormSubmission.bind(this);
    }

    /**
     * Initialize the handler and set up event listeners
     */
    init() {
        try {
            this.cacheElements();
            this.validateElements();
            this.setupEventListeners();
            this.checkMessageListVisibility();
        } catch (error) {
            Utils.showError(`Initialization failed: ${error.message}`);
        }
    }

    /**
     * Cache DOM elements for better performance
     * @private
     */
    cacheElements() {
        this.messageForm = document.querySelector(CONFIG.selectors.messageForm);
        this.messageList = document.querySelector(CONFIG.selectors.messageList);
        this.messagesSection = document.querySelector(CONFIG.selectors.messagesSection);
    }

    /**
     * Validate that required elements exist
     * @private
     * @throws {Error} If required elements are missing
     */
    validateElements() {
        if (!this.messageForm || !this.messageList || !this.messagesSection) {
            throw new Error('Required message form elements not found');
        }
    }

    /**
     * Set up event listeners for the form
     * @private
     */
    setupEventListeners() {
        this.messageForm.addEventListener('submit', this.boundHandleSubmission);
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        this.messageForm?.removeEventListener('submit', this.boundHandleSubmission);
    }

    /**
     * Handle form submission
     * @param {Event} event - The submit event
     */
    handleFormSubmission(event) {
        event.preventDefault();

        const userName = event.target.usersName.value;
        const userEmail = event.target.usersEmail.value;
        const userMessage = event.target.usersMessage.value;
        console.log(userName, userEmail, userMessage);

        try {
            const formData = this.extractFormData(event.target);
            const validation = FormValidator.validate(formData);

            if (!validation.isValid) {
                Utils.showError(validation.errors.join(', '));
                return;
            }

            // If no message or empty message, just reset the form and return
            if (!formData.message || !formData.message.trim()) {
                this.resetForm(this.messageForm);
                return;
            }

            this.processFormSubmission(formData);
        } catch (error) {
            Utils.showError(`Form submission failed: ${error.message}`);
        }
    }

    /**
     * Process valid form submission
     * @private
     * @param {Object} formData - The validated form data
     */
    processFormSubmission(formData) {
        this.removeExistingThankYouMessages();
        const messageElement = this.createMessageElement(formData);
        this.addMessageToList(messageElement);
        this.showMessagesSection();
        this.resetForm(this.messageForm);
        this.showThankYouMessage(formData.name);
    }

    /**
     * Extract data from form
     * @private
     * @param {HTMLFormElement} form - The form element
     * @returns {Object} The extracted form data
     */
    extractFormData(form) {
        return {
            name: form.usersName.value.trim(),
            email: form.usersEmail.value.trim(),
            message: form.usersMessage.value.trim()
        };
    }

    /**
     * Create message element with proper structure and events
     * @private
     * @param {Object} formData - The validated form data
     * @returns {HTMLElement} The created message element
     */
    createMessageElement(formData) {
        const messageItem = document.createElement('li');
        messageItem.className = CONFIG.classes.messageItem;
        
        messageItem.innerHTML = `
            <div class="${CONFIG.classes.messageContent}">
                <a href="mailto:${Utils.sanitizeHTML(formData.email)}" 
                   class="${CONFIG.classes.messageSender}">
                    ${Utils.sanitizeHTML(formData.name)}
                </a>
                <p class="${CONFIG.classes.messageText}">
                    ${Utils.sanitizeHTML(formData.message)}
                </p>
            </div>
        `;

        const removeButton = this.createRemoveButton();
        messageItem.appendChild(removeButton);

        return messageItem;
    }

    /**
     * Create remove button with proper attributes and events
     * @private
     * @returns {HTMLButtonElement} The created button
     */
    createRemoveButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = CONFIG.classes.removeBtn;
        button.textContent = 'Remove';
        button.setAttribute('aria-label', 'Remove message');
        
        button.addEventListener('click', () => this.removeMessage(button));
        
        return button;
    }

    /**
     * Remove message and update visibility
     * @param {HTMLButtonElement} button - The remove button
     */
    removeMessage(button) {
        const messageItem = button.closest(`.${CONFIG.classes.messageItem}`);
        if (messageItem) {
            messageItem.remove();
            this.checkMessageListVisibility();
        }
    }

    /**
     * Add message to list
     * @private
     * @param {HTMLElement} messageElement - The message element to add
     */
    addMessageToList(messageElement) {
        this.messageList.appendChild(messageElement);
    }

    /**
     * Show messages section
     */
    showMessagesSection() {
        this.messagesSection.style.display = 'block';
    }

    /**
     * Check and update message list visibility
     */
    checkMessageListVisibility() {
        this.messagesSection.style.display = 
        this.messageList.children.length > 0 ? 'block' : 'none';
    }

    /**
     * Reset form fields
     * @private
     * @param {HTMLFormElement} form - The form to reset
     */
    resetForm(form) {
        form.reset();
    }

    /**
     * Show thank you message with proper accessibility
     * @private
     * @param {string} userName - The user's name
     */
    showThankYouMessage(userName) {
        const thankYouDiv = document.createElement('div');
        thankYouDiv.className = CONFIG.classes.thankYouMessage;
        thankYouDiv.setAttribute('role', 'alert');
        thankYouDiv.setAttribute('aria-live', 'polite');
        
        thankYouDiv.innerHTML = `
            <p>Thank you ${Utils.sanitizeHTML(userName)} for visiting my portfolio site! 
            I will get back to you as soon as possible.</p>
        `;
        
        this.messageForm.parentNode.insertBefore(thankYouDiv, this.messageForm.nextSibling);
        
        setTimeout(() => {
            if (thankYouDiv.parentNode) {
                thankYouDiv.remove();
            }
        }, CONFIG.timing.thankYouMessageDuration);
    }

    /**
     * Remove existing thank you messages
     * @private
     */
    removeExistingThankYouMessages() {
        const existingMessages = document.querySelectorAll(`.${CONFIG.classes.thankYouMessage}`);
        existingMessages.forEach(message => message.remove());
    }
}

// Create a new date object
const today = new Date();

// Get the current year
const thisYear = today.getFullYear();

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

/**
 * Main portfolio application controller
 */
class PortfolioApp {
    constructor() {
        this.messageHandler = null;
    }

    /**
     * Initialize the application
     */
    init() {
        try {
            this.initializeComponents();
            this.setupEventListeners();
        } catch (error) {
            Utils.showError(`Application initialization failed: ${error.message}`);
        }
    }

    /**
     * Initialize all application components
     * @private
     */
    initializeComponents() {
        // Initialize message form
        this.messageHandler = new MessageFormHandler();
        this.messageHandler.init();

        // Initialize skills section
        SkillsHandler.init(skills);

        // Initialize footer
        FooterHandler.init();
    }

    /**
     * Set up global event listeners
     * @private
     */
    setupEventListeners() {
        // Add any global event listeners here
        window.addEventListener('unload', () => this.cleanup());
    }

    /**
     * Clean up resources
     * @private
     */
    cleanup() {
        if (this.messageHandler) {
            this.messageHandler.destroy();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.init();
});