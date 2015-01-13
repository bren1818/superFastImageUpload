<?php
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
				<h2>Native (image) Drop Zone</h2>
				<p style="color: #f00">Please note, if you upload something, it will say it failed, this is due to the fact that this site injects it's analytic tracking codes. View your gallery of uploaded files and they should be present</p>
				<div id="dropzone"></div>
				<p>After Uploading, <b>view</b> your uploaded image(s) <a style="color: #f00;" href="viewGallery.php"><b>here</b>.</a></p>
				
                         
				<div id="expandy1">
					Drag and drop image file(s). Currently limited to 10 at a time...<br/>
					Click Process Queue<br/>
					It'll scale it to 640/480 compress and upload it to me...<br />
					lickity split. Saves banwidth for both of us and time.
				</div>
				
				
			</div>
		</div>
<?php printFooter(); ?>