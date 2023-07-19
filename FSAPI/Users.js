
var fs = require('fs');
var file = __dirname + "/tables/user.json";


var userCreate = async function(firstName, lastName, username, password){
	
	var id = await getTableLastId() +1;
	var data = await getTableData();
	
	fs.writeFile(file, JSON.stringify([
			...data,
			{
				id: id,
				firstName: firstName,
				lastname: lastName,
				username: username,
				password: password
			}
		], null, 2), function(){
		
	});
}

async function getTableLastId(){
	var lastId = 0;
	var data = await getTableData();
	console.log(data.length);
	if (data.length !== 0) {
		var lastId = data[data.length-1].id;
	}
	return lastId;
}
async function getTableData(){
	var data = await fs.promises.readFile(file,  { encoding: 'utf8' });
	data = JSON.parse(data);
	return data;
}

module.exports.userCreate = userCreate;