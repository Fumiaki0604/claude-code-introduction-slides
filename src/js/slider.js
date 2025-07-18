// Simple Vanilla JavaScript Slider
console.log('Loading slider script...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing slider...');
    
    // Slider variables
    let currentSlide = 0;
    const totalSlides = 7;
    let autoSlideInterval;
    let progressInterval;
    let isPaused = false;
    
    // DOM elements
    const slider = document.getElementById('slider');
    if (!slider) {
        console.error('Slider element not found!');
        return;
    }
    
    const sliderUl = slider.querySelector('ul');
    if (!sliderUl) {
        console.error('Slider UL not found!');
        return;
    }
    
    const slides = sliderUl.querySelectorAll('li');
    const nextBtn = slider.querySelector('.control_next');
    const prevBtn = slider.querySelector('.control_prev');
    const progressBar = slider.querySelector('.progress .bar');
    const progressContainer = slider.querySelector('.progress');
    
    console.log('Found elements:', {
        slider: !!slider,
        sliderUl: !!sliderUl,
        slides: slides.length,
        nextBtn: !!nextBtn,
        prevBtn: !!prevBtn,
        progressBar: !!progressBar
    });
    
    // Initialize slider
    function initSlider() {
        console.log('Initializing slider...');
        
        // Force proper styling
        sliderUl.style.transform = 'translateX(0vw)';
        sliderUl.style.transition = 'transform 1s ease-in-out';
        sliderUl.style.display = 'flex';
        sliderUl.style.flexDirection = 'row';
        sliderUl.style.width = '700vw';
        sliderUl.style.height = '100vh';
        
        // Log initial state
        console.log('Initial slider state:', {
            transform: sliderUl.style.transform,
            width: sliderUl.style.width,
            display: window.getComputedStyle(sliderUl).display,
            flexDirection: window.getComputedStyle(sliderUl).flexDirection
        });
        
        // Add event listeners first
        addEventListeners();
        
        // Update active slide
        updateActiveSlide();
        
        // Start auto-slide
        startAutoSlide();
        
        // Start progress bar
        startProgressBar();
        
        console.log('Slider initialized successfully');
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        console.log('Going to slide:', slideIndex);
        
        if (slideIndex < 0 || slideIndex >= totalSlides) {
            console.log('Invalid slide index:', slideIndex);
            return;
        }
        
        currentSlide = slideIndex;
        const translateX = -slideIndex * 100; // 100vw per slide
        
        console.log('Setting transform to:', `translateX(${translateX}vw)`);
        sliderUl.style.transform = `translateX(${translateX}vw)`;
        
        updateActiveSlide();
        resetProgressBar();
        
        if (!isPaused) {
            startProgressBar();
        }
        
        console.log('Moved to slide:', slideIndex, 'Transform:', sliderUl.style.transform);
    }
    
    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }
    
    // Previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }
    
    // Update active slide class
    function updateActiveSlide() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('actslide');
            } else {
                slide.classList.remove('actslide');
            }
        });
    }
    
    // Start auto-slide
    function startAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        
        autoSlideInterval = setInterval(() => {
            if (!isPaused) {
                nextSlide();
            }
        }, 8000); // 8 seconds
        
        console.log('Auto-slide started');
    }
    
    // Start progress bar
    function startProgressBar() {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        let progress = 0;
        const increment = 100 / 80; // 100% over 8 seconds (80 steps of 100ms)
        
        progressInterval = setInterval(() => {
            if (!isPaused) {
                progress += increment;
                progressBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                }
            }
        }, 100);
    }
    
    // Reset progress bar
    function resetProgressBar() {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        progressBar.style.width = '0%';
    }
    
    // Pause slider
    function pauseSlider() {
        isPaused = true;
        progressContainer.classList.add('paused');
        console.log('Slider paused');
    }
    
    // Resume slider
    function resumeSlider() {
        isPaused = false;
        progressContainer.classList.remove('paused');
        console.log('Slider resumed');
    }
    
    // Add event listeners
    function addEventListeners() {
        // Navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                console.log('Next button clicked');
                nextSlide();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                console.log('Previous button clicked');
                prevSlide();
            });
        }
        
        // Progress bar click
        if (progressContainer) {
            progressContainer.addEventListener('click', function() {
                if (isPaused) {
                    resumeSlider();
                    startProgressBar();
                } else {
                    pauseSlider();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'Escape':
                    e.preventDefault();
                    if (isPaused) {
                        resumeSlider();
                        startProgressBar();
                    } else {
                        pauseSlider();
                    }
                    break;
            }
        });
        
        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        
        slider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        slider.addEventListener('touchend', function(e) {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only process horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe right - previous slide
                    prevSlide();
                } else {
                    // Swipe left - next slide
                    nextSlide();
                }
            }
        });
        
        // Hover to pause
        slider.addEventListener('mouseenter', function() {
            pauseSlider();
        });
        
        slider.addEventListener('mouseleave', function() {
            resumeSlider();
            if (!isPaused) {
                startProgressBar();
            }
        });
        
        // Visibility API
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                pauseSlider();
            } else {
                resumeSlider();
                if (!isPaused) {
                    startProgressBar();
                }
            }
        });
        
        console.log('Event listeners added');
    }
    
    // Initialize the slider
    initSlider();
    
    // Test the slider immediately
    setTimeout(() => {
        console.log('=== Auto Test ===');
        console.log('Testing slider after 3 seconds...');
        nextSlide();
    }, 3000);
    
    // Global functions for debugging
    window.testSlider = function() {
        console.log('=== Slider Test ===');
        console.log('Current slide:', currentSlide);
        console.log('Total slides:', totalSlides);
        console.log('Is paused:', isPaused);
        console.log('Slider element:', slider);
        console.log('Slider UL:', sliderUl);
        console.log('Current transform:', sliderUl.style.transform);
        console.log('Computed styles:', window.getComputedStyle(sliderUl));
        
        // Test next slide
        console.log('Testing next slide in 2 seconds...');
        setTimeout(() => {
            nextSlide();
        }, 2000);
    };
    
    // Force slide to work
    window.forceSlide = function(index) {
        console.log('Force sliding to index:', index);
        if (index < 0 || index >= totalSlides) {
            console.log('Invalid index');
            return;
        }
        
        currentSlide = index;
        const translateValue = -index * 100;
        console.log('Setting transform to:', `translateX(${translateValue}vw)`);
        
        sliderUl.style.transform = `translateX(${translateValue}vw)`;
        updateActiveSlide();
        
        console.log('Force slide completed. Current transform:', sliderUl.style.transform);
    };
    
    window.sliderNext = nextSlide;
    window.sliderPrev = prevSlide;
    window.sliderGoTo = goToSlide;
    window.sliderPause = pauseSlider;
    window.sliderResume = resumeSlider;
    
    console.log('Slider script loaded successfully');
    console.log('Available debug functions: testSlider(), sliderNext(), sliderPrev(), sliderGoTo(index)');
});