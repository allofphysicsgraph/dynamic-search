function loadXMLDoc()
    {
        var req = new XMLHttpRequest()
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status != 200) {
                    //error handling code here
                } else {
                    var response = JSON.parse(req.responseText);
                    console.log(response);
                    //document.getElementById('myDiv').innerHTML = response.username

                }
            }
        };
        req.open('POST', '/index');
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var search_string = document.getElementById('search_string').value;
        var postVars = search_string;
        req.send(postVars);
        return false
    }

