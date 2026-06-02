const form =
    document.getElementById("loginForm");

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

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

        if (!email || !password) {

            message.innerText =
                "All fields required";

            return;

        }

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/login",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })

                    }
                );

            const data =
                await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "token",
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