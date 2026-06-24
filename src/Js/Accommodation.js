document.addEventListener("DOMContentLoaded", function() {
    // Set the event date (example: December 31, 2024)
    const eventDate = new Date("December 31, 2024 23:59:59").getTime();

    // Update the countdown every second
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = eventDate - now;

        if (timeLeft < 0) {
            clearInterval(countdown);
            document.getElementById("countdown").innerHTML = "<p>We have launched!</p>";
        } else {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById("days").innerText = days;
            document.getElementById("hours").innerText = hours;
            document.getElementById("minutes").innerText = minutes;
            document.getElementById("seconds").innerText = seconds;
        }
    }, 1000);

    // Notify Me form submit event
    document.getElementById("notifyForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        alert(`Thank you, ${email}! You will be notified when we launch.`);
        this.reset(); // Reset the form after submission
    });
});
