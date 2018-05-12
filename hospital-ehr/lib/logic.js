/**
   * To add doctors
   * @param {org.acme.hospital.addMeLive} addLive the doctor adding transaction
   * @transaction
  */
 async function addMeLive(addLive) {
  var factory = getFactory();
  var nameSpace = 'org.acme.hospital';
 
  var doctor = addLive.mydoctor;
  var patient = addLive.mypatient;
  var privledge = addLive.myprivledge;
  var medication = addLive.mymedication;
   var tranID = privledge.eventId;

  if(doctor.myClients) { doctor.myClients.push(patient.personId);  }
  else { doctor.myClients = [patient.personId];  }

  if(patient.myReaders) { patient.myReaders.push(doctor.personId);  }
         else { patient.myReaders = [doctor.personId];  }

  if(patient.myMedications) { patient.myMedications.push(medication); }
  else { patient.myMedications = [medication]; }


    return getParticipantRegistry(nameSpace + '.Doctor')
      .then(function (updateRegistry) {
          return updateRegistry.update(doctor);
      })
   .then(function (){
        return getParticipantRegistry(nameSpace + '.Patient')
            .then(function (updateRegistry) {
                return updateRegistry.update(patient);
            })
      })
      .then(function () {
        return getAssetRegistry(nameSpace + '.Privledge')
          .then(function (privledgeRegistry) {
            return privledgeRegistry.remove(privledge)
          })
      })
    .catch(function (error) {
      throw 'bummer' + error;
    });
}


/**
  * to prescribe a medication
  * @param {org.acme.hospital.giveMedication} giveMed prescription instance
  * @transaction
  */
 async function giveMedication(giveMed) {
  var factory = getFactory();
  var nameSpace = 'org.acme.hospital';
  
   var doctor = giveMed.mydoctor;
  var patient = giveMed.mypatient;
  var medication = giveMed.mymedication;
   let arrLength = 0;
   if(patient.myReaders){  arrLength = patient.myReaders.length; } 

   let found = 0;
   for(let i=0; i<arrLength; i++){
   	if(patient.myReaders[i] === doctor.personId){ found = 1; }
   }
   if(found){
      if(patient.myMedications) { patient.myMedications.push(medication);  }
  			else { patient.myMedications = [medication];  }
      return getParticipantRegistry(nameSpace + '.Patient').then(function(patientRegistry) {
    			return patientRegistry.update(patient); }); 
   }
   else {      
     var privledge = factory.newResource(nameSpace, 'Privledge', giveMed.transactionId);
     return getAssetRegistry(nameSpace + '.Privledge').then(function(medicationRegistry) {
           var basicEvent = factory.newEvent(nameSpace, 'addMeLiveEvent');
           basicEvent.thedoctor=doctor.personId;
           basicEvent.thepatient=patient.personId;
           basicEvent.themessage=giveMed.transactionId;
           basicEvent.themedication = medication.medicineId;
           emit(basicEvent);
      return medicationRegistry.addAll([privledge])
     
     });

   }

}
 
  /**
    * To revoke access
    * @param {org.acme.hospital.revokeAccess} rmAccess a doctor from the list
    * @transaction
    */
 async function revokeAccess(rmAccess) {
        var factory = getFactory();
        var nameSpace = 'org.acme.hospital';
      
        var doctor = rmAccess.mydoctor;
        var patient = rmAccess.mypatient;
      
      if(doctor.myClients) { 
        let id = doctor.myClients.indexOf(patient.personId);
        	doctor.myClients.splice(id,1);               
        }
      
      let doctorRegistry = await getParticipantRegistry(nameSpace + '.Doctor');
      await doctorRegistry.update(doctor);
        
          if(patient.myReaders) { 
            let ip = patient.myReaders.indexOf(doctor.personId);
            patient.myReaders.splice(ip,1);  
          }
        
      let patientRegistry = await getParticipantRegistry(nameSpace + '.Patient');
      await patientRegistry.update(patient);
  }
                                                      
    /**
   * to add a medication
   * @param {org.acme.hospital.addMedication} addMed prescription instance
   * @transaction
   */
  async function addMedication(addMed) {
    var factory = getFactory();
    var nameSpace = 'org.acme.hospital';
    var URL = 'http://192.168.42.157:4000';
	var Reply = false;
    var patient = addMed.mypatient;
    var medication = addMed.mymedication;
    var pharmacy = addMed.mypharmacy;
    
    let arrLength = 0;
    if(patient.myReaders){  arrLength = patient.myReaders.length; } 
    let found = 0;
    for(let i=0; i<arrLength; i++){
       if(patient.myReaders[i] === pharmacy.personId){ found = 1; }
    }

    if(found){
      if(patient.myMedications) { patient.myMedications.push(medication);  }
      else { patient.myMedications = [medication];  }

      return getParticipantRegistry(nameSpace + '.Patient').then(function(patientRegistry) {
                return patientRegistry.update(patient); });
    }
    else{
      await request.get({uri: `${URL}/verify?doctorAddress=${pharmacy.personId}&patientAddress=${patient.personId}`, headers: {
        'User-Agent': 'Request-Promise' }, json: true})
        .then(function(result) {
            if(result){
              Reply = true;
            }
        else{
          Reply = false;
        }
        });
    } 
    
    if(Reply){
      if(pharmacy.myClients) { pharmacy.myClients.push(patient.personId);  }
      else { pharmacy.myClients = [patient.personId];  }
              
      let pharmacyRegistry = await getParticipantRegistry(nameSpace + '.Pharmacy');
      await pharmacyRegistry.update(pharmacy);

      if(patient.myMedications) { patient.myMedications.push(medication);  }
      else { patient.myMedications = [medication];  }
     if(patient.myReaders) { patient.myReaders.push(pharmacy.personId);  }
      else { patient.myReaders = [pharmacy.personId];  }

      let pRegistry = await getParticipantRegistry(nameSpace + '.Patient');
      await pRegistry.update(patient);              

    }
}   