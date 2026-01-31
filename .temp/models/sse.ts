
const eventSource = new EventSource("https://localhost:44300/tasks/stream");

eventSource.addEventListener("tasks", (e) => {
    try {
        const data = JSON.parse(e.data);
        console.log(data);
    } catch (error) {
        console.error(error);

    }
});

eventSource.onopen = (e) => { };
eventSource.onerror = (e) => { };
eventSource.onmessage = (e) => { };

export default () => {

}