<!-- Generator: Widdershins v4.0.1 -->

<h1 id="hollyfilms-api">HollyFilms API v0.1</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

The HollyFilms API description

Base URLs:

# Authentication

* API Key (cookie)
    - Parameter Name: **connect.sid**, in: cookie. 

<h1 id="hollyfilms-api-app">App</h1>

## AppController_getHealth

<a id="opIdAppController_getHealth"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /health

```

```http
GET /health HTTP/1.1

```

```javascript

fetch('/health',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/health',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/health')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/health', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/health");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/health", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /health`

*[Public] Check if the server is alive*

<h3 id="appcontroller_gethealth-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="hollyfilms-api-users">Users</h1>

## UsersController_getUser

<a id="opIdUsersController_getUser"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /users/limited/{id}

```

```http
GET /users/limited/{id} HTTP/1.1

```

```javascript

fetch('/users/limited/{id}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/users/limited/{id}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/users/limited/{id}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/users/limited/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/users/limited/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/users/limited/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /users/limited/{id}`

*[User] get user*

<h3 id="userscontroller_getuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="userscontroller_getuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersController_updateMe

<a id="opIdUsersController_updateMe"></a>

> Code samples

```shell
# You can also use wget
curl -X PUT /users/me \
  -H 'Content-Type: application/json'

```

```http
PUT /users/me HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "newPassword": "123456",
  "newPasswordConfirm": "123456"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/users/me',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.put '/users/me',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('/users/me', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','/users/me', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/users/me");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "/users/me", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /users/me`

*[User] Update self*

> Body parameter

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "newPassword": "123456",
  "newPasswordConfirm": "123456"
}
```

<h3 id="userscontroller_updateme-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[UpdateMeDto](#schemaupdatemedto)|true|none|

<h3 id="userscontroller_updateme-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="hollyfilms-api-users-admin">Users Admin</h1>

## UsersAdminController_getUsers

<a id="opIdUsersAdminController_getUsers"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /users/admin

```

```http
GET /users/admin HTTP/1.1

```

```javascript

fetch('/users/admin',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/users/admin',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/users/admin')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/users/admin', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/users/admin");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/users/admin", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /users/admin`

*[Admin] Get all users*

<h3 id="usersadmincontroller_getusers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersAdminController_createUser

<a id="opIdUsersAdminController_createUser"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /users/admin \
  -H 'Content-Type: application/json'

