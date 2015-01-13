<?php
session_start();
$sessionID = session_id(); 


if( !is_dir('uploads/'.$sessionID) ){
	mkdir('uploads/' . "$sessionID", 0777);
}



$json = stripslashes($_POST["json"]);
if( isset($json) ){		
	$note = json_decode($json);

	$INPUT = $note->{'pic'};
	$OUTPUT =   = preg_replace("/\\.[^.\\s]{3,4}$/", "", $note->{'filename'} );
	
	$TYPE = $note->{'type'};
	
	
	
	if( $TYPE == "image/jpeg" ){
		$OUTPUT= $OUTPUT.".jpg";
	}else{
		$OUTPUT= $OUTPUT.".png";
	}
		
		
		
	$bin = base64_decode($INPUT);

	file_put_contents("uploads/$sessionID/".$OUTPUT, $bin);

	echo "1";
}else{
	echo "0";
}
?>