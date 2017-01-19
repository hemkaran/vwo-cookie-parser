/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+R),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+I), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+L)
 */
//alert(document.cookie)

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

function searchString(matchStr, strArray){
  var idx;
  
  strArray.forEach(function(str, index){
    
    if(str.match(matchStr)){
      idx = str
    }
    
  });
  
  return idx;
}

function equivString(str){
  
  var temp;
  temp = str.split('=');
  return temp[1];
  
}

function process_vwo_ds_feature_key(str){
  
  var arr = [];
  var temp = str.split(',');
  for(var i = 0; i< temp.length; i++){
    
    var temp2 = temp[i].split('_');
    
    if(temp2[0] == 'a')
     var analyze_track = "analyze";
    else
      var analyze_track = "track";
    
    if(temp2[1] == '1')
     var is_bucketed = "true";
    else
     var is_bucketed = "false";
    
    arr.push({
      raw: temp[i],
      feature: analyze_track,
      if_bucketed: is_bucketed
    });
    
  }
  
  return arr;
}

function process_vwo_ds_funnel_info(str){
  
  var arr = [];
  var temp = str.split(',');
  for(var i = 0; i< temp.length; i++){
    
    var funn_id;
    var funn_goal;
    var bucket_val;
    var exp;
    var funn_version;
    var temp2 = temp[i].split('_');
    
    funn_id = temp2[0];
    if(temp2[1] == '0')
     funn_goal = "no goal triggered";
    else
     funn_goal = temp2[1];
    
    if(temp2[2] == '0')
      bucket_val = "false";
    else
      bucket_val = "true";
    
    exp = temp2[3];
    funn_version = temp2[4];
    
    arr.push({
      raw: temp[i],
      funnel_id: funn_id,
      funnel_goal: funn_goal,
      funnel_bucket: bucket_val,
      funnel_expiry: exp,
      funnel_version: funn_version
      
    });
    
  }
  
  return arr;
  
}

function process_vwo_ds_track_info(str){
  
  var arr = [];
  var temp = str.split(',');
  for(var i = 0; i< temp.length; i++){
    
    var track_gl_id;
    var bucket_value;
    var temp2 = temp[i].split('_');
    
    track_gl_id = temp2[0];
    if(temp2[1] == "0")
      bucket_value = "false";
    else if(temp2[1] == "1")
      bucket_value = "true";
    else
      bucket_value = "triggered";
    
    arr.push({
      raw: temp[i],
      track_goal_id: track_gl_id,
      track_bucket: bucket_value
    });
    
  }
  
  return arr;
  
}

function process_vwo_ds_campaign_info(str){
  
  var arr = [];
  var temp = str.split(',');
  for(var i = 0; i< temp.length; i++){
    
    var camp_id;
    var bucket_value;
    var temp2 = temp[i].split('_');
    
    camp_id = temp2[0];
    if(temp2[1] == "0")
      bucket_value = "false";
    else(temp2[1] == "1")
      bucket_value = "true";

    arr.push({
      raw: temp[i],
      campaign_id: camp_id,
      campaign_bucket: bucket_value
    });
    
  }
  
  return arr;
  
}

function process_vwo_ds(str){

  var _vwo_ds_parsed = new Object();
  var temp = str.split(':');

  /*parse cookie version*/
  _vwo_ds_parsed.cookieVersion = temp[0];

  /*parse feature_key(is_bucketed) && first session id*/
  _vwo_ds_parsed.feature_key = process_vwo_ds_feature_key(temp[1].split('$')[0]);
  
  /*parse first session id*/
  _vwo_ds_parsed.first_session_id = temp[1].split('$')[1];
  _vwo_ds_parsed.calculated_sampling = temp[2];
  _vwo_ds_parsed.funnel_info = process_vwo_ds_funnel_info(temp[3]);
  _vwo_ds_parsed.track_goal_info = process_vwo_ds_track_info(temp[4]);
  _vwo_ds_parsed.analyze_campaign_info = process_vwo_ds_campaign_info(temp[5]);

  return _vwo_ds_parsed;
}

var x = decodeURIComponent(document.cookie);
var res = x.split(";");
var _vwo_ds_content = searchString('_vwo_ds', res);
_vwo_ds_content = equivString(_vwo_ds_content);
var _vwo_ds_parsed = process_vwo_ds(_vwo_ds_content);

JSONstringify(_vwo_ds_parsed);

