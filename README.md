# healthcare-network

Secure file sharing solution for healthcare

## Start hyperledger:
1. Go to fabric-tools folder
2. ./startFabric.sh
3. ./createPeerAdminCard.sh

## Starting healthcare network:
1. Change to healthcare project folder
2. composer archive create --sourceType dir --sourceName .
3. composer network install --archiveFile cards-trading-network@0.0.1.bna --card PeerAdmin@hlfv1
4. composer network start --networkName cards-trading-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file cards-trading-admin.card
5. composer card import --file cards-trading-admin.card
6. composer network ping --card admin@cards-trading-network
This just checks if network is working properly
7. composer-playground
