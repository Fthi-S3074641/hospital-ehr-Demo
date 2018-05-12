pragma solidity ^0.4.17;

contract Hospital {
    
    struct Entity {
        string Role;
        uint Balance;
        uint registered;
        mapping (address => uint) myReaders;
        mapping (address => uint) icanRead;
    }
    
    mapping (address => Entity) private allParticipants;
    
    event randomEvent(address doctor, address patient);
    
    function entityRegister(string user) public{
        // check if a user has been registered
        require(allParticipants[msg.sender].registered == 0);
        allParticipants[msg.sender].registered = 1;
        allParticipants[msg.sender].Role = user;
        allParticipants[msg.sender].Balance = 10;
        allParticipants[msg.sender].myReaders[msg.sender] = 1;
        allParticipants[msg.sender].icanRead[msg.sender] = 1;
        //an event maybe RegisterParticipant(msg.sender, user);
    }
    
    // modifier avoidDuplicate {
    //     // require(user=='Doctor' || user=='Patient' || user=='Pharmacy' || user=='Insurance');
    //     require(allParticipants[msg.sender].myReaders[msg.sender] == 0);
    //     _;
    // }
    
    function checkRegistration() public view returns(uint) {
        return allParticipants[msg.sender].registered;
    }

    function grantAccess(address doctor) public {
        allParticipants[msg.sender].myReaders[doctor] = 1;
        allParticipants[doctor].icanRead[msg.sender] = 1;
    }
    
    function revokeAccess(address user) public{
        allParticipants[msg.sender].myReaders[user] = 2;
        allParticipants[user].icanRead[msg.sender] = 2;
    }
    

    function sendPayment(address receiver, uint amount) public {
        require(allParticipants[msg.sender].Balance >= amount);
        allParticipants[msg.sender].Balance -= amount;
        allParticipants[receiver].Balance += amount;
    }
    
    // function requestPayment(address from, uint amount) public {
    //     // we could use event to fire a payment request
    //     // PaymentRequested(from, msg.sender, amount);
    // }
    
    function getBalance() public view returns(uint){
        return allParticipants[msg.sender].Balance;
    }
    
    function getRole() public view returns(string){
        return allParticipants[msg.sender].Role;
    }
    
    function didIGaveRights(address x) public view returns(bool){
        if(allParticipants[msg.sender].myReaders[x] == 1){
            return true;
        }else {
            return false;
        }
    }

    function doIHaveRights(address x) public view returns(bool){
        if(allParticipants[msg.sender].icanRead[x] == 1){
            return true;
        }else {
            return false;
        }
    }

    function helperEvent(address doctor, address patient) public {
        randomEvent(doctor, patient);
        return;
    }
}
