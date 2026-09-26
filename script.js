const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* =========================================================
   PRELOADER
========================================================= */

window.addEventListener("load", () => {
  setTimeout(() => {
    $("#preloader")?.classList.add("hide");
    document.body.classList.add("loaded");
  }, 700);
});


/* =========================================================
   NAVIGATION + SCROLL PROGRESS
========================================================= */

const nav = $(".nav-wrap");
const progress = $(".scroll-progress");

window.addEventListener(
  "scroll",
  () => {
    nav?.classList.toggle("scrolled", scrollY > 30);

    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width =
        (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    }
  },
  { passive: true }
);


/* =========================================================
   MOBILE MENU
========================================================= */

const toggle = $(".menu-toggle");
const links = $(".nav-links");

toggle?.addEventListener("click", () => {
  links?.classList.toggle("open");
});

$$(".nav-links a").forEach((a) => {
  a.addEventListener("click", () => {
    links?.classList.remove("open");
  });
});


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursorDot = $(".cursor-dot");
const cursorRing = $(".cursor-ring");

window.addEventListener("pointermove", (e) => {
  if (cursorDot) {
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
  }

  if (cursorRing) {
    cursorRing.style.left = e.clientX + "px";
    cursorRing.style.top = e.clientY + "px";
  }
});

$$("a, button, .magnetic").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorRing?.classList.add("hover");
  });

  el.addEventListener("mouseleave", () => {
    cursorRing?.classList.remove("hover");
  });
});


/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

