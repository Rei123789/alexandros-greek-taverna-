
// ALEXANDROS GREEK TAVERNA
// WEBSITE INTERACTIONS

document.addEventListener("DOMContentLoaded", () => {

    // CURRENT YEAR
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // MOBILE NAVIGATION
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    function closeMenu() {
        if (!menuToggle || !mainNav) return;

        menuToggle.classList.remove("active");
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        document.body.classList.remove("nav-open");
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            document.body.classList.toggle("nav-open", isOpen);
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", event => {
            if (
                mainNav.classList.contains("open") &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 850) {
                closeMenu();
            }
        });
    }

    
 
 // MENU CATEGORY FILTERS
const filterButtons = document.querySelectorAll(".filter-btn");
const menuCards = document.querySelectorAll(".menu-photo-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        const selectedCategory = button.dataset.filter;

        // Update active button
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        // Show or hide entire photo cards
        menuCards.forEach(card => {
            const matches =
                selectedCategory === "all" ||
                card.dataset.category === selectedCategory;

            card.hidden = !matches;
        });

    });
});



    // SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll(".reveal");

    if (
        "IntersectionObserver" in window &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }

    // HEADER SHADOW AND BACK-TO-TOP BUTTON
    const header = document.querySelector(".site-header");
    const backToTop = document.querySelector(".back-to-top");

    function updateScrollUI() {
        const scrolled = window.scrollY > 80;

        if (header) {
            header.classList.toggle("scrolled", scrolled);
        }

        if (backToTop) {
            backToTop.classList.toggle(
                "visible",
                window.scrollY > 450
            );
        }
    }

    window.addEventListener("scroll", updateScrollUI, {
        passive: true
    });

    updateScrollUI();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "instant" : "smooth"
            });
        });
    }

// ===================================
// ALEXANDROS PHOTO GALLERY
// ===================================

const galleryPhotos = [
    ["table.jpeg", "restaurant", "Our Greek food selection"],
    ["wrap.jpeg", "wraps", "Greek wrap"],
    ["wrap-2.jpeg", "wraps", "Greek wrap"],
    ["wrap-3.jpeg", "wraps", "Greek wrap"],
    ["wrap-4.jpeg", "wraps", "Greek wrap"],
    ["wrap-5.jpeg", "wraps", "Greek wrap"],
    ["souvlaki.jpeg", "grill", "Greek souvlaki"],
    ["souvlaki-2.jpeg", "grill", "Greek souvlaki"],
    ["souvlaki-3.jpeg", "grill", "Greek souvlaki"],
    ["souvlaki-4.jpeg", "grill", "Greek souvlaki"],
    ["dinner.jpeg", "grill", "Greek dinner platter"],
    ["dinner-2.jpeg", "grill", "Greek dinner platter"],
    ["dinner-3.jpeg", "grill", "Greek dinner platter"],
    ["dinner-4.jpeg", "grill", "Greek dinner platter"],
    ["dinner-5.jpeg", "grill", "Greek dinner platter"],
    ["burger.jpeg", "burgers", "Alexandros burger"],
    ["burger-2.jpeg", "burgers", "Alexandros burger"],
    ["greek.jpeg", "sides", "Greek dish"],
    ["village.jpeg", "sides", "Village salad"],
    ["tomato.jpeg", "sides", "Tomato salad"],
    ["tzatziki.jpeg", "sides", "Tzatziki"],
    ["kopanisti.jpeg", "sides", "Spicy feta dip"],
    ["greek-fries.jpeg", "sides", "Greek fries"],
    ["potatos.jpeg", "sides", "Lemon potatoes"],
    ["rice.jpeg", "sides", "Rice"],
    ["skepasti.jpeg", "skepasti", "Skepasti"],
    
];

const photoGallery = document.getElementById("photoGallery");
const photoFilters = document.querySelectorAll(".photo-filter");
const photoMore = document.getElementById("photoMore");
const photoLightbox = document.getElementById("photoLightbox");
const photoLightboxImage = document.getElementById("photoLightboxImage");
const photoLightboxCaption = document.getElementById("photoLightboxCaption");

