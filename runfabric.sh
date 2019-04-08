[ -z "$1" ] && { echo "Usage: ./upgrade.sh versionNumber "; exit -1; }
composer archive create --sourceType dir --sourceName .
composer network install --archiveFile healthcare-network@$1.bna --card PeerAdmin@hlfv1
composer network start --networkName healthcare-network --networkVersion $1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file healthcare-admin.card
composer card import --file healthcare-admin.card # To import the cards generated earlier 
composer network ping --card admin@healthcare-network