/* ============================================================
   PREMIUM PORTFOLIO — FINAL FIXED SCRIPT
   ------------------------------------------------------------
   Features:
   - Preloader
   - Mobile menu
   - Smooth navigation
   - Scroll progress
   - Custom cursor
   - Magnetic buttons
   - Reveal animations
   - Count-up statistics
   - Project slider
   - Mouse/touch drag slider
   - Social icon click + drag protection
   - Weather / Geolocation
   - Contact form validation
   - Discord webhook
   - Testimonials
   - 3D tilt
   - Keyboard project navigation
   - Footer year
   ============================================================ */

"use strict";

/* ============================================================
   CONFIG
   ============================================================ */

const DISCORD_WEBHOOK_URL =
    "https://discord.com/api/webhooks/1556738701965402204/N22cfmAiwG3LMe8tiiA-pHHrJyYoHurPRBzPQlyLI-bbfs8QG215SefFHlDVzlvCtCvL";


/* ============================================================
   HELPERS
   ============================================================ */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);


/* ============================================================
   DOM READY
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       PRELOADER
       ======================================================== */

    const preloader = $("#preloader");

    if (preloader) {
        const hidePreloader = () => {
            preloader.classList.add("loaded");

            setTimeout(() => {
                preloader.style.display = "none";
            }, 800);
        };

        if (document.readyState === "complete") {
            setTimeout(hidePreloader, 300);
        } else {
            window.addEventListener("load", () => {
                setTimeout(hidePreloader, 300);
            });

            // Safety fallback
            setTimeout(hidePreloader, 3000);
        }
    }


    /* ========================================================
       FOOTER YEAR
       ======================================================== */

    const yearElement =
        $("#year") ||
        $("[data-year]") ||
        $(".footer-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* ========================================================
       MOBILE MENU
       ======================================================== */

    const menuToggle =
        $("#menuToggle") ||
        $(".menu-toggle") ||
        $("[data-menu-toggle]");

    const mobileMenu =
        $("#mobileMenu") ||
        $(".mobile-menu") ||
        $("[data-mobile-menu]");

    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener("click", (event) => {
            event.preventDefault();

            const isOpen =
                mobileMenu.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );
        });

        $$("a", mobileMenu).forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.classList.remove("menu-open");
            });
        });
    }


    /* ========================================================
       SMOOTH NAVIGATION
       ======================================================== */

    $$('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            const header =
                $("header") ||
                $(".navbar") ||
                $(".nav");

            const headerHeight =
                header ? header.offsetHeight : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: Math.max(targetPosition, 0),
                behavior: "smooth"
            });

            history.replaceState(null, "", href);
        });

    });


    /* ========================================================
       SCROLL PROGRESS
       ======================================================== */

    const progressBar =
        $("#scrollProgress") ||
        $(".scroll-progress") ||
        $("[data-scroll-progress]");

    const updateScrollProgress = () => {

        if (!progressBar) return;

        const scrollTop = window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percentage =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        progressBar.style.width =
            `${clamp(percentage, 0, 100)}%`;
    };

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    updateScrollProgress();


    /* ========================================================
       CUSTOM CURSOR
       ======================================================== */

    const cursorDot =
        $("#cursorDot") ||
        $(".cursor-dot") ||
        $(".cursor-dot");

    const cursorRing =
        $("#cursorRing") ||
        $(".cursor-ring");

    const hasFinePointer =
        window.matchMedia &&
        window.matchMedia("(pointer: fine)").matches;

    if (hasFinePointer && (cursorDot || cursorRing)) {

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let ringX = mouseX;
        let ringY = mouseY;

        document.addEventListener("mousemove", (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

            if (cursorDot) {
                cursorDot.style.transform =
                    `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }
        });

        const animateCursor = () => {

            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            if (cursorRing) {
                cursorRing.style.transform =
                    `translate3d(${ringX}px, ${ringY}px, 0)`;
            }

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        $$(
            "a, button, input, textarea, select, .project-card, .magnetic"
        ).forEach((element) => {

            element.addEventListener("mouseenter", () => {
                document.body.classList.add("cursor-hover");
            });

            element.addEventListener("mouseleave", () => {
                document.body.classList.remove("cursor-hover");
            });
        });
    }


    /* ========================================================
       MAGNETIC BUTTONS
       ======================================================== */

    if (hasFinePointer) {

        $$(".magnetic, [data-magnetic]").forEach((element) => {

            element.addEventListener("mousemove", (event) => {

                const rect =
                    element.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;

                const strength =
                    parseFloat(
                        element.dataset.magneticStrength || "0.18"
                    );

                element.style.transform =
                    `translate(${x * strength}px, ${y * strength}px)`;
            });

            element.addEventListener("mouseleave", () => {
                element.style.transform = "";
            });
        });
    }


    /* ========================================================
       REVEAL ANIMATIONS
       ======================================================== */

    const revealElements = $$(
        ".reveal, .reveal-up, .reveal-left, .reveal-right, [data-reveal]"
    );

    if (revealElements.length) {

        if ("IntersectionObserver" in window) {

            const revealObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach((entry) => {

                            if (!entry.isIntersecting) return;

                            entry.target.classList.add("visible");
                            entry.target.classList.add("active");

                            observer.unobserve(entry.target);
                        });

                    },
                    {
                        threshold: 0.12,
                        rootMargin: "0px 0px -50px 0px"
                    }
                );

            revealElements.forEach((element) => {
                revealObserver.observe(element);
            });

        } else {

            revealElements.forEach((element) => {
                element.classList.add("visible");
                element.classList.add("active");
            });
        }
    }


    /* ========================================================
       COUNT-UP STATS
       ======================================================== */

    const counters = $$(
        ".counter, [data-count], [data-counter]"
    );

    const animateCounter = (element) => {

        if (element.dataset.counted === "true") return;

        element.dataset.counted = "true";

        const rawValue =
            element.dataset.count ||
            element.dataset.counter ||
            element.textContent;

        const numericValue =
            parseFloat(
                String(rawValue).replace(/[^\d.]/g, "")
            );

        if (!Number.isFinite(numericValue)) return;

        const suffix =
            element.dataset.suffix ||
            (String(rawValue).includes("+") ? "+" : "");

        const duration = 1600;
        const start = performance.now();

        const update = (currentTime) => {

            const elapsed =
                currentTime - start;

            const progress =
                clamp(elapsed / duration, 0, 1);

            const eased =
                1 - Math.pow(1 - progress, 3);

            const current =
                numericValue * eased;

            const decimals =
                Number.isInteger(numericValue)
                    ? 0
                    : 1;

            element.textContent =
                current.toFixed(decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    if (counters.length) {

        if ("IntersectionObserver" in window) {

            const counterObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach((entry) => {

                            if (!entry.isIntersecting) return;

                            animateCounter(entry.target);

                            observer.unobserve(entry.target);
                        });

                    },
                    {
                        threshold: 0.5
                    }
                );

            counters.forEach((counter) => {
                counterObserver.observe(counter);
            });

        } else {
            counters.forEach(animateCounter);
        }
    }


    /* ========================================================
       3D TILT
       ======================================================== */

    if (hasFinePointer) {

        $$(
            ".tilt, .tilt-card, [data-tilt]"
        ).forEach((card) => {

            card.addEventListener("mousemove", (event) => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;

                const rotateY =
                    (x - 0.5) * 10;

                const rotateX =
                    (0.5 - y) * 10;

                card.style.transform =
                    `perspective(900px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateZ(0)`;
            });

            card.addEventListener("mouseleave", () => {

                card.style.transform =
                    "";
            });
        });
    }


    /* ========================================================
       SOCIAL ICON CLICK + DRAG
       --------------------------------------------------------
       Click  = open link
       Drag   = horizontal scrolling
       After drag = DO NOT open link
       ======================================================== */

    const socialContainers = $$(
        ".social-links, .social-icons, .socials, [data-socials]"
    );

    socialContainers.forEach((container) => {

        let isPointerDown = false;
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;

        const dragThreshold = 7;

        container.style.cursor = "grab";

        container.addEventListener(
            "pointerdown",
            (event) => {

                if (event.pointerType === "mouse" &&
                    event.button !== 0) {
                    return;
                }

                isPointerDown = true;
                isDragging = false;

                startX = event.clientX;
                startScrollLeft =
                    container.scrollLeft;

                container.style.cursor = "grabbing";

                try {
                    container.setPointerCapture(
                        event.pointerId
                    );
                } catch (_) {}
            }
        );

        container.addEventListener(
            "pointermove",
            (event) => {

                if (!isPointerDown) return;

                const distance =
                    event.clientX - startX;

                if (Math.abs(distance) > dragThreshold) {
                    isDragging = true;
                }

                if (isDragging) {

                    event.preventDefault();

                    container.scrollLeft =
                        startScrollLeft - distance;
                }
            },
            { passive: false }
        );

        const finishPointer = (event) => {

            if (!isPointerDown) return;

            isPointerDown = false;

            container.style.cursor = "grab";

            try {
                container.releasePointerCapture(
                    event.pointerId
                );
            } catch (_) {}

            /*
             * If the user dragged the social container,
             * remember it briefly so the click event is blocked.
             */
            if (isDragging) {

                container.dataset.dragged = "true";

                setTimeout(() => {
                    delete container.dataset.dragged;
                }, 100);
            }

            isDragging = false;
        };

        container.addEventListener(
            "pointerup",
            finishPointer
        );

        container.addEventListener(
            "pointercancel",
            finishPointer
        );

        container.addEventListener(
            "click",
            (event) => {

                if (
                    container.dataset.dragged === "true"
                ) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            },
            true
        );

        /*
         * Prevent native image/link dragging.
         */
        $$("img", container).forEach((image) => {
            image.setAttribute("draggable", "false");

            image.addEventListener(
                "dragstart",
                (event) => {
                    event.preventDefault();
                }
            );
        });

        $$("a", container).forEach((link) => {

            link.setAttribute("draggable", "false");

            link.addEventListener(
                "dragstart",
                (event) => {
                    event.preventDefault();
                }
            );
        });
    });


    /* ========================================================
       PROJECT SLIDER
       ======================================================== */

    const projectSlider =
        $("#projectSlider") ||
        $(".project-slider") ||
        $("[data-project-slider]");

    const previousProject =
        $("#prevProject") ||
        $("#previousProject") ||
        $(".prev-project");

    const nextProject =
        $("#nextProject") ||
        $(".next-project");

    const sliderDots =
        $("#sliderDots") ||
        $(".slider-dots");

    if (projectSlider) {

        const slides = $$(
            ".project-card, .project-slide, .project-item",
            projectSlider
        );

        let currentProject = 0;
        let sliderDragging = false;
        let sliderStartX = 0;
        let sliderStartScroll = 0;

        const getSlideWidth = () => {

            const firstSlide = slides[0];

            if (!firstSlide) {
                return projectSlider.clientWidth;
            }

            const styles =
                window.getComputedStyle(firstSlide);

            const gap =
                parseFloat(styles.marginRight || "0");

            return firstSlide.offsetWidth + gap;
        };

        const updateProjectSlider = (
            index,
            smooth = true
        ) => {

            if (!slides.length) return;

            currentProject =
                (index + slides.length) %
                slides.length;

            const slideWidth =
                getSlideWidth();

            projectSlider.scrollTo({
                left: currentProject * slideWidth,
                behavior: smooth ? "smooth" : "auto"
            });

            if (sliderDots) {

                $$(".dot, button", sliderDots)
                    .forEach((dot, dotIndex) => {

                        dot.classList.toggle(
                            "active",
                            dotIndex === currentProject
                        );

                        dot.setAttribute(
                            "aria-current",
                            dotIndex === currentProject
                                ? "true"
                                : "false"
                        );
                    });
            }

            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle(
                    "active",
                    slideIndex === currentProject
                );
            });
        };

        if (previousProject) {

            previousProject.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    updateProjectSlider(
                        currentProject - 1
                    );
                }
            );
        }

        if (nextProject) {

            nextProject.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    updateProjectSlider(
                        currentProject + 1
                    );
                }
            );
        }

        if (sliderDots) {

            $$(".dot, button", sliderDots)
                .forEach((dot, index) => {

                    dot.addEventListener(
                        "click",
                        () => {
                            updateProjectSlider(index);
                        }
                    );
                });
        }

        /*
         * Project slider mouse/touch drag
         */

        projectSlider.addEventListener(
            "pointerdown",
            (event) => {

                if (
                    event.target.closest("a, button")
                ) {
                    return;
                }

                sliderDragging = true;
                sliderStartX = event.clientX;
                sliderStartScroll =
                    projectSlider.scrollLeft;

                projectSlider.classList.add("dragging");

                try {
                    projectSlider.setPointerCapture(
                        event.pointerId
                    );
                } catch (_) {}
            }
        );

        projectSlider.addEventListener(
            "pointermove",
            (event) => {

                if (!sliderDragging) return;

                const distance =
                    event.clientX - sliderStartX;

                if (Math.abs(distance) > 5) {
                    event.preventDefault();

                    projectSlider.scrollLeft =
                        sliderStartScroll - distance;
                }
            },
            { passive: false }
        );

        const stopSliderDrag = (event) => {

            if (!sliderDragging) return;

            sliderDragging = false;

            projectSlider.classList.remove(
                "dragging"
            );

            try {
                projectSlider.releasePointerCapture(
                    event.pointerId
                );
            } catch (_) {}

            const slideWidth =
                getSlideWidth();

            if (!slideWidth) return;

            const nearest =
                Math.round(
                    projectSlider.scrollLeft /
                    slideWidth
                );

            updateProjectSlider(nearest);
        };

        projectSlider.addEventListener(
            "pointerup",
            stopSliderDrag
        );

        projectSlider.addEventListener(
            "pointercancel",
            stopSliderDrag
        );

        /*
         * Keyboard navigation
         */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "ArrowLeft"
                ) {
                    updateProjectSlider(
                        currentProject - 1
                    );
                }

                if (
                    event.key === "ArrowRight"
                ) {
                    updateProjectSlider(
                        currentProject + 1
                    );
                }
            }
        );

        /*
         * Keep active slide synced with manual scrolling.
         */

        let scrollTimer;

        projectSlider.addEventListener(
            "scroll",
            () => {

                clearTimeout(scrollTimer);

                scrollTimer = setTimeout(() => {

                    if (sliderDragging) return;

                    const slideWidth =
                        getSlideWidth();

                    if (!slideWidth) return;

                    const nearest =
                        Math.round(
                            projectSlider.scrollLeft /
                            slideWidth
                        );

                    if (
                        nearest !== currentProject
                    ) {
                        updateProjectSlider(
                            nearest,
                            false
                        );
                    }

                }, 80);
            },
            { passive: true }
        );

        updateProjectSlider(0, false);
    }


    /* ========================================================
       WEATHER / GEOLOCATION
       ======================================================== */

    const locationButton =
        $("#useLocation") ||
        $("#locationBtn") ||
        $("#getLocation") ||
        $("[data-location]");

    const weatherContainer =
        $("#weather") ||
        $(".weather") ||
        $("[data-weather]");

    const weatherText =
        $("#weatherText") ||
        $(".weather-text") ||
        $("[data-weather-text]");

    const temperatureElement =
        $("#temperature") ||
        $(".temperature") ||
        $("[data-temperature]");

    const locationText =
        $("#locationText") ||
        $(".location-text") ||
        $("[data-location-text]");

    const setWeatherMessage = (message) => {

        if (weatherText) {
            weatherText.textContent = message;
        }
    };

    const setLocationMessage = (message) => {

        if (locationText) {
            locationText.textContent = message;
        }
    };

    const getWeather = async (latitude, longitude) => {

        try {

            setWeatherMessage(
                "Getting your local weather..."
            );

            /*
             * Open-Meteo is used because it does not require
             * an API key for normal public usage.
             */

            const url =
                "https://api.open-meteo.com/v1/forecast" +
                `?latitude=${encodeURIComponent(latitude)}` +
                `&longitude=${encodeURIComponent(longitude)}` +
                "&current=temperature_2m,weather_code" +
                "&temperature_unit=celsius";

            const response =
                await fetch(url);

            if (!response.ok) {
                throw new Error(
                    "Weather request failed"
                );
            }

            const data =
                await response.json();

            const temperature =
                data?.current?.temperature_2m;

            const weatherCode =
                data?.current?.weather_code;

            if (
                typeof temperature === "number" &&
                temperatureElement
            ) {
                temperatureElement.textContent =
                    `${Math.round(temperature)}°C`;
            }

            const weatherDescriptions = {
                0: "Clear sky",
                1: "Mainly clear",
                2: "Partly cloudy",
                3: "Overcast",
                45: "Foggy",
                48: "Foggy",
                51: "Light drizzle",
                53: "Drizzle",
                55: "Heavy drizzle",
                61: "Light rain",
                63: "Rain",
                65: "Heavy rain",
                71: "Light snow",
                73: "Snow",
                75: "Heavy snow",
                80: "Rain showers",
                81: "Rain showers",
                82: "Heavy showers",
                95: "Thunderstorm",
                96: "Thunderstorm",
                99: "Thunderstorm"
            };

            const description =
                weatherDescriptions[weatherCode] ||
                "Current weather";

            setWeatherMessage(description);

            if (weatherContainer) {
                weatherContainer.classList.add(
                    "weather-loaded"
                );
            }

        } catch (error) {

            console.error(
                "Weather error:",
                error
            );

            setWeatherMessage(
                "Weather unavailable"
            );
        }
    };

    const reverseGeocode = async (
        latitude,
        longitude
    ) => {

        try {

            const url =
                "https://nominatim.openstreetmap.org/reverse" +
                `?format=jsonv2` +
                `&lat=${encodeURIComponent(latitude)}` +
                `&lon=${encodeURIComponent(longitude)}`;

            const response =
                await fetch(url, {
                    headers: {
                        Accept: "application/json"
                    }
                });

            if (!response.ok) return;

            const data =
                await response.json();

            const address =
                data?.address || {};

            const city =
                address.city ||
                address.town ||
                address.municipality ||
                address.village ||
                address.county ||
                "";

            const country =
                address.country || "";

            const location =
                [city, country]
                    .filter(Boolean)
                    .join(", ");

            if (location) {
                setLocationMessage(location);
            }

        } catch (error) {

            console.warn(
                "Reverse geocoding unavailable:",
                error
            );
        }
    };

    const requestLocation = () => {

        if (!navigator.geolocation) {

            setWeatherMessage(
                "Geolocation is not supported by your browser."
            );

            return;
        }

        setWeatherMessage(
            "Requesting your location..."
        );

        if (locationButton) {
            locationButton.disabled = true;
            locationButton.classList.add("loading");
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {

                const {
                    latitude,
                    longitude
                } = position.coords;

                await Promise.all([
                    getWeather(latitude, longitude),
                    reverseGeocode(
                        latitude,
                        longitude
                    )
                ]);

                if (locationButton) {
                    locationButton.disabled = false;
                    locationButton.classList.remove(
                        "loading"
                    );
                }
            },

            (error) => {

                console.warn(
                    "Geolocation error:",
                    error
                );

                let message =
                    "Unable to access your location.";

                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {
                    message =
                        "Location permission was denied.";
                }

                if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {
                    message =
                        "Your location is unavailable.";
                }

                if (
                    error.code ===
                    error.TIMEOUT
                ) {
                    message =
                        "Location request timed out.";
                }

                setWeatherMessage(message);

                if (locationButton) {
                    locationButton.disabled = false;
                    locationButton.classList.remove(
                        "loading"
                    );
                }
            },

            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    if (locationButton) {

        locationButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                requestLocation();
            }
        );
    }


    /* ========================================================
       CONTACT FORM
       ======================================================== */

    const contactForm =
        $("#contactForm") ||
        $("form[data-contact-form]") ||
        $(".contact-form");

    if (contactForm) {

        const submitButton =
            contactForm.querySelector(
                'button[type="submit"], input[type="submit"]'
            );

        const getField = (...selectors) => {

            for (const selector of selectors) {

                const element =
                    contactForm.querySelector(selector);

                if (element) return element;
            }

            return null;
        };

        const nameField = getField(
            "#name",
            "#contactName",
            '[name="name"]',
            '[name="username"]'
        );

        const emailField = getField(
            "#email",
            "#contactEmail",
            '[name="email"]'
        );

        const subjectField = getField(
            "#subject",
            "#contactSubject",
            '[name="subject"]'
        );

        const messageField = getField(
            "#message",
            "#contactMessage",
            '[name="message"]'
        );

        const statusElement =
            $("#formStatus") ||
            $(".form-status") ||
            "[data-form-status]";

        const actualStatusElement =
            typeof statusElement === "string"
                ? contactForm.querySelector(
                    statusElement
                )
                : statusElement;

        const setFormStatus = (
            message,
            type = ""
        ) => {

            if (!actualStatusElement) return;

            actualStatusElement.textContent =
                message;

            actualStatusElement.className =
                `form-status ${type}`.trim();
        };

        const isValidEmail = (email) => {

            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
                .test(email);
        };

        contactForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                const name =
                    nameField?.value.trim() || "";

                const email =
                    emailField?.value.trim() || "";

                const subject =
                    subjectField?.value.trim() ||
                    "Portfolio Contact";

                const message =
                    messageField?.value.trim() || "";

                if (!name) {

                    setFormStatus(
                        "Please enter your name.",
                        "error"
                    );

                    nameField?.focus();

                    return;
                }

                if (!email || !isValidEmail(email)) {

                    setFormStatus(
                        "Please enter a valid email address.",
                        "error"
                    );

                    emailField?.focus();

                    return;
                }

                if (!message) {

                    setFormStatus(
                        "Please enter your message.",
                        "error"
                    );

                    messageField?.focus();

                    return;
                }

                if (
                    !DISCORD_WEBHOOK_URL ||
                    DISCORD_WEBHOOK_URL.includes(
                        "PASTE_YOUR_DISCORD"
                    )
                ) {

                    setFormStatus(
                        "Contact form is not configured yet.",
                        "error"
                    );

                    console.error(
                        "Discord webhook URL is missing."
                    );

                    return;
                }

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.classList.add(
                        "loading"
                    );
                }

                setFormStatus(
                    "Sending your message...",
                    "loading"
                );

                const payload = {

                    username:
                        "Portfolio Contact",

                    embeds: [
                        {
                            title:
                                "📩 New Portfolio Message",

                            color: 0x5865F2,

                            fields: [
                                {
                                    name: "Name",
                                    value:
                                        name.slice(0, 1024)
                                },
                                {
                                    name: "Email",
                                    value:
                                        email.slice(0, 1024)
                                },
                                {
                                    name: "Subject",
                                    value:
                                        subject.slice(0, 1024)
                                },
                                {
                                    name: "Message",
                                    value:
                                        message.slice(0, 4000)
                                }
                            ],

                            timestamp:
                                new Date().toISOString(),

                            footer: {
                                text:
                                    "Portfolio Contact Form"
                            }
                        }
                    ]
                };

                try {

                    const response =
                        await fetch(
                            DISCORD_WEBHOOK_URL,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(payload)
                            }
                        );

                    if (!response.ok) {
                        throw new Error(
                            `HTTP ${response.status}`
                        );
                    }

                    setFormStatus(
                        "Message sent successfully! I'll get back to you soon.",
                        "success"
                    );

                    contactForm.reset();

                } catch (error) {

                    console.error(
                        "Contact form error:",
                        error
                    );

                    setFormStatus(
                        "Message could not be sent. Please try again later.",
                        "error"
                    );

                } finally {

                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.classList.remove(
                            "loading"
                        );
                    }
                }
            }
        );
    }


    /* ========================================================
       ACTIVE NAVIGATION ON SCROLL
       ======================================================== */

    const sections = $$(
        "section[id], main [id]"
    );

    const navLinks = $$(
        'nav a[href^="#"], header a[href^="#"]'
    );

    if (
        sections.length &&
        navLinks.length &&
        "IntersectionObserver" in window
    ) {

        const sectionObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting)
                            return;

                        const id =
                            entry.target.id;

                        navLinks.forEach((link) => {

                            const href =
                                link.getAttribute("href");

                            link.classList.toggle(
                                "active",
                                href === `#${id}`
                            );
                        });
                    });

                },
                {
                    threshold: 0.35,
                    rootMargin: "-10% 0px -55% 0px"
                }
            );

        sections.forEach((section) => {
            if (section.id) {
                sectionObserver.observe(section);
            }
        });
    }


    /* ========================================================
       TESTIMONIALS
       ======================================================== */

    const testimonialSlider =
        $("#testimonialSlider") ||
        $(".testimonial-slider") ||
        $("[data-testimonial-slider]");

    if (testimonialSlider) {

        const testimonials = $$(
            ".testimonial, .testimonial-card, .testimonial-item",
            testimonialSlider
        );

        const testimonialPrev =
            $("#prevTestimonial") ||
            $(".prev-testimonial");

        const testimonialNext =
            $("#nextTestimonial") ||
            $(".next-testimonial");

        let testimonialIndex = 0;

        const showTestimonial = (index) => {

            if (!testimonials.length) return;

            testimonialIndex =
                (index + testimonials.length) %
                testimonials.length;

            testimonials.forEach(
                (item, itemIndex) => {

                    item.classList.toggle(
                        "active",
                        itemIndex === testimonialIndex
                    );
                }
            );
        };

        testimonialPrev?.addEventListener(
            "click",
            () => {
                showTestimonial(
                    testimonialIndex - 1
                );
            }
        );

        testimonialNext?.addEventListener(
            "click",
            () => {
                showTestimonial(
                    testimonialIndex + 1
                );
            }
        );

        showTestimonial(0);
    }


    /* ========================================================
       IMAGE / LINK NATIVE DRAG PROTECTION
       ======================================================== */

    $$("img, a").forEach((element) => {

        element.setAttribute(
            "draggable",
            "false"
        );

        element.addEventListener(
            "dragstart",
            (event) => {
                event.preventDefault();
            }
        );
    });


    /* ========================================================
       EXTERNAL LINKS
       ======================================================== */

    $$(
        'a[href^="http://"], a[href^="https://"]'
    ).forEach((link) => {

        /*
         * Do not modify same-domain/internal links.
         */

        try {

            const url =
                new URL(
                    link.href,
                    window.location.href
                );

            if (
                url.hostname !==
                window.location.hostname
            ) {

                link.setAttribute(
                    "target",
                    "_blank"
                );

                link.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );
            }

        } catch (_) {}
    });


    /* ========================================================
       ESC KEY — CLOSE MOBILE MENU
       ======================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") return;

            if (
                mobileMenu &&
                mobileMenu.classList.contains("active")
            ) {

                mobileMenu.classList.remove(
                    "active"
                );

                menuToggle?.classList.remove(
                    "active"
                );

                menuToggle?.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.classList.remove(
                    "menu-open"
                );
            }
        }
    );


    /* ========================================================
       RESIZE CLEANUP
       ======================================================== */

    window.addEventListener(
        "resize",
        () => {

            /*
             * Remove accidental inline transform from
             * magnetic elements after responsive changes.
             */

            if (window.innerWidth < 768) {

                $$(".magnetic, [data-magnetic]")
                    .forEach((element) => {
                        element.style.transform = "";
                    });
            }
        },
        { passive: true }
    );


    /* ========================================================
       PAGE LOADED
       ======================================================== */

    document.documentElement.classList.add(
        "js-ready"
    );

    document.body.classList.add(
        "page-ready"
    );

});