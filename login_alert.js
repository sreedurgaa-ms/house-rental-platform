document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) {
                alert(result.message);
            } 
        else {
                window.location.href = '/home';
            }
        } 
    catch (err) {
            console.error(err);
        }
    });
