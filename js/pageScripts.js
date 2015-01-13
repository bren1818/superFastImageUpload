(function( $ ) {
	$.fn.bUpload = function(options) 
	{
		function getFileExtension(filename)
		{
		  var ext = /^.+\.([^.]+)$/.exec(filename);
		  return ext == null ? "" : ext[1];
		}
		
		var settings = $.extend({
			ImageType : 'image/jpeg', //image/png  //image/jpeg
			maxFileQueue : 20,
			maxResizeHeight : 768,
			maxResizeWidth : 500,
			resampleImages : true, // false means they're a file
			scaleBy: 'both', //both, height, width, neither
			ImageQuality: 1.0, //between 0.0 and 1.0
			allowFileTypes : 'image', // image or both
			
			thumbWidth : 64,
			thumbHeight : 64,
			cropThumb : false,
			maxFileSize : 5, //mb || 0 for unlimited
			postURL : 'post_file_xhr.php',
			showProgressbar : true,
			showNotifications: true,
			showReport : true,
			imageTypeMatch : /image.*/,
			thumbAreaId: 'thumbDrop',
			processQueueId : 'go',
			forceImageAsFile : false //make image transfer as a file
			
			//autoProcessQueue: false
			//allowLiveConfigChanges : false
			//compressImagesAtFileSize: 
		
		},options);
		
		
		
		var id = this;
		var dropAreaId = this.attr('id');
	
		
		function isCanvasSupported(){
		  var elem = document.createElement('canvas');
		  return !!(elem.getContext && elem.getContext('2d'));
		}
		
		
		function getCompressedCanvasData( bytes, file ){
			
			if( isCanvasSupported() ){
				var id =  new Date();
				$('#' + thumbsId).append('<canvas id="' + id.getTime() + '">'); //temporary canvas
				var can = document.getElementById(id.getTime());
				var ctx = can.getContext('2d');
				var img = new Image();
				$('#' + dropAreaId).addClass('processing');
				img.onload = function(){
					var maxWidth = settings.maxResizeWidth; // Max width for the image
					var maxHeight = settings.maxResizeHeight;    // Max height for the image
					
					var ratio = 0;  // Used for aspect ratio
					var width = img.width;    // Current image width
					var height = img.height;  // Current image height

					if( settings.scaleBy == "both" || settings.scaleBy == "width"){
						if(width > maxWidth){
							ratio = maxWidth / width;   // get ratio for scaling image
							height = height * ratio;    // Reset height to match scaled image
							width = maxWidth;    // Reset width to match scaled image
						}
					}
					
					if( settings.scaleBy == "both" || settings.scaleBy == "height"){												
						if(height > maxHeight){
							ratio = maxHeight / height; // get ratio for scaling image
							height = maxHeight;
							width = width * ratio;    // Reset width to match scaled image
						}
					}
										
					can.width = width;
					can.height = height;
					ctx.drawImage( img, 0, 0, width, height );
					
					var thumbSrc = can.toDataURL(settings.ImageType, settings.ImageQuality);  //QUALITY
					$('#' + id.getTime()).remove(); //kill the temp canvas
				
					var classes = getFileExtension(file.name);
					thumbnails_.insertAdjacentHTML( 'afterBegin', '<div id="file_' + id.getTime() +'" class="fileContainer"><div class="fileName">' + file.name + '</div><div class="fileSize">' + parseInt(file.size / 1024) + ' KB</div><div class="fileImage ' + classes + '">' +  '<img src="' + thumbSrc + '" height="'+settings.thumbHeight+'" width="' + settings.thumbWidth + '" alt="' + file.name + '" title="' + file.name + '" />' + '</div>' +  ((settings.showProgressbar) ? '<div class="progressBar"><div class="progress">0%</div></div>' : '') + '</div>');
					$('#' + dropAreaId).removeClass('processing');
				}
				img.src =  bytes;
			
			}else{
				if( ((file.size / 1024) /1024) <= settings.maxFileSize && settings.maxFileSize != 0 ){
					spitTemplate('image', file, bytes);
				}
			}
			
		}
		
		function spitTemplate(type, file, thumbSrc){
			type =  type || "file";
			var classes = getFileExtension(file.name);
			var id =  new Date();
			
			if( ((file.size / 1024) /1024) <= settings.maxFileSize && settings.maxFileSize != 0 ){
			
			thumbnails_.insertAdjacentHTML( 'afterBegin', '<div id="file_' + id.getTime() +'" class="fileContainer ' + ((type == 'file') ? 'fileFileContainer' : '') + '"><div class="fileName">' + file.name + '</div><div class="fileSize">' + parseInt(file.size / 1024) + ' KB</div><div class="fileImage ' + classes + '">' + ((type == "image") ? '<img src="' + thumbSrc + '" height="'+settings.thumbHeight+'" width="' + settings.thumbWidth + '" alt="' + file.name + '" title="' + file.name + '" />' : '' ) + '</div>' +  ((settings.showProgressbar) ? '<div class="progressBar"><div class="progress">0%</div></div>' : '') + '</div>');
			
			}else{
				console.log("file too big");
			}
			
		}
		
		function appendStdFile(file,num)
		{	
			if( settings.allowFileTypes == "both" ){
					//do check for bad files?
					
			}else if( settings.allowFileTypes == "image" ){
				if ( !file.type.match(settings.imageTypeMatch )) {
					return;
				}
			}
		
			if ( file.type.match(settings.imageTypeMatch ) && !settings.forceImageAsFile ) 
			{
				if( settings.resampleImages  )
				{
					var r = new FileReader();
					var input = document.getElementById('filesToUpload');
					r.onload = (function(aFile) 
					{
						return function(e) 
						{
							if (e.target.readyState == FileReader.DONE) 
							{
								getCompressedCanvasData(e.target.result, aFile);
								
								
								//remove the file?
								
							}//end file reader complete
						};//end event	
					})(input.files[num]);//done reading the file
					r.readAsDataURL( input.files[num] );
					
				}else{
				
					//check file size
				
				if( ((file.size / 1024) /1024) <= settings.maxFileSize && settings.maxFileSize != 0){
				
					var r = new FileReader();
					var input = document.getElementById('filesToUpload');
					r.onload = (function(aFile) 
					{
						return function(e) 
						{
							if (e.target.readyState == FileReader.DONE) 
							{
								spitTemplate('image', file, e.target.result);								
							}//end file reader complete
						};//end event
						
					})(input.files[num]);//done reading the file
					r.readAsDataURL( input.files[num] );
				}else{
					console.log("image too big");
				}
				
				}
			}else{
				
				//check file size
				
				if( ((file.size / 1024) /1024) <= settings.maxFileSize  && settings.maxFileSize != 0){
					spitTemplate('file', file, '');
				}else{
					console.log( "File To Big");
					
				}
				
			}
			
			
		}
		
		if (window.File && window.FileList && window.FileReader) 
		{
			var el_ = document.getElementById(dropAreaId);
			
			$('<div id="' + settings.thumbAreaId +'"></div><div id="report"></div><div id="' + dropAreaId + '_controls"><button class="clear" id="' + settings.processQueueId +'">Process Queue</button><button class="clearComplete">Clear Completed</button><button class="clearQueue">Clear Queue</button></div>').insertAfter( $('#' + dropAreaId) );
			$( '<form enctype="multipart/form-data"><input class="clear" name="filesToUpload[]"  id="filesToUpload" type="file" multiple/></form>').insertAfter( $('#' + dropAreaId) );
			var thumbnails_ = document.getElementById( settings.thumbAreaId );
			var thumbsId = settings.thumbAreaId;
			
			var input = document.getElementById('filesToUpload');
			$(input).change(function(){
				
				$('#report').html(''); 
				//remove all non uploaded non image files... due to security replaces on drop :(
				 $('#' + settings.thumbAreaId + ' .uploaded').remove();
				
				
				var cnt = 0;
				
				
				for (var x = 0; x <  input.files.length; x++) {
					var file = this.files[x];
					//check if file exists already
					if( $('.fileFileContainer .fileName').filter(':contains("' + file.name + '")').length ){
						log(" already placed: " + file.name );
					}else{
						
						if( cnt < settings.maxFileQueue  ){
						
							appendStdFile(file, x);
						}else{
							continue;
						}
						cnt++;
					}
				}
				
				
				$('#' + settings.processQueueId).show();
				
			});
			
			
			$('#' + dropAreaId + '_controls .clearComplete').click(function(){   $('#' + settings.thumbAreaId + ' .uploaded').remove(); $('#report').html(''); });
			$('#' + dropAreaId + '_controls .clearQueue').click(function(){ $('#' + settings.thumbAreaId + ' .fileContainer').remove();  $('#report').html('');  $('#filesToUpload').replaceWith('<input class="clear" name="filesToUpload[]" id="filesToUpload" type="file" multiple/>');  });
			
		  this.dragenter = function(e) {
			e.stopPropagation();
			e.preventDefault();
			$(el_).addClass('dragEnter');
		  };

		  this.dragover = function(e) {
			e.stopPropagation();
			e.preventDefault();
			$(el_).addClass('dragOver');
			
		  };

		  this.dragleave = function(e) {
			e.stopPropagation();
			e.preventDefault();
			$(el_).removeClass('dragOver');
			$(el_).removeClass('dragEnter');
		  };

		  this.drop = function(e) {
			e.stopPropagation();
			e.preventDefault();

			$('#' + dropAreaId).addClass('processing');
			
			el_.classList.remove('dragEnter');
			el_.classList.remove('dragOver');
			
			files = e.dataTransfer.files ; //global
			
			var onImage = 0;
			var totImages = 0;
			var loaded = 0;
			var totSize = 0; 
			var filesTooLarge = 0;
			//go through all files dropped
			for (var i = 0, file; file = files[i]; i++) {

				if( settings.allowFileTypes == "both" ){
					//do check for bad files?
					
				}else if( settings.allowFileTypes == "image" ){
					//var imageType = /image.*/;
					if ( !file.type.match(settings.imageTypeMatch )) {
						
						if( i == files.length -1){
							$('#' + dropAreaId).removeClass('processing');
						}
						continue; //skip to next item
					}
				}
					
				//greater than max size                             and its not unlimited size and     resampling is false but it is an image
				if(  (((file.size / 1024) / 1024) >  settings.maxFileSize ) &&  (settings.maxFileSize != 0) && ( (settings.resampleImages == false && file.type.match(settings.imageTypeMatch ) ) || !file.type.match(settings.imageTypeMatch )  ) ){
					filesTooLarge++;
					if( settings.showNotifications ){
						notify("Error File [" + file.name + "] too Large. " + settings.maxFileSize + "MB is the max" ,"warning","File Too Large");
					}
					//console.log("toobig");
					if( i == files.length -1){
						$('#' + dropAreaId).removeClass('processing');
					}
					continue;
				}
				
				if( settings.maxFileQueue != 0 ){ //unlimited
					if( totImages > (settings.maxFileQueue -1) ){
						if( i == files.length -1){
							$('#' + dropAreaId).removeClass('processing');
						}
						continue; //skip to next item
					}else{
						totImages++;
					}
				}
				
				var reader = new FileReader();
				reader.onerror = function(evt) {
					//console.log("error");
					 var msg = 'Error ' + evt.target.error.code;
					 switch (evt.target.error.code) {
					   case FileError.NOT_READABLE_ERR:
						 msg += ': NOT_READABLE_ERR';
						 break;
					 };
					 if( settings.showNotifications ){
						notify("Error " + msg ,"","Error Occurred");
					 }else{
						log( msg );
					 }
				};
	
				reader.onload = (function(aFile) 
				{
					return function(evt) 
					{
						if (evt.target.readyState == FileReader.DONE) 
						{
							onImage++;

							
							//if resample && image // || image and over?
							if( settings.resampleImages &&  aFile.type.match(settings.imageTypeMatch ) )
							{  
								loaded++;
								totSize += parseInt(aFile.size / 1024);
								if( loaded == totImages ){
									if( settings.showNotifications ){	notify("Done Pre-Processing ~" + ( totSize / 1024 ) + " mb","","PreProcess Complete!"); }
									$('#' + dropAreaId).removeClass('processing');
								}
								//make thumbnail to upload
								//spitTemplate('image', aFile, getCompressedCanvasData( evt.target.result ) );
								
								getCompressedCanvasData(evt.target.result, aFile);
								
							}else{
								//no compression but an image
								if( aFile.type.match( settings.imageTypeMatch ) ){
									spitTemplate('image', aFile, evt.target.result);
									loaded++;
									totSize += parseInt(aFile.size / 1024);
									if( loaded == totImages ){
										if( settings.showNotifications ){	notify("Done Pre-Processing ~" + ( totSize / 1024 ) + " mb","","PreProcess Complete!"); }
										$('#' + dropAreaId).removeClass('processing');
									}
								//File for upload	
								}else{
									//already handled 
									loaded++;
									if( loaded == totImages ){
										if( settings.showNotifications ){	notify("Done Pre-Processing ~" + ( totSize / 1024 ) + " mb","","PreProcess Complete!"); }
										$('#' + dropAreaId).removeClass('processing');
									}
								}									
							}
								
							$('#' + dropAreaId).html('<p>Pre-Processing image ' + onImage + ' of ' + totImages + '</p>');
							if( onImage == totImages){
									$('#' +dropAreaId).html('');
							}	
						}//end file reader complete
					};//end event
				})(file);//done reading the file
				
				//read the file
				reader.readAsDataURL(file);
				
				//we're done going through the dropped files
				if( i == files.length -1 || (i + filesTooLarge) == files.length -1 ){
					$('#' + settings.processQueueId).show();
				}  
			}

			return false;
		  };

		  el_.addEventListener("dragenter", this.dragenter, false);
		  el_.addEventListener("dragover", this.dragover, false);
		  el_.addEventListener("dragleave", this.dragleave, false);
		  el_.addEventListener("drop", this.drop, false);
		  
			$('#' + settings.processQueueId).click(function(event){	
					
					$('#report').html('');
					
					if( settings.showNotifications ){
						notify("Uploading in Progress","","Uploading in Progress");
					}
					completed = 0;
					failed = 0;
					numImages  = $('.fileContainer').not('.uploaded').not('.fileFileContainer').length ;
					
					$('.fileContainer').not('.uploaded').not('.fileFileContainer').find(' > .fileImage > img').each(function(){
						var parent = $(this).parent().parent();
						var img = $(this);
						xhrAjax( img , $(parent).find('.fileName').html(), settings.ImageType);
					}); 
					
					$('.fileFileContainer').not('.uploaded').each(function(){
						var parent = $(this);
						xhrAjax( $(parent).find('.progress')  , $(parent).find('.fileName').html() ,  getFileExtension( $(parent).find('.fileName').html() ) , 'file' ); 
					});
					
					$('#' + settings.processQueueId).hide();
			});
		  
		}
		else
		{
			$('#' +dropAreaId).hide();
			
			var fileFields = "";
			for(var f = 0; f < settings.maxFileQueue; f++){
				fileFields+= '<input class="clear ' + ((f %2==0) ? 'odd' : 'even') +'" name="file_' + f + '"  id="filesToUpload_' + f + '" type="file" /><br/>';
			}
			

			var setting ="";
			for(var propertyName in settings) {
				setting+= '<input type="hidden" value="' + settings[propertyName] + '" name="' + propertyName + '" />';
			}
			
			$( '<form enctype="multipart/form-data" action="' + settings.postURL +'" method="post">' + fileFields + ' ' + setting + '<input type="hidden" name="barbaricUpload" value="1" /><input id="badUpload" type="submit" name="submit" value="Upload File" /></form>').insertAfter( $('#' + dropAreaId) );
			

			
		}
		  
		function progressHandlingFunction(ev,data){
			if (data.lengthComputable) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
			}
		}
		
		//image
		function xhrAjax(img, name, type, fileD )
		{
			var file = new FormData;
				file.append('filename', name);
				file.append('filetype', type);
			
			for(var propertyName in settings) {
			//	file.append('' + propertyName, settings[propertyName] ); 
			}
		
			
			if( fileD != undefined ){
				var input = document.getElementById('filesToUpload');
					for (var x = 0; x <  input.files.length; x++) {
						var i = input.files[x];
						if( i.name == name){
							file.append('theFile',  i ); //add to the form data to upload
							break;
						}
					}
			}else{
				var image = $(img).attr('src') ;
				image = image.replace('data:'+settings.ImageType+';base64,', '');
				file.append('pic', image);
			}
			
			var xhr = new XMLHttpRequest();
			xhr.addEventListener('progress', function(e) {
			
				if( settings.showProgressbar == true ){
					var done = e.position || e.loaded, total = e.totalSize || e.total;
					//console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
					$(img).parent().parent().find('.progressBar .progress').html( (Math.floor(done/total*1000)/10) + '%' );
					$(img).parent().parent().find('.progressBar .progress').css('width',  (Math.floor(done/total*1000)/10) + '%' );
				}
				
			}, false);
			if ( xhr.upload ) {
				xhr.upload.onprogress = function(e) {
					if( settings.showProgressbar == true ){
						var done = e.position || e.loaded, total = e.totalSize || e.total;
						//console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
						
						$(img).parent().parent().find('.progressBar .progress').html( (Math.floor(done/total*1000)/10) + '%' );
						$(img).parent().parent().find('.progressBar .progress').css('width',  (Math.floor(done/total*1000)/10) + '%' );
					}
				};
			}
			xhr.onreadystatechange = function(e) {
				if ( 4 == this.readyState ) {
					//console.log(['xhr upload complete', e]);
					if( settings.showProgressbar == true ){
						$(img).parent().parent().find('.progressBar .progress').html(  '100%' );
						$(img).parent().parent().find('.progressBar .progress').css('width', '100%' );
					}
					
					if( xhr.responseText == 1 ){
						completed++;
						
						$(img).parent().parent().addClass('uploaded');
						$(img).parent().parent().removeClass('uploading');
						
					}else{
						failed++;
						
						$(img).parent().parent().addClass('failed');
						$(img).parent().parent().removeClass('uploading');
						if( settings.showProgressbar == true ){
							$(img).parent().parent().find('.progressBar .progress').html(  'FAILED' );
						}
					}
					if( settings.showReport ){
						$('#report').html('<p>' + completed + ' / ' + numImages + ' uploaded. ' + failed + ' failed.</p>');
					}
					if( (completed + failed) == numImages ){  if( settings.showNotifications ){ notify( completed + " Images Uploaded","","Jobs Done!"); } }
					
				}
			};
			xhr.open('post', settings.postURL , true);
			xhr.send(file);
				
		}
	};
})(jQuery);	