$$(".magnetic").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();

    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;

    el.style.transform =
      `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
});


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$(".reveal").forEach((el) => observer.observe(el));
} else {
  $$(".reveal").forEach((el) => {
    el.classList.add("visible");
  });
}


/* =========================================================
   COUNT UP STATS
========================================================= */

if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const end = Number(el.dataset.count);
        const start = 0;
        const duration = 1200;

        let t0 = null;

        function step(t) {
          if (!t0) t0 = t;

          const p = Math.min(
            (t - t0) / duration,
            1
          );

          const v = Math.floor(
            start +
            (end - start) *
            (1 - Math.pow(1 - p, 3))
          );

          el.textContent = v;

          if (p < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = end;
          }
        }

        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.7 }
  );

  $$("[data-count]").forEach((el) =>
    countObserver.observe(el)
  );
}


/* =========================================================
   PROJECT SLIDER
========================================================= */

const slides = $$(".project-slide");
const dots = $("#sliderDots");
const prev = $("#prevProject");
const next = $("#nextProject");
const projectSlider = $("#projectSlider");

let projectIndex = 0;

if (slides.length && dots) {

  slides.forEach((_, i) => {
    const b = document.createElement("button");

    b.setAttribute(
      "aria-label",
      "Project " + (i + 1)
    );

    b.addEventListener("click", () =>
      showProject(i)
    );

    dots.appendChild(b);
  });

  function showProject(i) {
    projectIndex =
      (i + slides.length) % slides.length;

    slides.forEach((s, n) => {
      s.classList.toggle(
        "active",
        n === projectIndex
      );
    });

    $$("#sliderDots button").forEach((b, n) => {
      b.classList.toggle(
        "active",
        n === projectIndex
      );
    });
  }

  prev?.addEventListener("click", () =>
    showProject(projectIndex - 1)
  );

  next?.addEventListener("click", () =>
    showProject(projectIndex + 1)
  );

  showProject(0);

  let sliderTimer = setInterval(
    () => showProject(projectIndex + 1),
    6500
  );

  projectSlider?.addEventListener(
    "mouseenter",
    () => clearInterval(sliderTimer)
  );

  projectSlider?.addEventListener(
    "mouseleave",
    () => {
      sliderTimer = setInterval(
        () => showProject(projectIndex + 1),
        6500
      );
    }
  );

  /* Touch swipe */

  let touchX = 0;

  projectSlider?.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  projectSlider?.addEventListener(
    "touchend",
    (e) => {
      const dx =
        e.changedTouches[0].screenX - touchX;

      if (Math.abs(dx) > 45) {
        showProject(
          projectIndex + (dx < 0 ? 1 : -1)
        );
      }
    },
    { passive: true }
  );
}


/* =========================================================
   TESTIMONIALS
========================================================= */

const quotes = $$(".quote");
const qButtons = $$(".quote-controls button");

function showQuote(i) {
  quotes.forEach((q, n) => {
    q.classList.toggle(
      "active",
      n === i
    );
  });

  qButtons.forEach((b, n) => {
    b.style.color =
      n === i ? "#b7ff3c" : "";
  });
}

qButtons.forEach((b) => {
  b.addEventListener("click", () => {
    showQuote(Number(b.dataset.q));
  });
});

if (quotes.length) {
  showQuote(0);
}


/* =========================================================
   VISITOR WEATHER
   Browser Geolocation → Open-Meteo
========================================================= */

const weatherBtn = $("#weatherBtn");
const weatherTemp = $("#weatherTemp");
const weatherPlace = $("#weatherPlace");
const weatherCondition = $("#weatherCondition");
const weatherIcon = $(".weather-icon");


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
    61: ["Light rain", "🌦"],
    63: ["Rain", "🌧"],
    65: ["Heavy rain", "🌧"],
    71: ["Light snow", "🌨"],
    73: ["Snow", "❄"],
    75: ["Heavy snow", "❄"],
    80: ["Rain showers", "🌦"],
    81: ["Rain showers", "🌧"],
    82: ["Heavy showers", "⛈"],
    95: ["Thunderstorm", "⛈"],
    96: ["Thunderstorm + hail", "⛈"],
    99: ["Thunderstorm + hail", "⛈"]
  };

  return (
    map[code] ||
    ["Current conditions", "◌"]
  );
}


async function loadWeather(lat, lon) {

  if (!weatherCondition) return;

  weatherCondition.textContent =
    "Loading local weather…";

  try {

    const [weatherResponse, geoResponse] =
      await Promise.all([

        fetch(
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}` +
          `&longitude=${lon}` +
          `&current=temperature_2m,apparent_temperature,weather_code` +
          `&timezone=auto`
        ),

        fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse` +
          `?latitude=${lat}` +
          `&longitude=${lon}` +
          `&count=1` +
          `&language=en` +
          `&format=json`
        ).catch(() => null)

      ]);

    if (!weatherResponse.ok) {
      throw new Error("Weather request failed");
    }

    const w = await weatherResponse.json();

    let g = {};

    if (geoResponse?.ok) {
      g = await geoResponse.json();
    }

    const cur = w.current || {};
    const place = g.results?.[0];

    const [label, icon] =
      weatherText(cur.weather_code);

    if (weatherTemp) {
      weatherTemp.textContent =
        `${Math.round(cur.temperature_2m)}°C`;
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
        `${label} · Feels like ${Math.round(
          cur.apparent_temperature
        )}°C`;
    }

    if (weatherIcon) {
      weatherIcon.textContent = icon;
    }

    if (weatherBtn) {
      weatherBtn.textContent =
        "Refresh weather";
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
    }
  }
}


/* =========================================================
   LOCATION
========================================================= */

function locate() {

  if (!navigator.geolocation) {

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
  }


  navigator.geolocation.getCurrentPosition(

    /* SUCCESS */

    (pos) => {

      loadWeather(
        pos.coords.latitude,
        pos.coords.longitude
      );

    },


    /* ERROR */

    (err) => {

      console.warn(
        "Geolocation error:",
        err
      );

      if (weatherPlace) {
        weatherPlace.textContent =
          "Location permission needed";
      }

      if (weatherCondition) {

        if (err.code === 1) {
          weatherCondition.textContent =
            "Allow location access to see local weather";
        } else if (err.code === 2) {
          weatherCondition.textContent =
            "Could not detect your location";
        } else if (err.code === 3) {
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
      }
    },


    /* OPTIONS */

    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    }

  );
}


weatherBtn?.addEventListener(
  "click",
  locate
);


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm = $("#contactForm");

contactForm?.addEventListener(
  "submit",
  (e) => {

    e.preventDefault();

    const status = $("#formStatus");

    if (status) {
      status.textContent =
        "Thanks! This demo form is ready to connect to your email service or Discord webhook.";
    }

  }
);


/* =========================================================
   FOOTER YEAR
========================================================= */

const year = $("#year");

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

    if (!slides.length) return;

    if (e.key === "ArrowRight") {
      showProject(projectIndex + 1);
    }

    if (e.key === "ArrowLeft") {
      showProject(projectIndex - 1);
    }

  }
);


/* =========================================================
   3D CARD TILT
========================================================= */

$$(
  ".portrait-card, .case-card, .skill-card"
).forEach((card) => {

  card.addEventListener(
    "mousemove",
    (e) => {

      if (innerWidth < 900) return;

      const r =
        card.getBoundingClientRect();

      const x =
        (e.clientX - r.left) /
          r.width -
        0.5;

      const y =
        (e.clientY - r.top) /
          r.height -
        0.5;

      card.style.transform =
        `perspective(800px) ` +
        `rotateX(${y * -4}deg) ` +
        `rotateY(${x * 5}deg) ` +
        `translateY(-4px)`;
    }
  );


  card.addEventListener(
    "mouseleave",
    () => {
      card.style.transform = "";
    }
  );

});
