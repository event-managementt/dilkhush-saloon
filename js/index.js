// --- Hamburger Menu Logic ---
        const navMenu = document.getElementById("navMenu");
        const CLOSE_ON_SCROLL_THRESHOLD = 180;

        function toggleMenu() { navMenu.classList.toggle("active"); }
        window.addEventListener("scroll", function() {
            if (window.scrollY > CLOSE_ON_SCROLL_THRESHOLD && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
            }
        });

        // --- DYNAMIC SLIDER LOGIC ---
        function getScrollAmount(grid) {
            if (!grid || grid.children.length === 0) return 0;
            const card = grid.children[0];
            const gap = parseFloat(window.getComputedStyle(grid).gap) || 0;
            return card.offsetWidth + gap;
        }

        function scrollGrid(gridId, direction) {
            const grid = document.getElementById(gridId);
            const scrollAmount = getScrollAmount(grid);
            if(scrollAmount > 0) {
                grid.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
            }
        }

        function goToSlide(gridId, index) {
            const grid = document.getElementById(gridId);
            const scrollAmount = getScrollAmount(grid);
            if(scrollAmount > 0) {
                grid.scrollTo({ left: index * scrollAmount, behavior: 'smooth' });
            }
        }

        function updateDots(gridId, dotsId) {
            const grid = document.getElementById(gridId);
            const dotsContainer = document.getElementById(dotsId);
            const scrollAmount = getScrollAmount(grid);
            if(!grid || !dotsContainer || scrollAmount === 0) return;
            
            const dots = dotsContainer.querySelectorAll('.dot');
            let index = Math.round(grid.scrollLeft / scrollAmount);
            
            dots.forEach((dot, i) => {
                if (i === index) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }

        // --- AUTO SLIDER LOGIC ---
        function startAutoSlide(gridId) {
            setInterval(() => {
                const grid = document.getElementById(gridId);
                const scrollAmount = getScrollAmount(grid);
                if (scrollAmount === 0) return;

                let currentIndex = Math.round(grid.scrollLeft / scrollAmount);
                let nextIndex = currentIndex + 1;

                const maxScrollLeft = grid.scrollWidth - grid.clientWidth;
                const maxIndex = Math.round(maxScrollLeft / scrollAmount);

                if (currentIndex >= maxIndex) {
                    nextIndex = 0;
                }
                goToSlide(gridId, nextIndex);
            }, 3000); 
        }

        // --- GALLERY AUTO CHANGE LOGIC ---
        const galleryImages = [
            'gallery/img1.png',
            'gallery/img2.png',
            'gallery/img3.png',
            'gallery/img4.png',
            'gallery/img5.png',
            'gallery/img6.png',
            'gallery/img1.png',
            'gallery/img2.png',
            'gallery/img3.png',
            'gallery/img4.png',
            'gallery/img5.png',
            'gallery/img6.png'
        ];
        
        let currentGalleryGroup = 0;

        function updateGalleryImages() {
            const imgEls = document.querySelectorAll('.gallery-card img.gal-bg');
            currentGalleryGroup = (currentGalleryGroup + 4) % galleryImages.length;
            
            imgEls.forEach((img, index) => {
                setTimeout(() => {
                    img.style.opacity = 0; 
                    img.style.transform = 'translateX(20px)'; 
                    
                    setTimeout(() => {
                        img.src = galleryImages[(currentGalleryGroup + index) % galleryImages.length];
                        img.style.transform = 'translateX(-20px)'; 
                        
                        setTimeout(() => {
                            img.style.opacity = 1; 
                            img.style.transform = 'translateX(0)'; 
                        }, 50);

                    }, 400); 
                }, index * 300); 
            });
        }

        // Init scripts on load
        window.addEventListener('load', () => {
            startAutoSlide('services-grid');
            startAutoSlide('specialist-grid');
            
            const imgEls = document.querySelectorAll('.gallery-card img.gal-bg');
            imgEls.forEach((img, index) => {
                img.src = galleryImages[index];
            });

            setInterval(updateGalleryImages, 3500); 
        });