const getDepartments = () =>
    fetch('/api/departments', {
        method: 'GET',
        headers: {
            'Content-Tyoe': 'application.json',
        },
    });