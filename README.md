# yurS

yurS is an ASP.Net and Angular library for dealing with proper capitalization and word pluralization, no wait... I mean, it is a library for dealing with lonliness aka a dating app.

## Installation

To get the API running create an appsettings.json file in the API root folder:
```bash
cd API
touch appsettings.json
```

Cut and paste this in to the file:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

Now we need to create the database and run the migrations:
```bash
dotnet ef database update
```
That should produce a database file named yurs.db in the API root folder.


To get angular running you will need to create a folder named ssl and copy your certificate files into it.

```bash
cd client
mkdir ssl
cd ssl
```

Cut and paste the below into a new file named openssl-custom.cnf :
```
[req]
default_bits = 2048
prompt = no
default_md = sha256
x509_extensions = v3_req
distinguished_name = dn

[dn]
C = US
ST = KS
L = Olathe
O = IT
OU = IT Department
emailAddress = webmaster@example.com
CN = localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.localhost
DNS.2 = localhost
```

Now to generate the certificate. We do that by making a sh script.
```bash
touch generate.sh
```

Cut and paste the code below in the new script file:
```bash
#!bin/bash

openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout server.key \
    -new \
    -out server.crt \
    -config ./openssl-custom.cnf \
    -sha256 \
    -days 7300
```

Run the script to generate the certificate files:
```bash
chmod +x generate.sh
./generate.sh
```

You can safely delete generate.sh and openssl-custom.cnf leaving the certificate files:
```bash
rm -rf generate.sh openssl-custom.cnf
```

Return back the the client directory and run:
```
cd..
npm install
```

## Usage
Use dotnet run to start the API:
```bash
cd API
dotnet run
```
Make sure that the API is running on localhost:5001, this is where the client will look.

Use ng serve to start the client:
```bash
cd client
ng serve
```
Make sure that the client is running on https://localhost:4200 as this is where the API expects to receive requests from.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)