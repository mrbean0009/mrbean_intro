```javascript

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];


// ============================================================
// PRELOADER
// ============================================================
(function initPreloader() {

  const preloader = document.getElementById("preloader");

  if (!preloader) {
    console.warn("Preloader #preloader not found.");
    return;
  }

  function hidePreloader() {

    // CSS uses #preloader.hide
    preloader.classList.add("hide");

    // Completely remove after fade animation
    setTimeout(() => {
      if (preloader && preloader.parentNode) {
        preloader.remove();
      }
    }, 900);
  }

  /*
   * Do NOT wait for window.load.
   * DOM is enough for the preloader.
   */
  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      () => {
        setTimeout(hidePreloader, 300);
      },
      { once: true }
    );

  } else {

    setTimeout(hidePreloader, 300);
  }

  /*
   * Emergency fallback.
   * Even if something goes wrong,
   * preloader cannot remain forever.
   */
  setTimeout(hidePreloader, 3000);

})();




/* =========================================================
   NAVIGATION + SCROLL PROGRESS
========================================================= */

const nav = $(".nav-wrap");
const progress = $(".scroll-progress");

window.addEventListener(
  "scroll",
  () => {

    nav?.classList.toggle(
      "scrolled",
      window.scrollY > 30
    );

    if (progress) {

      const max =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const percentage =
        max > 0
          ? Math.min(
              (window.scrollY / max) * 100,
              100
            )
          : 0;

      progress.style.width =
        percentage + "%";
    }
  },
  { passive: true }
);


/* =========================================================
   MOBILE MENU
========================================================= */

const toggle =
  $(".menu-toggle");

const links =
  $(".nav-links");

toggle?.addEventListener(
  "click",
  () => {

    links?.classList.toggle(
      "open"
    );

    const expanded =
      links?.classList.contains(
        "open"
      ) || false;

    toggle.setAttribute(
      "aria-expanded",
      String(expanded)
    );
  }
);


$$(".nav-links a").forEach(
  (a) => {

    a.addEventListener(
      "click",
      () => {

        links?.classList.remove(
          "open"
        );

        toggle?.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    );
  }
);


/* =========================================================
   CLOSE MOBILE MENU OUTSIDE
========================================================= */

document.addEventListener(
  "click",
  (e) => {

    if (
      !links?.classList.contains(
        "open"
      )
    ) {
      return;
    }

    const insideMenu =
      links.contains(e.target);

    const insideToggle =
      toggle?.contains(e.target);

    if (
      !insideMenu &&
      !insideToggle
    ) {

      links.classList.remove(
        "open"
      );

      toggle?.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }
);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursorDot =
  $(".cursor-dot");

const cursorRing =
  $(".cursor-ring");


window.addEventListener(
  "pointermove",
  (e) => {

    if (cursorDot) {

      cursorDot.style.left =
        e.clientX + "px";

      cursorDot.style.top =
        e.clientY + "px";
    }


    if (cursorRing) {

      cursorRing.style.left =
        e.clientX + "px";

      cursorRing.style.top =
        e.clientY + "px";
    }
  },
  { passive: true }
);


$$(
  "a, button, .magnetic"
).forEach(
  (el) => {

    el.addEventListener(
      "mouseenter",
      () => {
        cursorRing?.classList.add(
          "hover"
        );
      }
    );


    el.addEventListener(
      "mouseleave",
      () => {
        cursorRing?.classList.remove(
          "hover"
        );
      }
    );
  }
);


/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

$$(".magnetic").forEach(
  (el) => {

    el.addEventListener(
      "mousemove",
      (e) => {

        if (
          window.innerWidth < 900
        ) {
          return;
        }

        const r =
          el.getBoundingClientRect();

        const x =
          e.clientX -
          r.left -
          r.width / 2;

        const y =
          e.clientY -
          r.top -
          r.height / 2;

        el.style.transform =
          `translate(${x * 0.12}px, ${y * 0.12}px)`;
      }
    );


    el.addEventListener(
      "mouseleave",
      () => {
        el.style.transform = "";
      }
    );
  }
);


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

if (
  "IntersectionObserver" in window
) {

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );
          }
        );
      },
      {
        threshold: 0.12
      }
    );


  $$(".reveal").forEach(
    (el) => {
      observer.observe(el);
    }
  );

} else {

  $$(".reveal").forEach(
    (el) => {
      el.classList.add(
        "visible"
      );
    }
  );
}


/* =========================================================
   COUNT UP STATS
========================================================= */

if (
  "IntersectionObserver" in window
) {

  const countObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }

            const el =
              entry.target;

            const end =
              Number(
                el.dataset.count
              );

            if (
              !Number.isFinite(end)
            ) {
              countObserver.unobserve(
                el
              );

              return;
            }

            const duration =
              1200;

            let startTime =
              null;


            function step(timestamp) {

              if (!startTime) {
                startTime =
                  timestamp;
              }

              const p =
                Math.min(
                  (timestamp -
                    startTime) /
                    duration,
                  1
                );


              const eased =
                1 -
                Math.pow(
                  1 - p,
                  3
                );


              const value =
                Math.floor(
                  end * eased
                );


              el.textContent =
                value;


              if (p < 1) {

                requestAnimationFrame(
                  step
                );

              } else {

                el.textContent =
                  end;
              }
            }


            requestAnimationFrame(
              step
            );


            countObserver.unobserve(
              el
            );
          }
        );
      },
      {
        threshold: 0.7
      }
    );


  $$("[data-count]").forEach(
    (el) => {
      countObserver.observe(el);
    }
  );
}


/* =========================================================
   PROJECT SLIDER
========================================================= */

const slides =
  $$(".project-slide");

const dots =
  $("#sliderDots");

const prev =
  $("#prevProject");

const next =
  $("#nextProject");

const projectSlider =
  $("#projectSlider");


let projectIndex = 0;
let sliderTimer = null;


function showProject(i) {

  if (!slides.length) {
    return;
  }


  projectIndex =
    (i + slides.length) %
    slides.length;


  slides.forEach(
    (slide, n) => {

      slide.classList.toggle(
        "active",
        n === projectIndex
      );
    }
  );


  $$("#sliderDots button")
    .forEach(
      (button, n) => {

        button.classList.toggle(
          "active",
          n === projectIndex
        );
      }
    );
}


function startProjectSlider() {

  if (
    slides.length <= 1
  ) {
    return;
  }


  clearInterval(
    sliderTimer
  );


  sliderTimer =
    setInterval(
      () => {

        showProject(
          projectIndex + 1
        );

      },
      6500
    );
}


function stopProjectSlider() {

  clearInterval(
    sliderTimer
  );

  sliderTimer =
    null;
}


if (slides.length) {

  if (dots) {

    slides.forEach(
      (_, i) => {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.setAttribute(
          "aria-label",
          "Project " + (i + 1)
        );


        button.addEventListener(
          "click",
          () => {

            showProject(i);

            startProjectSlider();
          }
        );


        dots.appendChild(
          button
        );
      }
    );
  }


  prev?.addEventListener(
    "click",
    () => {

      showProject(
        projectIndex - 1
      );

      startProjectSlider();
    }
  );


  next?.addEventListener(
    "click",
    () => {

      showProject(
        projectIndex + 1
      );

      startProjectSlider();
    }
  );


  showProject(0);

  startProjectSlider();


  projectSlider?.addEventListener(
    "mouseenter",
    stopProjectSlider
  );


  projectSlider?.addEventListener(
    "mouseleave",
    startProjectSlider
  );


  /* -------------------------------------------------------
     PROJECT TOUCH SWIPE
  ------------------------------------------------------- */

  let touchStartX = 0;
  let touchStartY = 0;


  projectSlider?.addEventListener(
    "touchstart",
    (e) => {

      const touch =
        e.changedTouches[0];

      touchStartX =
        touch.clientX;

      touchStartY =
        touch.clientY;

      stopProjectSlider();
    },
    {
      passive: true
    }
  );


  projectSlider?.addEventListener(
    "touchend",
    (e) => {

      const touch =
        e.changedTouches[0];

      const dx =
        touch.clientX -
        touchStartX;

      const dy =
        touch.clientY -
        touchStartY;


      if (
        Math.abs(dx) > 45 &&
        Math.abs(dx) >
          Math.abs(dy)
      ) {

        showProject(
          projectIndex +
          (dx < 0 ? 1 : -1)
        );
      }


      startProjectSlider();
    },
    {
      passive: true
    }
  );
}


/* =========================================================
   HERO SOCIALS
   CLICK + DRAG FIX
========================================================= */

/*
 * Behavior:
 *
 * NORMAL CLICK:
 *     Social link opens normally.
 *
 * MOUSE DRAG:
 *     Social container scrolls horizontally.
 *
 * DRAG:
 *     Link will NOT open.
 *
 * TOUCH:
 *     Horizontal swipe scrolls.
 *
 * IMAGE/LINK:
 *     Browser's default drag disabled.
 */

const socialSlider =
  $(".hero-socials");


if (socialSlider) {

  let isPointerDown =
    false;

  let isDragging =
    false;

  let startX =
    0;

  let startY =
    0;

  let startScrollLeft =
    0;

  let pointerId =
    null;


  /* -------------------------------------------------------
     POINTER DOWN
  ------------------------------------------------------- */

  socialSlider.addEventListener(
    "pointerdown",
    (e) => {

      /*
       * Ignore right/middle mouse buttons.
       */

      if (
        e.pointerType === "mouse" &&
        e.button !== 0
      ) {
        return;
      }


      isPointerDown =
        true;

      isDragging =
        false;

      pointerId =
        e.pointerId;


      startX =
        e.clientX;

      startY =
        e.clientY;


      startScrollLeft =
        socialSlider.scrollLeft;


      socialSlider.classList.add(
        "is-dragging"
      );


      try {

        socialSlider.setPointerCapture(
          e.pointerId
        );

      } catch (_) {}
    }
  );


  /* -------------------------------------------------------
     POINTER MOVE
  ------------------------------------------------------- */

  socialSlider.addEventListener(
    "pointermove",
    (e) => {

      if (
        !isPointerDown ||
        e.pointerId !== pointerId
      ) {
        return;
      }


      const dx =
        e.clientX -
        startX;

      const dy =
        e.clientY -
        startY;


      /*
       * Detect actual drag.
       *
       * 8px threshold prevents a normal
       * click from accidentally becoming
       * a drag.
       */

      if (
        Math.abs(dx) > 8
      ) {

        isDragging =
          true;
      }


      /*
       * Only horizontally drag the
       * social slider.
       */

      if (
        isDragging &&
        Math.abs(dx) >
          Math.abs(dy)
      ) {

        e.preventDefault();


        socialSlider.scrollLeft =
          startScrollLeft -
          dx;
      }
    }
  );


  /* -------------------------------------------------------
     POINTER UP
  ------------------------------------------------------- */

  socialSlider.addEventListener(
    "pointerup",
    (e) => {

      if (
        e.pointerId !== pointerId
      ) {
        return;
      }


      try {

        socialSlider.releasePointerCapture(
          e.pointerId
        );

      } catch (_) {}


      isPointerDown =
        false;


      pointerId =
        null;


      socialSlider.classList.remove(
        "is-dragging"
      );


      /*
       * Keep drag state alive long enough
       * for browser's click event.
       */

      setTimeout(
        () => {

          isDragging =
            false;

        },
        50
      );
    }
  );


  /* -------------------------------------------------------
     POINTER CANCEL
  ------------------------------------------------------- */

  socialSlider.addEventListener(
    "pointercancel",
    () => {

      isPointerDown =
        false;

      isDragging =
        false;

      pointerId =
        null;

      socialSlider.classList.remove(
        "is-dragging"
      );
    }
  );


  /* -------------------------------------------------------
     CLICK PROTECTION
  ------------------------------------------------------- */

  socialSlider.addEventListener(
    "click",
    (e) => {

      /*
       * If user dragged:
       *
       * STOP the click.
       *
       * Therefore the social link
       * will NOT open.
       */

      if (isDragging) {

        e.preventDefault();

        e.stopPropagation();

        e.stopImmediatePropagation();

        return;
      }


      /*
       * If user did NOT drag:
       *
       * Do absolutely nothing.
       *
       * Browser's normal <a href>
       * behavior opens the link.
       */
    },
    true
  );


  /* -------------------------------------------------------
     DISABLE NATIVE IMAGE DRAG
  ------------------------------------------------------- */

  $$(
    "img",
    socialSlider
  ).forEach(
    (img) => {

      img.draggable =
        false;


      img.addEventListener(
        "dragstart",
        (e) => {

          e.preventDefault();
        }
      );
    }
  );


  /* -------------------------------------------------------
     DISABLE NATIVE LINK DRAG
  ------------------------------------------------------- */

  $$(
    "a",
    socialSlider
  ).forEach(
    (link) => {

      link.addEventListener(
        "dragstart",
        (e) => {

          e.preventDefault();
        }
      );
    }
  );


  /* -------------------------------------------------------
     PREVENT TEXT SELECTION WHILE DRAGGING
  ------------------------------------------------------- */

  socialSlider.addEventListener(
    "selectstart",
    (e) => {

      if (isDragging) {
        e.preventDefault();
      }
    }
  );
}


/* =========================================================
   TESTIMONIALS
========================================================= */

const quotes =
  $$(".quote");

const qButtons =
  $$(".quote-controls button");


function showQuote(i) {

  if (!quotes.length) {
    return;
  }


  const index =
    (i + quotes.length) %
    quotes.length;


  quotes.forEach(
    (quote, n) => {

      quote.classList.toggle(
        "active",
        n === index
      );
    }
  );


  qButtons.forEach(
    (button, n) => {

      button.classList.toggle(
        "active",
        n === index
      );


      /*
       * Fallback for existing CSS.
       */

      button.style.color =
        n === index
          ? "#b7ff3c"
          : "";
    }
  );
}


qButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const index =
          Number(
            button.dataset.q
          );


        if (
          Number.isFinite(index)
        ) {

          showQuote(index);
        }
      }
    );
  }
);


if (quotes.length) {
  showQuote(0);
}


/* =========================================================
   VISITOR WEATHER
   Browser Geolocation → Open-Meteo
========================================================= */

const weatherBtn =
  $("#weatherBtn");

const weatherTemp =
  $("#weatherTemp");

const weatherPlace =
  $("#weatherPlace");

const weatherCondition =
  $("#weatherCondition");

const weatherIcon =
  $(".weather-icon");


function weatherText(code) {

  const map = {

    0: ["Clear sky", "☀"],

    1: ["Mainly clear", "🌤"],

    2: ["Partly cloudy", "⛅"],

    3: ["Overcast", "☁"],

    45: ["Fog", "〰"],

    48: ["Rime fog", "〰"],

    51: ["Light drizzle", "🌦"],

    53: ["Drizzle", "🌦"],

    55: ["Heavy drizzle", "🌧"],

    56: ["Freezing drizzle", "🌧"],

    57: ["Heavy freezing drizzle", "🌧"],

    61: ["Light rain", "🌦"],

    63: ["Rain", "🌧"],

    65: ["Heavy rain", "🌧"],

    66: ["Freezing rain", "🌧"],

    67: ["Heavy freezing rain", "🌧"],

    71: ["Light snow", "🌨"],

    73: ["Snow", "❄"],

    75: ["Heavy snow", "❄"],

    77: ["Snow grains", "❄"],

    80: ["Rain showers", "🌦"],

    81: ["Rain showers", "🌧"],

    82: ["Heavy showers", "⛈"],

    85: ["Snow showers", "🌨"],

    86: ["Heavy snow showers", "❄"],

    95: ["Thunderstorm", "⛈"],

    96: ["Thunderstorm + hail", "⛈"],

    99: ["Thunderstorm + hail", "⛈"]
  };


  return (
    map[code] ||
    [
      "Current conditions",
      "◌"
    ]
  );
}


async function loadWeather(
  lat,
  lon
) {

  if (!weatherCondition) {
    return;
  }


  weatherCondition.textContent =
    "Loading local weather…";


  if (weatherBtn) {
    weatherBtn.disabled =
      true;
  }


  try {

    const [
      weatherResponse,
      geoResponse
    ] =
      await Promise.all([

        fetch(
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${encodeURIComponent(lat)}` +
          `&longitude=${encodeURIComponent(lon)}` +
          `&current=temperature_2m,apparent_temperature,weather_code` +
          `&timezone=auto`
        ),

        fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse` +
          `?latitude=${encodeURIComponent(lat)}` +
          `&longitude=${encodeURIComponent(lon)}` +
          `&count=1` +
          `&language=en` +
          `&format=json`
        ).catch(
          () => null
        )
      ]);


    if (
      !weatherResponse.ok
    ) {

      throw new Error(
        "Weather request failed"
      );
    }


    const weather =
      await weatherResponse.json();


    let geo = {};


    if (
      geoResponse?.ok
    ) {

      geo =
        await geoResponse.json();
    }


    const current =
      weather.current ||
      {};


    const place =
      geo.results?.[0];


    const [
      label,
      icon
    ] =
      weatherText(
        current.weather_code
      );


    const temperature =
      Number(
        current.temperature_2m
      );


    const apparent =
      Number(
        current.apparent_temperature
      );


    if (weatherTemp) {

      weatherTemp.textContent =
        Number.isFinite(
          temperature
        )
          ? `${Math.round(
              temperature
            )}°C`
          : "--°C";
    }


    if (weatherPlace) {

      weatherPlace.textContent =
        place
          ? [
              place.name,
              place.admin1,
              place.country
            ]
              .filter(Boolean)
              .join(", ")
          : "Your location";
    }


    if (weatherCondition) {

      weatherCondition.textContent =
        Number.isFinite(
          apparent
        )
          ? `${label} · Feels like ${Math.round(
              apparent
            )}°C`
          : label;
    }


    if (weatherIcon) {

      weatherIcon.textContent =
        icon;
    }


    if (weatherBtn) {

      weatherBtn.textContent =
        "Refresh weather";

      weatherBtn.disabled =
        false;
    }

  } catch (error) {

    console.error(
      "Weather error:",
      error
    );


    if (weatherCondition) {

      weatherCondition.textContent =
        "Weather service unavailable";
    }


    if (weatherBtn) {

      weatherBtn.textContent =
        "Try again";

      weatherBtn.disabled =
        false;
    }
  }
}


/* =========================================================
   LOCATION
========================================================= */

function locate() {

  if (
    !navigator.geolocation
  ) {

    if (weatherPlace) {

      weatherPlace.textContent =
        "Geolocation is not supported";
    }


    if (weatherCondition) {

      weatherCondition.textContent =
        "Please use a modern browser";
    }


    return;
  }


  if (weatherBtn) {

    weatherBtn.textContent =
      "Requesting permission…";

    weatherBtn.disabled =
      true;
  }


  navigator.geolocation.getCurrentPosition(

    /* SUCCESS */

    (position) => {

      loadWeather(
        position.coords.latitude,
        position.coords.longitude
      );
    },


    /* ERROR */

    (error) => {

      console.warn(
        "Geolocation error:",
        error
      );


      if (weatherPlace) {

        weatherPlace.textContent =
          "Location permission needed";
      }


      if (weatherCondition) {

        if (
          error.code === 1
        ) {

          weatherCondition.textContent =
            "Allow location access to see local weather";

        } else if (
          error.code === 2
        ) {

          weatherCondition.textContent =
            "Could not detect your location";

        } else if (
          error.code === 3
        ) {

          weatherCondition.textContent =
            "Location request timed out";

        } else {

          weatherCondition.textContent =
            "Could not detect location";
        }
      }


      if (weatherBtn) {

        weatherBtn.textContent =
          "Use my location";

        weatherBtn.disabled =
          false;
      }
    },


    /* OPTIONS */

    {
      enableHighAccuracy:
        false,

      timeout:
        10000,

      maximumAge:
        300000
    }
  );
}


weatherBtn?.addEventListener(
  "click",
  locate
);


/* =========================================================
   CONTACT FORM
   DIRECT DISCORD WEBHOOK
   NO BACKEND / NO API
========================================================= */

/*
 * ========================================================
 * PUT YOUR DISCORD WEBHOOK URL HERE
 * ========================================================
 *
 * Example:
 *
 * const DISCORD_WEBHOOK_URL =
 *   "https://discord.com/api/webhooks/....";
 *
 * ========================================================
 */

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1556738701965402204/N22cfmAiwG3LMe8tiiA-pHHrJyYoHurPRBzPQlyLI-bbfs8QG215SefFHlDVzlvCtCvL";


const contactForm =
  $("#contactForm");


if (contactForm) {

  contactForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      /* ---------------------------------------------------
         FORM STATUS
      --------------------------------------------------- */

      const status =
        $("#formStatus");


      /* ---------------------------------------------------
         SUBMIT BUTTON
      --------------------------------------------------- */

      const submitButton =
        contactForm.querySelector(
          'button[type="submit"], input[type="submit"]'
        );


      /* ---------------------------------------------------
         GET NAME
      --------------------------------------------------- */

      const name =
        contactForm.querySelector(
          '[name="name"]'
        )?.value.trim() || "";


      /* ---------------------------------------------------
         GET EMAIL
      --------------------------------------------------- */

      const email =
        contactForm.querySelector(
          '[name="email"]'
        )?.value.trim() || "";


      /* ---------------------------------------------------
         GET PROJECT TYPE
         HTML:
         <select name="type">
      --------------------------------------------------- */

      const projectType =
        contactForm.querySelector(
          '[name="type"]'
        )?.value.trim() ||
        "Not specified";


      /* ---------------------------------------------------
         GET MESSAGE
      --------------------------------------------------- */

      const message =
        contactForm.querySelector(
          '[name="message"]'
        )?.value.trim() || "";


      /* ---------------------------------------------------
         REQUIRED FIELD VALIDATION
      --------------------------------------------------- */

      if (
        !name ||
        !email ||
        !message
      ) {

        if (status) {

          status.textContent =
            "Please fill in all required fields.";
        }


        return;
      }


      /* ---------------------------------------------------
         EMAIL VALIDATION
      --------------------------------------------------- */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailPattern.test(email)
      ) {

        if (status) {

          status.textContent =
            "Please enter a valid email address.";
        }


        return;
      }


      /* ---------------------------------------------------
         WEBHOOK VALIDATION
      --------------------------------------------------- */

      if (
        !DISCORD_WEBHOOK_URL ||
        DISCORD_WEBHOOK_URL.includes(
          "PASTE_YOUR_DISCORD_WEBHOOK"
        )
      ) {

        console.error(
          "Discord webhook URL is missing."
        );


        if (status) {

          status.textContent =
            "Contact system is not configured yet.";
        }


        return;
      }


      /* ---------------------------------------------------
         LOADING
      --------------------------------------------------- */

      if (status) {

        status.textContent =
          "Sending message…";
      }


      if (submitButton) {

        submitButton.disabled =
          true;
      }


      /* ---------------------------------------------------
         DISCORD EMBED
      --------------------------------------------------- */

      const payload = {

        username:
          "Portfolio Contact",


        embeds: [

          {

            title:
              "📩 New Project Inquiry",


            description:
              "A new project inquiry was submitted through the portfolio website.",


            color:
              12058623,


            fields: [

              /* NAME */

              {
                name:
                  "👤 Name",

                value:
                  name.substring(
                    0,
                    1024
                  ),

                inline:
                  true
              },


              /* EMAIL */

              {
                name:
                  "📧 Email",

                value:
                  email.substring(
                    0,
                    1024
                  ),

                inline:
                  true
              },


              /* PROJECT TYPE */

              {
                name:
                  "💼 Project Type",

                value:
                  projectType.substring(
                    0,
                    1024
                  ),

                inline:
                  false
              },


              /* MESSAGE */

              {
                name:
                  "💬 Message",

                value:
                  message.substring(
                    0,
                    1024
                  ),

                inline:
                  false
              }

            ],


            footer: {

              text:
                "Mr Bean — Portfolio Contact"
            },


            timestamp:
              new Date().toISOString()
          }

        ]
      };


      /* ---------------------------------------------------
         SEND DIRECTLY TO DISCORD
      --------------------------------------------------- */

      try {

        const response =
          await fetch(
            DISCORD_WEBHOOK_URL,
            {

              method:
                "POST",


              headers: {

                "Content-Type":
                  "application/json"
              },


              body:
                JSON.stringify(
                  payload
                )
            }
          );


        /* -------------------------------------------------
           DISCORD WEBHOOK ERROR
        ------------------------------------------------- */

        if (
          !response.ok
        ) {

          let discordError =
            null;


          try {

            discordError =
              await response.json();

          } catch (_) {}


          console.error(
            "Discord webhook error:",
            discordError
          );


          throw new Error(
            `Discord returned HTTP ${response.status}`
          );
        }


        /* -------------------------------------------------
           SUCCESS
        ------------------------------------------------- */

        if (status) {

          status.textContent =
            "Message sent successfully! I'll get back to you soon.";
        }


        contactForm.reset();


      } catch (error) {

        console.error(
          "Contact form error:",
          error
        );


        if (status) {

          status.textContent =
            "Unable to send message. Please try again later.";
        }


      } finally {

        if (submitButton) {

          submitButton.disabled =
            false;
        }
      }
    }
  );
}


/* =========================================================
   FOOTER YEAR
========================================================= */

const year =
  $("#year");


if (year) {

  year.textContent =
    new Date().getFullYear();
}


/* =========================================================
   KEYBOARD PROJECT NAVIGATION
========================================================= */

document.addEventListener(
  "keydown",
  (e) => {

    if (
      !slides.length
    ) {
      return;
    }


    /*
     * Don't change projects while
     * user is typing in a form.
     */

    const target =
      e.target;


    const isTyping =
      target &&
      (
        target.tagName ===
          "INPUT" ||

        target.tagName ===
          "TEXTAREA" ||

        target.tagName ===
          "SELECT" ||

        target.isContentEditable
      );


    if (isTyping) {
      return;
    }


    if (
      e.key ===
      "ArrowRight"
    ) {

      e.preventDefault();


      showProject(
        projectIndex + 1
      );


      startProjectSlider();
    }


    if (
      e.key ===
      "ArrowLeft"
    ) {

      e.preventDefault();


      showProject(
        projectIndex - 1
      );


      startProjectSlider();
    }
  }
);


/* =========================================================
   3D CARD TILT
========================================================= */

$$(
  ".portrait-card, .case-card, .skill-card"
).forEach(
  (card) => {

    card.addEventListener(
      "mousemove",
      (e) => {

        if (
          window.innerWidth <
          900
        ) {
          return;
        }


        const r =
          card.getBoundingClientRect();


        const x =
          (e.clientX -
            r.left) /
            r.width -
          0.5;


        const y =
          (e.clientY -
            r.top) /
            r.height -
          0.5;


        card.style.transform =
          `perspective(800px)` +
          `rotateX(${y * -4}deg)` +
          `rotateY(${x * 5}deg)` +
          `translateY(-4px)`;
      }
    );


    card.addEventListener(
      "mouseleave",
      () => {

        card.style.transform =
          "";
      }
    );
  }
);


/* =========================================================
   SMOOTH ANCHOR LINKS
========================================================= */

$$(
  'a[href^="#"]'
).forEach(
  (link) => {

    link.addEventListener(
      "click",
      (e) => {

        const href =
          link.getAttribute(
            "href"
          );


        if (
          !href ||
          href === "#"
        ) {
          return;
        }


        /*
         * Social links are NOT affected.
         */

        if (
          link.closest(
            ".hero-socials"
          )
        ) {
          return;
        }


        const target =
          $(href);


        if (!target) {
          return;
        }


        e.preventDefault();


        target.scrollIntoView({
          behavior:
            "smooth",

          block:
            "start"
        });
      }
    );
  }
);


/* =========================================================
   PAGE READY
========================================================= */

document.documentElement.classList.add(
  "js-ready"
);

document.body.classList.add(
  "script-ready"
);


/* =========================================================
   FINAL CONSOLE MESSAGE
========================================================= */

console.log(
  "%cPortfolio script loaded successfully.",
  "font-weight:bold;"
);
```
