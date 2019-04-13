composer card delete  -c admin@healthcare-network

if [[ $1 = 1 ]];
then
	cd ~/fabric-dev-servers
	./stopFabric.sh && ./teardownFabric.sh  && ./startFabric.sh 
	cd /media/sridivyay/Workspace/Desktop/CS731Project/healthcare-network/
	echo ./runfabric.sh $2
else
	echo ./upgrade.sh $2
fi
./genpa.sh