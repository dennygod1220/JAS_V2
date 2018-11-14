
function nlLoadScript(src)
{
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = src;
	var stag = document.getElementsByTagName("script")[0];
	stag.parentNode.insertBefore(script, stag);
}

function nlLoadStyle(src)
{
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = src;
	var stag = document.getElementsByTagName("script")[0];
	stag.parentNode.insertBefore(link, stag);
}

var nlLastProgram = null;
var nlConfigs = null;
var nlAdPlayerObj = null;
var nlIsHTML5 = false;
var nlIsAndroid = false;
var nlSessionPollInt = 0;
var NL_SESSION_POLL_INTERVAL = 1000 * 60 * 2;

var ua = navigator.userAgent.toLowerCase();
var nlIsiOS = (ua.indexOf("ipad")!=-1 || ua.indexOf("iphone")!=-1);

function nlRenderPlayerCustom(configs){}

function nlRenderPlayer(configs,program)
{
	nlRenderPlayerCustom(configs);
	nlConfigs = configs;
	if(nlConfigs.playerId==null || nlConfigs.playerId.length==0)
		nlConfigs.playerId = "nlplayer";
	if(nlConfigs.customPath==null)
		nlConfigs.customPath = "";
	if(program!=null)
		nlLastProgram = program;
	nlLoadTracker();
	if(nlIsiOS || nlConfigs.noFlash)
	{
		if(nlConfigs.noHTML5)
		{
			if(nlConfigs.unsupportedCallback!=null)
				nlConfigs.unsupportedCallback();
		}
		else
		{
			nlIsHTML5 = true;
			nlInitFlashCheck();
		}
	}
	else
	{
		if(ua.indexOf("android")!=-1)
			nlIsAndroid = true;
		nlLoadScript(nlConfigs.locResource+"scripts/swfobject.js");
		setTimeout("nlInitFlashCheck()",200);
	}
}

var nlRenderCounter = 0;
function nlInitFlashCheck()
{
	if((!nlIsHTML5 && window.swfobject==null) || document.getElementById(nlConfigs.containerId)==null || 
		typeof require == "undefined" || typeof NLTracker == "undefined")
	{
		if((nlRenderCounter++)<100)
			setTimeout("nlInitFlashCheck()",100);
		else
			setTimeout("nlInitFlashCheck()",5000);
	}
	else
	{
		var div = document.getElementById("nlplayerplaceholder");
		if(div==null)
		{
			var container = document.getElementById(nlConfigs.containerId);
			var div = document.createElement("DIV");
			div.id = "nlplayerplaceholder";
			container.appendChild(div);
		}
		nlLoadScript(nlConfigs.locResource+"scripts/companions.js");
		nlLoadStyle(nlConfigs.locResource+"styles/overlay.css");
		
		if(nlConfigs.audio)
			nlConfigs.useCustomControls = true;
			
		nlLoadStyle(nlConfigs.locResource+nlConfigs.customPath+"styles/nlcontrols.css");
		if(nlConfigs.useCustomControls!=null)
			nlLoadScript(nlConfigs.locResource+nlConfigs.customPath+"scripts/nlcontrols.js");
	
		if(!nlIsHTML5)
		{
			var pv = swfobject.getFlashPlayerVersion();
			if((pv!=null && pv.major==0))
			{
				if(nlConfigs.noHTML5)
				{
					if(nlConfigs.unsupportedCallback!=null)
						nlConfigs.unsupportedCallback();
				}
				else
				{
					nlIsHTML5 = true;
					loadHTML5Scripts();
				}	
			}
			else
				nlRenderVideoPlayer();
		}
		else
			loadHTML5Scripts();
			
		NLTracker.initialize(nlConfigs);
	}
}

function loadHTML5Scripts()
{
	var v = document.createElement("video");
	if(v.canPlayType!=null)
	{
		nlIsHTML5 = true;
		var ph = document.getElementById("nlplayerplaceholder");
		ph.parentNode.removeChild(ph);
		if(nlConfigs.hasAds && nlAdPlayerObj==null)
		{
			if(nlConfigs.fwConfig!=null)
			{
				nlLoadScript(nlConfigs.fwConfig.locJS);
				nlLoadScript(nlConfigs.locResource+"scripts/nladplayerfw.js");
			}
			else
			{
				nlLoadScript("//imasdk.googleapis.com/js/sdkloader/ima3.js");
				nlLoadScript(nlConfigs.locResource+"scripts/nlgimahtml5.js");
			}	
			nlRenderAdPlayerHTML5();
		}
		nlRenderVideoPlayerHTML5();
	}
	else
	{
		if(nlConfigs.unsupportedCallback!=null)
			nlConfigs.unsupportedCallback();
	}
}

var nlRenderAdHtml5Counter = 0;
function nlRenderAdPlayerHTML5()
{
	if(nlConfigs.fwConfig!=null)
	{
		if(typeof nlFreeWheelHtml5!="function"||typeof tv=="undefined")
		{	
			if((nlRenderAdHtml5Counter++)<100)
				setTimeout(function(){nlRenderAdPlayerHTML5();},100);
			else
				nlRenderVideoPlayerHTML5();
		}
		else
		{	
			nlAdPlayerObj  = new nlFreeWheelHtml5(nlConfigs.fwConfig, nlConfigs.containerId, nlConfigs.playerId);
			nlRenderVideoPlayerHTML5();
		}
	}
	else
	{
		var gimaLoaded = (window.google!=null);
		if(!gimaLoaded)
		{
			if((nlRenderAdHtml5Counter++)<100)
				setTimeout("nlRenderAdPlayerHTML5()",100);
			else
				return;
		}
		else if(window.google.ima == null || typeof initAdPlayer!="function")
		{	
			if((nlRenderAdHtml5Counter++)<100)
				setTimeout("nlRenderAdPlayerHTML5()",100);
			else
				return;
		}
		else
		{
			nlAdPlayerObj = new initAdPlayer(nlConfigs.containerId,nlConfigs.companionsInfo);
			if(nlLastProgram && nlLastProgram.adTag!=null)
				nlAdPlayerObj.AD_TAG = nlLastProgram.adTag;
			nlRenderVideoPlayerHTML5();
		}
	}
}

