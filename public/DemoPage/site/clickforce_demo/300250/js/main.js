$(function(){
	$(".navi-s-btn").mouseover(function(){
		$(this).find("li").show();
		
	});
	$(".navi-s-btn").mouseout(function(){
		$(this).find("li").hide();
		
	});	

	$(".msg-btn").click(function(){
		var url = $(this).prop("href");
		$.ajax({
			type: 'POST',
			url: url,
			success:function(html){
				$("#main-modal-content").html(html);
				$("#main-modal").modal('show');
			}
		})
        .fail(function(e) {
            alert("功能維護中，若您有需要可聯絡本公司電話02-2719-8500將有專人為您服務");
        });	

        return false;	
	});

	$("#item4 iframe").css("width","990px").css("height","590px");

	var thisUrl = location.href;

	if(thisUrl.indexOf("#contact")!=-1){
		var url = $("#contact-btn").prop("href");
		$.ajax({
			type: 'POST',
			url: url,
			success:function(html){
				$("#main-modal-content").html(html);
				$("#main-modal").modal('show');
			}
		})
        .fail(function(e) {
            alert("功能維護中，若您有需要可聯絡本公司電話02-2719-8500將有專人為您服務");
        });	

        return false;		
	}

	if(thisUrl.indexOf("#privacyPolicy")!=-1){
		var url = $("#privacyPolicy-btn").prop("href");
		$.ajax({
			type: 'POST',
			url: url,
			success:function(html){
				$("#main-modal-content").html(html);
				$("#main-modal").modal('show');
			}
		})
        .fail(function(e) {
            alert("功能維護中，若您有需要可聯絡本公司電話02-2719-8500將有專人為您服務");
        });	

        return false;		
	}

	if(thisUrl.indexOf("#cooperation")!=-1){
		var url = $("#cooperation-btn").prop("href");
		$.ajax({
			type: 'POST',
			url: url,
			success:function(html){
				$("#main-modal-content").html(html);
				$("#main-modal").modal('show');
			}
		})
        .fail(function(e) {
            alert("功能維護中，若您有需要可聯絡本公司電話02-2719-8500將有專人為您服務");
        });	

        return false;		
	}

	if(thisUrl.indexOf("#newsPaper")!=-1){
		var url = $("#newsPaper-btn").prop("href");
		$.ajax({
			type: 'POST',
			url: url,
			success:function(html){
				$("#main-modal-content").html(html);
				$("#main-modal").modal('show');
			}
		})
        .fail(function(e) {
            alert("功能維護中，若您有需要可聯絡本公司電話02-2719-8500將有專人為您服務");
        });	

        return false;		
	}		
})