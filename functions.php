<?php
	session_start();
	global $sessionID;
	$sessionID = session_id(); 
?>

<?php function printHeader(){ ?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<!--<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /> Put into HTACCESS-->

	<title>Bren's Test Site</title>

	<meta name="author" content="Bren's Template Site" />
	<meta name="description" content="A simple template Site" />
    <meta name="keywords" content="HTML, Javascript, jQuery, CSS, CSS3, less.js" />
    
	<meta property="og:site_name" content="Bren's Website"/> <!-- Website Title -->
	<meta property="og:title" content="Bren's Template Site" /> <!-- Page Title -->
    <meta property="og:type" content="website" /> <!--Type of page -->
    <meta property="og:image" content="theme/touch-icon-iphone4.png" /> <!-- Image shown -->
	
    <meta property="og:url" content="http://bren1818.kicks-ass.net/"/> <!-- canonical link to this page -->
	<link rel="canonical" href="http://bren1818.kicks-ass.net/" /> <!-- canonical link to this page -->
    
    <meta name="revisit-after" content="30 days" /> <!--How often the page should be re-crawled -->
    
	<!-- Mobile -->
	
	<link rel="shortcut icon" type="image/x-icon" href="theme/favicon.ico">
    <link rel="apple-touch-icon" href="theme/touch-icon-iphone.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="theme/touch-icon-ipad.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="theme/touch-icon-iphone4.png" />
	<link rel="apple-touch-icon" sizes="144x144" href="theme/touch-icon-ipad-retina.png" />
	
    <!-- iPod/Phone 320 x 460 image -->
    <link rel="apple-touch-startup-image" href="theme/startup-iPod.jpg"/> 
	<!--iPad Portrait 768 x 1004 -->
    <link rel="apple-touch-startup-image" href="theme/startup-iPad-portrait.jpg" media="(device-width: 768px) and (orientation: portrait)" /> 
	<!--iPad LandScape 1024 x 748--> 
    <link rel="apple-touch-startup-image" href="theme/startup-iPad-landscape.jpg" media="(device-width: 768px) and (orientation: landscape)" /> 
    
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" /> <!--could be default-->
	
	<meta name="HandheldFriendly" content="True" />
	<meta id="Viewport" name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
	
	<!-- End Mobile -->
	
	<!-- CSS -->
	<link href="css/smoothness/jquery-ui-1.9.2.custom.css" rel="stylesheet"/>
    <link href="css/cboxStyles/1/colorbox.css" rel="stylesheet"/>
	
	<!-- End CSS -->
	
	<!-- Scripts -->
	<script src="js/jquery-1.8.3.js">              </script>
	<script src="js/jquery-ui-1.9.2.custom.min.js"></script>
    <script src="js/modernizr.js">                 </script>
	<script src="js/jquery.colorbox-min.js">       </script>
	
   
	<link href='http://fonts.googleapis.com/css?family=Cabin' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/less" href="css/style.css" /> <!-- This auto includes the styleLib.less must be # 1 -->
   
    
	<script src="js/less-1.3.1.min.js" type="text/javascript"></script>
	<script src="js/blib.js" type="text/javascript"></script>  <!--Bren Scripts --> 
	
	<script src="js/pageScripts.js">       </script>
	
    <script type="text/javascript">
		var sessionId = "<?php global $sessionID; echo $sessionID; ?>";
		
		$(function(){
			
			$('#dropzone').bUpload({'maxResizeHeight': 1024, 'maxResizeWidth': 1024, showProgressbar : true, showNotifications : true , thumbAreaId : "ThumbArea", resampleImages : true, allowFileTypes : 'both', maxFileSize : 2 });
			
			setViewPort(480); //viewport for mobile devices
			
			//function to show mini bar when large header bar is out of view
			$(window).bind('scroll', function(){
					var headerHeight = $('#header').height();
					if( $(window).scrollTop() > ( headerHeight  ) ){
						$('body').addClass('showMiniMenu');
					}else{
						$('body').removeClass('showMiniMenu');
					}
			});
			
			initNotificationControls('browser');
			initAccessibilityControls();
			
			$('#expandy1').expandy("Read Me...");
		});
	</script>
	<!-- End Scripts -->
</head>

<body>
<div id="srollHeaderBar" class="siteSection">
		<div class="siteContent nonContentSiteSection">
		
		</div>
</div>

<div id="wrap">
	<div id="main">

<?php } ?>


<?php function printFooter(){ ?>
</div>
</div>
<div class="leatherWrap" id="footer">
   <div class="siteSection nonContentSiteSection" >
		<div class="siteContent">
			<p><span style="color: #fff;">&copy; Brendon Irwin</span></p>
		</div>
	</div>
</div>
</body>
</html>
<?php } ?>