function nlRenderVideoPlayer()
{
	var p = document.getElementById(nlConfigs.playerId);
	if(p==null)
	{
		var flashvars = {htmlid:nlConfigs.playerId,readyCallback:"listenNLReady",completeCallback:"listenNLVideoComplete",statusCallback:"listenNLStatus"};
		flashvars.server = nlConfigs.server;
		if(nlConfigs.api!=null && nlConfigs.api.length>0)
			flashvars.api = nlConfigs.api;
		flashvars.locres = nlConfigs.locResource;
		if(nlConfigs.locale!=null)
			flashvars.locale = nlConfigs.locale;
		flashvars.pingInterval = nlConfigs.videoDurationInterval;
		if(nlConfigs.locQos!=null)
		{
			if(nlConfigs.locQos.indexOf('http') != 0)
			{
				if(nlConfigs.locQos.indexOf('//') == 0)
				{
					nlConfigs.locQos = window.location.protocol + nlConfigs.locQos;
				}
			}
			flashvars.locqos = nlConfigs.locQos;
			flashvars.siteid = nlConfigs.site;
			if(nlConfigs.product!=null)
				flashvars.prodid = nlConfigs.product;
			else
				flashvars.prodid = nlConfigs.playerId;
			if(nlConfigs.uid!=null)
			{
				flashvars.uid = nlConfigs.uid;
				if(nlConfigs.userType!=null)
					flashvars.usertype = nlConfigs.userType;	
			}		
			if(nlConfigs.tuid!=null)
				flashvars.tuid = nlConfigs.tuid;
		}
		if((nlConfigs.gaa!=null && nlConfigs.externalTrackCallback!=null) ||
		   (nlConfigs.gaa!=null && nlConfigs.comscore!=null) ||
		   (nlConfigs.externalTrackCallback!=null && nlConfigs.comscore!=null))
		{
			flashvars.externalTrackCallback = nlConfigs.externalTrackCallback;
			flashvars.trackPingInterval = nlConfigs.videoDurationInterval;
		}   
		else if(nlConfigs.externalTrackCallback!=null)
		{
			flashvars.externalTrackCallback = nlConfigs.externalTrackCallback;
			flashvars.trackPingInterval = nlConfigs.videoDurationInterval;
		}
		else if(nlConfigs.comscore != null)
			flashvars.comscore = true;
		else if(nlConfigs.gaa!=null)
			flashvars.gaa = nlConfigs.gaa;
		if(nlConfigs.nielsen != null)
		{
			flashvars.nielsen = "true";
			flashvars.trackPingInterval = nlConfigs.videoDurationInterval;
		}
		if(nlConfigs.personalization!=null)
		{
			flashvars.personalization = true;
			flashvars.trackPingInterval = nlConfigs.videoDurationInterval;
		}	
		if(nlConfigs.brand!=null)
			flashvars.brand = nlConfigs.brand;
		if(nlConfigs.nosp)
			flashvars.nosp = "true";
		else
			flashvars.timeoutCallback = "sessionTimeout";
		flashvars.geoblockedCallback = "geoBlocked";
		if(navigator.userAgent.indexOf("Chrome")!=-1)
			flashvars.disablesv = "true";
		var params = {quality:"high",bgcolor:"#000000",allowScriptAccess:"always",allowFullScreen:"true"};
		if(nlConfigs.wmode!=null)
			params.wmode = nlConfigs.wmode;	
		if(params.wmode!="direct")
		{
			var ua = navigator.userAgent.toLowerCase();
			if(ua.indexOf("windows")!=-1 && (ua.indexOf("firefox")!=-1 || ua.indexOf("opr/")!=-1 || ua.indexOf("opera")!=-1))
          		flashvars.seekFS = "true";
        }
        if(nlConfigs.nextVideoCallback!=null)
        	flashvars.nextVideoCallback = nlConfigs.nextVideoCallback;
        if(nlConfigs.trackChromecastClick!=null)
        	flashvars.trackChromecastClick = nlConfigs.trackChromecastClick;
        if(nlConfigs.trackMilestones!=null)
			flashvars.trackMilestones = nlConfigs.trackMilestones;
        if(nlConfigs.apMvpd!=null)
        {
        	flashvars.apmvpd = nlConfigs.apMvpd;
        	if(nlConfigs.nosp!=false)
        		flashvars.nosp = "true";
        }
        if(nlConfigs.brandColor!=null)
        	flashvars.brandcolor = nlConfigs.brandColor;
        if(nlConfigs.clientID!=null)
        	flashvars.clientID = nlConfigs.clientID;
        if(nlConfigs.mute!=null)
        	flashvars.mute = "true";
        if(nlConfigs.audio!=null)
        	flashvars.audio = true;
        if(nlConfigs.customFlashVars!=null)
    	{
        	for(var fv in nlConfigs.customFlashVars)
        		flashvars[fv] = nlConfigs.customFlashVars[fv];
    	}	
    	if(nlConfigs.fwConfig!=null)
    	{
        	for(var fv in nlConfigs.fwConfig)
        	{
        		flashvars["fw"+fv] = nlConfigs.fwConfig[fv];
        	}	
    	}
        var swfurl = nlConfigs.locResource + "nlplayer.swf";
        if(nlConfigs.locResourceSWF!=null)
        	swfurl = nlConfigs.locResourceSWF + "nlplayer.swf";
        if(nlConfigs.locResourceSWFName!=null)
        	swfurl = nlConfigs.locResourceSWFName;
		swfobject.embedSWF(swfurl, "nlplayerplaceholder", "100%", "100%", "10.2.0", nlConfigs.locResource+"scripts/expressInstall.swf", flashvars, params, {id:nlConfigs.playerId,name:nlConfigs.playerId,align:"middle"});
   	}
	else
	{
		listenNLReady();
	}
}

function nlRenderVideoPlayerHTML5()
{
	var p = document.getElementById("nlplayerhtml5");
	if(p==null)
	{
		var container = document.getElementById(nlConfigs.containerId);
		if(container!=null)
			container.style.overflow = "hidden";

		var v = document.createElement("video");
		v.style.width = "100%";
		v.style.height = "100%";
		v.controls = true;
		v.autoplay = true;
		v.id = "nlplayerhtml5";
		nlConfigs.playerId = 'nlplayerhtml5';
		container.appendChild(v);
		
		if(nlConfigs.audio)
			v.style.display = "none";
		
		v.addEventListener("ended", nlHTML5CompleteListener);
		v.addEventListener("onerror", nlHTML5ErrorListener);
		v.addEventListener("error", nlHTML5ErrorListener);
		v.addEventListener("loadedmetadata", nlHTML5MetadataListener);
		v.addEventListener("timeupdate", nlHTML5ProgressListener);
		v.addEventListener("pause", nlHTML5StateListener);
		v.addEventListener("play", nlHTML5StateListener);
		v.addEventListener("seeking", nlHTML5StateListener);
		v.addEventListener("canplay", nlHTML5StateListener);
		v.addEventListener("pause"  , nlUpdatePlayResumeUI);
		v.addEventListener("play"   , nlUpdatePlayResumeUI);
		v.addEventListener("seeking", nlUpdatePlayResumeUI);
		v.addEventListener("canplay", nlUpdatePlayResumeUI);
		v.addEventListener("volumechange",nlHTML5VolumeListener);
		v.addEventListener("webkitbeginfullscreen", nlHTML5FullscreenListener);
		v.addEventListener("webkitendfullscreen", nlHTML5FullscreenListener);
		document.addEventListener("fullscreenchange",nlHTML5FullscreenListener);
		document.addEventListener("MSFullscreenChange",nlHTML5FullscreenListener);
		document.addEventListener("mozfullscreenchange",nlHTML5FullscreenListener);
 		document.addEventListener("webkitfullscreenchange",nlHTML5FullscreenListener);
 		
 		nlRenderHTML5ControlBar();
		
		if(nlConfigs.hasAds!=true)
		{
			listenNLReady();
			if(nlConfigs.nosp!=true)
				nlSessionPollInt = setInterval("sessionPoll()",NL_SESSION_POLL_INTERVAL);
		}
	}
	else
	{
		listenNLReady();
		if(nlConfigs.nosp!=true)
			nlSessionPollInt = setInterval("sessionPoll()",NL_SESSION_POLL_INTERVAL);
	}
}

