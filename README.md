# yurS

yurS is an example dating app written in ASP.Net and Angular.

![yurS Screenshot](https://github.com/KevinAsbury/yurS/blob/development/yurS_SS.png?raw=true)

## Installation

### API
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
    "CloudinarySettings": {
        "CloudName": "YOUR CLOUDINARY.COM NAME",
        "ApiKey": "YOUR CLOUDINARY.COM KEY",
        "ApiSecret": "YOUR CLOUDINARY.COM SECRET"
    },
    "AllowedHosts": "*"
  }
```
If you haven't done so then head to [Cloudinary](https://cloudinary.com) and set up a free-tier account (no credit card required). After verifying your email address and logging in you will see your CloudName, ApiKey, and ApiSecret on the login panel. Cut and paste this information into the appsettings.json and save the file. The app uses Cloudinary to store uploaded images.

Running the API requires .Net Core 5.0 installed along with the Entity Framework.

Visit [How to Install .Net](https://docs.microsoft.com/en-us/dotnet/core/install/) and follow the appropriate instructions. You can install the Runtime instead of the SDK if you only plan on running the app. 

Check your dotnet version:
```bash
dotnet --version
```

Install the Entity Framework:
```bash
dotnet new tool-manifest
dotnet tool install dotnet-ef
```

You should now be greated by the .Net Ef unicorn when you type:
```bash
dotnet ef
```
<!--
Now we are ready to create the database, run:
```bash
dotnet ef database update
```
-->

If everything succeeded then you will have a yurs.db file located in the API directory.

---
### Angular Client
First Angular needs SSL certificates. You will need to create a folder named ssl:

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

Save the file. Now to generate the certificate. We do that by making a sh script.
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

You can safely delete generate.sh and openssl-custom.cnf:
```bash
rm -rf generate.sh openssl-custom.cnf
```

Now you should have all your SSL files generated. Return back the the client directory and run:
```
cd ..
npm install
```

Next we need to install Angular:
```bash
npm install -g @angular/cli
```

---
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