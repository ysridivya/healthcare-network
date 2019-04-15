if [ "$#" -ne 2 ]; then
    echo "Usage: ./install_card.sh resource_name user_id "; exit -1;
fi
composer identity issue -c admin@healthcare-network -u $2 -a $1

composer card import --file $2@healthcare-network.card

 