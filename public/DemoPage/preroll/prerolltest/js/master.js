$(document).ready(function(){
	$(".language").click(function(){
		var $languageList = $(".language-list");
		if($languageList.hasClass("open"))
		{
			$languageList.slideUp(300);
			$languageList.removeClass("open");
		}else
		{
			$languageList.slideDown(300);
			$languageList.addClass("open");
		}
	});
})
function updateMaster(year)
{

	var tr = document.getElementById("footerTable").insertRow(-1);
	var td = tr.insertCell(-1);
	td.colSpan = 2;
	td.className = "footerCopyright";
	td.align = "center";
	td.innerHTML = getLocalizedString("copyright") + ' ' + year + getLocalizedString("rights_reserved")
}
function showModal(modal)
{
	$("#modalUnder").show();
	$("#modal" + modal).show();
}
function hideModal(modal)
{
	$("#modal" + modal).hide();
	$("#modalUnder").hide();
}
function showSignIn()
{
	var url = location.href;
	if(url.indexOf("?")!=-1)
		url = url.substr(0, url.indexOf("?"));
	url = LOC_SERVER_SECURE + "secure/signin?parent=" + encodeURIComponent(url);
	document.getElementById("signInFrame").src = url;
	$('html,body').animate({scrollTop:0},'slow');
	showModal("Signin");
}
function hideFooterMenu(){
	for(var i = 0;i < 4;i++){
		$("#footer li").eq(i).hide();
	}
}
setInterval(hideFooterMenu,1);
