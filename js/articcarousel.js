/**
 * Art Institute of Chicago API Integration for Carousel
 */
class ArticCarousel {
    constructor() {
        this.apiBaseUrl = 'https://api.artic.edu/api/v1';
        this.iiifBaseUrl = 'https://www.artic.edu/iiif/2';
        this.currentIndex = 0;
        this.artworks = [];
        this.carouselTrack = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.loadingElement = null;
        this.errorElement = null;
        this.isLoading = false;
        this.cardsToShow = this.calculateCardsToShow();
    }

    /**
     * Calculate how many cards to show based on screen size
     */
    calculateCardsToShow() {
        const width = window.innerWidth;
        if (width >= 1200) return 3;
        if (width >= 768) return 2;
        return 1;
    }

    /**
     * Initialize the art carousel
     */
    async init() {
        try {
            this.cacheElements();
            if (!this.carouselTrack) {
                console.warn('ARTIC Carousel elements not found');
                return;
            }
            
            this.setupEventListeners();
            await this.loadArtworks();
            this.renderArtworks();
            this.updateControls();
        } catch (error) {
            console.error('Failed to initialize ARTIC carousel:', error);
            this.showError();
        }
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.carouselTrack = document.querySelector('#artic .carousel-track');
        this.prevBtn = document.querySelector('#artic .prev-btn');
        this.nextBtn = document.querySelector('#artic .next-btn');
        this.loadingElement = document.querySelector('#artic .carousel-loading');
        this.errorElement = document.querySelector('#artic .carousel-error');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Add touch/swipe support for mobile
        this.setupTouchEvents();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const newCardsToShow = this.calculateCardsToShow();
        if (newCardsToShow !== this.cardsToShow) {
            this.cardsToShow = newCardsToShow;
            this.currentIndex = Math.min(this.currentIndex, this.getMaxIndex());
            this.updateCarouselPosition();
            this.updateControls();
        }
    }

    /**
     * Set up touch events for mobile swipe
     */
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;

