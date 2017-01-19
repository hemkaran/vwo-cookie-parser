
function JSONstringify(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, '\t');
    }

    var 
        arr = [],
        _string = 'color:green',
        _number = 'color:darkorange',
        _boolean = 'color:blue',
        _null = 'color:magenta',
        _key = 'color:red';

    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var style = _number;
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                style = _key;
            } else {
                style = _string;
            }
        } else if (/true|false/.test(match)) {
            style = _boolean;
        } else if (/null/.test(match)) {
            style = _null;
        }
        arr.push(style);
        arr.push('');
        return '%c' + match + '%c';
    });

    arr.unshift(json);

    console.log.apply(console, arr);
}

function searchStringforArray(matchStr, strArray){
  var idx = [];
  
  strArray.forEach(function(str, index){
    
    if(str.match(matchStr)){
      idx.push(str);
    }
    
  });
  
  return idx;
}


function getIdFromCookie(strArray){

	var ids = [];
	strArray.forEach(function(str, index){
		var temp = str.split("_");
		ids.push(temp[4]);
	});

	return ids;

}

/*----
	intersection(args1, args2)
	args1: parent array
	args2: secondary array
	return: array which contains element which are in both args1 and args2
----*/
function intersectionOfIds(parent_array, secondary_array){

	var resultArray = [];

	parent_array.forEach(function(str){

		if(secondary_array.indexOf(str) >= 0)
			resultArray.push(str);

	});

	return resultArray;
}

function getObjectContentbyId(parent_array){

	var resultArray = [];
	parent_array.forEach(function(str){

		resultArray.push({
			cookie_key:str,
			obj:window._vwo_exp[str]
			}
		);

	});

	return resultArray;
}



var x = decodeURIComponent(document.cookie);
var res = x.split(";");
//_vwo_exp_ids;
var _vis_opt_exp_array = searchStringforArray("_vis_opt_exp", res);
var _vwo_exp_ids_cookie = getIdFromCookie(_vis_opt_exp_array);
var _vwo_exp_ids_window = window._vwo_exp_ids;
var intersected_ids = intersectionOfIds(_vwo_exp_ids_cookie, _vwo_exp_ids_window);
var data = getObjectContentbyId(intersected_ids);
JSONstringify(data);
