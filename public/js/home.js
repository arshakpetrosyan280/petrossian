let usernameTag = document.querySelector("#username");

fetch("/session-user")
	.then(data=>data.json())
	.then(user => {
		if(user){
			usernameTag.innerHTML = `${user.firstName} ${user.lastname}`
		}
		
	}).catch((error) => {
	  	fetch("/cookie-user")
			.then(data=>data.json())
			.then(user => {
				usernameTag.innerHTML = `${user.firstName} ${user.lastname}`
			});
	});

