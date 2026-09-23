async function deleteuser(id) {
    try {
        console.log('working')
        const response = await fetch(`/delete/${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert(result.message);
            location.reload();
        }
    } 
    catch (error) {
        console.error(error);
    }
}

async function editdata(id) {
    window.location.href = `/edit/${id}`;
}

document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.fa-trash');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = button.dataset.id;
            deleteuser(id);
        });
    });

    const editButtons = document.querySelectorAll('.fa-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = button.dataset.id;
            editdata(id);
        });
    });
});