var nlRenderControls = 0;
function nlRenderHTML5ControlBar()
{
	if(nlConfigs.useCustomControls != null)
	{
		if(typeof nlHTML5Controls == 'function')
		{
			var controls = new nlHTML5Controls(nlConfigs.containerId);
		}
		else
		{	
			if((nlRenderControls++)<100)
				setTimeout("nlRenderHTML5ControlBar()",100);
			else
				setTimeout("nlRenderHTML5ControlBar()",5000);
		}		
	}		
}

function nlLoadTracker()
{
	if(typeof NLTracker == "undefined")
		nlLoadScript(nlConfigs.locResource+"scripts/nltracker.js");
	
	if(typeof require == "undefined")
		nlLoadScript(nlConfigs.locResource+"scripts/require.js");
		
	if(nlConfigs.trackMilestones!=null)
	{
		nlConfigs.milestonesMap = {};
		for(var i=0;i<nlConfigs.trackMilestones.length;i++)
		{
			var ms = parseInt(nlConfigs.trackMilestones[i]);
			if(!isNaN(ms))
			{
				nlConfigs.milestonesMap[ms] = true;
			}	
		}	
	}
	if(nlConfigs.gaa!=null)
	{
		if(nlConfigs.pingInterval!=null)
			nlConfigs.videoDurationInterval = nlConfigs.pingInterval;
	}
    if(nlConfigs.externalTrackCallback!=null || nlConfigs.personalization!=null)
	{
		if(nlConfigs.trackPingInterval!=null)
			nlConfigs.videoDurationInterval = nlConfigs.trackPingInterval;
    }	
    if(nlConfigs.videoDurationInterval == null)
   		nlConfigs.videoDurationInterval = 15;
}

function nlSetVideoAdTag(program){}

var nlhasThumbnail;
function nlPlayVideo(program)
{
	if(program!=null)
	{
		if(program.prerollPlayed == null)
			nlSetVideoAdTag(program);
		
		if(program.name==null)
		{
			switch(program.type)
			{
			case "channel":
				program.name = "Channel " + program.id;
				break;
			case "game":
				program.name = "Game " + program.id;
				break;
			default:
				program.name = "Video "+program.id;
			}
		}
		
		if(nlIsHTML5 && nlLastProgram!=null && program.name!=nlLastProgram.name)
		{
			var player = document.getElementById(nlConfigs.playerId);
			if(player.ended == false)
				NLTracker.trackEvent(nlConfigs.playerId,"customevent",{event:"videochanged",video:nlHTML5GetTrackMetadata(player)});
		}	
		
		if(program.hash!=null && program.apRid!=null && nlConfigs.apMvpd!=null)
		{
			if(program.publishPointParams==null)
				program.publishPointParams = new Object();
			
			program.publishPointParams.hash = program.hash;
			program.publishPointParams.aprid = program.apRid;
			program.publishPointParams.mvpd = nlConfigs.apMvpd;
		}
		if(!nlIsHTML5 && program.type == "game")
		{
			if(program.publishPointParams==null)
				program.publishPointParams = new Object();
			
			if(program.publishPointParams.gt==null && program.gt!=null)
				program.publishPointParams.gt = program.gt;
				
			if(program.publishPointParams.gs==null)
			{
				program.publishPointParams.gs = 3;
				if(program.isLive)
				{
					program.publishPointParams.gs = 1;
					if(program.isDVRLive && program.beginDateTimeGMT!=null && program.endDateTimeGMT!=null)
						program.publishPointParams.gs = 2;
				}
			}
		}
		
		nlLastProgram = program;
		
		nlRenderOverlay(false);
			
		if(nlIsHTML5)
		{
			var playResumeBtn = document.getElementsByClassName('nlPlayResumeBtn')[0];
			if(playResumeBtn!=null && playResumeBtn.style.display == "none")
				playResumeBtn.style.display = "";
		
			if(nlAdPlayerObj!=null && !nlIsAdPlaying() && nlConfigs.hasAds)
			{
        		var container   = document.getElementById(nlConfigs.containerId);
				var adPlayer 	= nlAdPlayerObj.adPlayerDiv;
				var videoPlayer = document.getElementById("nlplayerhtml5");
				var controlBar  = container.getElementsByClassName("nlControlBar")[0];
				
				if(nlLastProgram.adTag!=null && nlLastProgram.prerollPlayed == null && nlLastProgram.adTag.length > 0)
				{
					var info = null;
					if(videoPlayer != null)
					{
						videoPlayer.pause();
						if(controlBar!=null)
							controlBar.style.display = "none";
						var v = videoPlayer.muted?0:videoPlayer.volume;
						info = {volume:v,adtag:nlLastProgram.adTag,isLive:nlLastProgram.isLive};
						if(nlConfigs.fwConfig!=null)
						{
							info.videoId       = nlLastProgram.fwId;
						    info.videoDuration = "300";
						    info.isPreroll     = true;
						    if(nlLastProgram.isLive)
								info.timeleft  = -1;
						    if(nlLastProgram.fwKeyValue!=null)
						    	info.keyValue = nlLastProgram.fwKeyValue;
						    if(nlLastProgram.fwProfile!=null)
						    	info.fwProfile = nlLastProgram.fwProfile;
						}
						videoPlayer.style.display = "none";
						adPlayer.style.display    = "";
					}
					videoPlayer.load();
					if(nlAdPlayerObj.loadAdPlayer!=null)
						nlAdPlayerObj.loadAdPlayer();
					nlAdPlayerObj.loadAds(info);
				}
				else
				{
					if(videoPlayer != null)
					{
						if(controlBar!=null)
							controlBar.style.display = "";
						
						videoPlayer.load();
						if(nlAdPlayerObj.loadAdPlayer!=null)
							nlAdPlayerObj.loadAdPlayer();
						getHTML5PublishPoint(nlLastProgram);
					}	
				}	
			}	
			else if(nlAdPlayerObj==null)
			{
				document.getElementById("nlplayerhtml5").load();
				getHTML5PublishPoint(nlLastProgram);
			}
		}
		else if(document.getElementById(nlConfigs.playerId)!=null && document.getElementById(nlConfigs.playerId).playProgram!=null)
			document.getElementById(nlConfigs.playerId).playProgram(nlLastProgram);
	}
}