```

```http
POST /users/admin HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "email": "exemple.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "role": "super_admin",
  "password": "123456",
  "roles": [
    "user",
    "admin"
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/users/admin',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.post '/users/admin',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('/users/admin', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/users/admin', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/users/admin");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/users/admin", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /users/admin`

*[Admin] Create new user*

> Body parameter

```json
{
  "email": "exemple.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "role": "super_admin",
  "password": "123456",
  "roles": [
    "user",
    "admin"
  ]
}
```

<h3 id="usersadmincontroller_createuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateUserDto](#schemacreateuserdto)|true|none|

<h3 id="usersadmincontroller_createuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersAdminController_getUser

<a id="opIdUsersAdminController_getUser"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /users/admin/{id}

```

```http
GET /users/admin/{id} HTTP/1.1

```

```javascript

fetch('/users/admin/{id}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/users/admin/{id}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/users/admin/{id}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/users/admin/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/users/admin/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/users/admin/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /users/admin/{id}`

*[Admin] Get specific user*

<h3 id="usersadmincontroller_getuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="usersadmincontroller_getuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersAdminController_updateUser

<a id="opIdUsersAdminController_updateUser"></a>

> Code samples

```shell
# You can also use wget
curl -X PUT /users/admin/{id} \
  -H 'Content-Type: application/json'

```

```http
PUT /users/admin/{id} HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "email": "exemple.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "password": "123456",
  "roles": [
    "user",
    "admin"
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/users/admin/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.put '/users/admin/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.put('/users/admin/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','/users/admin/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/users/admin/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "/users/admin/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /users/admin/{id}`

*[Admin] Update specific user*

> Body parameter

```json
{
  "email": "exemple.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "password": "123456",
  "roles": [
    "user",
    "admin"
  ]
}
```

<h3 id="usersadmincontroller_updateuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateUserDto](#schemaupdateuserdto)|true|none|

<h3 id="usersadmincontroller_updateuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersAdminController_deleteUser

<a id="opIdUsersAdminController_deleteUser"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /users/admin/{id}

```

```http
DELETE /users/admin/{id} HTTP/1.1

```

```javascript

fetch('/users/admin/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete '/users/admin/{id}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('/users/admin/{id}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/users/admin/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/users/admin/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/users/admin/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /users/admin/{id}`

*[Admin] Delete specific user*

<h3 id="usersadmincontroller_deleteuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="usersadmincontroller_deleteuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="hollyfilms-api-auth">Auth</h1>

## AuthController_login

<a id="opIdAuthController_login"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth/login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /auth/login HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "email": "exemple.test@gmail.com",
  "password": "123456"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/auth/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/auth/login',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/auth/login', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth/login', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth/login");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth/login", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/login`

*[Public] Login using credentials*

> Body parameter

```json
{
  "email": "exemple.test@gmail.com",
  "password": "123456"
}
```

<h3 id="authcontroller_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[LoginAuthDto](#schemaloginauthdto)|true|Login data|

> Example responses

> 200 Response

```json
{
  "_id": "5e9f8f8f8f8f8f8f8f8f8f8f8",
  "email": "exemplle.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "roles": [
    "user",
    "admin"
  ],
  "isAdmin": "true",
  "playedMedias": [
    "string"
  ]
}
```

<h3 id="authcontroller_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Login successful|[CurrentUser](#schemacurrentuser)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Login failed - Bad credentials|None|

### Response Headers

|Status|Header|Type|Format|Description|
|---|---|---|---|---|
|200|Set-Cookie|undefined||Authorization cookie|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_logout

<a id="opIdAuthController_logout"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /auth/logout

```

```http
GET /auth/logout HTTP/1.1

```

```javascript

fetch('/auth/logout',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/auth/logout',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/auth/logout')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/auth/logout', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth/logout");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/auth/logout", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /auth/logout`

*[Public] Reset current cookie*

<h3 id="authcontroller_logout-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_register

<a id="opIdAuthController_register"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth/register \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /auth/register HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "email": "exemple.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "password": "123456",
  "passwordConfirm": "123456"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/auth/register',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/auth/register',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/auth/register', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth/register', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth/register");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth/register", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/register`

*[Public] Register standalone/organization*

> Body parameter

```json
{
  "email": "exemple.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "password": "123456",
  "passwordConfirm": "123456"
}
```

<h3 id="authcontroller_register-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[RegisterAuthDto](#schemaregisterauthdto)|true|none|

> Example responses

> 201 Response

```json
{
  "_id": "5e9f8f8f8f8f8f8f8f8f8f8f8",
  "email": "exemplle.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "roles": [
    "user",
    "admin"
  ],
  "isAdmin": "true",
  "playedMedias": [
    "string"
  ]
}
```

<h3 id="authcontroller_register-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Register successful|[CurrentUser](#schemacurrentuser)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Register failed - Email already exists|None|

### Response Headers

|Status|Header|Type|Format|Description|
|---|---|---|---|---|
|201|Set-Cookie|undefined||Authorization cookie|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_regenerateTokens

<a id="opIdAuthController_regenerateTokens"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /auth/refresh-tokens

```

```http
GET /auth/refresh-tokens HTTP/1.1

```

```javascript

fetch('/auth/refresh-tokens',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/auth/refresh-tokens',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/auth/refresh-tokens')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/auth/refresh-tokens', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth/refresh-tokens");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/auth/refresh-tokens", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /auth/refresh-tokens`

*[User] Get a new jwt using refresh token*

<h3 id="authcontroller_regeneratetokens-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Refresh token successful|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Refresh token failed - Expired token or not logged in|None|

### Response Headers

|Status|Header|Type|Format|Description|
|---|---|---|---|---|
|200|Set-Cookie|undefined||Authorization cookie|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
cookie
</aside>

## AuthController_getProfile

<a id="opIdAuthController_getProfile"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /auth/me \
  -H 'Accept: application/json'

```

```http
GET /auth/me HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/auth/me',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/auth/me',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/auth/me', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/auth/me', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth/me");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/auth/me", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /auth/me`

*[User] Get the currently logged user*

> Example responses

> 200 Response

```json
{
  "_id": "5e9f8f8f8f8f8f8f8f8f8f8f8",
  "email": "exemplle.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "roles": [
    "user",
    "admin"
  ],
  "isAdmin": "true",
  "playedMedias": [
    "string"
  ]
}
```

<h3 id="authcontroller_getprofile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Current logged user|[CurrentUser](#schemacurrentuser)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Not logged in|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
cookie
</aside>

## AuthController_resetPassword

<a id="opIdAuthController_resetPassword"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth/reset-password \
  -H 'Content-Type: application/json'

```

```http
POST /auth/reset-password HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "email": "exemple.test@gmail.com"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/reset-password',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.post '/auth/reset-password',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('/auth/reset-password', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth/reset-password', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth/reset-password");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth/reset-password", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/reset-password`

*[Public] Trigger reset-password procedure*

> Body parameter

```json
{
  "email": "exemple.test@gmail.com"
}
```

<h3 id="authcontroller_resetpassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ResetPasswordDto](#schemaresetpassworddto)|true|none|

<h3 id="authcontroller_resetpassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_changePassword

<a id="opIdAuthController_changePassword"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth/change-password \
  -H 'Content-Type: application/json'

```

```http
POST /auth/change-password HTTP/1.1

Content-Type: application/json

```

```javascript
const inputBody = '{
  "email": "exemple.test@gmail.com",
  "token": "b7wCwIHaRkhhCJW5IfZN8LzehT1SoE98Y4ZfmrCE8X9gj14TrWqBBdbhXzjm2vzb",
  "newPassword": "12345612",
  "newPasswordConfirm": "123456"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/change-password',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json'
}

