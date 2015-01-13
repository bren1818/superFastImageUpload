<?php
if( !isset( $_POST['barbaricUpload'] ) ){
	session_start();
	$sessionID = session_id();

	if( !is_dir('uploads/xhr/'.$sessionID) ){
		//mkdir('uploads/xhr/' . "$sessionID", 0777);
		mkdir(dirname(__FILE__) . "/uploads/xhr/" ."$sessionID");
	}

	if( isset($_POST['filename'])  && isset($_POST['pic'])  ){		//and compressed...
			$INPUT = $_POST['pic'];
			$OUTPUT = preg_replace("/\\.[^.\\s]{3,4}$/", "", $_POST['filename'] );
			
			$TYPE = $_POST['filetype'];
			
			if( $TYPE == "image/jpeg" ){
				$OUTPUT= $OUTPUT.".jpg";
			}else{
				$OUTPUT= $OUTPUT.".png";
			}
			
			$bin = base64_decode($INPUT);
			file_put_contents("uploads/xhr/$sessionID/".$OUTPUT, $bin);
			echo 1;
	}else{
		
		
			$filename =  $_FILES['theFile']['name'] ;
			 $filesize =  $_FILES['theFile']['size']; 
			 $erro     =  $_FILES['theFile']['error']; //checks UPLOAD_ERR_OK
			 $tmpname  = $_FILES['theFile']['tmp_name'];              
			

			
			$INPUT = $_FILES['theFile'];
			 move_uploaded_file($tmpname, "uploads/xhr/$sessionID/".$filename );
			
		
			
			echo 1;
		
	}
}else{
	/*Supporting IE :| */
	
	include "imgResize.php";
	include "functions.php";
	printHeader();
	?>
	<div class="leatherWrap">
			<div class="siteSection nonContentSiteSection" id="header">
					<div class="siteContent">
						<div id="logo">
							<a onclick='notify("Hello, Thanks for visiting!","success","You Rock!");'>Bren's<br/>Site</a>
						</div>
						
						<div id="menu">
							<ul>
								<li>
									<a target="_blank" href="https://github.com/bren1818">Git Hub *new*</a>
								</li>
								<li>
									<a target="_blank" href="http://bren1818.blogspot.ca/">Blog</a>
								</li>
								<li>
									<a target="_blank" href="http://brendonirwin.dyndns.org">My Site (Hosted locally may be offline)</a>
								</li>
								<li>
									<a target="_blank" href="http://www.linkedin.com/pub/brendon-irwin/19/8b8/188">Linked In</a>
								</li>
							</ul>
						</div>
					</div>
			</div>
		</div>
	   
	   
        <div class="siteSection">
            <div class="siteContent">
			<?php
			
	if( !is_dir('uploads/xhr/'.$sessionID) ){
	//	mkdir('uploads/xhr/' . "$sessionID", 0777);
	mkdir(dirname(__FILE__) . "/uploads/xhr/" ."$sessionID");
	
	}
	
	function is_image($path)
	{
		$a = getimagesize($path);
		$image_type = $a[2];
		
		if(in_array($image_type , array(IMAGETYPE_GIF , IMAGETYPE_JPEG ,IMAGETYPE_PNG , IMAGETYPE_BMP)))
		{
			return true;
		}
		return false;
	}
		
	//should be sanitized
	$maxFiles = $_POST['maxFileQueue'];
	$imageHeight = $_POST['maxResizeHeight'];
	$imageWidth = $_POST['maxResizeWidth'];
	$scaleBy = $_POST['scaleBy'];
	$imageQuality = $_POST['ImageQuality'];
	$maxFileSize = $_POST['maxFileSize'];
	$forceImageAsFile = $_POST['forceImageAsFile'];
	$allowFileTypes = $_POST['allowFileTypes'];
	
	$fails = 0;
	$uploads = 0;
	for( $f = 0; $f < $maxFiles; $f++){
		$curFile = "file_".$f;
		if ($_FILES[$curFile]["error"] > 0)
		{
			if( $_FILES[$curFile]["name"] != ""){
				$fails++;
			}
		}
		else
		{
			
			//echo "Type: " . $_FILES[$curFile]["type"] . "<br>";
			//echo "Size: " . (($_FILES[$curFile]["size"] / 1024) /1024) . " kB<br>";
			//echo "Stored in: " . $_FILES["file"]["tmp_name"];
			$tmpname  = $_FILES[$curFile]['tmp_name'];
		
			//is image
			if( is_image($tmpname) == 1 && $forceImageAsFile == "false" ){
				
				if( $allowFileTypes == "both" || $allowFileTypes == "image" ){
			
					if( move_uploaded_file($tmpname, "uploads/xhr/$sessionID/".$_FILES[$curFile]["name"] ) )
					{
						//$tmpname = getcwd(). "\\uploads\\xhr\\$sessionID\\".$_FILES[$curFile]["name"];
						
						$tmpname = getcwd(). "/uploads/xhr/$sessionID/".$_FILES[$curFile]["name"];
						
						$resizeObj = new resize($tmpname);  
						if( $scaleBy == "height" ){
							//getSizeByFixedHeight
							$resizeObj -> resizeImage( $resizeObj ->getSizeByFixedHeight($imageHeight), $imageHeight, 'auto');  
						}else if( $scaleBy == "width" ){
							//getSizeByFixedWidth
							$resizeObj -> resizeImage( $imageWidth, $resizeObj ->getSizeByFixedWidth($imageWidth), 'auto');  
						}else{ //both
							$resizeObj -> resizeImage($imageWidth, $imageHeight, 'auto');  
						}
						
						$resizeObj -> saveImage($tmpname , ($imageQuality * 100) );
						
						//check if still too big
						
						if( ((filesize($tmpname) / 1024) /1024) > $maxFileSize ){
						
							echo "Upload of: " . $_FILES[$curFile]["name"] . " failed. File too big even after compression. <br>";
							unlink( $tmpname  );
							$fails++;
						}else{

							$uploads++;
							echo "Upload: " . $_FILES[$curFile]["name"] . "<br>";
						}
					}
				}
			}else{
				//file size
				if( $allowFileTypes == "both" ){
				
					if( (($_FILES[$curFile]["size"] / 1024) /1024) < $maxFileSize ){
						if( move_uploaded_file($tmpname, "uploads/xhr/$sessionID/".$_FILES[$curFile]["name"] ) ){
							$uploads++;
							echo "Upload: " . $_FILES[$curFile]["name"] . "<br>";
						}	
					}else{
						$fails++;
						echo "Upload of: " . $_FILES[$curFile]["name"] . " failed. File too big<br>";
					}
				}else{
					$fails++;
					echo "Upload of: " . $_FILES[$curFile]["name"] . " failed. Only images allowed<br>";
				}
			}
			
			
		}	
	
	
	}
	echo "<p>".$uploads." files uploaded OK. ".$fails." file(s) failed to upload</p>";
	echo "<p>If you weren't using IE... or some crappy browser you could be uploading multiple files at once, without posting back...</p>";
	echo "<p><a href='".$_SERVER['HTTP_REFERER']."'>Go Back</a>, and feel free to upload another.</p>";
	
	?>
		<p><b>View</b> your uploaded image(s) <a style="color: #f00;" href="viewGallery.php"><b>here</b>.</a></p>
				</div>
		</div>
	<?php
	printFooter();
}
?>