function nlStopVideo(stopAds)
{
	if(nlIsHTML5)
	{
		var videoPlayer = document.getElementById("nlplayerhtml5");
		if(videoPlayer!=null)
		{
			videoPlayer.pause();
		}
	}
	else if(document.getElementById(nlConfigs.playerId)!=null && document.getElementById(nlConfigs.playerId).stopPlayer!=null)
		document.getElementById(nlConfigs.playerId).stopPlayer(stopAds);
}

function nlPauseVideo()
{
	if(nlIsHTML5)
	{
		var videoPlayer = document.getElementById("nlplayerhtml5");
		if(nlAdPlayerObj!=null && nlIsAdPlaying())
		{
			nlAdPlayerObj.listenPause();
		}
		else if(videoPlayer!=null)
		{
			videoPlayer.pause();
		}
	}
	else if(document.getElementById(nlConfigs.playerId)!=null && document.getElementById(nlConfigs.playerId).pausePlayer!=null)
		document.getElementById(nlConfigs.playerId).pausePlayer();
}

function nlResumeVideo()
{
	if(nlIsHTML5)
	{
		var videoPlayer = document.getElementById("nlplayerhtml5");
		if(nlAdPlayerObj!=null && nlIsAdPlaying())
		{
			nlAdPlayerObj.listenResume();
		}
		else if(videoPlayer!=null)
		{
			videoPlayer.play();
		}
	}
	else if(document.getElementById(nlConfigs.playerId)!=null && document.getElementById(nlConfigs.playerId).resumePlayer!=null)
		document.getElementById(nlConfigs.playerId).resumePlayer();
}

function nlMuteVideo()
{
	// Only for PC HTML5. Cannot programmatically set volume on iOS.
	if(nlIsHTML5)
	{
		document.getElementById("nlplayerhtml5").volume = 0;
		
		if(nlAdPlayerObj!=null)
			nlAdPlayerObj.listenMute();
	}
}

function nlSeekVideo(value)
{
	if(nlIsHTML5)
	{
		var videoPlayer = document.getElementById("nlplayerhtml5");
		if(videoPlayer!=null && videoPlayer.style.display == "")
		{
			videoPlayer.currentTime = value;
		}
	}
	else if(document.getElementById(nlConfigs.playerId)!=null && document.getElementById(nlConfigs.playerId).seekPlayer!=null)
		document.getElementById(nlConfigs.playerId).seekPlayer(value);
}

function listenNLReady()
{
	if(!nlIsHTML5)
	{
		if(nlConfigs.companionsInfo!=null)
			document.getElementById(nlConfigs.playerId).setCompanions(nlConfigs.companionsInfo);
		
		if(window.dispatchPlayerReadyEvent!=null)	
			dispatchPlayerReadyEvent('nlplayer');	
			
		/*
		if(nlConfigs.clientID == null && NLQosTracker.clientID!=null)
		  	document.getElementById(nlConfigs.playerId).updateClientID(NLQosTracker.clientID);
		*/  	
	}
	
	if(nlConfigs.mute!=null)
		nlMuteVideo();
	
	if(document.getElementById('nl-overlay')==null)
		nlcreateEndcard();
	else
		nlHideOverlay();
	
	if(nlConfigs.autostart==null)
		nlConfigs.autostart = true;
	
	var playResumeBtn     		= document.createElement('div');
	playResumeBtn.className     = "nlPlayResumeBtn";
	playResumeBtn.style.display = "none"; 
	playResumeBtn.addEventListener('click', nlResumeVideo);
	document.getElementById(nlConfigs.containerId).appendChild(playResumeBtn);
	
	if(nlLastProgram!=null)
	{
		if((nlConfigs.autostart && !nlIsHTML5) || nlConfigs.audio)
			nlPlayVideo(nlLastProgram);
		else
			nlRenderOverlay(true);
	}
		
	if(nlConfigs.readyCallback!=null)
		nlConfigs.readyCallback();
}

function listenNLVideoComplete()
{
	if(nlIsHTML5 && nlhasThumbnail)
		nlExitHTML5Fullscreen();
		
	if(nlhasThumbnail && !nlConfigs.isPlaylist && !nlConfigs.audio)
		nlShowOverlay();
	else
		nlHideOverlay();
		
	if(nlConfigs.completeCallback!=null)
		nlConfigs.completeCallback();
}

function nlListenHTML5AdStart(info)
{
	if(info)
	{
		var data = new Object();
		data.ad = info;
		data.video = nlHTML5GetTrackMetadata(null);
		NLTracker.trackEvent('nlplayerhtml5',"adstart",data);
	}
	var playResumeBtn = document.getElementsByClassName('nlPlayResumeBtn')[0];
	if(playResumeBtn!=null)
	{
		if(playResumeBtn.style.display == "")
			playResumeBtn.style.display = "none";
	}
}

function nlListenHTML5AdComplete(info)
{
	var container   = document.getElementById(nlConfigs.containerId);
	var adPlayer    = nlAdPlayerObj.adPlayerDiv;
	var videoPlayer = document.getElementById(nlConfigs.playerId);
	
	if(nlLastProgram.prerollPlayed == null)
		nlLastProgram.prerollPlayed = true
		
	if(info)
	{
		var data = new Object();
		data.ad = info;
		data.video = nlHTML5GetTrackMetadata(null);
		NLTracker.trackEvent('nlplayerhtml5',"adcomplete",data);
	}
	
	adPlayer.style.display    = "none";
	videoPlayer.style.display = "";
	
	nlPlayVideo(nlLastProgram);
}

function nlListenHTML5AdPause(info)
{
	if(info)
	{
		var data = new Object();
		data.ad = info;
		data.video = nlHTML5GetTrackMetadata(null);
		NLTracker.trackEvent('nlplayerhtml5',"adpause",data);
	}
}

function nlListenHTML5AdResume(info)
{
	if(info)
	{
		var data = new Object();
		data.ad = info;
		data.video = nlHTML5GetTrackMetadata(null);
		NLTracker.trackEvent('nlplayerhtml5',"adresume",data);
	}
}

var nlIsContentPaused = false;
function nlUpdatePlayResumeUI(e)
{
	if(nlIsAdPlaying())
		return;
		
	var playResumeBtn = document.getElementsByClassName('nlPlayResumeBtn')[0];
	if(playResumeBtn!=null)
	{
		if(e.target.paused)
		{
			playResumeBtn.style.display = "";
			nlIsContentPaused = true;
		}
		else if(e.target.readyState==4 || e.type == 'canplay')
		{
			playResumeBtn.style.display = "none";
			nlIsContentPaused = false;
		}
		else
		{
			if(nlIsContentPaused && playResumeBtn.style.display == "none")
				playResumeBtn.style.display = ""
			else if(playResumeBtn.style.display == "")
				playResumeBtn.style.display = "none";
		}
	}
}

