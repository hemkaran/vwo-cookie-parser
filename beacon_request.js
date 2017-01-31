function b_request(config){

	/*config.url
	config.data
	config.success
	config.type : GET/POST for ajax
	config.log : true/false for console logs
	config.retryCount: maximum times to retry
	config.priority: "beacon"|"ajax"
	*/

	if(config.priority == "beacon" && (undefined != self.navigator.sendBeacon)){


		while(config.retryCount >= 0){

			if(navigator.sendBeacon(config.url, config.data)){

				if(config.log)
					console.log('b_request: Becon Request Sent');

				if(config.success){
					if(typeof config.sucess === "function")
						config.sucess();
				}

				return true;

			}else{

				if(config.log)
					console.log('b_request: Becon Request Failed Retrying');

				config.retryCount--;
			}
		}

		if(config.log)
			console.log('b_request: Becon Request Failed after maximum retry');

		return false;

	}else{

		$.ajax({
		    url : config.url,
		    type : config.type,
		    data :  config.data,   
		    tryCount : 0,
		    retryLimit : config.retryCount,
		    success : config.success,
		    error : function(xhr, textStatus, errorThrown ) {
		        if (textStatus == 'timeout') {
		            this.tryCount++;
		            if (this.tryCount <= this.retryLimit) {
		                //try again
		                if(config.log)
		            		console.log('b_request: Error in AJAX mode retrying');
		                $.ajax(this);
		                return;
		            }            
		            return;
		        }
		        if (xhr.status == 500) {
		            if(config.log)
		            	console.log('b_request: Error 500 while trying AJAX mode');
		        } else {

		            if(config.log)
		            	console.log('b_request: Error 500 while trying AJAX mode');
		        }
    		}
		});
	}


}
