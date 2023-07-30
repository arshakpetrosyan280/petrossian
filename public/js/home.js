let usernameTag = document.querySelector("#username");

fetch("/session-user")
	.then(data=>data.json())
	.then(user => {
		usernameTag.innerHTML = `${user.firstName} ${user.lastname}`
	});