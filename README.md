# healthcare-network

Secure file sharing solution for healthcare

## Start hyperledger:
#Change Directory to fabric-dev-servers, then,
1. export FABRIC_VERSION=hlfv12 #To specify version we want!
2. ./downloadFabric.sh # To download and extract the tools required to install Hyperledger Fabric. One time only.
3. ./startFabric.sh  # To start fabric runtime.
4. ./createPeerAdminCard.sh # To generate cards analogous to real life business cards, so as to join the network

## Starting healthcare network:
1. composer archive create --sourceType dir --sourceName . # To generate BNA file in the current directory 
2. composer network install --archiveFile healthcare-network@0.0.1.bna --card PeerAdmin@hlfv1 # To install and deploy the network to our local Fabric runtime using the PeerAdmin user
3. composer network start --networkName healthcare-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file healthcare-admin.card # To deploy the network to our local Fabric runtime using the PeerAdmin user
4. composer card import --file healthcare-admin.card # To import the cards generated earlier 
5. composer network ping --card admin@healthcare-network # To test whether network is running or not.
6.. composer-playground
