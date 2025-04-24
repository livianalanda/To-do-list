const tabs = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;

        tabs.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        contents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tab) {
                content.classList.add('active');
            }
        });
    });
});