        if (this.carouselTrack) {
            this.carouselTrack.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            this.carouselTrack.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe(startX, endX);
            }, { passive: true });
        }
    }

    /**
     * Handle swipe gestures
     */
    handleSwipe(startX, endX) {
        const deltaX = endX - startX;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
    }

    /**
     * Load artworks from the Art Institute API
     */
    async loadArtworks() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
            // Search for public domain artworks with images
            const searchUrl = `${this.apiBaseUrl}/artworks/search`;
            const searchParams = new URLSearchParams({
                'query[term][is_public_domain]': 'true',
                'query[exists]': 'image_id',
                'fields': 'id,title,artist_display,date_display,image_id,thumbnail',
                'limit': '24'
            });

            const response = await fetch(`${searchUrl}?${searchParams}`);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                this.artworks = data.data.filter(artwork => artwork.image_id);
                console.log(`Loaded ${this.artworks.length} artworks from ARTIC`);
            } else {
                throw new Error('No artworks found');
            }

        } catch (error) {
            console.error('Error loading ARTIC artworks:', error);
            this.showError();
            throw error;
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    /**
     * Render artworks in the carousel
     */
    renderArtworks() {
        if (!this.carouselTrack || this.artworks.length === 0) {
            this.showError();
            return;
        }

        this.carouselTrack.innerHTML = '';

        this.artworks.forEach((artwork, index) => {
            const artworkCard = this.createArtworkCard(artwork, index);
            this.carouselTrack.appendChild(artworkCard);
        });

        this.updateCarouselPosition();
    }

    /**
     * Create an artwork card element
     */
    createArtworkCard(artwork, index) {
        const card = document.createElement('div');
        card.className = 'artwork-card';
        card.setAttribute('data-index', index);

        // Construct IIIF image URL
        const imageUrl = artwork.image_id 
            ? `${this.iiifBaseUrl}/${artwork.image_id}/full/600,/0/default.jpg`
            : '';

        // Create artwork page URL
        const artworkUrl = `https://www.artic.edu/artworks/${artwork.id}`;

        // Create fallback image
        const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PGNpcmNsZSBjeD0iMzAwIiBjeT0iMTgwIiByPSI0MCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';

        card.innerHTML = `
            <img src="${imageUrl}" 
                 alt="${this.escapeHtml(artwork.title || 'Untitled')}" 
                 class="artwork-image clickable-artwork-image"
                 loading="lazy"
                 style="cursor: pointer;"
                 data-artwork-id="${artwork.id}"
                 onerror="this.src='${fallbackImage}';">
            <div class="artwork-info">
                <h4 class="artwork-title">${this.escapeHtml(artwork.title || 'Untitled')}</h4>
                <p class="artwork-artist">${this.escapeHtml(artwork.artist_display || 'Unknown Artist')}</p>
                <p class="artwork-date">${this.escapeHtml(artwork.date_display || 'Date unknown')}</p>
                <a href="${artworkUrl}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="artwork-link">
                    View at AIC
                    <span>→</span>
                </a>
            </div>
        `;

        // Add click event listener to the image
        const imageElement = card.querySelector('.clickable-artwork-image');
        if (imageElement) {
            imageElement.addEventListener('click', () => {
                this.showArtworkDetails(artwork.id);
            });
        }

        return card;
    }

    /**
     * Show detailed artwork information
     */
    async showArtworkDetails(artworkId) {
        try {
            const detailViewer = document.getElementById('artwork-detail-viewer');
            if (!detailViewer) return;

            // Show loading state
            this.showDetailLoading();
            detailViewer.style.display = 'block';
            
            // Smooth scroll to detail viewer
            setTimeout(() => {
                detailViewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                detailViewer.classList.add('show');
            }, 100);

            // Fetch detailed artwork data
            const artworkData = await this.fetchArtworkDetails(artworkId);
            
            // Populate the detail viewer
            this.populateDetailViewer(artworkData);
            
            // Set up close button
            this.setupDetailViewerEvents();

        } catch (error) {
            console.error('Error showing artwork details:', error);
            this.showDetailError();
        }
    }

    /**
     * Fetch detailed artwork information from API
     */
    async fetchArtworkDetails(artworkId) {
        const detailUrl = `${this.apiBaseUrl}/artworks/${artworkId}`;
        const params = new URLSearchParams({
            'fields': 'id,title,artist_display,artist_title,date_display,medium_display,dimensions,credit_line,publication_history,exhibition_history,provenance_text,catalogue_display,description,image_id,thumbnail,is_public_domain'
        });

        const response = await fetch(`${detailUrl}?${params}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch artwork details: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    }

    /**
     * Populate the detail viewer with artwork information
     */
    populateDetailViewer(artwork) {
        // Update image
        const detailImage = document.getElementById('detail-image');
        if (detailImage && artwork.image_id) {
            const largeImageUrl = `${this.iiifBaseUrl}/${artwork.image_id}/full/843,/0/default.jpg`;
            detailImage.src = largeImageUrl;
            detailImage.alt = artwork.title || 'Untitled';
        }

        // Update title
        const titleElement = document.getElementById('detail-title');
        if (titleElement) {
            titleElement.textContent = artwork.title || 'Untitled';
        }

        // Update artist information
        const artistNameElement = document.getElementById('detail-artist-name');
        const artistBioElement = document.getElementById('detail-artist-bio');
        
        if (artistNameElement) {
            const artistName = artwork.artist_title || this.extractArtistName(artwork.artist_display) || 'Unknown Artist';
            artistNameElement.textContent = artistName;
        }
        
        if (artistBioElement) {
            artistBioElement.textContent = this.generateArtistBio(artwork);
        }

        // Update artwork info
        const dateElement = document.getElementById('detail-date');
        const mediumElement = document.getElementById('detail-medium');
        const dimensionsElement = document.getElementById('detail-dimensions');
        const creditElement = document.getElementById('detail-credit');

        if (dateElement) {
            dateElement.innerHTML = `<strong>Date:</strong> ${artwork.date_display || 'Date unknown'}`;
        }
        
        if (mediumElement) {
            mediumElement.innerHTML = `<strong>Medium:</strong> ${artwork.medium_display || 'Medium unknown'}`;
        }
        
        if (dimensionsElement) {
            dimensionsElement.innerHTML = `<strong>Dimensions:</strong> ${artwork.dimensions || 'Dimensions not available'}`;
        }
        
        if (creditElement) {
            creditElement.innerHTML = `<strong>Credit:</strong> ${artwork.credit_line || 'Art Institute of Chicago'}`;
        }

        // Update description/significance
        const descriptionElement = document.getElementById('detail-description');
        if (descriptionElement) {
            descriptionElement.textContent = this.generateArtworkSignificance(artwork);
        }

        // Update museum link
        const museumLink = document.getElementById('detail-museum-link');
        if (museumLink) {
            museumLink.href = `https://www.artic.edu/artworks/${artwork.id}`;
        }

        // Hide loading
        this.hideDetailLoading();
    }

    /**
     * Extract artist name from artist_display string
     */
    extractArtistName(artistDisplay) {
        if (!artistDisplay) return null;
        
        // Try to extract name before nationality/dates
        const match = artistDisplay.match(/^([^,\n]+)/);
        return match ? match[1].trim() : artistDisplay;
    }

    /**
     * Generate artist biography information
     */
    generateArtistBio(artwork) {
        const artistInfo = artwork.artist_display || '';
        
        if (artistInfo.includes('American')) {
            return "This artist contributed to the rich tradition of American art, reflecting the cultural and social movements of their time.";
        } else if (artistInfo.includes('French')) {
            return "Part of the influential French artistic tradition, this artist helped shape European art movements and international artistic discourse.";
        } else if (artistInfo.includes('Italian')) {
            return "Drawing from Italy's Renaissance heritage, this artist continued the tradition of Italian mastery in visual arts.";
        } else if (artistInfo.includes('German')) {
            return "Contributing to Germany's rich artistic legacy, this artist explored themes central to German cultural identity and European art movements.";
        } else if (artistInfo.includes('British') || artistInfo.includes('English')) {
            return "Part of the British artistic tradition, this artist contributed to the evolution of art in the English-speaking world.";
        } else {
            return "This artist represents the international nature of art, contributing unique perspectives to the global artistic conversation.";
        }
    }

    /**
     * Generate artwork significance description
     */
    generateArtworkSignificance(artwork) {
        const title = artwork.title || '';
        const date = artwork.date_display || '';
        const medium = artwork.medium_display || '';
        
        let significance = '';
        
        if (medium.toLowerCase().includes('oil')) {
            significance += "This oil painting demonstrates the artist's mastery of traditional techniques, ";
        } else if (medium.toLowerCase().includes('watercolor')) {
            significance += "This watercolor showcases the delicate and translucent qualities of the medium, ";
        } else if (medium.toLowerCase().includes('bronze') || medium.toLowerCase().includes('sculpture')) {
            significance += "This sculptural work represents three-dimensional artistic expression, ";
        } else {
            significance += "This artwork exemplifies the artist's technical skill and creative vision, ";
        }
        
        if (date.includes('19th century') || date.includes('18')) {
            significance += "reflecting the artistic movements and social changes of the 19th century. ";
        } else if (date.includes('20th century') || date.includes('19')) {
            significance += "embodying the revolutionary artistic developments of the 20th century. ";
        } else {
            significance += "representing the artistic traditions of its time period. ";
        }
        
        significance += "As part of the Art Institute of Chicago's distinguished collection, this work contributes to our understanding of art history and continues to inspire contemporary audiences. ";
        
        significance += "The piece demonstrates the universal power of art to communicate across cultures and time periods, making it an invaluable part of our shared cultural heritage.";
        
        return significance;
    }

    /**
     * Set up event listeners for detail viewer
     */
    setupDetailViewerEvents() {
        const closeBtn = document.querySelector('.close-detail-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideArtworkDetails();
            });
        }

        // Close on Escape key
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                this.hideArtworkDetails();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
    }

    /**
     * Hide artwork details viewer
     */
    hideArtworkDetails() {
        const detailViewer = document.getElementById('artwork-detail-viewer');
        if (detailViewer) {
            detailViewer.classList.remove('show');
            setTimeout(() => {
                detailViewer.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Show loading state in detail viewer
     */
    showDetailLoading() {
        const loadingElement = document.querySelector('.artwork-detail-loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
    }

    /**
     * Hide loading state in detail viewer
     */
    hideDetailLoading() {
        const loadingElement = document.querySelector('.artwork-detail-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    /**
     * Show error in detail viewer
     */
    showDetailError() {
        const descriptionElement = document.getElementById('detail-description');
        if (descriptionElement) {
            descriptionElement.textContent = 'Unable to load artwork details at this time. Please try again later.';
            descriptionElement.style.color = '#dc2626';
        }
        this.hideDetailLoading();
    }

    /**
     * Move to the next slide
     */
    nextSlide() {
        if (this.currentIndex < this.getMaxIndex()) {
            this.currentIndex++;
            this.updateCarouselPosition();
            this.updateControls();
        }
    }

    /**
     * Move to the previous slide
     */
    previousSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarouselPosition();
            this.updateControls();
        }
    }

    /**
     * Update carousel position
     */
    updateCarouselPosition() {
        if (!this.carouselTrack) return;

        const cardWidth = 320 + 24; // card width + margin
        const translateX = -this.currentIndex * cardWidth;
        this.carouselTrack.style.transform = `translateX(${translateX}px)`;
    }

    /**
     * Update control button states
     */
    updateControls() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= this.getMaxIndex();
        }
    }

    /**
     * Get maximum index for sliding
     */
    getMaxIndex() {
        return Math.max(0, this.artworks.length - this.cardsToShow);
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
        if (this.errorElement) {
            this.errorElement.style.display = 'none';
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    /**
     * Show error state
     */
    showError() {
        if (this.errorElement) {
            this.errorElement.style.display = 'block';
        }
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