function sessionPoll()
{
	nlLoadScript(nlConfigs.server+"service/sessionpoll?format=json&callback=nlSessionPollCallback&t="+(new Date()).getTime());
}
function nlSessionPollCallback(obj)
{
	if(obj.data!=null)
	{
		if(obj.data.isLoggedIn!="true")
		{
			clearInterval(nlSessionPollInt);
			sessionTimeout();
		}
	}
}
function sessionTimeout()
{
}
function geoBlocked()
{
	if(window.nlConfigs!=null && nlConfigs.geoBlockedCallback!=null)
		nlConfigs.geoBlockedCallback();
}

function getHTML5PublishPoint(video)
{
	if(video.streamUrl!=null)
	{
		getHTML5PublishPointCallback({path:video.streamUrl});
	}
	else
	{
		var data = new Array();
		if(video.type==null)
			video.type = "video";
		
		data.push("type="+video.type);
		if(video.isIDExternal)
			data.push("extid="+video.id);
		else
			data.push("id="+video.id);
		if(nlConfigs.audio!=null)
			data.push("audio=true");
		if(video.type=="game")
		{	
			if(video.gt!=null)
				data.push("gt="+video.gt);
			if(video.gs!=null)
			{	
				data.push("gs="+video.gs);
				if(video.gs==2)
				{
					if(video.st!=null)
						data.push("st="+video.st);
					if(video.dur!=null)
						data.push("dur="+video.dur);
				}
			}
			else
			{
				if(video.isLive)
				{
					var gameState = 1;
					if(video.isDVRLive && video.beginDateTimeGMT!=null && video.endDateTimeGMT!=null)
					{
						gameState = 2;
				 		var dvrParams = nlHTML5GetDVRParams(video);
				 
				 		data.push("st="+dvrParams.st);
				 		data.push("dur="+dvrParams.dur);
					}
					data.push("gs="+gameState);
				}	
				else
					data.push("gs=3");
			}
		}
		else if(video.type=="video")
		{
			if(video.isDVRLive && video.beginDateTimeGMT!=null && video.endDateTimeGMT!=null)
			{
				 var dvrParams = nlHTML5GetDVRParams(video);
				 
				 data.push("st="+dvrParams.st);
				 data.push("dur="+dvrParams.dur);
			}
		}
		if(video.publishPointParams!=null)
		{
			if(video.publishPointParams.trailer!=null)
				data.push("trailer=true");
			if(video.publishPointParams.clubid!=null)
				data.push("clubid="+video.publishPointParams.clubid);
			if(video.publishPointParams.ppHtml5!=null)
				data.push("pp="+encodeURIComponent(video.publishPointParams.ppHtml5));
			else
			{
				if(video.publishPointParams.token!=null)
				{
					data.push("token="+video.publishPointParams.token);
				}
				else if(video.publishPointParams.aprid!=null)
				{
					data.push("aprid="+video.publishPointParams.aprid);
					data.push("aptoken="+encodeURIComponent(video.publishPointParams.aptoken));
				}
			}
		}
		data.push("format=json");
		data.push("callback=getHTML5PublishPointCallback");
		
		if(nlConfigs.api!=null)
			nlLoadScript(nlConfigs.api+"publishpoint?"+data.join("&"));
		else
			nlLoadScript(nlConfigs.server+"service/publishpoint?"+data.join("&"));
	}	
}

function getHTML5PublishPointCallback(obj)
{
	var path = obj.path;
	if(nlConfigs.fwConfig!=null && nlLastProgram.isLive && nlLastProgram.fwLiveMidrolls)
	{
		var fw = nlConfigs.fwConfig;
		path += "&_dv=2&nw="+fw.network+"&caid="+nlLastProgram.fwId+"&csid="+nlLastProgram.adTag+"&vdur=300&flag=+proxy+sltp+exvt-slcb&prof="+fw.profileJS+"&mode=live&resp=m3u8;";
	
		if(nlLastProgram!=null && nlLastProgram.fwSyncToken!=null && path!=null)
		{
			var pathParam = null;
			var idx = path.indexOf("?");
			if(idx!=-1)
				pathParam = encodeURIComponent(path.substring(0, idx));
			else
				pathParam = encodeURIComponent(path);
				
			path += "&_fw_syncing_token="+nlLastProgram.fwSyncToken+"&_fw_lpu="+pathParam;
		}
	}
	if(path!=null && path.length>0)
	{
		document.getElementById("nlplayerhtml5").src = path;
		if(nlIsAndroid)
			document.getElementById("nlplayerhtml5").play();
	}
	else if(obj.code=="failedgeo")
		geoBlocked();
}

function nlHTML5GetDVRParams(video)
{
	if(video.isDVRLive && video.beginDateTimeGMT!=null && video.endDateTimeGMT!=null)
	{
		var d = new Date();
		var arr = video.beginDateTimeGMT.split(/[- : T]/);
		var st = new Date(arr[0], arr[1]-1, arr[2], arr[3] - (d.getTimezoneOffset()/60), arr[4], arr[5]).getTime();
			     
		arr = video.endDateTimeGMT.split(/[- : T]/);
		var et = new Date(arr[0], arr[1]-1, arr[2], arr[3] - (d.getTimezoneOffset()/60), arr[4], arr[5]).getTime();
				 
		var dur = et - st;
		return {st:st, et:et, dur:dur};
	}
	else
		return null;
}

