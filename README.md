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

### Create Methods

**For Optional arguments, you may use `''` for Strings or `0` for numbers**

| Methods       | Arguments     | Description  |
| ------------- |:-------------:| ------------:|
| pushData      | sortstring   | {`String`} **Optional** sort string |
|               | sortint      | {`Number`} **Optional** sort number |
|               | formid       | {`Number`} **Optional** Administration form ID. |
|               | collection   | {`String`} **Optional** Name of collection |
|               | data         | {`Object`} **Required** Object that has the data to be pushed. 
|               |              |    For example, "field1":"A string in field1","field2":"Another string with RAND(1,1000) =             |            |               |    763","field3":"field3 has a value here"|
|               | aCallback    | {`Function`} **Required**  Function to be called after api call has returned.|



