#![orgajs](https://avatars1.githubusercontent.com/u/11753162?v=3&s=200)  Orgajs

Api for using orga.zone in your own apps. 

## Installation
Using Bower:

    bower install orgajs

That's it!

## Usage

### Object creation
First, create an object of Orgajs and name it whatever you want. In this case we will name it orgajs. 

    var orgajs = new Orgajs(<<appname>>,<<email>>,<<password>>);

### Login

Then, we need to log in to the system:

    orgajs.login(function(data){
       //code to run after logging in.
    });


Where you can specify a callback function to be run after the user has logged in. You could,for example,  redirect to another page or call another method to run in sequence. 

You can also, at this point, save this orgajs object to your localstorage and keep reusing it throughout the session.

The "data" field on the callback function holds whatever the api returns. It could be an error or success message, data requested, file, etc.

And that's it ! After this you may use any of the available methods to interact with the Api.

Remember to handle any errors, or expired sessions on your own. 
One way would be to check if the error returned 401 or 403 and if it did, then login the user again which will generate a new token.

##API
**For Optional arguments, you may use `''` for Strings or `0` for numbers**

### Create Methods

| Methods       | Arguments     | Description  |
| ------------- |:-------------:|:------------|
| **pushData** - Push general data   | sortstring   | {`String`} *Optional* sort string |
|               | sortint      | {`Number`} *Optional* sort number |
|               | formid       | {`Number`} *Optional* Administration form ID. |
|               | collection   | {`String`} *Optional* Name of collection |
|               | data         | {`Object`} *Required* Object that has the data to be pushed. For example, "field1":"A string in field1","field2":"Another string with RAND(1,1000) = 763","field3":"field3 has a value here"
|               | aCallback    | {`Function`} *Required*  Function to be called after api call has returned.|
|               |              |               |
| **uploadFile** - Upload files up to 150 MB. The file is stored relatively to the app directory: for example: apps.orga.zone/up/ex3/files/NEWFILE.jpg. Allowed file types are: gif, jpg, png, doc, docx, ppt, pptx, xls, xlsx, zip, tgz and ics.  | sortint      | {`Number`} *Optional* sort number |
|               | parent       | {`String`} *Optional* sorter      |
|               | collection   | {`String`} *Optional* Name of collection |
|               | formid       | {`Number`} *Optional* Administration form ID. |
|               | objid        | {`String`} *Optional* sorter      |
|               | file         | {`File`}   *Required* sorter      |
|               | filedata     | {`Object`} *Optional* object or array of file data. Ex : filename, date, creator, etc.
|               | aCallback    | {`Function`} *Required* Function to be called after api call has returned.|

### Read Methods

| Methods       | Arguments     | Description  |
| ------------- |:-------------:|:------------|
| **login** - Logs in the user using given email and password        | aCallback   | {`Function`} *required* Function to be called after api call has returned |
|               |              |               |
| **showUser** - Shows information about the current user | aCallback   | {`Function`} *required* Function to be called after api call has returned |
|               |              |               |
| **getUser** - gets information about a user with given email       | email   | {`String`} *required* Email of the user to search for |
|               | aCallback   | {`Function`} *required* Function to be called after api call has returned | 
|               |              |               |
| **inviteUser** - Invite user to the app     | to  | {`String`} *required* Email of the user you want to invite|
|               | destination    | {`Number`} *required* The destination link should be on your subdomain and we append the value ?to=email to the URL |
|               | aCallback       | {`Function`} *required* Function to be called after api call has returned |
|               |              |               |
| **getStatus** - Get the primary key of last entry, total amount of entries and use optional filter     | sortstring   | {`String`} *Optional* sort string |
|               | aCallback    | {`Function`} *Required* Function to be called after api call has returned.|
|               |              |               |
| **getData** - Get general data     | sortstring   | {`String`} *Optional* sort string |
|               | sortint      | {`Number`} *Optional* sort number |
|               | collection   | {`String`} *Optional* Name of collection |
|               | data         | {`Object`} *required* Object that has the data to be searched for. For example, "field1":"A string in field1","field2":"Another string with RAND(1,1000) = 763","field3":"field3 has a value here" or "keyword"
|               | aCallback    | {`Function`} *required*  Function to be called after api call has returned.|
|               |              |               |
| **requestById**  - When you push data up, you will get an UNIQUE ID as an big integer value. You can use this value to retrieve one specific entry. | id     | {`Number`} *required* sort number |
|               | aCallback      | {`Function`} *required*  Function to be called after api call has returned.|
|               |                |               |
| **getFile** - Download a file     | filename           | {`String`} *required* name of file to be downloaded (Ex. tarifa.xlsx) |
|               | aCallback      | {`Function`} *required*  Function to be called after api call has returned.|
|               |              |               |
| **searchFiles** - You may filter out the files from different collections, sorting strings, etc.: All filters are optional| sortstring   | {`String`} *Optional* sort string | 
|               | sortint      | {`Number`} *Optional* sort number |
|               | parent       | {`String`} *Optional* sorter      |
|               | formid       | {`Number`} *Optional* Administration form ID. |
|               | collection   | {`String`} *Optional* Name of collection |
|               | objid        | {`String`} *Optional* sorter      |
|               | filedata     | {`Object`} *Optional* object or array of file data. Ex : filename, date, creator, etc.
|               | aCallback    | {`Function`} *Required*  Function to be called after api call has returned.|
|               |              |               |
| **sendEmail** - Function to send email.| to   | {`String`} *required* Email of the person to send email to | 
|               | subject      | {`String`} *required* subject of the email |
|               | message     | {`String`} *required* Message to be sent      |
|               | aCallback    | {`Function`} *Required*  Function to be called after api call has returned.|

### Update Methods