function nlHTML5GetTrackMetadata(player)
{
	var ret = {id:nlLastProgram.id,name:nlLastProgram.name.replace(/[^A-Za-z0-9 ]/g, "")};
	ret.live = false;
	if(player!=null)
	{	
		if(nlLastProgram.isLive)
		{ 
			ret.live = true;
			if(isNaN(player.duration))
				ret.duration = -1;
			if(nlLastProgram.isDVRLive)
			{
				ret.dvr = true;
				var dvrParams = nlHTML5GetDVRParams(nlLastProgram);
				if(dvrParams!=null)
				{
					ret.dvrSt = dvrParams.st;
					ret.dvrDur = dvrParams.dur;
				}	
			}	
		}
		else
			ret.duration = parseInt(player.duration);
			
		var idx = player.src.indexOf("?");
		if(idx!=-1)
			ret.publishPoint = player.src.substring(0, idx);
		else
			ret.publishPoint = player.src;
			
		if(!isNaN(player.currentTime) && player.currentTime>=0)
		{
			ret.playheadTime = player.currentTime;
			if(nlLastProgram.isLive)
			{
				var secondsFromStart = player.currentTime;
				if(nlLastProgram.joinTime!=null)
					secondsFromStart += nlLastProgram.joinTime;
				if(nlLastProgram.liveOffset!=null)
					secondsFromStart -= nlLastProgram.liveOffset;
				if(nlLastProgram.beginTime!=null)
					secondsFromStart -= nlLastProgram.beginTime;
				
				ret.playheadTime = Math.round(secondsFromStart);
			}	
			if(player.seeking)
				ret.playheadTime = nlLastProgram.playheadBeforeSeek;
		}	
			
		if(player.muted)
			ret.volume = 0;
		else
			ret.volume = Math.round(player.volume * 100);
	}		
	ret.cam = (nlLastProgram.cam)?parseInt(nlLastProgram.cam):-1;
	ret.type = nlLastProgram.type;
	if(ret.type == null)
		ret.type = "video";
	
	if(ret.type == "game")
	{
		var game = {};
		if(nlLastProgram.gt!=null)
			game.gt = parseInt(nlLastProgram.gt);
		if(nlLastProgram.gs!=null)	
			game.gs = parseInt(nlLastProgram.gs);
		
		if(nlLastProgram.gameDate!=null)	
			game.gameDate = nlLastProgram.gameDate;			
		if(nlLastProgram.homeTeam!=null)
		{
			game.homeTeam = (typeof nlLastProgram.homeTeam == "object")?nlLastProgram.homeTeam.name:nlLastProgram.homeTeam;
			if(nlLastProgram.awayTeam!=null)
			{
				game.awayTeam = (typeof nlLastProgram.awayTeam == "object")?nlLastProgram.awayTeam.name:nlLastProgram.awayTeam;
				ret.name = game.awayTeam+' @ '+game.homeTeam;
				
				if(nlLastProgram.gameDate!=null)
					ret.name += ' on '+nlLastProgram.gameDate;
			}	
		}		
		ret.game = game;
	}
	if(nlLastProgram.extid!=null)
		ret.extid = nlLastProgram.extid;
	return ret;
}

function nlHTML5MetadataListener(e)
{
	if(nlLastProgram!=null && !nlIsAdPlaying())
	{
		if(nlLastProgram.offsetStart!=null)
			e.target.currentTime = parseInt(nlLastProgram.offsetStart);
		
		if(nlLastProgram.isLive && nlLastProgram.beginDateTimeGMT!=null)
		{
			var d = new Date();
			nlLastProgram.joinTime =  d.getTime()/1000;
				
			var arr = nlLastProgram.beginDateTimeGMT.split(/[- : T]/);
		    nlLastProgram.beginTime = (new Date(arr[0], arr[1]-1, arr[2], arr[3] - (d.getTimezoneOffset()/60), arr[4], arr[5]).getTime())/1000;
		}	
		NLTracker.trackEvent(e.target.id,"videostart",{video:nlHTML5GetTrackMetadata(e.target)});
		listenNLStatus('loadedmetadata');
	}	
}

function nlHTML5CompleteListener(e)
{
	if(nlLastProgram!=null && !nlIsAdPlaying())
	{
		NLTracker.trackEvent(e.target.id,"videocomplete",{video:nlHTML5GetTrackMetadata(e.target)});
		listenNLVideoComplete();
	}	
}

function nlHTML5ProgressListener(e)
{
	if(nlIsAdPlaying())
		return;
	var player = e.target;
	if(nlLastProgram!=null)
	{
		setTimeout(function(){nlLastProgram.playheadBeforeSeek = player.currentTime},500); // Get Seeking start point
		var lastPlayheadTime = nlLastProgram.lastPlayheadTime;
		if(lastPlayheadTime==null)
		{
			if(nlLastProgram.isLive)
				lastPlayheadTime = player.currentTime;
			else
				lastPlayheadTime = 0;
			nlLastProgram.lastPlayheadTime = lastPlayheadTime;
		}	
		if(player.currentTime>lastPlayheadTime+nlConfigs.videoDurationInterval)
		{
			nlLastProgram.lastPlayheadTime = player.currentTime;
			NLTracker.trackEvent(e.target.id,"videoduration",{value:nlConfigs.videoDurationInterval,playheadTime:parseInt(player.currentTime),video:nlHTML5GetTrackMetadata(e.target)});	 
		}
		else if(player.currentTime<lastPlayheadTime)
			nlLastProgram.lastPlayheadTime = player.currentTime;
			
		if(!nlLastProgram.isLive && player.duration>0)
		{
			if(nlConfigs.trackMilestones!=null)
			{	
				var ms = Math.round(player.currentTime/player.duration * 100);
				if(nlConfigs.milestonesMap[ms]!=null && nlLastProgram['tracked'+ms]==null)
				{
					nlLastProgram['tracked'+ms] = true;
					NLTracker.trackEvent(e.target.id,"videopercent",{value:ms,video:nlHTML5GetTrackMetadata(e.target)});
				}
			}
			else if(nlLastProgram.tracked50==null && Math.round(player.currentTime)==Math.round(player.duration/2))
			{
				nlLastProgram.tracked50 = true;
				NLTracker.trackEvent(e.target.id,"videopercent",{value:50,video:nlHTML5GetTrackMetadata(e.target)});
			}
		}
		if(typeof NLQosTracker != "undefined")
		{
			var nlQosVideoTracker = NLQosTracker.getVideoTracker(nlConfigs.playerId);
			if(nlQosVideoTracker!=null)
				nlQosVideoTracker.updatePlayheadTime(Math.round(player.currentTime));
		}	
	}
}

function nlHTML5StateListener(e)
{
	if(nlIsAdPlaying())
		return;
	if(e.target.seeking)
	{
		NLTracker.trackEvent(e.target.id,"videostate",{value:"seeking",video:nlHTML5GetTrackMetadata(e.target)});
	}
	else if(e.target.paused)
	{
		NLTracker.trackEvent(e.target.id,"videostate",{value:"paused",video:nlHTML5GetTrackMetadata(e.target)});
		if(!nlLastProgram.paused)
		{
			nlLastProgram.paused = true;
			listenNLStatus('paused');
		}	
	}
	else if(e.target.readyState==4 || e.type == 'canplay')
	{
		if(nlLastProgram.isLive)
			nlLastProgram.liveOffset = e.target.currentTime;
		NLTracker.trackEvent(e.target.id,"videostate",{value:"playing",video:nlHTML5GetTrackMetadata(e.target)});
		if(nlLastProgram.paused)
		{
			nlLastProgram.paused = false;
			listenNLStatus('resume');
		}
	}
}

function nlHTML5ErrorListener(e)
{
	if(nlIsAdPlaying())
		return;
	if(e.target.error.code==e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED &&
	   e.target.src != window.location.href)
	{
		if(nlConfigs.unsupportedCallback!=null)
			nlConfigs.unsupportedCallback();
			
		NLTracker.trackEvent(e.target.id,"videoerror",{value:e.target.error.code,message:"Media not supported",video:nlHTML5GetTrackMetadata(e.target)});
	}
}

