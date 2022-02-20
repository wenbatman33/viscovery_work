## **Menu**

* [Login](#login)
* [Enroll](#enroll)
* [Token](#token)
* [Video List](#videolist)
* [Video Delete](#videodelete)

<h2 id="login"></h2>
## **Login**

***
* **URL**

  `/api/v1/login/<type>`

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   ```
   <type>=[string|fb]

   source_id=[string]

   email=[string]

   id=[string]

   birthday=[string|mm/dd/yyyy]
   ```

   **Optional:**

   `None`

* **Data Params**

  `None`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ "expires_in": 1498362197,"isSuccess": true, "msg": "", "refresh_token": "1234567890abcdef", "token": "1234567890abcdef1234567890abcdef","uid": "1234567890abcdef" }`
 
* **Error Response:**

  * **Code:** 200 <br />
    **Content:** `{ isSuccess : "false", msg : "not found" }`

  OR

  * **Code:** 200 <br />
    **Content:** `{ isSuccess : "false", msg : "400: Bad Request" }`

* **Sample Call:**

```
var data = "id=123456&email=xxx%40yahoo.com.tw&birthday=01%2F01%2F1911&source_id=b6d28f81e42f462489f88b58ac58d4db";

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://www.pythonanywhere.com/api/v1/login/fb");
xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
xhr.setRequestHeader("cache-control", "no-cache");
xhr.send(data);
```

* **Notes:**

  `None`

<h2 id="enroll"></h2>
## **Enroll**

***
* **URL**

  `/api/v1/enroll/<type>`

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**

   ```
   <type>=[string|fb] 

   source_id=[string]

   email=[string]

   id=[string]

   birthday=[string|mm/dd/yyyy] 
   ```

   **Optional:**

   `None`

* **Data Params**

  `None`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ "expires_in": 1498362197,"isSuccess": true, "msg": "", "refresh_token": "1234567890abcdef", "token": "1234567890abcdef1234567890123456","uid": "1234567890abcdef" }`
 
* **Error Response:**

  * **Code:** 200 <br />
    **Content:** `{ isSuccess : "false", msg : "exist" }`

  OR

  * **Code:** 200 <br />
    **Content:** `{ isSuccess : "false", msg : "400: Bad Request" }`

* **Sample Call:**

```
var data = "id=123456&email=xxx%40yahoo.com.tw&birthday=01%2F01%2F1911&source_id=b6d28f81e42f462489f88b58ac58d4db";

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://leejulee.pythonanywhere.com/api/v1/enroll/fb");
xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
```

* **Notes:**
  `None`

<h2 id="token"></h2>
## **Token**
***
* **URL**

  `/api/v1/token`

* **Method:**

  `POST`

*  **Headers Params**
  
   **Required:**

   `Authorization=[string|Token {token}}]`

*  **URL Params**

   **Required:**

   ```
   uid=[string] 

   source_id=[string]

   refresh_token=[string]
   ```

   **Optional:**

   `None`

* **Data Params**

  `None`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ "expires_in": 1498362197,"isSuccess": true, "msg": "", "refresh_token": "1234567890abcdef", "token": "1234567890abcdef1234567890123456","uid": "1234567890abcdef" }`
 
* **Error Response:**

  * **Code:** 200 <br />
    **Content:** `{ isSuccess : "false", msg : "fail" }`

  OR

  * **Code:** 200 <br />
    **Content:** `{ isSuccess : "false", msg : "parameter not null" }`

  OR

  * **Code:** 200 <br />
    **Content:** `{ isSuccess : "false", msg : "400: Bad Request" }`

* **Sample Call:**

```
var data = "uid=1234567890abcdef&refresh_token=1234567890abcdef&source_id=251406c814554f7ca509545b78ae9578";

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://leejulee.pythonanywhere.com/api/v1/token");
xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
xhr.setRequestHeader("authorization", "Token 1234567890abcdef1234567890123456");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
```

* **Notes:**
  `None`

<h2 id="videolist"></h2>
## **Video List**
***
* **URL**

  `/api/v1/video/<uid>`

* **Method:**

  `GET`

*  **Headers Params**
  
   **Required:**

   `Authorization=[string|Token {token}}]`

*  **URL Params**

   **Required:**

   ```
   uid=[string] 
   ```

   **Optional:**

   `None`

* **Data Params**

  `None`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
```     
      {
        "isSuccess": true,
        "msg": "OK",
        "videos": [
            {
                "id": 307,
                "imgurl": "https://i.ytimg.com/vi/7FFrikrAwYQ/hqdefault.jpg",
                "title": "髒話滿天飛？！模仿天王遇瓶頸！！模仿知名歌手居然沒人猜得出來？！",
                "url": "https://www.youtube.com/embed/7FFrikrAwYQ?feature=oembed",
                "website": "1",
                "website_vid": "7FFrikrAwYQ"
            },
            {
                "id": 302,
                "imgurl": "https://i.ytimg.com/vi/97fLl6_jcV4/hqdefault.jpg",
                "title": "【命理界郭富城】爛警官才能當臥底 瘋神無雙 20161030",
                "url": "https://www.youtube.com/embed/97fLl6_jcV4?start=78&feature=oembed",
                "website": "1",
                "website_vid": "97fLl6_jcV4"
            }
        ]
      } 
```
 
* **Error Response:**

  * **Code:** 200 <br />
    **Content:** `{"isSuccess": false,"msg": "Not found","videos": []}`

  OR

  * **Code:** 200 <br />
    **Content:** `{ isSuccess : "false", msg : "Server Error" }`

* **Sample Call:**

```
var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://leejulee.pythonanywhere.com/api/v1/video/1234567890abcdef");
xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
xhr.setRequestHeader("authorization", "Token 1234567890abcdef1234567890123456");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
```

* **Notes:**
  `None`

<h2 id="videodelete"></h2>
## **Video Delete**
***
* **URL**

  `/api/v1/video`

* **Method:**

  `DELETE`

*  **Headers Params**
  
   **Required:**

   `Authorization=[string|Token {token}}]`

*  **URL Params**

   **Required:**

   ```
   uid=[string] 

   vid=[string] 
   ```

   **Optional:**

   `None`

* **Data Params**

  `None`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"isSuccess": true,"msg": "Ok"}`
 
* **Error Response:**

  * **Code:** 200 <br />
    **Content:** `{"isSuccess": false,"msg": "No found or Parameter Not null"}`

  OR

  * **Code:** 200 <br />
    **Content:** `{ isSuccess : "false", msg : "Server Error" }`

* **Sample Call:**

```
var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://leejulee.pythonanywhere.com/api/v1/video/1234567890abcdef");
xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
xhr.setRequestHeader("authorization", "Token 1234567890abcdef1234567890123456");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
```

* **Notes:**
  `None`