const root = document.documentElement;
const revealElements = document.querySelectorAll(".reveal");
const navLinks = Array.from(document.querySelectorAll(".topnav a"));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
const heroStage = document.querySelector(".hero-stage");
const heroStageFrame = document.querySelector(".hero-stage__frame");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const updateScrollProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
};

const setActiveLink = (id) => {
    navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
};

const initialHash = window.location.hash.replace("#", "");

if (initialHash && sections.some((section) => section.id === initialHash)) {
    setActiveLink(initialHash);
} else {
    setActiveLink("");
}

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -10% 0px",
        }
    );

    revealElements.forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        },
        {
            threshold: 0.45,
            rootMargin: "-24% 0px -46% 0px",
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

if (heroStage && heroStageFrame && canHover && !reducedMotion) {
    const resetStage = () => {
        heroStageFrame.style.setProperty("--stage-tilt-x", "0deg");
        heroStageFrame.style.setProperty("--stage-tilt-y", "0deg");
        heroStageFrame.style.setProperty("--glow-x", "50%");
        heroStageFrame.style.setProperty("--glow-y", "50%");
    };

    heroStage.addEventListener("pointermove", (event) => {
        const rect = heroStage.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
        const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

        heroStageFrame.style.setProperty("--stage-tilt-x", `${relativeY * -7}deg`);
        heroStageFrame.style.setProperty("--stage-tilt-y", `${relativeX * 7}deg`);
        heroStageFrame.style.setProperty("--glow-x", `${(relativeX + 0.5) * 100}%`);
        heroStageFrame.style.setProperty("--glow-y", `${(relativeY + 0.5) * 100}%`);
    });

    heroStage.addEventListener("pointerleave", resetStage);
    resetStage();
}
