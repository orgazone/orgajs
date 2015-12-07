/**
 * Created by Relvin Gonzalez on 12/1/2015.
 */
 /*
  * Class to interact with the orga.zone api
  * @class Orgajs
  */
var Orgajs = (function(){
    var apiURL = "https://apps.orga.zone/apiv2/";

    //private shared function for making api calls
    function apiCall(appaction, appname, appsortstr, appsortint, formid, appcollection, appobjid, appparent, file, appdata, token,aCallback) {
        var apiUrl = apiURL + "?appaction=" + appaction;
        var anHttpRequest = new XMLHttpRequest();
        var response = "";

        if (appname)
            apiUrl = apiUrl + "&appname=" + appname;
        apiUrl = apiUrl + "&appid=API";
        if (appsortstr)apiUrl = apiUrl + "&appsortstr=" + appsortstr;
        if (appsortint)apiUrl = apiUrl + "&appsortint=" + appsortint;
        if (formid)apiUrl = apiUrl + "&formid=" + formid;
        if (appcollection)apiUrl = apiUrl + "&appcollection=" + appcollection;
        if (appobjid)apiUrl = apiUrl + "&appobjid=" + appobjid;
        if (appparent)apiUrl = apiUrl + "&appparent=" + appparent;
        if (file)apiUrl = apiUrl + "&file=" + file;
        if(typeof appdata === 'string' || appdata instanceof String || !isNaN(appdata))
            apiUrl = apiUrl + "&appdata=" + appdata;
        else if (appdata) {
            apiUrl = apiUrl + "&appdata=" + JSON.stringify(appdata);
        }
        if(token)
            apiUrl += "&token="+token;

        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
                response = JSON.parse(anHttpRequest.responseText);
                switch(appaction){
                    case 'login':
                        aCallback.setToken(response.token);
                        aCallback.package = response.package;
                        aCallback.aCallback(response);
                        break;
                    default:
                        aCallback(response);
                }

            }
        };

        if(appaction === 'sendmail' || appaction === 'login' || appaction === 'push'||appaction === 'upload'
        ||appaction === 'update' || appaction === 'updateby' || appaction === 'updateuser'
            ||appaction === 'delete'||appaction === 'delfile')
            anHttpRequest.open("POST", apiUrl, true);
        else
            anHttpRequest.open("GET", apiUrl, true);

        anHttpRequest.send(null);

    };

    /*
     * Constructor for the class
     * @param app {String} name of the app to use
     * @param email {String} email of the user
     * @param password {String} password of the user
     */
    function Orgajs(app,email,password){
        //private instance properties
        var token = "";
        var eMail = typeof email === 'string'?email:"";
        var passWord = typeof password === 'string'?transformPass(password):"";
        var app = typeof app === 'string'?app.toLowerCase():"";

        //public instance properties
        this.package = "";

        //Getters and setters
        this.getToken = function(){
            return token;
        };
        this.setToken = function(newToken){
            token = newToken;
        };
        this.getEmail = function(){
            return eMail;
        };
        this.getPassword = function(){
            return passWord;
        };
        this.getAppName = function(){
            return app;
        };


    };

    /**
     * Login function
     * Attempts to log in the user
     * @param {function} aCallback function to run after api call has returned
     */
    Orgajs.prototype.login = function(aCallback){
        var appdata ={
            'login':this.getEmail(),
            'pw':this.getPassword()
        };
        var self = this;
        var callback = {
            'setToken':self.setToken,
            'package':self.package,
            'aCallback':aCallback
        };
        apiCall('login',this.getAppName(),'','','','','','','',appdata,'',callback);
    };

    /**
     * Show User function
     * Shows information about the user
     * @param {function} aCallback Function to use as callback
     */
    Orgajs.prototype.showUser = function(aCallback){
        apiCall('showuser',this.getAppName(),'','','','','','','','',this.getToken(),aCallback);
    };
    /**
     * Function to get information about a user using their email
     * @param {String} email Email of the user to search and get info
     * @param {function} aCallback Function to run after the api call
     */
    Orgajs.prototype.getUser = function(email,aCallback){
        var appdata = email;
        apiCall('usrinfo',this.getAppName(),'','','','','','','',appdata,this.getToken(),aCallback);
    };

    /**
     * Update the current logged in user.
     * @param {String} firstname New firstname to use
     * @param {String} lastname New lastname to use
     * @param {String} nickname New nickname to use
     * @param {function} aCallback Function that will be called after the api call has returned
     */
    Orgajs.prototype.updateUser = function(firstname,lastname,nickname,aCallback){
        var appdata = {
            'firstname':firstname,
            'lastname':lastname,
            'nickname':nickname
        };
        apiCall('updateuser',this.getAppName(),'','','','','','','',appdata,this.getToken(),aCallback);
    };

    /**
     * Invite user to the app
     * @param {String} to Email of the user you want to invite
     * @param {String} destination The destination link should be on your subdomain and we append the value ?to=email to the URL
     * @param {function} aCallback Function that will be called after the api call has returned
     */
    Orgajs.prototype.inviteUser = function(to, destination, aCallback){
        var appdata = {
            'to':to,
            'destination':destination
        };
        apiCall('invite',this.getAppName(),'','','','','','','',appdata,this.getToken(),aCallback);
    };

    /**
     * Get the primary key of last entry, total amount of entries and use optional filter
     * @param {String} sortstring String - Optional filter to be used(example: 'PROJECTS').
     * @param {function} aCallback Function that will be called after the api call has returned
     */
    Orgajs.prototype.getStatus = function(sortstring,aCallback){
        apiCall('status',this.getAppName(),sortstring,'','','','','','','',this.getToken(),aCallback);
    };

    /**
     * Push general data
     * @param {String} sortstring Optional sort string
     * @param {Number} sortint Optional sort number
     * @param {Number} formid  Optional Administration form ID.
     * @param {String} collection Optional Name of collection
     * @param {Object} data Object that has the data to be pushed.
     *     For example, "field1":"A string in field1","field2":"Another string with RAND(1,1000) = 763","field3":"field3 has a value here"
     * @param {function} aCallback Function to be called after api call has returned.
     */
    Orgajs.prototype.pushData = function(sortstring, sortint, formid, collection, data, aCallback){
        apiCall('push',this.getAppName(),sortstring,sortint,formid,collection,'','','',data,this.getToken(),aCallback);
    };

    /**
     * Get general data
     * @param {String} sortstring Optional sort string
     * @param {Number} sortint Optional sort number
     * @param {String} collection Optional Name of collection
     * @param {Object,String} data Object or String keyword that has the data to be searched for.
     *     For example, "field1":"A string in field1","field2":"Another string with RAND(1,1000) = 763","field3":"field3 has a value here" or "keyword"
     * @param {function} aCallback Function to be called after api call has returned.
     */
    Orgajs.prototype.getData = function(sortstring, sortint, collection, data, aCallback){
        var appaction = 'request';
        if(typeof data === 'string' || data instanceof String)
            appaction = 'search';
        apiCall(appaction,this.getAppName(),sortstring,sortint,'',collection,'','','',data,this.getToken(),aCallback);
    };

    /**
     * When you push data up, you will get an UNIQUE ID as an big integer value.
     * You can use this value to retrieve one specific entry.
     * @param {Number} id  the id of the object to request
     * @param {function} aCallback  function called after the api call has returned
     */
    Orgajs.prototype.requestByID = function(id,aCallback){
        apiCall('requestById',this.getAppName(),'','','','','','','',id,this.getToken(),aCallback);
    };

    /**
     * Deletes 1 entry from the APIv2 table, where data equals the primary key.
     * The "sorter" fields are optional, but could limit the delete
     * @param {String} sortstring  sort string
     * @param {Number} sortint sort int
     * @param {Number} data primary key of the entry to be deleted
     * @param {Function} aCallback Function to be called after api call has returned
     */
    Orgajs.prototype.deleteEntry = function(sortstring,sortint,data,aCallback){
        apiCall('delete',this.getAppName(),sortstring,sortint,'','','','','',data,this.getToken(),aCallback);
    };

    /**
     * Updates 1 entry in the APIv2 table, where appdata equals the primary key
     * @param {String} sortstring sort string
     * @param {Number} sortint sort int
     * @param {Object} data Object or array with primary key and field to be updated.
     *     Example: Array("OZINDEX"=>"20150526202249-5303", "field1" => "...", "field2" => "...", "field3" => "...")
     * @param {Function} aCallback Function to be called after the api call has returned.
     */
    Orgajs.prototype.updateEntry = function(sortstring, sortint, data, aCallback){
        apiCall('update',this.getAppName(),sortstring,sortint,'','','','','',data,this.getToken(),aCallback);
    };

    /**
     * Update entries by other column in WHERE clause
     * Updates entries in the APIv2 table, where appdata equals the self selected key column
     * @param {Object, Array} data Array("MYCOLUMN"=>"OZOBJID", "MYVALUE" => "TESTING", "field2" => "...", "field3" => "...")
                with MYCOLUMN is the identifier of the entry to update and my value the search value.
                MYCOLUMN and MYVALUE must be the first two entries of the appdata JSON object!
     * @param {Function} aCallback function to be called once the api call has returned.
     */
    Orgajs.prototype.updateBy = function(data, aCallback){
        apiCall('updateby',this.getAppName(),'','','','','','','',data,this.getToken(),aCallback);
    };

    /**
     * Upload files up to 150 MB
     * The file is stored relatively to the app directory:
     * for example: apps.orga.zone/up/ex3/files/NEWFILE.jpg
     * Allowed file types are: gif, jpg, png, doc, docx, ppt, pptx, xls, xlsx, zip, tgz and ics.
     * @param {Number} sortint Optional sort number
     * @param {String} parent Optional sorter
     * @param {String} collection Optional sorter string
     * @param {Number} formid Optional if you need to list it in the admin section
     * @param {String} objid Optional sorter
     * @param {File} file Required File to upload
     * @param {Object} filedata Optional object or array of file data. Ex : filename, date, creator, etc.
     * @param {Function} aCallback Function to be called once the api call has returned.
     */
    Orgajs.prototype.uploadFile = function(sortint,parent,collection,formid,objid,file,filedata,aCallback){
        apiCall('upload',this.getAppName(),'FILE',sortint,formid,collection,objid,parent,file,filedata,this.getToken(),aCallback);
    };

    /**
     * Download a file
     * @param {String} filename name of file to be downloaded (Ex. tarifa.xlsx)
     * @param {Function} aCallback Function to be called after api all has returned.
     */
    Orgajs.prototype.getFile = function(filename,aCallback){
        apiCall('getfile',this.getAppName(),'','','','','','','',filename,this.getToken(),aCallback);
    };

    /**
     * Delete a file
     * @param {String} filename Name of file to be deleted (Ex. tarifa.xlsx)
     * @param {Function} aCallback Function to be called after api call has returned.
     */
    Orgajs.prototype.deleteFile = function(filename, aCallback){
        apiCall('delfile',this.getAppName(),'','','','','','','',filename,this.getToken(),aCallback);
    };

    /**
     * You may filter out the files from different collections, sorting strings, etc.: All filters are optional
     * @param {String} sortstring Sort string used as filter
     * @param {Number} sortint Sort int used as filter
     * @param {Number} formid form id used as filter
     * @param {String} collection Collection string used as filter
     * @param {String} objid Object id used as filter
     * @param {Object} filedata Object or array to use as a filter ( example = {'filename':'Example.jpg'} )
     * @param {Function} aCallback Function to be called after the api call has returned.
     */
    Orgajs.prototype.searchFiles = function(sortstring,sortint,formid,collection,objid,filedata,aCallback){
        apiCall('searchfiles',this.getAppName(),sortstring,sortint,formid,collection,objid,'','',filedata,this.getToken(),aCallback);
    };

    /**
     * Function to send email.
     *
     * @param {String} to Email of the person to send email to
     * @param {String} subject Subject of the email
     * @param {String} message Message of the email
     * @param {function} aCallback Function to use as callback
     */
    Orgajs.prototype.sendEmail = function(to,subject,message,aCallback){
        var appdata = {
            to:to,
            subject:subject,
            text:message
        };
        apiCall('sendmail',this.getAppName(),'','','','','','','',appdata,this.getToken(),aCallback);
    };


    /**
     * Transform password using md5
     * @param {String} pass  password to be transformed
     * @returns {String} transformed password
     */
    function transformPass(pass){
        var rotateLeft = function(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        var addUnsigned = function(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        var F = function(x, y, z) {
            return (x & y) | ((~ x) & z);
        }

        var G = function(x, y, z) {
            return (x & z) | (y & (~ z));
        }

        var H = function(x, y, z) {
            return (x ^ y ^ z);
        }

        var I = function(x, y, z) {
            return (y ^ (x | (~ z)));
        }

        var FF = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var GG = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var HH = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var II = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var convertToWordArray = function(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWordsTempOne = lMessageLength + 8;
            var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
            var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        var wordToHex = function(lValue) {
            var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValueTemp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
            }
            return WordToHexValue;
        };

        var uTF8Encode = function(string) {
            string = string.replace(/\x0d\x0a/g, "\x0a");
            var output = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    output += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    output += String.fromCharCode((c >> 6) | 192);
                    output += String.fromCharCode((c & 63) | 128);
                } else {
                    output += String.fromCharCode((c >> 12) | 224);
                    output += String.fromCharCode(((c >> 6) & 63) | 128);
                    output += String.fromCharCode((c & 63) | 128);
                }
            }
            return output;
        };

        function convert(string) {
            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11=7, S12=12, S13=17, S14=22;
            var S21=5, S22=9 , S23=14, S24=20;
            var S31=4, S32=11, S33=16, S34=23;
            var S41=6, S42=10, S43=15, S44=21;
            string = uTF8Encode(string);
            x = convertToWordArray(string);
            a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a; BB = b; CC = c; DD = d;
                a = FF(a, b, c, d, x[k+0],  S11, 0xD76AA478);
                d = FF(d, a, b, c, x[k+1],  S12, 0xE8C7B756);
                c = FF(c, d, a, b, x[k+2],  S13, 0x242070DB);
                b = FF(b, c, d, a, x[k+3],  S14, 0xC1BDCEEE);
                a = FF(a, b, c, d, x[k+4],  S11, 0xF57C0FAF);
                d = FF(d, a, b, c, x[k+5],  S12, 0x4787C62A);
                c = FF(c, d, a, b, x[k+6],  S13, 0xA8304613);
                b = FF(b, c, d, a, x[k+7],  S14, 0xFD469501);
                a = FF(a, b, c, d, x[k+8],  S11, 0x698098D8);
                d = FF(d, a, b, c, x[k+9],  S12, 0x8B44F7AF);
                c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
                b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
                a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
                d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
                c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
                b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
                a = GG(a, b, c, d, x[k+1],  S21, 0xF61E2562);
                d = GG(d, a, b, c, x[k+6],  S22, 0xC040B340);
                c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
                b = GG(b, c, d, a, x[k+0],  S24, 0xE9B6C7AA);
                a = GG(a, b, c, d, x[k+5],  S21, 0xD62F105D);
                d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
                c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
                b = GG(b, c, d, a, x[k+4],  S24, 0xE7D3FBC8);
                a = GG(a, b, c, d, x[k+9],  S21, 0x21E1CDE6);
                d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
                c = GG(c, d, a, b, x[k+3],  S23, 0xF4D50D87);
                b = GG(b, c, d, a, x[k+8],  S24, 0x455A14ED);
                a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
                d = GG(d, a, b, c, x[k+2],  S22, 0xFCEFA3F8);
                c = GG(c, d, a, b, x[k+7],  S23, 0x676F02D9);
                b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
                a = HH(a, b, c, d, x[k+5],  S31, 0xFFFA3942);
                d = HH(d, a, b, c, x[k+8],  S32, 0x8771F681);
                c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
                b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
                a = HH(a, b, c, d, x[k+1],  S31, 0xA4BEEA44);
                d = HH(d, a, b, c, x[k+4],  S32, 0x4BDECFA9);
                c = HH(c, d, a, b, x[k+7],  S33, 0xF6BB4B60);
                b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
                a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
                d = HH(d, a, b, c, x[k+0],  S32, 0xEAA127FA);
                c = HH(c, d, a, b, x[k+3],  S33, 0xD4EF3085);
                b = HH(b, c, d, a, x[k+6],  S34, 0x4881D05);
                a = HH(a, b, c, d, x[k+9],  S31, 0xD9D4D039);
                d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
                c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
                b = HH(b, c, d, a, x[k+2],  S34, 0xC4AC5665);
                a = II(a, b, c, d, x[k+0],  S41, 0xF4292244);
                d = II(d, a, b, c, x[k+7],  S42, 0x432AFF97);
                c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
                b = II(b, c, d, a, x[k+5],  S44, 0xFC93A039);
                a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
                d = II(d, a, b, c, x[k+3],  S42, 0x8F0CCC92);
                c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
                b = II(b, c, d, a, x[k+1],  S44, 0x85845DD1);
                a = II(a, b, c, d, x[k+8],  S41, 0x6FA87E4F);
                d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
                c = II(c, d, a, b, x[k+6],  S43, 0xA3014314);
                b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
                a = II(a, b, c, d, x[k+4],  S41, 0xF7537E82);
                d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
                c = II(c, d, a, b, x[k+2],  S43, 0x2AD7D2BB);
                b = II(b, c, d, a, x[k+9],  S44, 0xEB86D391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }
            var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
            return tempValue.toLowerCase();
        }
        return convert(pass);
    }

    return Orgajs;
})();
