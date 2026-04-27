document.addEventListener("DOMContentLoaded", init);

function init() {
    var form = document.getElementById("newsletterForm");
    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var messageDiv = document.getElementById("formMessage");

    form.addEventListener("submit", function (e) {
        handleSubmit(e, form, nameInput, emailInput, messageDiv);
    });
}

// Email validation
function isValidEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Display message to user
function showMessage(messageDiv, message, isError) {
    messageDiv.textContent = message;

    if (isError) {
        messageDiv.className = "form-message error";
    } else {
        messageDiv.className = "form-message success";
    }
}

// Handle form submission
async function handleSubmit(e, form, nameInput, emailInput, messageDiv) {
    e.preventDefault();

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();

    // 🔍 Validation
    if (name === "") {
        showMessage(messageDiv, "Please enter your name.", true);
        return;
    }

    if (email === "") {
        showMessage(messageDiv, "Please enter your email.", true);
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(messageDiv, "Please enter a valid email address.", true);
        return;
    }

    var submitBtn = form.querySelector("button");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
        // API call
        var response = await fetch(
            "https://mudfoot.doc.stu.mmu.ac.uk/ash/api/mailinglist",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email
                })
            }
        );

        var data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong.");
        }

        // ✅ Success
        showMessage(messageDiv, "Successfully subscribed to the mailing list!", false);
        form.reset();

    } catch (error) {
        // ❌ Error
        showMessage(messageDiv, "Error: " + error.message, true);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Subscribe";
    }
}