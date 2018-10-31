(function (){
	function setGdprCookie(){
	    var d = new Date();
	    d.setTime(d.getTime() + (600*24*60*60*1000));
	    var expires = "expires="+ d.toUTCString();
	    document.cookie = "gdpr=done;" + expires + ";path=/"; 
	}

	var gdprDisagree = document.querySelector('.gdprDisagree');
	var gdprAgree = document.querySelector('.gdprAgree');
	var gdprWrap = document.querySelector('.gdprWrap');

	if((document.cookie).indexOf('gdpr=done') ===-1){
	    gdprWrap.style.display = 'block';
	}
	gdprDisagree.addEventListener('click',function (){
		setGdprCookie();
		var image = new Image(1, 1);
		image.src = 'https://pp.doublemax.net/setCookie.php?Agree';
		gdprWrap.style.display = 'none';
	});
	gdprAgree.addEventListener('click',function (){
		setGdprCookie();
		var image = new Image(1, 1);
		image.src = 'https://pp.doublemax.net/setCookie.php?Remove';
		gdprWrap.style.display = 'none';	
	});

})();
