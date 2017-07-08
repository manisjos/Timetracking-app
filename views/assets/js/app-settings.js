var settingsData = angular.module('settingsData', []);

settingsData.controller('updatePwdCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
	

		//$scope.salesData = [];
		$scope.updatePassword = function(oldPwd,newPwd){
			
			
			var usrName = localStorage.getItem("login");
			var appKey = localStorage.getItem("appKey");

				var dfrd = $q.defer();

				$http.post(APIBaseURL+'updatePwd', 

					{
						params:{akey: appKey, uname: usrName, oldpwd: oldPwd, newpwd: newPwd},

					}
				)					
				.then(

					function(response) {

						var msg = response.data;

						swal("", ""+msg.message+" !" , "success");

					}, function(response) {
						//console.log(response.data);
						dfrd.reject(true);
					}
				);
				return dfrd.promise;
			

		}; /* end of update password */
    
}]);



settingsData.controller('settingsCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
	

		$scope.fetchTotalSettings = function(){
			

			var appKey = localStorage.getItem("appKey");
			

			var dfrd = $q.defer();
			$http.get(APIBaseURL + 'getAppSettings', 
					   
				{
					params:{akey: appKey},
					//headers: {Authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='}
				}
			)
			.then(function(response) {
				
				var data = response.data; 
				
				$scope.regcode = data.akey;
				
				var actData = data.act;
				//console.log(data);
				
				for(var i = 0; i<actData.length; i++){
					
					var devicetype = actData[i].dt;
					var platform = actData[i].pf;				
					var scrname = actData[i].name;
					
					// Check for device and show full name
					switch (devicetype) {
					  case 'S':
						actData[i].dt = "Smartphone";
						actData[i].dtsm = "S";
						break;
					  case 'T': 
						actData[i].dt = "Tablet";
						actData[i].dtsm = "T";
						break;
					  default:
						console.log('');
					};
					
					// Check for OS and show full name
					switch (platform) {
					  case 'A':
						actData[i].pf = "Android";
						actData[i].pfsm = "A";
							//console.log(actData[i].pf);
						break;
					  case 'W': 
						actData[i].pf = "Windows";
						actData[i].pfsm = "W";
						break;
					  case 'iOS': 
						actData[i].pf = "iOS";
						actData[i].pfsm = "iOS";
							//console.log(actData[i].pf);
						break; 
					  default:
						console.log('');
					};
					
					
					
					
				}// End of for loop
				
				//console.log(actData);
				$scope.settings = actData;
				
				
				
			}, function(x) {
				dfrd.reject(true);
			});
			return dfrd.promise;
			
		
		};// END OF FETCH TOTAL SETTINGS FUNC
	
	
	
			
			// On input change add class to same row
			$("#scrMap").on('input', '.scr-name', function(event){
				 
				// CURENT changed input ID
				var elmInputId = $(this).attr('id');
				
				// ADD CLASS TO ROW  WITH IMAGE SELECTED
				$("#"+ elmInputId).parent().parent().addClass(" upl-img");
				 
			 });
	
	
	
	
			
	
			 // add "upl-img" class to row with Image uploaded
			 var imgFilePath 
	
			 $("#scrMap").on('change', '.ulp-file', function(event){

				// CURENT ELM ID
				var elmId = $(this).attr('id');

				// ADD CLASS TO ROW  WITH IMAGE SELECTED
				$("#"+ elmId).parent().parent().addClass(" upl-img");
				

				var imgFile = $("#"+ elmId).prop("files")[0]; 
				 
				var imgSize = parseFloat(imgFile.size / 1024).toFixed(2);
				
				if(imgSize > 100) 
					{
						swal("OOPS " +imgSize+ " kb", "Image size cannot be more than 100kb" );
						$("#"+ elmId).val("");
						$("#"+ elmId).next().val("");
					}
				 else 
				 	{
					
					   var reader  = new FileReader();
					   reader.onloadend = function () {
						   imgFile.src = reader.result;

						   imgFilePath = imgFile.src

							$("#"+ elmId).next().val(imgFilePath);
					   }

					   if (imgFile) {
						   reader.readAsDataURL(imgFile); //reads the data as a URL

					   } else {
						   imgFile.src = "";
					   }
				 }

		});
	
	
		function storeTblValues()
		{
			var TableData = new Array();

			$('tr.upl-img').each(function(row, tr){
				TableData[row]={
					"dt" : $(tr).find('td:eq(0)').data('device')
					, "pf" :$(tr).find('td:eq(1)').data('platform')
					, "aname" : $(tr).find('td:eq(2)').text()
					, "name" : $(tr).find('td:eq(3) input').val()
					, "imgname" : $(tr).find('td:eq(4) input:hidden').val()
				}

			}); 
			
			return TableData;
			//console.log(TableData);
		}

		/*function convertArrayToJSON()
		{
			var TableData;
			TableData = JSON.stringify(storeTblValues());
			console.log('JSON array: \n\n' + TableData.replace(/},/g, "},\n"));
			return TableData
			
		}*/
	
	
		$scope.uploadChangedSettings = function(){
			//alert(e);
			
			var usrName = localStorage.getItem("userName");
			var appKey = localStorage.getItem("appKey");
			
			var TableData;
			var TableData = JSON.stringify(storeTblValues());
			var jsonTable = JSON.parse(TableData);
			//console.log(jsonTable);
			//console.log('JSON array: \n\n' + TableData.replace(/},/g, "},\n"));
			//console.log('JSON array: \n\n' + storeTblValues());
					
				var dfrd = $q.defer();
				$http.post(APIBaseURL +'uploadImg', 

					{
						params:{akey: appKey, userName: usrName, cTableData : jsonTable},
						//Content-Type: application/json
						//headers: {Authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='}
					}
				)
				.then(function(response) {


					//console.log(response.data);
					var msg = response.data;
					swal("", ""+msg.message+" !" , "success")
					//alert(msg.message)

				}, function(x) {
					dfrd.reject(true);
				});
				return dfrd.promise;
		};
    
}]);



