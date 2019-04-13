composer participant add -c  admin@healthcare-network -d '{"$class": "org1.healthcare.biznet.Doctor","DoctorId": "100","Name": "","Age": "","Address": "","phoneNumber": "","employedBy":"resource:org1.healthcare.biznet.Hospital#0322"}'
./genid.sh "org1.healthcare.biznet.Doctor#100" d100
composer participant add -c  admin@healthcare-network -d '{"$class": "org1.healthcare.biznet.Doctor","DoctorId": "101","Name": "","Age": "","Address": "","phoneNumber": "","employedBy":"resource:org1.healthcare.biznet.Hospital#0322"}'
./genid.sh "org1.healthcare.biznet.Doctor#101" d101
composer participant add -c  admin@healthcare-network -d '{"$class": "org1.healthcare.biznet.Doctor","DoctorId": "102","Name": "","Age": "","Address": "","phoneNumber": "","employedBy":"resource:org1.healthcare.biznet.Hospital#0322"}'
./genid.sh "org1.healthcare.biznet.Doctor#102" d102