result = RestClient.post '/auth/change-password',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('/auth/change-password', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth/change-password', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth/change-password");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth/change-password", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/change-password`

*[Public] Change the password using token*

> Body parameter

```json
{
  "email": "exemple.test@gmail.com",
  "token": "b7wCwIHaRkhhCJW5IfZN8LzehT1SoE98Y4ZfmrCE8X9gj14TrWqBBdbhXzjm2vzb",
  "newPassword": "12345612",
  "newPasswordConfirm": "123456"
}
```

<h3 id="authcontroller_changepassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ChangePasswordAuthDto](#schemachangepasswordauthdto)|true|none|

<h3 id="authcontroller_changepassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="hollyfilms-api-medias">Medias</h1>

## MediasController_getAllMedias

<a id="opIdMediasController_getAllMedias"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /medias

```

```http
GET /medias HTTP/1.1

```

```javascript

fetch('/medias',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/medias',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/medias')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/medias', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/medias", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /medias`

*[User] Get all medias sorted by titles*

<h3 id="mediascontroller_getallmedias-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## MediasController_getMedia

<a id="opIdMediasController_getMedia"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /medias/{id}

```

```http
GET /medias/{id} HTTP/1.1

```

```javascript

fetch('/medias/{id}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/medias/{id}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/medias/{id}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/medias/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/medias/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /medias/{id}`

*[User] Get a specific media by id*

<h3 id="mediascontroller_getmedia-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="mediascontroller_getmedia-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## MediasController_deleteMedia

<a id="opIdMediasController_deleteMedia"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /medias/{id}

```

```http
DELETE /medias/{id} HTTP/1.1

```

```javascript

fetch('/medias/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.delete '/medias/{id}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.delete('/medias/{id}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/medias/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/medias/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /medias/{id}`

*[Admin] Delete a specific media by id*

<h3 id="mediascontroller_deletemedia-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="mediascontroller_deletemedia-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## MediasController_getMostPopular

<a id="opIdMediasController_getMostPopular"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /medias/mostPopular

```

```http
GET /medias/mostPopular HTTP/1.1

```

```javascript

fetch('/medias/mostPopular',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/medias/mostPopular',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/medias/mostPopular')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/medias/mostPopular', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias/mostPopular");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/medias/mostPopular", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /medias/mostPopular`

*[User] Get all medias sorted by most populars*

<h3 id="mediascontroller_getmostpopular-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## MediasController_getRecommended

<a id="opIdMediasController_getRecommended"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /medias/recommended

```

```http
GET /medias/recommended HTTP/1.1

```

```javascript

fetch('/medias/recommended',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/medias/recommended',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/medias/recommended')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/medias/recommended', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias/recommended");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/medias/recommended", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /medias/recommended`

*[User] Get all medias sorted by recommended for the current user*

<h3 id="mediascontroller_getrecommended-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## MediasController_getContinueToWatch

<a id="opIdMediasController_getContinueToWatch"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /medias/continueToWatch

```

```http
GET /medias/continueToWatch HTTP/1.1

```

```javascript

fetch('/medias/continueToWatch',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/medias/continueToWatch',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/medias/continueToWatch')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/medias/continueToWatch', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias/continueToWatch");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/medias/continueToWatch", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /medias/continueToWatch`

*[User] Get all not entirely watched*

<h3 id="mediascontroller_getcontinuetowatch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## MediasController_getSeeAgain

<a id="opIdMediasController_getSeeAgain"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /medias/seeAgain

```

```http
GET /medias/seeAgain HTTP/1.1

```

```javascript

fetch('/medias/seeAgain',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/medias/seeAgain',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/medias/seeAgain')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/medias/seeAgain', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias/seeAgain");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/medias/seeAgain", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /medias/seeAgain`

*[User] Get all medias already seen*

<h3 id="mediascontroller_getseeagain-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## MediasController_searchQuery

<a id="opIdMediasController_searchQuery"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /medias/search/{query}

```

```http
GET /medias/search/{query} HTTP/1.1

```

```javascript

fetch('/medias/search/{query}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/medias/search/{query}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/medias/search/{query}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/medias/search/{query}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias/search/{query}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/medias/search/{query}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /medias/search/{query}`

*[User] Search for medias*

<h3 id="mediascontroller_searchquery-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|query|path|string|true|none|

<h3 id="mediascontroller_searchquery-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## MediasController_adminSearchQuery

<a id="opIdMediasController_adminSearchQuery"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /medias/adminSearch/{query}

```

```http
GET /medias/adminSearch/{query} HTTP/1.1

```

```javascript

fetch('/medias/adminSearch/{query}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/medias/adminSearch/{query}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/medias/adminSearch/{query}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/medias/adminSearch/{query}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias/adminSearch/{query}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/medias/adminSearch/{query}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /medias/adminSearch/{query}`

*[User] Search for medias in admin mode*

<h3 id="mediascontroller_adminsearchquery-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|query|path|string|true|none|

<h3 id="mediascontroller_adminsearchquery-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## MediasController_getRandomBackdrop

<a id="opIdMediasController_getRandomBackdrop"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /medias/randomBackdrop

```

```http
GET /medias/randomBackdrop HTTP/1.1

```

```javascript

fetch('/medias/randomBackdrop',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/medias/randomBackdrop',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/medias/randomBackdrop')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/medias/randomBackdrop', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias/randomBackdrop");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/medias/randomBackdrop", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /medias/randomBackdrop`

*[Admin] Get a random movie or tv backdrop*

<h3 id="mediascontroller_getrandombackdrop-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## MediasController_getStream

<a id="opIdMediasController_getStream"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /medias/stream/{location}/* \
  -H 'accept-encoding: string'

```

```http
GET /medias/stream/{location}/* HTTP/1.1

accept-encoding: string

```

```javascript

const headers = {
  'accept-encoding':'string'
};

fetch('/medias/stream/{location}/*',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'accept-encoding' => 'string'
}

result = RestClient.get '/medias/stream/{location}/*',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'accept-encoding': 'string'
}

r = requests.get('/medias/stream/{location}/*', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'accept-encoding' => 'string',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/medias/stream/{location}/*', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/medias/stream/{location}/*");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "accept-encoding": []string{"string"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/medias/stream/{location}/*", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /medias/stream/{location}/*`

*[User] Stream media file*

<h3 id="mediascontroller_getstream-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|location|path|string|true|none|
|accept-encoding|header|string|true|none|

<h3 id="mediascontroller_getstream-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="hollyfilms-api-tmdb">Tmdb</h1>

## TmdbController_searchQuerry

<a id="opIdTmdbController_searchQuerry"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /tmdb/search/{query}

```

```http
GET /tmdb/search/{query} HTTP/1.1

```

```javascript

fetch('/tmdb/search/{query}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/tmdb/search/{query}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/tmdb/search/{query}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/tmdb/search/{query}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/tmdb/search/{query}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/tmdb/search/{query}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tmdb/search/{query}`

*[Admin] Search in TMDB API for movies & tvs*

<h3 id="tmdbcontroller_searchquerry-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|query|path|string|true|none|

<h3 id="tmdbcontroller_searchquerry-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="hollyfilms-api-processing">Processing</h1>

## ProcessingController_getOnlineSearchResults

<a id="opIdProcessingController_getOnlineSearchResults"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /processing/onlineSearch

```

```http
POST /processing/onlineSearch HTTP/1.1

```

```javascript

fetch('/processing/onlineSearch',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.post '/processing/onlineSearch',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.post('/processing/onlineSearch')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/processing/onlineSearch', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/processing/onlineSearch");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/processing/onlineSearch", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /processing/onlineSearch`

*[Admin] Engage a scrapping request to search movies*

<h3 id="processingcontroller_getonlinesearchresults-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## ProcessingController_getmediaLink

<a id="opIdProcessingController_getmediaLink"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /processing/onlineSearch/getmediaLink

```

```http
POST /processing/onlineSearch/getmediaLink HTTP/1.1

```

```javascript

fetch('/processing/onlineSearch/getmediaLink',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.post '/processing/onlineSearch/getmediaLink',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.post('/processing/onlineSearch/getmediaLink')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/processing/onlineSearch/getmediaLink', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/processing/onlineSearch/getmediaLink");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/processing/onlineSearch/getmediaLink", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /processing/onlineSearch/getmediaLink`

*[Admin] Get uptobox premium link*

<h3 id="processingcontroller_getmedialink-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## ProcessingController_getLocalSearchResults

<a id="opIdProcessingController_getLocalSearchResults"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /processing/localSearch/{query}

```

```http
GET /processing/localSearch/{query} HTTP/1.1

```

```javascript

fetch('/processing/localSearch/{query}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/processing/localSearch/{query}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/processing/localSearch/{query}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/processing/localSearch/{query}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/processing/localSearch/{query}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/processing/localSearch/{query}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /processing/localSearch/{query}`

*[Admin] Search in hard space for files*

<h3 id="processingcontroller_getlocalsearchresults-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|query|path|string|true|none|

<h3 id="processingcontroller_getlocalsearchresults-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## ProcessingController_startQueue

<a id="opIdProcessingController_startQueue"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /processing/startQueue

```

```http
GET /processing/startQueue HTTP/1.1

```

```javascript

fetch('/processing/startQueue',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/processing/startQueue',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/processing/startQueue')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/processing/startQueue', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/processing/startQueue");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/processing/startQueue", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /processing/startQueue`

*[Admin] Start processing queue*

<h3 id="processingcontroller_startqueue-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## ProcessingController_clearQueue

<a id="opIdProcessingController_clearQueue"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /processing/clearQueue

```

```http
GET /processing/clearQueue HTTP/1.1

```

```javascript

fetch('/processing/clearQueue',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/processing/clearQueue',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/processing/clearQueue')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/processing/clearQueue', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/processing/clearQueue");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/processing/clearQueue", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /processing/clearQueue`

*[Admin] Clear all unprocessing files*

<h3 id="processingcontroller_clearqueue-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## ProcessingController_startGeneration

<a id="opIdProcessingController_startGeneration"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /processing/startGeneration/{id}/{name}

```

```http
GET /processing/startGeneration/{id}/{name} HTTP/1.1

```

```javascript

fetch('/processing/startGeneration/{id}/{name}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

result = RestClient.get '/processing/startGeneration/{id}/{name}',
  params: {
  }

p JSON.parse(result)

```

```python
import requests

r = requests.get('/processing/startGeneration/{id}/{name}')

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/processing/startGeneration/{id}/{name}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/processing/startGeneration/{id}/{name}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/processing/startGeneration/{id}/{name}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /processing/startGeneration/{id}/{name}`

*[Admin] Start generation of extra streams*

<h3 id="processingcontroller_startgeneration-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|name|path|string|true|none|

<h3 id="processingcontroller_startgeneration-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_UpdateMeDto">UpdateMeDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdatemedto"></a>
<a id="schema_UpdateMeDto"></a>
<a id="tocSupdatemedto"></a>
<a id="tocsupdatemedto"></a>

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "newPassword": "123456",
  "newPasswordConfirm": "123456"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|firstname|string|true|none|User first name|
|lastname|string|true|none|User last name|
|username|string|true|none|User nickname|
|newPassword|string|true|none|New user password|
|newPasswordConfirm|string|true|none|New user password confirmation|

<h2 id="tocS_CreateUserDto">CreateUserDto</h2>
<!-- backwards compatibility -->
<a id="schemacreateuserdto"></a>
<a id="schema_CreateUserDto"></a>
<a id="tocScreateuserdto"></a>
<a id="tocscreateuserdto"></a>

```json
{
  "email": "exemple.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "role": "super_admin",
  "password": "123456",
  "roles": [
    "user",
    "admin"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|User email|
|firstname|string|true|none|User first name|
|lastname|string|true|none|User last name|
|username|string|true|none|User nickname|
|role|string|true|none|User role|
|password|string|true|none|User password|
|roles|[string]|true|none|User roles|

<h2 id="tocS_UpdateUserDto">UpdateUserDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdateuserdto"></a>
<a id="schema_UpdateUserDto"></a>
<a id="tocSupdateuserdto"></a>
<a id="tocsupdateuserdto"></a>

```json
{
  "email": "exemple.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "password": "123456",
  "roles": [
    "user",
    "admin"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|User email|
|firstname|string|true|none|User first name|
|lastname|string|true|none|User last name|
|username|string|true|none|User nickname|
|password|string|true|none|User password|
|roles|[string]|true|none|User roles|

<h2 id="tocS_LoginAuthDto">LoginAuthDto</h2>
<!-- backwards compatibility -->
<a id="schemaloginauthdto"></a>
<a id="schema_LoginAuthDto"></a>
<a id="tocSloginauthdto"></a>
<a id="tocsloginauthdto"></a>

```json
{
  "email": "exemple.test@gmail.com",
  "password": "123456"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|User email|
|password|string|true|none|User password|

<h2 id="tocS_CurrentUser">CurrentUser</h2>
<!-- backwards compatibility -->
<a id="schemacurrentuser"></a>
<a id="schema_CurrentUser"></a>
<a id="tocScurrentuser"></a>
<a id="tocscurrentuser"></a>

```json
{
  "_id": "5e9f8f8f8f8f8f8f8f8f8f8f8",
  "email": "exemplle.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "roles": [
    "user",
    "admin"
  ],
  "isAdmin": "true",
  "playedMedias": [
    "string"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|_id|string|true|none|The user's id|
|email|string|true|none|The user's email|
|firstname|string|true|none|The user's first name|
|lastname|string|true|none|The user's last name|
|username|string|true|none|The user's nickname|
|roles|[string]|true|none|The user's roles|
|isAdmin|boolean|true|none|Is the user an Admin|
|playedMedias|[string]|true|none|Array of medias that the user has played|

<h2 id="tocS_RegisterAuthDto">RegisterAuthDto</h2>
<!-- backwards compatibility -->
<a id="schemaregisterauthdto"></a>
<a id="schema_RegisterAuthDto"></a>
<a id="tocSregisterauthdto"></a>
<a id="tocsregisterauthdto"></a>

```json
{
  "email": "exemple.test@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "username": "Johnny",
  "password": "123456",
  "passwordConfirm": "123456"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|User email|
|firstname|string|true|none|User first name|
|lastname|string|true|none|User last name|
|username|string|true|none|User nickname|
|password|string|true|none|User password|
|passwordConfirm|string|true|none|User password confirmation|

<h2 id="tocS_ResetPasswordDto">ResetPasswordDto</h2>
<!-- backwards compatibility -->
<a id="schemaresetpassworddto"></a>
<a id="schema_ResetPasswordDto"></a>
<a id="tocSresetpassworddto"></a>
<a id="tocsresetpassworddto"></a>

```json
{
  "email": "exemple.test@gmail.com"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|User email|

<h2 id="tocS_ChangePasswordAuthDto">ChangePasswordAuthDto</h2>
<!-- backwards compatibility -->
<a id="schemachangepasswordauthdto"></a>
<a id="schema_ChangePasswordAuthDto"></a>
<a id="tocSchangepasswordauthdto"></a>
<a id="tocschangepasswordauthdto"></a>

```json
{
  "email": "exemple.test@gmail.com",
  "token": "b7wCwIHaRkhhCJW5IfZN8LzehT1SoE98Y4ZfmrCE8X9gj14TrWqBBdbhXzjm2vzb",
  "newPassword": "12345612",
  "newPasswordConfirm": "123456"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|User email|
|token|string|true|none|Change password token|
|newPassword|string|true|none|New user password|
|newPasswordConfirm|string|true|none|New user password confirmation|

