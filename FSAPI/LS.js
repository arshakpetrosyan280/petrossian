var fs = require('fs');
var file = __dirname + "/localstorage.json";

class LS{
	constructor(){
		this.storage = this.getData();
	}
	setUser(value){
		this.storage.user = value;
		console.log(value);
		fs.writeFile(file, JSON.stringify(this.storage, null, 2), function(){});
	}
	async getUser(){
		return this.getData();
	}
	async unlinkUser(){
		fs.unlinkSync(file);
	}
	async getData(){
		if(fs.existsSync(file)){
			var data = await fs.promises.readFile(file, {encode: "utf-8"});
			return JSON.parse(data);
		}else{
			return {};
		}
	}
}

module.exports = LS;