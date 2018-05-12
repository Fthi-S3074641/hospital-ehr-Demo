const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection,
 express = require('express'),
 Web3 = require('web3'),
 http = require('http'),
 cors = require('cors'),
 app = module.exports.app = express();


var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(4000);

var io = require('socket.io').listen(server);
// io.set('log level', 1);
io.sockets.on('connection', function(socket){
});

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.version.getNetwork((error, netId) => {
if(error){ console.log(error); return; }
this.netID = netId;
console.log(netId);
});
const Hospital = require('./../build/contracts/Hospital.json');

var contract = Hospital.networks["1526145447636"].address;
console.log(contract);
var abi = Hospital.abi;
var MyContract = web3.eth.contract(abi);
var myContractInstance = MyContract.at(contract);

this.bizNetworkConnection = new BusinessNetworkConnection();
this.cardName ='admin@hospital-ehr';
this.businessNetworkIdentifier = 'hospital-ehr';
this.VERIFICATION = false;

const verify = async(doctor,patient) => {
	return await myContractInstance.doIHaveRights(patient, {from: doctor});
}
const init = async () => {
	 await this.bizNetworkConnection.connect(this.cardName)
	 .then((result) => {
		this.businessNetworkDefinition = result;
	 })
	 console.log(await this.businessNetworkDefinition.getName());
	 this.serializer = await this.businessNetworkDefinition.getSerializer();

}
const register = async (address, role) => {
	await this.bizNetworkConnection.getParticipantRegistry(`org.acme.hospital.${role}`)
	.then((result) => {
		this.userRegistry = result;
	})
	let factory = await this.businessNetworkDefinition.getFactory();
	user = factory.newResource('org.acme.hospital', role, address);
	user.name = role;
	if(role === 'Patient'){ user.myReaders = [address]; }
	else{	user.myClients = [address]; }
	return await this.userRegistry.add(user)
}
const medDemo = async () => {
	await this.bizNetworkConnection.getAssetRegistry('org.acme.hospital.Medication')
	.then((result) => {
		this.medRegistry = result;
	})
	let factory = await this.businessNetworkDefinition.getFactory();
	med = factory.newResource('org.acme.hospital', 'Medication', 'myPills');
	med.description = "Mercyful";
	return await this.medRegistry.add(med)
}
const moreLive = async (doc, patnt, evtt, med) => {
	await this.bizNetworkConnection.getTransactionRegistry("org.acme.hospital.addMeLive")
	.then((transactions) => {
		  let resource = this.serializer.fromJSON({
			  "$class": "org.acme.hospital.addMeLive",
			  "mydoctor": doc,
			  "mypatient": patnt,
			  "myprivledge": evtt,
			  "mymedication": med
			});
			this.bizNetworkConnection.submitTransaction(resource)
			.then((response) => {
				console.log('Event fired: '+ response);
				io.sockets.emit('stream', {'title': "SUCCESS"});
				// console.log(myContractInstance.helperEvent(doc, patnt,{from:patnt}));
			})
			.catch((errr) => {
				console.error(' not buxzzz: ', errr)
			});
	})
	.catch((error) => {
		console.error('buxzzz: ', error)
	});
}
const writeData = async(doctor, patient, med) => {
	var now = new Date();
	await this.bizNetworkConnection.getTransactionRegistry("org.acme.hospital.giveMedication")
	.then((transactions) => {
		let resource = this.serializer.fromJSON({
			"$class": "org.acme.hospital.giveMedication",
			"mydoctor": doctor,
			"mymedication": med,
			"mypatient": patient,
			"when": now
		});
		return this.bizNetworkConnection.submitTransaction(resource);
	})
	.catch((error) => {
		console.log('mehh: it will work: ', error)
	})
	
}
const remove = async(doctor, patient) => {
	var now = new Date();
	this.bizNetworkConnection.getTransactionRegistry("org.acme.hospital.revokeAccess")
	.then((transactions) => {
		let resource = this.serializer.fromJSON({
			"$class": "org.acme.hospital.revokeAccess",
			"mydoctor": doctor,
			"mypatient": patient,
			"when": now
		});
		return this.bizNetworkConnection.submitTransaction(resource);
	})
	.catch((error) => {
		console.log('mehh: it will work: ', error)
	})
}
this.bizNetworkConnection.on('event',(evt)=>{
	console.log(' — — — — — -Event happend — — — — -');
	verify(evt.thedoctor, evt.thepatient).then(result => {
		console.log('event id: '+evt.themessage);
		if(result){
			moreLive(evt.thedoctor, evt.thepatient, evt.themessage, evt.themedication);
		}else{
			console.log('BUMMER');
		}
	})
});
init();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, User-Agent, Content-Type, Accept");
    next();
});
app.get('/', (req, res) => {
	res.send('Hello world')
});
app.get('/medication', (req,res) => {
	// insert medications
	medDemo().then(result => {
		console.log(result);
		res.send('Medication added')
	})
	.catch(error => {
		console.log('CleARLY: ', error);
		res.send('It didnt work')
	});
});
app.get('/register', (req, res) => {
    // take up the id and role and register it to Hyperledger
	// return response OK or not
	var address = req.param('address');
	var role = req.param('role');
	register(address, role).then(response => {
		console.log(response);
		res.send('REGISTERED');
	}).catch(error => { console.log(error)
	res.send("unsuccessful")
	})

});
app.get('/readData', (req, res) => {
	io.sockets.emit('stream', {'title': "intialized"});
	var docAddress = req.param('doctor');
	var patAddress = req.param('patient');
	io.sockets.emit('stream', {'title': "verfication"});
	verify(docAddress, patAddress).then( result => {
		console.log('is Allowed: ', result);
		if(result){
			this.bizNetworkConnection.getTransactionRegistry('org.acme.hospital.giveMedication')
			.then(registry => {
				return registry.getAll();
			})
			.then(response => {
					let arrayLength = response.length;
					let meRet = [];
					for(let i=0; i<arrayLength;i++){
						let pId = response[i].mypatient['$identifier'];
						if(patAddress === pId){
							var myMed = new Object();
							myMed.dId = response[i].mydoctor['$identifier'];
							myMed.dRole = response[i].mydoctor['$type'];
							myMed.mId = response[i].mymedication['$identifier'];
							myMed.when = response[i].when;
							myMed.pId = patAddress;
							meRet.push(myMed);
						}
					}
					console.log(meRet.length);
					return meRet
			})
			.then((meRet) => {
				this.bizNetworkConnection.getTransactionRegistry('org.acme.hospital.addMedication')
				.then(reg => {
					return reg.getAll();
				})
				.then(ret => {
						let arrLength = ret.length;
						for(let ii=0; ii<arrLength;ii++){
							let pId = ret[ii].mypatient['$identifier'];
							if(patAddress === pId){
								var myMed = new Object();
								myMed.dId = ret[ii].mypharmacy['$identifier'];
								myMed.dRole = ret[ii].mypharmacy['$type'];
								myMed.mId = ret[ii].mymedication['$identifier'];
								myMed.when = ret[ii].when;
								myMed.pId = patAddress;
								meRet.push(myMed);
							}
						}
					res.send(meRet)		
				})
			})
			.catch((error) => {
				console.log('mehh: it is not working: ', error);
				res.send('')
			})
		}else{
			io.sockets.emit('stream', {'title': "you are not allowed"});
			res.send('')
		}
	})

});
app.get('/writeE', (req, res) => {
	var docAddress = req.param('doctor');
	var patAddress = req.param('patient');
	var medId = req.param('medication');

	verify(docAddress, patAddress).then(result => {
		if(result){
			writeData(docAddress,patAddress,medId).then(response => {
				io.sockets.emit('stream', {'title': "You CANT"});
				res.send("CESS")
			})
			.catch(error => {
			io.sockets.emit('stream', {'title': "FAILURE"});
			res.send('FAILURE')
	
			})
		}else{
			io.sockets.emit('stream', {'title': "FAILURE"});
			res.send('FAILURE')
		}
	});
});
app.get('/writeR', (req, res) => {
	var phamAddress = req.param('pharmacy');
	var patAddress = req.param('patient');
	var medId = req.param('medication');

	var now = new Date();
	this.bizNetworkConnection.getTransactionRegistry("org.acme.hospital.addMedication")
	.then((transactions) => {
		let resource = this.serializer.fromJSON({
			"$class": "org.acme.hospital.addMedication",
			"mypharmacy": phamAddress,
			"mymedication": medId,
			"mypatient": patAddress,
			"when": now
		});
		return this.bizNetworkConnection.submitTransaction(resource);
	})
	.then((respp) => {
		res.send(respp)
	})
	.catch((error) => {
		console.log('mehh: it will work: ', error)
		res.send('FAILER')
	})
});
app.get('/permissions', (req, res) => {
	var userId = req.param('userId');
	var role = req.param('role');
	this.bizNetworkConnection.getParticipantRegistry(`org.acme.hospital.${role}`)
			.then(registry => {
				return registry.get(userId);
			})
			.then(response => {
				let meRet = [];
				if(role === 'Patient'){ meRet = response.myReaders}
				else { meRet = response.myClients }
				console.log(meRet)
				res.send(meRet)
			})
			.catch((error) => {
				console.log('mehh: it is not working: ', error);
				res.send('')
			})
});
app.get('/revoke', (req, res) => {
	var patient = req.param('patient');
	var doctor = req.param('doctor');
    remove(doctor, patient).then(response => {
		res.send(response)
	})
	.catch(error => {
		res.send(error)
	})
});
app.get('/verify/', (req, res, next) => {
	var docAddress = req.param('doctorAddress');
	var patAddress = req.param('patientAddress');
	console.log(docAddress, ' and ', patAddress);
    console.log('REPLY:', myContractInstance.didIGaveRights(docAddress, {from: patAddress, gas:3000000}));
    res.send(myContractInstance.didIGaveRights(docAddress, {from: patAddress, gas:3000000}))
});