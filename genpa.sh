# composer card delete  -c d1@healthcare-network
# composer card delete  -c d2@healthcare-network
# composer card delete  -c d3@healthcare-network
# composer card delete  -c p1@healthcare-network
# composer card delete  -c p2@healthcare-network
# composer card delete  -c p3@healthcare-network

# rm d1*
# rm d2*
# rm d3*
# rm p1*
# rm p2*
# rm p3*

composer participant add -c  admin@healthcare-network -d '{"$class": "org1.healthcare.biznet.Doctor","DoctorId": "1","Name": "","Age": "","Address": "","phoneNumber": "","employedBy":"resource:org1.healthcare.biznet.Hospital#0322"}'
./genid.sh "org1.healthcare.biznet.Doctor#1" d1
composer participant add -c  admin@healthcare-network -d '{"$class": "org1.healthcare.biznet.Doctor","DoctorId": "2","Name": "","Age": "","Address": "","phoneNumber": "","employedBy":"resource:org1.healthcare.biznet.Hospital#0322"}'
./genid.sh "org1.healthcare.biznet.Doctor#2" d2
composer participant add -c  admin@healthcare-network -d '{"$class": "org1.healthcare.biznet.Doctor","DoctorId": "3","Name": "","Age": "","Address": "","phoneNumber": "","employedBy":"resource:org1.healthcare.biznet.Hospital#0322"}'
./genid.sh "org1.healthcare.biznet.Doctor#3" d3
composer participant add -c  admin@healthcare-network -d '{"$class": "org1.healthcare.biznet.Patient","PatientId": "1","Name": "","Age": "","Address": "","phoneNumber": ""}'
./genid.sh "org1.healthcare.biznet.Patient#1" p1
composer participant add -c  admin@healthcare-network -d '{"$class": "org1.healthcare.biznet.Patient","PatientId": "2","Name": "","Age": "","Address": "","phoneNumber": ""}'
./genid.sh "org1.healthcare.biznet.Patient#2" p2
composer participant add -c  admin@healthcare-network -d '{"$class": "org1.healthcare.biznet.Patient","PatientId": "3","Name": "","Age": "","Address": "","phoneNumber": ""}'
./genid.sh "org1.healthcare.biznet.Patient#3" p3
