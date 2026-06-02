const form =
    document.getElementById("registerForm");

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const name =
            document.getElementById("name")
            .value
            .trim();

        const email =
            document.getElementById("email")
            .value
            .trim();

        const password =
            document.getElementById("password")
            .value
            .trim();

        const message =
            document.getElementById("message");

        // VALIDATION
        if (!name || !email || !password) {

            message.innerText =
                "All fields are required";

            return;

        }

        if (password.length < 6) {

            message.innerText =
                "Password must be at least 6 characters";

            return;

        }

        try {

            const response =  await fetch( "http://localhost:5000/api/auth/register",
                    { method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })

                    }
                );

            const data =
                await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "tokens",
                    data.token
                );

                window.location.href =
                    "dashboard.html";

            } else {

                message.innerText =
                    data.message;

            }

        } catch (error) {

            console.log(error);

            message.innerText =
                "Server Error";

        }

    }
);