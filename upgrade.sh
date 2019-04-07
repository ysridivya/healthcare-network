[ -z "$1" ] && { echo "Usage: ./upgrade.sh versionNumber "; exit -1; }
composer archive create --sourceType dir --sourceName . -a ./dist/healthcare-network@$1.bna
composer network install -a ./dist/healthcare-network@$1.bna --card PeerAdmin@hlfv1
composer network upgrade --card PeerAdmin@hlfv1 --networkName healthcare-network --networkVersion $1