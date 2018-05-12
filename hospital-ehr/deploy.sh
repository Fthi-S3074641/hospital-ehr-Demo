#bash deploy.sh
#get the Ip of the host
#ip route get 8.8.8.8 | awk '{print $NF; exit}'
#inform Docker about the host IP
#docker run -i -t -e DOCKER_HOST=192.168.42.49 ubuntu /bin/bash
#Do the above two together
#docker run -i -t -e DOCKER_HOST=$(ip route get 8.8.8.8 | awk '{print $NF; exit}') ubuntu /bin/bash


composer archive create -t dir -n .

composer network install -c PeerAdmin@hlfv1 -a hospital-ehr@0.3.0.bna 

composer network start  -c PeerAdmin@hlfv1 -n hospital-ehr -V 0.3.0 -A admin -S adminpw -f networkadmin.card

composer card import -f networkadmin.card

composer network ping -c admin@hospital-ehr

# composer-rest-server