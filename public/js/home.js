let usernameTag = document.querySelector("#username");

fetch("/session-user")
	.then(data=>data.json())
	.then(user => {
		if(user){
			usernameTag.setAttribute("href", `/account/${user.id}`);
			usernameTag.innerHTML = `
				<i class="fa fa-user"></i>&nbsp;
				${user.firstName} ${user.lastname}
			`;
		}
		
	}).catch((error) => {
	  	fetch("/cookie-user")
			.then(data=>data.json())
			.then(user => {
				console.log(user);
				usernameTag.setAttribute("href", `/account/${user.id}`);
				usernameTag.innerHTML = `
					<i class="fa fa-user"></i>&nbsp;
					${user.firstName} ${user.lastname}
				`;
			});
	});

