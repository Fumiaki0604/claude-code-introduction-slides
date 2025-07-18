// Simplified Claude Code Slider
console.log('Slider script loading...');

// Fallback if jQuery is not loaded
if (typeof jQuery === 'undefined') {
    console.error('jQuery is not loaded!');
    // Load jQuery manually
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.onload = function() {
        console.log('jQuery loaded manually');
        initializeSlider();
    };
    document.head.appendChild(script);
} else {
    console.log('jQuery is loaded');
    jQuery(document).ready(function ($) {
        initializeSlider();
    });
}

function initializeSlider() {
    console.log('Initializing slider...');
    const $ = jQuery;
    
    let currentSlide = 0;
    const totalSlides = 7;
    const slideWidth = 100; // 100vw
    let autoSlideInterval;
    let isPaused = false;
    let progressInterval;
    let progressPercent = 0;
    
    // Initialize slider
    function initSlider() {
        console.log('Initializing slider...');
        
        // Set initial position
        $('#slider ul').css('transform', 'translateX(0vw)');
        
        // Start auto-slide
        startAutoSlide();
        
        // Start progress bar
        startProgressBar();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('Slider initialized successfully');
    }
    
    function goToSlide(slideIndex) {
        console.log('Going to slide:', slideIndex);
        
        currentSlide = slideIndex;
        const translateX = -slideIndex * slideWidth;
        
        $('#slider ul').css({
            'transform': `translateX(${translateX}vw)`,
            'transition': 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        // Update active slide class
        $('#slider ul li').removeClass('actslide');
        $('#slider ul li').eq(slideIndex).addClass('actslide');
        
        // Reset progress bar
        resetProgressBar();
        startProgressBar();
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }
    
    function startAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        
        autoSlideInterval = setInterval(() => {
            if (!isPaused) {
                nextSlide();
            }
        }, 8000); // 8 seconds
    }
    
    function startProgressBar() {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        progressPercent = 0;
        
        progressInterval = setInterval(() => {
            if (!isPaused) {
                progressPercent += 1.25; // 100% in 8 seconds (100/80 = 1.25)
                $('.progress .bar').css('width', progressPercent + '%');
                
                if (progressPercent >= 100) {
                    clearInterval(progressInterval);
                }
            }
        }, 100); // Update every 100ms
    }
    
    function resetProgressBar() {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        progressPercent = 0;
        $('.progress .bar').css('width', '0%');
    }
    
    function pauseSlider() {
        isPaused = true;
        $('.progress').addClass('paused');
        console.log('Slider paused');
    }
    
    function resumeSlider() {
        isPaused = false;
        $('.progress').removeClass('paused');
        console.log('Slider resumed');
    }
    
    function setupEventListeners() {
        // Navigation buttons
        $('.control_next').on('click', function() {
            console.log('Next button clicked');
            nextSlide();
        });
        
        $('.control_prev').on('click', function() {
            console.log('Previous button clicked');
            prevSlide();
        });
        
        // Progress bar click to pause/resume
        $('.progress').on('click', function() {
            if (isPaused) {
                resumeSlider();
            } else {
                pauseSlider();
            }
        });
        
        // Keyboard navigation
        $(document).on('keydown', function(e) {
            switch(e.which) {
                case 37: // left arrow
                case 38: // up arrow
                    e.preventDefault();
                    prevSlide();
                    break;
                    
                case 39: // right arrow
                case 40: // down arrow
                case 32: // spacebar
                    e.preventDefault();
                    nextSlide();
                    break;
                    
                case 27: // escape
                    e.preventDefault();
                    if (isPaused) {
                        resumeSlider();
                    } else {
                        pauseSlider();
                    }
                    break;
            }
        });
        
        // Touch/swipe navigation
        let startX = 0;
        let startY = 0;
        let threshold = 50;
        
        $('#slider').on('touchstart', function(e) {
            startX = e.originalEvent.touches[0].clientX;
            startY = e.originalEvent.touches[0].clientY;
        });
        
        $('#slider').on('touchend', function(e) {
            const endX = e.originalEvent.changedTouches[0].clientX;
            const endY = e.originalEvent.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only process horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    // Swipe right - go to previous slide
                    prevSlide();
                } else {
                    // Swipe left - go to next slide
                    nextSlide();
                }
            }
        });
        
        // Pause on hover
        $('#slider').on('mouseenter', function() {
            pauseSlider();
        });
        
        $('#slider').on('mouseleave', function() {
            resumeSlider();
        });
        
        // Visibility API - pause when tab is not active
        $(document).on('visibilitychange', function() {
            if (document.hidden) {
                pauseSlider();
            } else {
                resumeSlider();
            }
        });
    }
    
    // Initialize the slider
    initSlider();
    
    // Debug: Add click handlers to test
    console.log('Slider script loaded. Total slides:', totalSlides);
    
    // Test function (can be called from browser console)
    window.testSlider = function() {
        console.log('Testing slider...');
        console.log('Current slide:', currentSlide);
        console.log('Total slides:', totalSlides);
        console.log('Is paused:', isPaused);
        
        // Test navigation
        setTimeout(() => {
            console.log('Testing next slide...');
            nextSlide();
        }, 1000);
    };
    
    // Global access to slider functions
    window.sliderNext = nextSlide;
    window.sliderPrev = prevSlide;
    window.sliderGoTo = goToSlide;
}