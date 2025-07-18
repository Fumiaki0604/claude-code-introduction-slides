// Main JavaScript for Claude Code Introduction Slides

class SlidePresentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateSlideVisibility();
        this.updateNavigationButtons();
    }
    
    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    this.nextSlide();
                    break;
                case 'Home':
                    this.goToSlide(0);
                    break;
                case 'End':
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });
        
        // Touch navigation
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only process horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlideVisibility();
            this.updateNavigationButtons();
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlideVisibility();
            this.updateNavigationButtons();
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            this.currentSlide = slideIndex;
            this.updateSlideVisibility();
            this.updateNavigationButtons();
        }
    }
    
    updateSlideVisibility() {
        this.slides.forEach((slide, index) => {
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentSlide === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SlidePresentation();
});

// Utility functions
function addSlideAnimation(element) {
    element.classList.add('fade-in');
}

function highlightCode() {
    const codeBlocks = document.querySelectorAll('.code-block pre code');
    codeBlocks.forEach(block => {
        // Simple syntax highlighting for shell commands
        let html = block.innerHTML;
        html = html.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
        html = html.replace(/\b(npm|curl|claude-code)\b/g, '<span class="keyword">$1</span>');
        block.innerHTML = html;
    });
}

// Initialize code highlighting
document.addEventListener('DOMContentLoaded', highlightCode);