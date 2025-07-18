// Claude Code Slide Presentation
// Based on reference slider functionality

jQuery(document).ready(function ($) {
    
    startSlider($('#slider'), 50); // Slide container ID, SlideShow interval (50ms for smooth progress)
    
    function startSlider(obj, timer) {
        
        var obj, timer;
        var id = "#" + obj.attr("id");
        var slideCount = obj.find('ul li').length;
        var slideWidth = obj.attr("data-width");
        var sliderUlWidth = (slideCount + 1) * slideWidth;
        var time = 8; // seconds per slide
        var $bar,
            isPause,
            tick,
            percentTime;
        
        isPause = false; // false for auto slideshow
        
        $bar = obj.find('.progress .bar');
        
        function startProgressbar() {
            resetProgressbar();
            percentTime = 0;
            tick = setInterval(interval, timer);
        }
        
        function interval() {
            if (isPause === false) {
                percentTime += 1 / (time * 20); // 20 intervals per second
                $bar.css({
                    width: percentTime * 100 + "%"
                });
                if (percentTime >= 1) {
                    moveRight();
                    startProgressbar();
                }
            }
        }
        
        function resetProgressbar() {
            $bar.css({
                width: 0 + '%'
            });
            clearInterval(tick);
        }
        
        function startslide() {
            $(id + ' ul li:last-child').prependTo(id + ' ul');
            obj.find('ul').css({ 
                width: sliderUlWidth + 'vw', 
                marginLeft: -slideWidth + 'vw' 
            });
            
            obj.find('ul li:last-child').appendTo(id + ' ul');
        }
        
        if (slideCount > 1) {
            startslide();
            startProgressbar();
        } else { 
            // Hide navigation buttons for 1 slide only
            $(id + ' button.control_prev').hide();
            $(id + ' button.control_next').hide();
        }
        
        function moveLeft() {
            $(id + ' ul').css({ 
                transition: "1s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: "translateX(" + slideWidth + "vw)" 
            });
            
            setTimeout(function() {
                $(id + ' ul li:last-child').prependTo(id + ' ul');
                $(id + ' ul').css({ 
                    transition: "none",
                    transform: "translateX(" + 0 + "vw)" 
                });
                
                // Update active slide
                var $currentActive = $('li.actslide');
                $currentActive.removeClass('actslide');
                var $prevSlide = $currentActive.prev();
                if ($prevSlide.length === 0) {
                    $prevSlide = $(id + ' ul li:last-child');
                }
                $prevSlide.addClass('actslide');
                
            }, 1000);
        }
        
        function moveRight2() { 
            // Fix for only 2 slides
            $(id + ' ul li:first-child').appendTo(id + ' ul');
            
            $(id + ' ul').css({ 
                transition: "none",
                transform: "translateX(100vw)" 
            });
            
            setTimeout(function() {
                $(id + ' ul').css({ 
                    transition: "1s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: "translateX(0vw)" 
                });
                
                setTimeout(function() {
                    $(id + ' ul').css({ 
                        transition: "none",
                        transform: "translateX(0vw)" 
                    });
                    
                    // Update active slide
                    var $currentActive = $('li.actslide');
                    $currentActive.removeClass('actslide');
                    var $nextSlide = $currentActive.next();
                    if ($nextSlide.length === 0) {
                        $nextSlide = $(id + ' ul li:first-child');
                    }
                    $nextSlide.addClass('actslide');
                    
                }, 1000);
            }, 100);
        }
        
        function moveRight() {
            if (slideCount > 2) {
                $(id + ' ul').css({ 
                    transition: "1s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: "translateX(" + (-1) * slideWidth + "vw)" 
                });
                
                setTimeout(function() {
                    $(id + ' ul li:first-child').appendTo(id + ' ul');
                    $(id + ' ul').css({ 
                        transition: "none",
                        transform: "translateX(" + 0 + "vw)" 
                    });
                    
                    // Update active slide
                    var $currentActive = $('li.actslide');
                    $currentActive.removeClass('actslide');
                    var $nextSlide = $currentActive.next();
                    if ($nextSlide.length === 0) {
                        $nextSlide = $(id + ' ul li:first-child');
                    }
                    $nextSlide.addClass('actslide');
                    
                }, 1000);
            } else {
                moveRight2();
            }
        }
        
        // Navigation button events
        $(id + ' button.control_prev').click(function() {
            moveLeft();
            startProgressbar();
        });
        
        $(id + ' button.control_next').click(function() {
            moveRight();
            startProgressbar();
        });
        
        // Progress bar click to pause/resume
        $(id + ' .progress').click(function() {
            if (isPause === false) {
                isPause = true;
                $(this).addClass('paused');
            } else {
                isPause = false;
                $(this).removeClass('paused');
            }
        });
        
        // Keyboard navigation
        $(document).keydown(function(e) {
            switch(e.which) {
                case 37: // left arrow
                case 38: // up arrow
                    e.preventDefault();
                    moveLeft();
                    startProgressbar();
                    break;
                    
                case 39: // right arrow
                case 40: // down arrow
                case 32: // spacebar
                    e.preventDefault();
                    moveRight();
                    startProgressbar();
                    break;
                    
                case 27: // escape
                    e.preventDefault();
                    if (isPause === false) {
                        isPause = true;
                        $(id + ' .progress').addClass('paused');
                    } else {
                        isPause = false;
                        $(id + ' .progress').removeClass('paused');
                    }
                    break;
                    
                default: return;
            }
        });
        
        // Touch/swipe navigation
        var startX, startY, distX, distY, threshold = 100, restraint = 100, allowedTime = 300, elapsedTime, startTime;
        
        $(id).on('touchstart', function(e) {
            var touchobj = e.originalEvent.changedTouches[0];
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();
            e.preventDefault();
        });
        
        $(id).on('touchend', function(e) {
            var touchobj = e.originalEvent.changedTouches[0];
            distX = touchobj.pageX - startX;
            distY = touchobj.pageY - startY;
            elapsedTime = new Date().getTime() - startTime;
            
            if (elapsedTime <= allowedTime) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    if (distX > 0) {
                        // Swipe right - go to previous slide
                        moveLeft();
                        startProgressbar();
                    } else {
                        // Swipe left - go to next slide
                        moveRight();
                        startProgressbar();
                    }
                }
            }
            e.preventDefault();
        });
        
        // Auto-pause on hover
        $(id).hover(
            function() {
                if (!isPause) {
                    isPause = true;
                    $(id + ' .progress').addClass('paused');
                }
            },
            function() {
                if (isPause) {
                    isPause = false;
                    $(id + ' .progress').removeClass('paused');
                }
            }
        );
        
        // Visibility API - pause when tab is not active
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                if (!isPause) {
                    isPause = true;
                    $(id + ' .progress').addClass('paused');
                }
            } else {
                if (isPause) {
                    isPause = false;
                    $(id + ' .progress').removeClass('paused');
                }
            }
        });
    }
});