function nlHTML5FullscreenListener(e)
{
	if(nlIsAdPlaying())
		return;
	if(document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.requestFullscreen||e.type == 'webkitbeginfullscreen')
		NLTracker.trackEvent(e.target.id,"videostatus",{property:"windowMode",value:"fullscreen",video:nlHTML5GetTrackMetadata(e.target)});
	else
		NLTracker.trackEvent(e.target.id,"videostatus",{property:"windowMode",value:"normal",video:nlHTML5GetTrackMetadata(e.target)});
}

function nlHTML5VolumeListener(e)
{
	if(nlIsAdPlaying())
		return;
	
	var lastMetaData = nlHTML5GetTrackMetadata(e.target);
	NLTracker.trackEvent(e.target.id,"videostatus",{property:"volume", value:lastMetaData.volume, video:lastMetaData});
}

function listenNLStatus(status)
{
	if(nlConfigs.statusCallback!=null)
		nlConfigs.statusCallback(status);
}

function nlcreateEndcard()
{
	var div = document.createElement('div');
	div.id = 'nl-overlay';
	div.style.display = "none";
	
	var str = '<div class="nl-thumbnail-container"><table><tr><td>';
	str += '<div id="nl-overlay-current-video" class ="nl-overlay-video"><img id="nl-current-thumbnail" class="nl-overlay-thumbnail"></img>';
	str += '<div id="replay-button-wrapper" class="overlay-button-wrapper" onclick="nlReplayVideo()"><div class="nl-replay-icon"></div><div class="nl-overlay-text">REPLAY VIDEO</div><div style="clear:both"></div></div><div id="nl-current-title" class="nl-overlay-title"></div></div></td>';
	str += '<td><div id="nl-spacer-div" class="nl-spacer-div" style="display:none"></div></td>';
	str += '<td><div id="nl-overlay-next-video" class ="nl-overlay-video" style="display:none"><img id="nl-next-thumbnail" class="nl-overlay-thumbnail"></img>';
	str += '<div id="next-button-wrapper" class="overlay-button-wrapper" onclick="nlPlayNextVideo()"><div class="nl-overlay-text">NEXT VIDEO</div><div class="nl-next-icon"></div><div style="clear:both"></div></div><div id="nl-next-title" class="nl-overlay-title"></div></div></td></tr></table></div>';	
	str += '<div id="nl-play-wrapper" class="nl-play-wrapper"><img id="nl-play-button" class= "nl-play-button" onclick="javascript:nlPlayVideo(nlLastProgram)"></img></div>';
	div.innerHTML = str;
	
	var container = document.getElementById(nlConfigs.containerId);
	container.style.position = "relative";
	container.appendChild(div);
	
	var playBtn = document.getElementById('nl-play-button');
	playBtn.src = nlConfigs.locResource+'images/embedplay.png';
	playBtn.parentNode.style.width = (container.offsetWidth>700)?"200px":"100px";
	playBtn.parentNode.style.height = playBtn.parentNode.style.width;
}

function nlUpdateEndcard()
{
	if(document.getElementById('nl-overlay')!=null)
	{
		document.getElementById('nl-current-title').innerHTML = nlLastProgram.name;
		document.getElementById('nl-current-thumbnail').src = nlLastProgram.image;
		
		if(nlLastProgram.bigImage!= null)
			document.getElementById('nl-overlay').style.backgroundImage  = "url("+nlLastProgram.bigImage+")";
		
		if(nlLastProgram.next!=null)
		{
			document.getElementById('nl-next-title').innerHTML = nlLastProgram.next.name;
			document.getElementById('nl-next-thumbnail').src = nlLastProgram.next.image; 
		}	
	}	
}

function nlPlayNextVideo()
{
	nlHideOverlay();	
	if(nlConfigs.nextVideoCallback!=null)
	{
		var nextVideo = window[nlConfigs.nextVideoCallback];
		if(typeof nextVideo == 'function')
			nextVideo();
	}
}

function nlReplayVideo()
{
	nlHideOverlay();
	
	if(nlIsHTML5)
		document.getElementById("nlplayerhtml5").play();
	else
		document.getElementById('nlplayer').listenReplayClick(null);
}

function nlShowOverlay(isFirstProgram)
{
	var show = (nlhasThumbnail || nlIsHTML5 || !nlConfigs.autostart);
	if(show)
	{
		if(isFirstProgram)
		{
			document.getElementById('nl-play-wrapper').style.display = "";
			document.getElementById('nl-overlay-current-video').style.display = "none";
			
			if(nlLastProgram.bigImage!= null)
			{
				document.getElementById('nl-overlay').className = "nl-overlay-background"; 
				document.getElementById('nl-play-wrapper').className = "nl-play-wrapper";
			}	
			else if(nlhasThumbnail)
			{
				document.getElementById('nl-overlay-current-video').style.display = "";
				document.getElementById('replay-button-wrapper').style.display = "none";
				document.getElementById('nl-play-wrapper').className = "nl-play-wrapper-up";
			}	
		}
		else
		{
			document.getElementById('nl-play-wrapper').style.display = "none";
			
			if(nlLastProgram.bigImage!= null)
			{
				document.getElementById('nl-overlay').className = "";
				document.getElementById('nl-overlay').style.backgroundImage = "";
			}	
				
			if(nlhasThumbnail)
			{
				document.getElementById('nl-overlay-current-video').style.display = "";
				document.getElementById('replay-button-wrapper').style.display = "";
				document.getElementById('nl-play-wrapper').className = "nl-play-wrapper-up";
				document.getElementById('nl-current-thumbnail').className = "nl-overlay-thumbnail-opaque";
				
				if(nlLastProgram.next!=null)
				{
					document.getElementById('nl-spacer-div').style.display = "";
					document.getElementById('nl-overlay-next-video').style.display = "";
					document.getElementById('nl-next-thumbnail').className = "nl-overlay-thumbnail-opaque";
				}
				else
					document.getElementById('nl-spacer-div').style.display = "none";
			}	
		}
		
		nlResizePlayer(true);
		document.getElementById('nl-overlay').style.display = "";
	}	
}

function nlHideOverlay()
{
	if(document.getElementById('nl-overlay')!=null)
	{
		nlResizePlayer(false);
		document.getElementById('nl-overlay').style.display = "none";
	}	
}

function nlRenderOverlay(show)
{
	nlhasThumbnail = (nlLastProgram.image!=null);
	
	if(nlhasThumbnail)
		nlUpdateEndcard();
		
	if(show)
		nlShowOverlay(show);
	else
		nlHideOverlay();
}

function nlExitHTML5Fullscreen()
{
	if(document.exitFullscreen) 
    	document.exitFullscreen();

	else if(document.mozCancelFullScreen) 
    	document.mozCancelFullScreen();

	else if(document.webkitCancelFullScreen) 
    	document.webkitCancelFullScreen();
}