if (photoGallery && photoMore && photoLightbox) {

    let activeCategory = "all";
    let expanded = false;
    let currentIndex = 0;
    let previousFocus = null;

    // CREATE ALL 27 PHOTO CARDS
    galleryPhotos.forEach(([file, category, caption]) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "photo-card";
        card.dataset.category = category;
        card.dataset.full = "images/" + file;
        card.dataset.caption = caption;
        card.setAttribute("aria-label", "Enlarge " + caption);

        const img = document.createElement("img");
        img.src = "images/" + file;
        img.alt = caption;
        img.loading = "lazy";
        img.decoding = "async";

        card.appendChild(img);
        photoGallery.appendChild(card);
    });

    const cards = [...photoGallery.querySelectorAll(".photo-card")];

    function matchingPhotos() {
        return cards.filter(card =>
            activeCategory === "all" ||
            card.dataset.category === activeCategory
        );
    }

    function renderPhotos() {
        const matches = matchingPhotos();

        cards.forEach(card => {
            const index = matches.indexOf(card);
            card.hidden = index === -1 || (!expanded && index >= 6);
        });

        photoMore.hidden = matches.length <= 6;
        photoMore.textContent = expanded
            ? "Show Fewer Photos"
            : `View All ${matches.length} Photos`;

        photoMore.setAttribute("aria-expanded", String(expanded));
    }

    // FILTER BUTTONS
    photoFilters.forEach(button => {
        button.setAttribute("aria-pressed",
            String(button.classList.contains("active")));

        button.addEventListener("click", () => {
            activeCategory = button.dataset.photoFilter;
            expanded = false;

            photoFilters.forEach(filter => {
                const selected = filter === button;
                filter.classList.toggle("active", selected);
                filter.setAttribute("aria-pressed", String(selected));
            });

            renderPhotos();
        });
    });

    // SHOW ALL / SHOW FEWER
    photoMore.addEventListener("click", () => {
        expanded = !expanded;
        renderPhotos();
    });

    // FULLSCREEN VIEWER
    function showPhoto(index) {
        const matches = matchingPhotos();
        if (!matches.length) return;

        currentIndex = (index + matches.length) % matches.length;
        const photo = matches[currentIndex];

        photoLightboxImage.src = photo.dataset.full;
        photoLightboxImage.alt = photo.querySelector("img").alt;
        photoLightboxCaption.textContent = photo.dataset.caption;
    }

    cards.forEach(card => {
        card.addEventListener("click", () => {
            previousFocus = document.activeElement;
            showPhoto(matchingPhotos().indexOf(card));

            photoLightbox.hidden = false;
            document.body.style.overflow = "hidden";

            photoLightbox.querySelector(".photo-lightbox-close").focus();
        });
    });

    function closeLightbox() {
        photoLightbox.hidden = true;
        document.body.style.overflow = "";
        photoLightboxImage.removeAttribute("src");
        previousFocus?.focus();
    }

    photoLightbox.querySelector(".photo-lightbox-close")
        .addEventListener("click", closeLightbox);

    photoLightbox.querySelector(".photo-lightbox-prev")
        .addEventListener("click", () => showPhoto(currentIndex - 1));

    photoLightbox.querySelector(".photo-lightbox-next")
        .addEventListener("click", () => showPhoto(currentIndex + 1));

    photoLightbox.addEventListener("click", event => {
        if (event.target === photoLightbox) closeLightbox();
    });

    document.addEventListener("keydown", event => {
        if (photoLightbox.hidden) return;

        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
        if (event.key === "ArrowRight") showPhoto(currentIndex + 1);

        if (event.key === "Tab") {
            const controls = [
                ...photoLightbox.querySelectorAll("button")
            ];
            const current = controls.indexOf(document.activeElement);

            if (event.shiftKey && current === 0) {
                event.preventDefault();
                controls[controls.length - 1].focus();
            } else if (!event.shiftKey &&
                       current === controls.length - 1) {
                event.preventDefault();
                controls[0].focus();
            }
        }
    });

    renderPhotos();
}

});
