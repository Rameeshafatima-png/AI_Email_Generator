/* ============================================================
   DISPATCH — AI EMAIL GENERATOR
   Frontend logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* --------------------------------------------------------
       ELEMENTS
    -------------------------------------------------------- */

    const recipientInput =
        document.getElementById("recipient");

    const purposeInput =
        document.getElementById("purpose");

    const counter =
        document.getElementById("counter");

    const generateBtn =
        document.getElementById("generateBtn");

    const toneCards =
        document.querySelectorAll(".tone-card");

    const stampTone =
        document.getElementById("stampTone");

    const emptyState =
        document.getElementById("emptyState");

    const loadingState =
        document.getElementById("loadingState");

    const emailResult =
        document.getElementById("emailResult");

    const errorState =
        document.getElementById("errorState");

    const errorMessage =
        document.getElementById("errorMessage");

    const emailSubject =
        document.getElementById("emailSubject");

    const emailBody =
        document.getElementById("emailBody");

    const copyBtn =
        document.getElementById("copyBtn");

    const newBtn =
        document.getElementById("newBtn");

    const retryBtn =
        document.getElementById("retryBtn");


    /* --------------------------------------------------------
       SELECTED TONE
    -------------------------------------------------------- */

    let selectedTone = "Professional";


    /* --------------------------------------------------------
       CURRENT DATE
    -------------------------------------------------------- */

    function updateDate() {

        const dateElement =
            document.getElementById("currentDate");

        const now = new Date();

        const formattedDate =
            now.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });

        dateElement.textContent = formattedDate;
    }

    updateDate();


    /* --------------------------------------------------------
       TONE SELECTION
    -------------------------------------------------------- */

    toneCards.forEach(card => {

        card.addEventListener("click", () => {

            toneCards.forEach(item => {
                item.classList.remove("active");
            });

            card.classList.add("active");

            selectedTone =
                card.dataset.tone;

            stampTone.textContent =
                selectedTone;
        });

    });


    /* --------------------------------------------------------
       CHARACTER COUNTER
    -------------------------------------------------------- */

    function updateCounter() {

        const length =
            purposeInput.value.length;

        counter.textContent =
            `${length}/1000`;

    }

    purposeInput.addEventListener(
        "input",
        updateCounter
    );


    /* --------------------------------------------------------
       SHOW STATE
    -------------------------------------------------------- */

    function showState(state) {

        emptyState.classList.add("hidden");
        loadingState.classList.add("hidden");
        emailResult.classList.add("hidden");
        errorState.classList.add("hidden");

        if (state === "empty") {
            emptyState.classList.remove("hidden");
        }

        if (state === "loading") {
            loadingState.classList.remove("hidden");
        }

        if (state === "result") {
            emailResult.classList.remove("hidden");
        }

        if (state === "error") {
            errorState.classList.remove("hidden");
        }

    }


    /* --------------------------------------------------------
       LOADING BUTTON
    -------------------------------------------------------- */

    function setLoading(isLoading) {

        if (isLoading) {

            generateBtn.classList.add("loading");

            generateBtn.disabled = true;

        } else {

            generateBtn.classList.remove("loading");

            generateBtn.disabled = false;

        }

    }


    /* --------------------------------------------------------
       PARSE GENERATED EMAIL
    -------------------------------------------------------- */

    function parseEmail(text) {

        let subject = "";
        let body = text;

        const subjectMatch =
            text.match(
                /^SUBJECT:\s*(.+?)(?:\r?\n|$)/i
            );

        if (subjectMatch) {

            subject =
                subjectMatch[1].trim();

            body =
                text
                    .replace(
                        subjectMatch[0],
                        ""
                    )
                    .trim();

        } else {

            subject =
                "New message";

        }

        return {
            subject,
            body
        };

    }


    /* --------------------------------------------------------
       FORMAT EMAIL BODY
    -------------------------------------------------------- */

    function formatEmailBody(text) {

        /*
           Convert plain generated text into paragraphs.
        */

        const lines =
            text
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line.length > 0);


        if (lines.length === 0) {
            return "";
        }


        let html = "";

        let currentParagraph = [];


        lines.forEach(line => {

            /*
               Signature / closing lines
            */

            if (
                line.toLowerCase() === "best regards," ||
                line.toLowerCase() === "kind regards," ||
                line.toLowerCase() === "regards," ||
                line.toLowerCase() === "sincerely,"
            ) {

                if (currentParagraph.length) {

                    html +=
                        `<p>${escapeHTML(
                            currentParagraph.join(" ")
                        )}</p>`;

                    currentParagraph = [];
                }

                html +=
                    `<p>${escapeHTML(line)}<br>`;

                return;
            }


            /*
               If previous line opened signature
            */

            if (
                html.endsWith("<br>") &&
                currentParagraph.length === 0
            ) {

                html +=
                    `${escapeHTML(line)}</p>`;

                return;
            }


            currentParagraph.push(line);

        });


        if (currentParagraph.length) {

            html +=
                `<p>${escapeHTML(
                    currentParagraph.join(" ")
                )}</p>`;

        }


        return html;

    }


    /* --------------------------------------------------------
       HTML ESCAPE
    -------------------------------------------------------- */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }


    /* --------------------------------------------------------
       GENERATE EMAIL
    -------------------------------------------------------- */

    async function generateEmail() {

        const recipient =
            recipientInput.value.trim();

        const purpose =
            purposeInput.value.trim();


        /*
           Validation
        */

        if (!recipient) {

            recipientInput.focus();

            recipientInput.style.borderColor =
                "#b77b65";

            setTimeout(() => {
                recipientInput.style.borderColor =
                    "";
            }, 1800);

            return;
        }


        if (!purpose) {

            purposeInput.focus();

            purposeInput.style.borderColor =
                "#b77b65";

            setTimeout(() => {
                purposeInput.style.borderColor =
                    "";
            }, 1800);

            return;
        }


        /*
           Loading
        */

        showState("loading");

        setLoading(true);


        try {

            const response =
                await fetch("/generate", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        recipient_name:
                            recipient,

                        purpose:
                            purpose,

                        tone:
                            selectedTone

                    })

                });


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.error ||
                    "Unable to generate email."
                );

            }


            /*
               Parse response
            */

            const parsed =
                parseEmail(data.email);


            emailSubject.textContent =
                parsed.subject;


            emailBody.innerHTML =
                formatEmailBody(parsed.body);


            /*
               Update date stamp
            */

            stampTone.textContent =
                selectedTone;


            /*
               Show result
            */

            showState("result");


        } catch (error) {

            console.error(
                "Generation error:",
                error
            );

            errorMessage.textContent =
                error.message ||
                "Unable to generate email.";

            showState("error");

        } finally {

            setLoading(false);

        }

    }


    /* --------------------------------------------------------
       GENERATE CLICK
    -------------------------------------------------------- */

    generateBtn.addEventListener(
        "click",
        generateEmail
    );


    /* --------------------------------------------------------
       COPY EMAIL
    -------------------------------------------------------- */

    copyBtn.addEventListener(
        "click",
        async () => {

            const subject =
                emailSubject.textContent.trim();

            const body =
                emailBody.innerText.trim();


            const completeEmail =
                `Subject: ${subject}\n\n${body}`;


            try {

                await navigator.clipboard.writeText(
                    completeEmail
                );


                const originalText =
                    copyBtn.innerHTML;


                copyBtn.innerHTML =
                    "<span>Copied ✓</span>";


                setTimeout(() => {

                    copyBtn.innerHTML =
                        originalText;

                }, 1600);


            } catch (error) {

                /*
                   Fallback
                */

                const textarea =
                    document.createElement("textarea");

                textarea.value =
                    completeEmail;

                document.body.appendChild(textarea);

                textarea.select();

                document.execCommand("copy");

                textarea.remove();


                copyBtn.innerHTML =
                    "<span>Copied ✓</span>";

                setTimeout(() => {

                    copyBtn.innerHTML =
                        "<span>Copy email</span>";

                }, 1600);

            }

        }
    );


    /* --------------------------------------------------------
       WRITE AGAIN / NEW EMAIL
    -------------------------------------------------------- */

    newBtn.addEventListener(
        "click",
        () => {

            purposeInput.focus();

            showState("empty");

        }
    );


    /* --------------------------------------------------------
       RETRY
    -------------------------------------------------------- */

    retryBtn.addEventListener(
        "click",
        generateEmail
    );


    /* --------------------------------------------------------
       ENTER KEY
    -------------------------------------------------------- */

    recipientInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                purposeInput.focus();

            }

        }
    );


    /* --------------------------------------------------------
       CTRL + ENTER
       Generate from textarea
    -------------------------------------------------------- */

    purposeInput.addEventListener(
        "keydown",
        event => {

            if (
                event.ctrlKey &&
                event.key === "Enter"
            ) {

                generateEmail();

            }

        }
    );

});