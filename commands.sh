composer archive create --sourceType dir --sourceName . # To generate BNA file in the current directory 
composer network install --archiveFile healthcare-network@0.0.1.bna --card PeerAdmin@hlfv1 # To install and deploy the network to our local Fabric runtime using the PeerAdmin user
composer network start --networkName healthcare-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file healthcare-admin.card # To deploy the network to our local Fabric runtime using the PeerAdmin user
composer card import --file healthcare-admin.card # To import the cards generated earlier 
composer network ping --card admin@healthcare-network # To test whether network is running or not.
