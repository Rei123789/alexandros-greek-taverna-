
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
    const menuItems = document.querySelectorAll(".menu-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {

            const selectedCategory = button.dataset.filter;

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
                btn.setAttribute("aria-pressed", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            menuItems.forEach(item => {
                const matches =
                    selectedCategory === "all" ||
                    item.dataset.category === selectedCategory;

                item.hidden = !matches;
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

});
