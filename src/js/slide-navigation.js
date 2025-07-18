// Slide Navigation Enhancement

class SlideNavigationEnhancer {
    constructor() {
        this.slideIndicators = null;
        this.progressBar = null;
        this.init();
    }
    
    init() {
        this.createSlideIndicators();
        this.createProgressBar();
        this.setupSlideCounter();
    }
    
    createSlideIndicators() {
        const navigation = document.querySelector('.slide-navigation');
        if (!navigation) return;
        
        const indicators = document.createElement('div');
        indicators.className = 'slide-indicators';
        indicators.innerHTML = `
            <style>
                .slide-indicators {
                    position: fixed;
                    bottom: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                    z-index: 100;
                }
                .indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .indicator.active {
                    background: white;
                    transform: scale(1.2);
                }
                .indicator:hover {
                    background: rgba(255, 255, 255, 0.8);
                }
                .progress-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    transition: width 0.3s ease;
                    z-index: 1000;
                }
            </style>
        `;
        
        // Create indicator dots
        const totalSlides = document.querySelectorAll('.slide').length;
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'indicator';
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                window.slidePresentation?.goToSlide(i);
                this.updateIndicators(i);
            });
            
            indicators.appendChild(dot);
        }
        
        document.body.appendChild(indicators);
        this.slideIndicators = indicators;
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = '14.28%'; // 1/7 for first slide
        
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }
    
    setupSlideCounter() {
        // Update indicators and progress when slides change
        const originalUpdateSlideVisibility = window.SlidePresentation?.prototype.updateSlideVisibility;
        
        if (originalUpdateSlideVisibility) {
            window.SlidePresentation.prototype.updateSlideVisibility = function() {
                originalUpdateSlideVisibility.call(this);
                
                // Update indicators
                const indicators = document.querySelectorAll('.indicator');
                indicators.forEach((indicator, index) => {
                    if (index === this.currentSlide) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
                
                // Update progress bar
                const progressBar = document.querySelector('.progress-bar');
                if (progressBar) {
                    const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
                    progressBar.style.width = `${progress}%`;
                }
            };
        }
    }
    
    updateIndicators(currentSlide) {
        const indicators = this.slideIndicators?.querySelectorAll('.indicator');
        if (indicators) {
            indicators.forEach((indicator, index) => {
                if (index === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        // Update progress bar
        if (this.progressBar) {
            const totalSlides = document.querySelectorAll('.slide').length;
            const progress = ((currentSlide + 1) / totalSlides) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }
}

// Auto-play functionality
class SlideAutoPlay {
    constructor(interval = 10000) { // 10 seconds
        this.interval = interval;
        this.timer = null;
        this.isPlaying = false;
        this.init();
    }
    
    init() {
        this.createAutoPlayControls();
    }
    
    createAutoPlayControls() {
        const controls = document.createElement('div');
        controls.className = 'autoplay-controls';
        controls.innerHTML = `
            <style>
                .autoplay-controls {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                .autoplay-btn {
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }
                .autoplay-btn:hover {
                    background: white;
                    transform: scale(1.05);
                }
            </style>
            <button class="autoplay-btn" id="autoplay-toggle">¶ Auto Play</button>
        `;
        
        document.body.appendChild(controls);
        
        const toggleBtn = document.getElementById('autoplay-toggle');
        toggleBtn.addEventListener('click', () => this.toggle());
    }
    
    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.timer = setInterval(() => {
            const presentation = window.slidePresentation;
            if (presentation) {
                if (presentation.currentSlide < presentation.totalSlides - 1) {
                    presentation.nextSlide();
                } else {
                    this.stop(); // Stop at the end
                }
            }
        }, this.interval);
        
        const toggleBtn = document.getElementById('autoplay-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = 'ø Pause';
        }
    }
    
    stop() {
        if (!this.isPlaying) return;
        
        this.isPlaying = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        const toggleBtn = document.getElementById('autoplay-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '¶ Auto Play';
        }
    }
    
    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }
}

// Initialize enhancements
document.addEventListener('DOMContentLoaded', () => {
    new SlideNavigationEnhancer();
    new SlideAutoPlay();
});