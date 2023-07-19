document.querySelector("#rgisterForm").addEventListener("submit", async (event) => {
	event.preventDefault();
	const data = await serialize(document.querySelector("#rgisterForm"));
	console.log(data);

	fetch("/register", {
		method: "post",
		headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
});

async function serialize(form) {
	const formEntries = new FormData(form).entries();
	const json = Object.assign(...Array.from(formEntries, ([x,y]) => ({[x]:y})));
	return json;
}