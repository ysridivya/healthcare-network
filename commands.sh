[ -z "$1" ] && { echo "Usage: ./upgrade.sh versionNumber "; exit -1; }
composer card delete -c admin@healthcare-network # To remove previous card
mkdir dist # makes dist directory if not present
composer archive create --sourceType dir --sourceName . -a ./dist/healthcare-network@$1.bna # To generate BNA file in the current directory 
composer network install --archiveFile ./dist/healthcare-network@$1.bna --card PeerAdmin@hlfv1 # To install and deploy the network to our local Fabric runtime using the PeerAdmin user
composer network start --networkName healthcare-network --networkVersion $1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file healthcare-admin.card # To deploy the network to our local Fabric runtime using the PeerAdmin user
composer card import --file healthcare-admin.card # To import the cards generated earlier 
composer network ping --card admin@healthcare-network # To test whether network is running or not.
