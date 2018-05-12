#bash deploy.sh
#ip route get 8.8.8.8 | awk '{print $NF; exit}'
#docker run -i -t -e DOCKER_HOST=192.168.42.49 ubuntu /bin/bash
#docker run -i -t -e DOCKER_HOST=$(ip route get 8.8.8.8 | awk '{print $NF; exit}') ubuntu /bin/bash
composer archive create -t dir -n .

composer network install -c PeerAdmin@hlfv1 -a hospital-ehr@0.3.0.bna 

composer network upgrade  -c PeerAdmin@hlfv1 -n hospital-ehr -V 0.3.0

composer-rest-server -c admin@hospital-ehr -n never -w true