function nlCheckWindowMode()
{
	var isWin8IE11 = false;
	var ua = navigator.userAgent.toLowerCase();
	
	var index = ua.indexOf("windows nt");
	if(index!=-1)
	{
		var winVersion = ua.substr(index+11,3);
		if(parseFloat(winVersion) >=  6.2)
		{
			index = ua.indexOf("trident/");
			if(index!=-1)
			{
				var trident = ua.substr(index+8,3);
				if(parseFloat(trident) >= 7.0)
					isWin8IE11 = true;
			}
		}
	}
		
	var isDirectMode = (nlConfigs.wmode == "opaque" || nlConfigs.wmode == "transparent")?false:true;
	
	var ua = navigator.userAgent.toLowerCase();
	var isIphone = (ua.indexOf("iphone")!=-1);
	
	return ((!isWin8IE11 && isDirectMode) || isIphone);
}

function nlResizePlayer(visible)
{
	var resize = nlCheckWindowMode();
		
	if(resize)
	{
		var player = nlIsHTML5?'nlplayerhtml5':'nlplayer';
		if(visible)
		{
			document.getElementById(player).style.width = "0px";
			document.getElementById(player).style.height = "0px";
		}
		else
		{
			document.getElementById(player).style.width = "100%";
			document.getElementById(player).style.height = "100%";
		}
	}	
}

function nlLogout()
{
	nlLoadScript(nlConfigs.server+"service/logout?format=json&callback=nlLogoutCallback&t="+(new Date()).getTime());
}
function nlLogoutCallback(obj)
{
	if(obj.code=="logout")
	{
		if(nlConfigs.logoutCallback!=null)
			nlConfigs.logoutCallback();
	}
}
function nlIsAdPlaying()
{
	if(nlAdPlayerObj!=null)
	{
		if(nlAdPlayerObj.isAdPlaying())
			return true;
		else
			return false;
	}
	else
		return false;
}

var nlCastConfig = null;
var NLCAST_MEDIA_ATTACHED = 0;
var NLCAST_DISCONNECTED = 1;
var NLCAST_MEDIA_REMOVED = 3;
var NLCAST_CONNECTED = 4;

function nlLoadChromecast(config)
{
	nlCastConfig = config;
	nlLoadScript(nlCastConfig.locResource+"scripts/nlchromecastsender.js");
	setTimeout(nlInitChromecast(),200);
}

var nlChromecastCounter = 0;
function nlInitChromecast()
{
	if(typeof nlsender == "undefined")
	{
		if((nlChromecastCounter++)<100)
			setTimeout("nlInitChromecast()",100);
	}
	else if(typeof ChromeSender == "undefined")
	{
		if(nlCastConfig.senderRequested == null)
		{
			nlCastConfig.senderRequested = true;
			nlLoadScript(nlCastConfig.locResourceApp+"scripts/chromecastsender.js");
		}	
		if((nlChromecastCounter++)<100)
			setTimeout("nlInitChromecast()",100);
	}
	else
	{	
		ChromeSender.detectSDK(nlCastConfig.appId);
	}
}

function nlListenChromecastStatus(obj)
{
	switch(obj.status)
	{
		case 0:
		case 1:
		case 3:
		case 4:
			if(nlCastConfig.statusCallback!= null)
				nlCastConfig.statusCallback(obj.status);
			break;
					
		case 2:
			if(nlCastConfig.errorCallback!= null)
				nlCastConfig.errorCallback(obj.error);
			break;
	}
}

function nlListenCastMetaData(data)
{
	if(data)
 	{
 		var info = {};
 		info.contentId = data.pid;
 		info.contentName = data.name;
 		info.deviceName = data.deviceName;
 		info.image = data.image;
 	
 		if(data.muted!=null)
 			info.muted = data.muted;
 		if(data.volume!=null)
 			info.volume = data.volume;
 		if(data.playTime!=null)
 			info.playheadTime = data.playTime;
 		if(data.duration!=null)	
 			info.duration = data.duration;
 		info.isLive = false;
 		if(data.gs!=null && data.gs != 3)
 			info.isLive = true;
 		
 		if(nlCastConfig.progressListener!=null)
 			nlCastConfig.progressListener(info);
 	}
 }

function nlChromecastPlay()
{
	if(typeof ChromeSender != "undefined")
		ChromeSender.play();
}

function nlChromecastPause()
{
	if(typeof ChromeSender != "undefined")
		ChromeSender.pause();
}

function nlChromecastMute()
{
	if(typeof ChromeSender != "undefined")
		ChromeSender.mute();
}

function nlChromecastSound()
{
	if(typeof ChromeSender != "undefined")
		ChromeSender.sound();
}

function nlChromecastUpdateVolume(value)
{
	var volume = 1;
	if(value >=0 && value <=1)
		volume = parseFloat(value);
		
	if(typeof ChromeSender != "undefined")
		ChromeSender.sound(volume);
}

function nlChromecastSeek(value)
{
	if(typeof ChromeSender != "undefined")
		ChromeSender.seek(value);
}

function nlChromecastDisconnect()
{
	if(typeof ChromeSender != "undefined")
		ChromeSender.disconnect();
}

function nlHTML5GoFullscreen()
{
	var player    = document.getElementById("nlplayerhtml5");
	var container = document.getElementById(nlConfigs.containerId);
	var enablefs  = (player.mozRequestFullScreen || player.webkitRequestFullScreen || 
					player.webkitEnterFullscreen|| player.msRequestFullscreen ||nlIsiOS || nlIsAndroid) ;
		
	if(enablefs)
	{
		var isFullScreen = (document.fullscreen || document.mozFullScreen || 
							document.webkitIsFullScreen || document.msFullscreenElement!=null);
							
		if(!isFullScreen)
		{
			if(container.requestFullScreen)
		    	container.requestFullScreen();
			else if (container.mozRequestFullScreen) 
		     	container.mozRequestFullScreen();
		    else if(container.webkitRequestFullScreen) 
		    	container.webkitRequestFullScreen();
		    else if(container.msRequestFullscreen)
		    	container.msRequestFullscreen();
		    else if(nlIsiOS || nlIsAndroid)
		    	player.webkitEnterFullscreen();
		}
	}	
	else
	{
		alert('This device does not support full screen mode');
	}	
}

function nlHTML5ExitFullscreen()
{
	var player    = document.getElementById("nlplayerhtml5");
	var container = document.getElementById(nlConfigs.containerId);
	
	var isFullScreen = (document.fullscreen || document.mozFullScreen || 
						document.webkitIsFullScreen || document.msFullscreenElement!=null);
						
	if(isFullScreen)
	{
		if(document.exitFullscreen)
	    	document.exitFullscreen();
	    else if (document.mozCancelFullScreen) 
	    	document.mozCancelFullScreen();
	    else if (document.webkitCancelFullScreen) 
	    	document.webkitCancelFullScreen();
	    else if (document.msExitFullscreen) 
	    	document.msExitFullscreen();
	}
}