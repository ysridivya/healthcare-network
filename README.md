# healthcare-network

Secure health record sharing application built on hyperledger framework.
## Start hyperledger:
#Change Directory to fabric-dev-servers, then,
1. export FABRIC_VERSION=hlfv12 #Specify version of the fabric
2. ./downloadFabric.sh # To download and extract the tools required to install Hyperledger Fabric. One time only.
3. ./startFabric.sh  # To start fabric runtime.
4. ./createPeerAdminCard.sh # To genefsdfrate cards analogous to real life business cards, so as to join the network

## Starting healthcare network:
1. composer archive create --sourceType dir --sourceName . # To generate BNA file in the current directory 
2. composer network install --archiveFile healthcare-network@0.0.1.bna --card PeerAdmin@hlfv1  # To install and deploy the network to our local Fabric runtime using the PeerAdmin user
3. composer network start --networkName healthcare-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file healthcare-admin.card # To deploy the network to our local Fabric runtime using the PeerAdmin user
4. composer card import --file healthcare-admin.card   # To import the cards generated earlier
5. composer network ping --card admin@healthcare-network # To test whether network is running or not.

## Starting the rest server(End point used for registering the users)
composer-rest-server -c admin@healthcare-network -p 3001

## Starting the authenticated Rest server
Go to http://www.github.com/ -> settings -> Developer settings -> New OAuth App 
Fill the following details
Application name: HealthCareNetwork
Homepage URL: http://localhost:3000/
Authorization callback URL: http://localhost:3000/auth/github/callback

Save the ClientId and ClientSecret

Go to terminal  and run the following commmands. 
Remember to replace the clientId and ClientSecret obtained from the github
```

export COMPOSER_PROVIDERS='{
  "github": {
    "provider": "github",
    "module": "passport-github",
    "clientID": "replace_client_id",
    "clientSecret": "replace_client_secret",
    "authPath": "/auth/github",
    "callbackURL":  "/auth/github/callback",
    "successRedirect": "http://localhost:4200?loggedIn=true/",
    "failureRedirect": "/"
  }
}'
```

composer-rest-server -c admin@healthcare-network -m true


## Starting the front end application server. 
1. cd patient_secure_health_care_app/
2. npm install
3. npm start
The front end application is running on the link http://localhost:4200

If multiple participants are used then change the default user from the 
