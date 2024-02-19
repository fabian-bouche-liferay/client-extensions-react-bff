# BFF for Liferay React client extension

## Configure service access policy to create a new OAuth 2.0 scope

In Liferay *Control Panel*, go to *Service Access Policy* and hit the +
button to create a new Service Accee Policy.

For the name: **OAUTH2_httpbin.read**

The **OAUTH2_** prefix is used to register new scopes in Liferay.

Check **Enabled**

For the title: Make requests against https://httpbin.org/get

Hit Save.

## Configure Kong as a backend for https://httpbin.org/get

`https://httpbin.org/get` responds with the headers you have sent in
your request. This is going to be useful to see what Authorization
token is sent to the backend service.

Note: if you are worried about your OAuth 2.0 tokens, build and run
httpbin locally: https://httpbin.org

Outside of the Liferay workspace, create a `kong.yml` file:

```
 _format_version: "3.0"
 _transform: true

 services:
 - host: httpbin.org
   name: example_service
   port: 80
   protocol: http
   routes:
   - name: example_route
     paths:
     - /mock
     strip_path: true
```

In the directory where you have created the file, execute this command:

```
sudo docker network create kong-net
```

And this command to start kong:

```
sudo docker run -d --name kong-dbless  --network=kong-net\
  -v "$(pwd):/kong/declarative/"  -e "KONG_DATABASE=off"\
  -e "KONG_DECLARATIVE_CONFIG=/kong/declarative/kong.yml"\
  -e "KONG_PROXY_ACCESS_LOG=/dev/stdout"\
  -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout"\
  -e "KONG_PROXY_ERROR_LOG=/dev/stderr"\
  -e "KONG_ADMIN_ERROR_LOG=/dev/stderr"\
  -e "KONG_ADMIN_LISTEN=0.0.0.0:8001"\
  -e "KONG_ADMIN_GUI_URL=http://localhost:8002"\
  -p 8000:8000  -p 8443:8443  -p 8001:8001  -p 8444:8444\
  -p 8002:8002  -p 8445:8445  -p 8003:8003  -p 8004:8004\
  kong/kong-gateway:3.6.0.0
```

You should be able to get a response when calling:

```
curl http://localhost:8000/mock/get
```

At this step, Kong is forwarding the inbound query to httpbin without changing it.

## Put the Kong-React Client extension on a page

You will see that the kong-httpbin client extension received
the JWT Token with the `liferay-json-web-services.httpbin.read` scope
defined in the service access policy and registered in 
https://github.com/fabian-bouche-liferay/client-extensions-react-bff/blob/master/client-extensions/kong-httpbin/client-extension.yaml#L6

## Configure Kong to check the JWT token

The next step is to setup Kong to validate the JWT token generated
by Liferay and that the scope is valid to make a call to the
backend service:

https://konghq.com/blog/engineering/jwt-kong-gateway
