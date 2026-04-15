// --- Hamburger Menu Logic (EXACT MATCH) ---
        const navMenu = document.getElementById("navMenu");
        const CLOSE_ON_SCROLL_THRESHOLD = 180;

        function toggleMenu() { navMenu.classList.toggle("active"); }
        window.addEventListener("scroll", function() {
            if (window.scrollY > CLOSE_ON_SCROLL_THRESHOLD && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
            }
        });

        // --- RANDOM GALLERY AUTO CHANGE LOGIC ---
        // Yaha par tu apni baaki images add kar sakta hai
        const allGalleryImages = [
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
        
        const imgElements = document.querySelectorAll('.gallery-card img.gal-bg');
        
        // Initial load: Set random images on page load
        function setInitialImages() {
            let availableImages = [...allGalleryImages];
            imgElements.forEach(img => {
                // If we run out of unique images, reset the pool
                if(availableImages.length === 0) availableImages = [...allGalleryImages];
                
                const randomIdx = Math.floor(Math.random() * availableImages.length);
                img.src = availableImages[randomIdx];
                // Remove used image so it doesn't repeat immediately on load
                availableImages.splice(randomIdx, 1);
            });
        }

        // Swap 2 random images every few seconds
        function startRandomSwapping() {
            setInterval(() => {
                // Pick 1 to 3 random cards to change at the same time
                const numToChange = Math.floor(Math.random() * 3) + 1; 
                
                for(let i=0; i<numToChange; i++) {
                    // Pick a random image element from the grid
                    const randomImgElIdx = Math.floor(Math.random() * imgElements.length);
                    const targetImg = imgElements[randomImgElIdx];
                    
                    // Pick a random new image source
                    const newSrc = allGalleryImages[Math.floor(Math.random() * allGalleryImages.length)];
                    
                    // Prevent swapping to the exact same image
                    if(!targetImg.src.includes(newSrc)) {
                        // Apply fade out effect
                        targetImg.style.opacity = 0;
                        targetImg.style.transform = 'scale(0.95)';
                        
                        setTimeout(() => {
                            // Change source
                            targetImg.src = newSrc;
                            
                            // Fade back in
                            setTimeout(() => {
                                targetImg.style.opacity = 1;
                                targetImg.style.transform = 'scale(1)';
                            }, 50);
                        }, 400); // Time it takes to fade out
                    }
                }
            }, 3000); // Trigger a swap every 3 seconds
        }

        window.addEventListener('load', () => {
            setInitialImages();
            setTimeout(startRandomSwapping, 2000); // Start swapping after 2 seconds
        });