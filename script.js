
/* =========================================
   KNOW DR. HARISH-CHANDRA
   Interactive Website JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // -------------------------------------
    // 1. DARK MODE
    // -------------------------------------

    const themeToggle = document.getElementById("themeToggle");
    const themeStorageKey = "harishChandraTheme";

    function getSavedTheme() {
        try {
            return localStorage.getItem(themeStorageKey);
        } catch (error) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(themeStorageKey, theme);
        } catch (error) {
            // Theme still works if browser storage is unavailable.
        }
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";

        body.classList.toggle("dark-mode", isDark);

        if (themeToggle) {
            themeToggle.textContent = isDark
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";

            themeToggle.setAttribute("aria-pressed", String(isDark));
            themeToggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
        }

        const themeColor = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (themeColor) {
            themeColor.setAttribute(
                "content",
                isDark ? "#0b1422" : "#102544"
            );
        }
    }

    const savedTheme = getSavedTheme();
    applyTheme(savedTheme === "dark" ? "dark" : "light");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isDark = body.classList.contains("dark-mode");
            const nextTheme = isDark ? "light" : "dark";

            applyTheme(nextTheme);
            saveTheme(nextTheme);
        });
    }


    // -------------------------------------
    // 2. INTERACTIVE LIFE TIMELINE
    // -------------------------------------

    const timelineButtons = document.querySelectorAll(".timeline-toggle");

    timelineButtons.forEach((button) => {
        const details = button.nextElementSibling;

        if (!details || !details.classList.contains("timeline-details")) {
            return;
        }

        function updateTimelineButton(isOpen) {
            button.setAttribute("aria-expanded", String(isOpen));

            const label = isOpen ? "Show less" : "Read more";
            const symbol = isOpen ? "−" : "+";

            // Keep the symbol span intact.
            const symbolSpan = button.querySelector("span");

            if (symbolSpan) {
                button.textContent = label + " ";
                button.appendChild(symbolSpan);
                symbolSpan.textContent = symbol;
            } else {
                button.textContent = label;
            }
        }

        // Synchronize the initial button state with its content.
        updateTimelineButton(!details.hidden);

        button.addEventListener("click", () => {
            const isCurrentlyOpen = !details.hidden;
            details.hidden = isCurrentlyOpen;

            updateTimelineButton(!isCurrentlyOpen);
        });
    });


    // -------------------------------------
    // 3. WEBSITE SEARCH
    // -------------------------------------

    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const clearButton = document.getElementById("clearButton");
    const searchMessage = document.getElementById("searchMessage");

    const searchableSections = Array.from(
        document.querySelectorAll("main .content-section")
    );

    function removeSearchHighlights() {
        document
            .querySelectorAll(".search-highlight")
            .forEach((element) => {
                element.classList.remove("search-highlight");
            });
    }

    function showSearchMessage(message) {
        if (searchMessage) {
            searchMessage.textContent = message;
        }
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const query = searchInput.value.trim().toLocaleLowerCase();

            removeSearchHighlights();

            if (!query) {
                showSearchMessage("Please enter a topic to search.");
                searchInput.focus();
                return;
            }

            const matchingSections = searchableSections.filter((section) => {
                const sectionText = section.textContent
                    .replace(/\s+/g, " ")
                    .toLocaleLowerCase();

                return sectionText.includes(query);
            });

            if (matchingSections.length === 0) {
                showSearchMessage(
                    `No results found for "${searchInput.value.trim()}".`
                );
                return;
            }

            matchingSections.forEach((section) => {
                section.classList.add("search-highlight");
            });

            showSearchMessage(
                `${matchingSections.length} section(s) found for "${searchInput.value.trim()}".`
            );

            matchingSections[0].scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
            }

            removeSearchHighlights();
            showSearchMessage("");

            if (searchInput) {
                searchInput.focus();
            }
        });
    }


    // -------------------------------------
    // 4. PRINT / SAVE AS PDF
    // -------------------------------------

    const printButton = document.getElementById("printButton");

    if (printButton) {
        printButton.addEventListener("click", () => {
            window.print();
        });
    }


    // -------------------------------------
    // 5. SHARE WEBSITE
    // -------------------------------------

    const shareButton = document.getElementById("shareButton");
    const shareMessage = document.getElementById("shareMessage");

    function showShareMessage(message) {
        if (shareMessage) {
            shareMessage.textContent = message;
        }
    }

    async function copyWebsiteLink() {
        const websiteUrl = window.location.href;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(websiteUrl);
                showShareMessage("Website link copied successfully!");
                return;
            }

            // Fallback for browsers without Clipboard API access.
            window.prompt("Copy your website link:", websiteUrl);
            showShareMessage("Copy the website link from the dialog.");
        } catch (error) {
            // A manual copy option remains available.
            window.prompt("Copy your website link:", websiteUrl);
            showShareMessage("Copy the website link from the dialog.");
        }
    }

    if (shareButton) {
        shareButton.addEventListener("click", async () => {
            showShareMessage("");

            const shareData = {
                title: document.title,
                text: "Explore the life and mathematical legacy of Dr. Harish-Chandra.",
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                    showShareMessage("Website shared successfully.");
                } catch (error) {
                    // User cancellation is normal; do not show an error.
                    if (error.name !== "AbortError") {
                        await copyWebsiteLink();
                    }
                }
            } else {
                await copyWebsiteLink();
            }
        });
    }


    // -------------------------------------
    // 6. SMOOTH INTERNAL NAVIGATION
    // -------------------------------------

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.getElementById(targetId.slice(1));

            if (!target) {
                return;
            }

            event.preventDefault();

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            // Keep the URL anchor in sync with navigation.
            if (window.location.hash !== targetId) {
                history.replaceState(null, "", targetId);
            }
        });
    });

});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("nav a[href^='#']");

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const galleryButtons = document.querySelectorAll(".hc-gallery-item");
    const modal = document.getElementById("hcGalleryModal");
    const modalImage = document.getElementById("hcGalleryModalImage");
    const closeButton = document.getElementById("hcGalleryClose");

    if (!modal || !modalImage || !closeButton) return;

    function closeGallery() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        modalImage.src = "";
        document.body.classList.remove("gallery-modal-open");
    }

    galleryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const image = button.dataset.fullImage;
            if (!image) return;

            modalImage.src = image;
            modalImage.alt = button.querySelector("img")?.alt || "Gallery photo";
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("gallery-modal-open");
            closeButton.focus();
        });
    });

    closeButton.addEventListener("click", closeGallery);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeGallery();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closeGallery();
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const quiz = document.getElementById("hcQuiz");
    const submitButton = document.getElementById("hcSubmitQuiz");
    const retryButton = document.getElementById("hcRetryQuiz");
    const result = document.getElementById("hcQuizResult");

    if (!quiz || !submitButton || !retryButton || !result) return;

    const questions = quiz.querySelectorAll(".hc-question");

    submitButton.addEventListener("click", () => {
        let score = 0;
        let unanswered = 0;

        questions.forEach((question) => {
            const selected = question.querySelector('input[type="radio"]:checked');
            const correctAnswer = question.dataset.answer;

            question.classList.remove("is-correct", "is-wrong");

            if (!selected) {
                unanswered++;
                question.classList.add("is-wrong");
                return;
            }

            if (selected.value === correctAnswer) {
                score++;
                question.classList.add("is-correct");
            } else {
                question.classList.add("is-wrong");
            }
        });

        if (unanswered > 0) {
            result.textContent =
                `Please answer all questions. ${unanswered} question(s) remaining.`;
            result.style.color = "#d73a49";
            return;
        }

        result.textContent = `Your Score: ${score} / ${questions.length}`;
        result.style.color = score === questions.length ? "#238636" : "var(--text-color, #14243b)";

        submitButton.disabled = true;
        retryButton.hidden = false;

        questions.forEach((question) => {
            question.querySelectorAll('input[type="radio"]').forEach((input) => {
                input.disabled = true;
            });
        });
    });

    retryButton.addEventListener("click", () => {
        questions.forEach((question) => {
            question.classList.remove("is-correct", "is-wrong");

            question.querySelectorAll('input[type="radio"]').forEach((input) => {
                input.checked = false;
                input.disabled = false;
            });
        });

        result.textContent = "";
        submitButton.disabled = false;
        retryButton.hidden = true;
    });
});