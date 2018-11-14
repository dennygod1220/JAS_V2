
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

function nlLoadHTML5Player()
{
	nlLoadScript(nlConfigs.locResource+"scripts/nlplayerhtml5.js");
	if(nlConfigs.drm!=null || (nlConfigs.noFlash && nlConfigs.nlHTML5) || nlConfigs.nlHTML5)
	{
		nlLoadScript(nlConfigs.locResource+"scripts/nladaptiveplayer.js");
	}
	nlLoadScript(nlConfigs.locResource+"scripts/nlplayerstrings.js");
}

function nlLoadCustomControls()
{
	if(nlConfigs.theme!=null)
	{	
		if(nlConfigs.customStyles==null)
			nlConfigs.customStyles = [];
		
		if(nlConfigs.skin!=null && nlConfigs.skinColor==null)
		{
			var skin = nlConfigs.skin;
			nlConfigs.customStyles.unshift(nlConfigs.locResource+nlConfigs.customPath+"player/styles/skins/skin"+skin+".css");
		}
		nlConfigs.customStyles.unshift(nlConfigs.locResource+nlConfigs.customPath+"player/styles/themes/theme"+nlConfigs.theme+".css");
	}
	if(nlConfigs.customStyles!=null && nlConfigs.customStyles.length>0)
	{
		for(var i=0;i<nlConfigs.customStyles.length;i++)
			nlLoadStyle(nlConfigs.customStyles[i]);
	}

	var styleSrc = nlConfigs.locResource+nlConfigs.customPath+"styles/nlcontrols.css";
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = styleSrc;
	link.onload = function()
	{
		nlStyleLoaded = true;
	};
	
	if(nlConfigs.customStyles!=null)
		var stag = document.getElementsByTagName("link")[0];
	else
		var stag = document.getElementsByTagName("script")[0];
		
	stag.parentNode.insertBefore(link, stag);
	
	if(nlConfigs.useCustomControls!=null)
		nlLoadScript(nlConfigs.locResource+nlConfigs.customPath+"scripts/nlcontrols.js");
}

var nlLastProgram = null;
var nlConfigs = null;
var nlAdPlayerObj = null;
var nlIsHTML5 = false;
var nlSessionPollInt = 0;
var nlPlayerReady = false;
var nlCountdownTimerInt   = 0;
var NL_SESSION_POLL_INTERVAL = 1000 * 60 * 2;
var NL_PS_DURATION           = 120;
var NL_ENDCARD_COUNTDOWN     = 10;

var ua = navigator.userAgent.toLowerCase();
var nlIsiOS = (ua.indexOf("ipad")!=-1 || ua.indexOf("iphone")!=-1);
var nlIsAndroid = (ua.indexOf("android")!=-1);
var nlIsSafari = (ua.indexOf("safari")!=-1);

function nlRenderPlayerCustom(configs){}

function nlRenderPlayer(configs,program)
{
	nlRenderPlayerCustom(configs);
	nlConfigs = configs;
	if(nlConfigs.playerId==null || nlConfigs.playerId.length==0)
		nlConfigs.playerId = "nlplayer";
	if(nlConfigs.customPath==null)
		nlConfigs.customPath = "";
	if(nlConfigs.nextAutoplay!=null && nlConfigs.nextAutoplay>0)
		NL_ENDCARD_COUNTDOWN = nlConfigs.nextAutoplay;
	if(program!=null)
		nlLastProgram = program;
	nlLoadTracker();
	nlLoadHTML5Player();
	nlLoadCustomControls();
	
	if(nlIsiOS || nlConfigs.noFlash || nlConfigs.drm)
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

var nlStyleLoaded   = false;
var nlRenderCounter = 0;
function nlInitFlashCheck()
{
	if((!nlIsHTML5 && window.swfobject==null)                        || 
	   (document.getElementById(nlConfigs.containerId)==null)        || 
	   (nlIsHTML5 && typeof nlRenderVideoPlayerHTML5 == "undefined") ||
	   typeof require == "undefined"                                 ||
	   typeof NLTracker == "undefined"                               ||
	   typeof nlLocaleText == "undefined"                            ||
	   (nlConfigs.useCustomControls && typeof nlHTML5Controls == "undefined") || !nlStyleLoaded ||
	   ((nlConfigs.drm||(nlConfigs.noFlash && nlConfigs.nlHTML5)||nlConfigs.nlHTML5) && 
	   typeof AdaptivePlayer == "undefined"))
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
		
		if(nlConfigs.concurrency!=null)
		{
			if(typeof NLConcurrencyManager != "undefined")
				nlLoadConcurrency();
			else
			{
				require([nlConfigs.locResource + "scripts/nlcm.js"],function(){
					nlLoadConcurrency();
				});
			}
		}

		nlLoadScript(nlConfigs.locResource+"scripts/companions.js");
		nlLoadStyle(nlConfigs.locResource+"styles/overlay.css");
		
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
				}	
			}
			else
			{
				nlRenderVideoPlayer();
				NLTracker.initialize(nlConfigs);
			}
		}
		
		if(nlConfigs.customScripts!=null && nlConfigs.customScripts.length>0)
		{	
			require(nlConfigs.customScripts,function()
			{
				if(nlIsHTML5)
				{
					loadHTML5Scripts();
					NLTracker.initialize(nlConfigs);
				}
			});
		}
		else if(nlIsHTML5)
		{
			loadHTML5Scripts();
			NLTracker.initialize(nlConfigs);
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
		
		if(nlConfigs.psDuration==null)
			nlConfigs.psDuration = NL_PS_DURATION;
    }	
    if(nlConfigs.videoDurationInterval == null)
   		nlConfigs.videoDurationInterval = 15;
}

function nlLoadConcurrency()
{
	nlConfigs.nosp =  true;
	
	var config = {
		callback   : nlListenConcurrenyCallback,
		locResource:nlConfigs.locResource+'scripts/',
		debugMode  :true
	};
		
	if(nlConfigs.concurrency.pcm!=null)
	{
		config.pcm   = nlConfigs.concurrency.pcm;
		if(config.pcm.server!=null)
			nlCM.initialize(config);
	}
	else if(nlConfigs.concurrency.adobe!=null)
	{
		config.adobe = nlConfigs.concurrency.adobe;
		if(config.adobe.upstreamID!=null)
			nlCM.initialize(config);
	}
}

var nlPCMToken = null;
var nlContentPlaybackOn = false;
function nlSetCMPlaybackState(state)
{
	var info = {state:state};
	if((nlConfigs.concurrency.pcm!=null && nlPCMToken!=null) || nlConfigs.concurrency.adobe)
	{
		if(nlPCMToken)
			info.token = nlPCMToken;
		if(state == nlCM.PlayerState.PLAY && !nlContentPlaybackOn)
		{
			nlContentPlaybackOn = true;
			nlCM.setPlayerState(info);
		}
		else if(state == nlCM.PlayerState.STOPPED && nlContentPlaybackOn)
		{
			nlPCMToken = null;
			nlContentPlaybackOn = false;
			nlCM.setPlayerState(info);
		}
	}
}

function nlListenConcurrenyCallback(info)
{
	if(nlIsHTML5)
		nlHTML5ExitFullscreen();
	nlPCMToken = null;
	nlStopVideo();
	
	if(nlConfigs.concurrency.callback!=null)
		nlConfigs.concurrency.callback(info);
}

function nlSetVideoAdTag(program){}

function nlPlayVideo(program)
{
	if(program!=null)
	{
		delete program.stopRequested;
		delete program.pauseRequested;
		clearInterval(nlCountdownTimerInt);
		
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
		
		if(nlIsHTML5 && nlLastProgram!=null && (program.name!=nlLastProgram.name || program.id!=nlLastProgram.id))
		{
			var player = document.getElementById(nlConfigs.playerId);
			if(player.ended == false)
				NLTracker.trackEvent(nlConfigs.playerId,"customevent",{event:"videochanged",video:nlHTML5GetTrackMetadata(player)});
			
			// Needed for GIMA to destroy the adsManager instance
			if(nlAdPlayerObj!=null)
				nlAdPlayerObj.videoChange();
				
			if(nlConfigs.locEDL!=null && nlLastProgram.type == "game" && nlConfigs.useCustomControls!=null) 
				nlStopTimelineFeed();

			nlClearMidrolls();
			
			if(nlControlBarObj!=null && nlConfigs.useCustomControls!=null && typeof nlControlBarObj.listenProgramChanged!="undefined")
				nlControlBarObj.listenProgramChanged();
		}	
		nlUnsupportedCallbackTriggered = false;
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
		if(nlConfigs.watermark!=null && nlLastProgram.watermarkUrl!=null)
			nlRenderWatermarkLogo();
			
		if(nlIsHTML5)
		{
			var playResumeBtn = document.getElementsByClassName('nlPlayResumeBtn')[0];
			if(playResumeBtn!=null && playResumeBtn.style.display == "none")
				playResumeBtn.style.display = "";

			if(nlAdPlayerObj!=null && nlConfigs.hasAds)
			{
				var container   = document.getElementById(nlConfigs.containerId);
				var adPlayer    = nlAdPlayerObj.adPlayerDiv;
				var videoPlayer = document.getElementById("nlplayerhtml5");
				var controlBar  = container.getElementsByClassName("nlControlBar")[0];
				
				if(nlLastProgram.adTag!=null && nlLastProgram.prerollPlayed == null && nlLastProgram.adTag.length > 0)
				{
					var info = null;
					if(videoPlayer != null)
					{
						if(nlDRMPlayer)
							nlDRMPlayer.stop();
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
						else if(program.vmap)
							info.vmap = true;
							
						videoPlayer.style.display = "none";
						adPlayer.style.display    = "";
					}
					if(nlIsiOS||nlIsAndroid||nlIsSafari)
					{
						videoPlayer.load();

						if(nlAdPlayerObj.loadAdPlayer!=null)
							nlAdPlayerObj.loadAdPlayer();
					}
					nlAdPlayerObj.loadAds(info);
				}
				else
				{
					if(videoPlayer != null)
					{
						if(controlBar!=null)
							controlBar.style.display = "";
						
						if(nlIsiOS||nlIsAndroid||nlIsSafari)
						{
							videoPlayer.load();

							if(nlAdPlayerObj.loadAdPlayer!=null)
								nlAdPlayerObj.loadAdPlayer();
						}
						getHTML5PublishPoint(nlLastProgram);
					}	
				}	
			}	
			else if(nlAdPlayerObj==null)
			{
				if(nlIsiOS||nlIsAndroid||nlIsSafari)
					document.getElementById(nlConfigs.playerId).load();
				getHTML5PublishPoint(nlLastProgram);
			}
		}
		else if(document.getElementById(nlConfigs.playerId)!=null && document.getElementById(nlConfigs.playerId).playProgram!=null)
			document.getElementById(nlConfigs.playerId).playProgram(nlLastProgram);
	}
}

/*********************************************** Callbacks *********************************************/

function listenNLReady()
{
	if(!nlIsHTML5)
	{
		if(nlConfigs.companionsInfo!=null)
			document.getElementById(nlConfigs.playerId).setCompanions(nlConfigs.companionsInfo);
		
		/*
		if(nlConfigs.clientID == null && NLQosTracker.clientID!=null)
		  	document.getElementById(nlConfigs.playerId).updateClientID(NLQosTracker.clientID);
		*/  	
	}
	nlPlayerReady = true;
	if(window.dispatchPlayerReadyEvent!=null)
		dispatchPlayerReadyEvent(nlConfigs.playerId);

	if(nlIsHTML5)
	{
		if(window.supportsGlobalVolume)
			nlSetVolumeOnLoad()
		else if(nlConfigs.mute!=null)
			nlMuteVideo();
	}
	
	var container = document.getElementById(nlConfigs.containerId);
	if(container.getElementsByClassName('nlOverlay')[0]==null)
		nlCreateOverlay();
	
	if(nlConfigs.autostart==null)
		nlConfigs.autostart = true;

	var playResumeBtn     		= document.createElement('div');
	playResumeBtn.className     = "nlPlayResumeBtn";
	playResumeBtn.style.display = "none"; 
	playResumeBtn.addEventListener('click', nlResumeVideo);
	document.getElementById(nlConfigs.containerId).appendChild(playResumeBtn);
	
	if(nlLastProgram!=null)
	{
		if(nlConfigs.autostart)
			nlPlayVideo(nlLastProgram);
		else
			nlRenderOverlay(true);
	}
	
	if(nlConfigs.readyCallback!=null)
		nlConfigs.readyCallback();
}

function listenNLVideoComplete()
{
	if((nlIsAndroid || nlIsiOS) && !nlConfigs.isPlaylist)
		nlHTML5ExitFullscreen();
		
	if(!nlConfigs.isPlaylist && !nlConfigs.audio)
		nlShowOverlay();
	else
		nlHideOverlay();
		
	if(nlConfigs.completeCallback!=null)
		nlConfigs.completeCallback();
}

function listenNLStatus(status)
{
	if(nlConfigs.statusCallback!=null)
		nlConfigs.statusCallback(status);
}

/**************************************** API Methods **************************************************/

function nlStopVideo(stopAds)
{
	if(nlIsHTML5)
	{
		if(nlLastProgram!=null)
			nlLastProgram.stopRequested = true;
				
		var videoPlayer = document.getElementById(nlConfigs.playerId);
		if(nlAdPlayerObj!=null)
		{
			if(stopAds)
			{
				nlLastProgram.adTag = null;
				if(nlAdPlayerObj.stop)
					nlAdPlayerObj.stop();
			}

			if(nlIsAdPlaying())
				return;
		}
		
		if(videoPlayer!=null)
		{
			if(nlDRMPlayer!=null)
				nlDRMPlayer.stop();
			else
				videoPlayer.pause();
		}
		if(nlConfigs.concurrency!=null && typeof NLConcurrencyManager != "undefined")
		{
			if(nlPCMToken!=null)
				nlSetCMPlaybackState(nlCM.PlayerState.STOPPED);
			else
				nlContentPlaybackOn = false;
		}
	}
	else if(document.getElementById(nlConfigs.playerId)!=null && document.getElementById(nlConfigs.playerId).stopPlayer!=null)
		document.getElementById(nlConfigs.playerId).stopPlayer(stopAds);
}

function nlPauseVideo()
{
	if(nlIsHTML5)
	{
		if(nlLastProgram!=null)
			nlLastProgram.pauseRequested = true;
			
		var videoPlayer = document.getElementById(nlConfigs.playerId);
		if(nlAdPlayerObj!=null && nlIsAdPlaying())
		{
			nlAdPlayerObj.listenPause();
		}
		else if(videoPlayer!=null)
		{
			if(nlDRMPlayer!=null)
				nlDRMPlayer.pause();
			else
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
		var videoPlayer = document.getElementById(nlConfigs.playerId);
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
		document.getElementById(nlConfigs.playerId).muted = true;
		
		// Manually update volume slider since 'volumeChange' event is not triggered while feed is loading
		if(nlControlBarObj!=null && nlControlBarObj.mute!=null)
			nlControlBarObj.mute();
		
		if(nlAdPlayerObj!=null)
			nlAdPlayerObj.listenMute();
	}
}

function nlUnmuteVideo()
{
	if(nlIsHTML5)
	{
		if(window.supportsGlobalVolume)
		{
			nlSetGlobalVolume(nlLastVolume, false, true);
		}
		else
		{
			document.getElementById(nlConfigs.playerId).muted  = false;
			if(nlAdPlayerObj!=null)
				nlAdPlayerObj.listenSound();
		}
	}
}

function nlSetVolume(volume)
{
	if(nlIsHTML5)
	{
		if(window.supportsGlobalVolume)
		{
			nlSetGlobalVolume(volume, volume==0, true);
		}
		else
		{
			document.getElementById(nlConfigs.playerId).muted  = (volume==0);
			document.getElementById(nlConfigs.playerId).volume = volume;
		
			if(nlAdPlayerObj!=null)
				nlAdPlayerObj.setVolume(volume);
		}
	}
}

function nlSeekVideo(value)
{
	if(nlIsHTML5)
	{
		var videoPlayer = document.getElementById(nlConfigs.playerId);
		if(videoPlayer!=null && videoPlayer.style.display == "")
		{
			videoPlayer.currentTime = value;
		}
	}
	else if(document.getElementById(nlConfigs.playerId)!=null && document.getElementById(nlConfigs.playerId).seekPlayer!=null)
		document.getElementById(nlConfigs.playerId).seekPlayer(value);
}

function nlGetPlayheadTime()
{
	if(nlIsHTML5)
	{
		if(nlDRMPlayer!=null)
			return nlDRMPlayer.currentTime;
		else
			return document.getElementById(nlConfigs.playerId).currentTime;
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
	{
		if(nlDRMPlayer!=null && !nlLastProgram.isLive)
		{
			nlDRMPlayer.currentTime = 0;
			nlDRMPlayer.play();
		}
		else
			document.getElementById(nlConfigs.playerId).play();
	}
	else
		document.getElementById('nlplayer').listenReplayClick(null);
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

var nlLastVolume = 0.75;
function nlSetGlobalVolume(volume, muted, updatePreference)
{
	if(volume>0)
		nlLastVolume = volume;

	var currentVolume = muted?0:volume;

	nlDRMPlayer.volume = currentVolume;
	if(currentVolume>0)
		nlDRMPlayer.muted  = false;
	else
		nlDRMPlayer.muted = true;
	
	nlControlBarObj.updateVolumeUI(currentVolume);

	if(nlAdPlayerObj!=null)
		nlAdPlayerObj.setVolume(currentVolume);

	if(updatePreference)
	{
		nlSetPreference('nlvolume', nlLastVolume);
		nlSetPreference('nlmuted' , volume==0);
	}
}

function nlSetGlobalMuteSound(mute)
{
	if(mute)
		nlSetGlobalVolume(0, true, true);
	else
		nlSetGlobalVolume(nlLastVolume, false, true);
}

function nlSetVolumeOnLoad()
{
	var volumePref = nlGetPreference('nlvolume');
	var mutePref   = nlGetPreference('nlmuted');

	if(nlConfigs.mute!=null)
	{
		if(volumePref!=null)
			nlSetGlobalVolume(Number(volumePref), true, false);
		else
			nlSetGlobalVolume(nlLastVolume, true, false);
	}
	else if(volumePref!=null || mutePref!=null)
	{
		if(volumePref!=null)
		{
			if(mutePref!=null)
				nlSetGlobalVolume(Number(volumePref), mutePref=="true", false);
			else
				nlSetGlobalVolume(Number(volumePref), false, false);
		}
	}
	else
	{
		nlSetGlobalVolume(nlLastVolume);
	}
}

function nlGetResourceString(key)
{
	if(typeof nlLocaleText != "undefined")
		return nlLocaleText[key];
	else
		return null;
}

/****************************************  Overlay and End card **************************************/

function nlCreateOverlay()
{
	var div = document.createElement('div');
	div.className = 'nlOverlay';

	var str =   '<div class = "nlBeginCard" style="display:none">'+
					'<div class = "nlOverlayPlayBtnBegin nlOverlayPlayBtn"></div>'+
					'<div class = "nlOverlayVideoDetails">'+
						'<img class ="nlOverlayVideoThumbnail"></img>'+
						'<div class ="nlOverlayVideoName"></div>'+
					'</div>'+
			    '</div>'+
			    '<div class = "nlEndCard">'+
			        '<div class="nlOverlayVideo">'+
			            '<div class = "nlOverlayVideoTitle"></div>'+
						'<div class = "nlOverlayVideoReplay">'+
						   	'<div class = "nlOverlayVideoLeft"></div>'+
						    '<div class = "nlOverlayVideoRight">'+nlGetResourceString("overlay_replay")+'</div>'+
						'</div>'+
			        '</div>'+
				    '<div class="nlOverlayNextVideo">'+
				  	    '<div class="nlOverlayNextVideoLeft">'+
				  		    '<img class= "nlOverlayNextVideoThumbnail"></img>'+
				  		    '<div class= "nlOverlayPlayBtnEnd nlOverlayPlayBtn"></div>'+
				  	    '</div>'+
				  	    '<div class="nlOverlayNextVideoRight">'+
				  		    '<div class="nlOverlayNextVideoCountdown">'+nlGetResourceString("overlay_next")+'</div>'+
				  		    '<div class="nlOverlayNextVideoTitle"></div>'+
				  	    '</div>'+
				  '</div>'+
			    '</div>';
	
	div.innerHTML = str;
	
	var container = document.getElementById(nlConfigs.containerId);
	container.style.position = "relative";
	container.appendChild(div);

	var playBtn = container.getElementsByClassName('nlOverlayPlayBtnBegin')[0];
	playBtn.addEventListener('click', function() {
		nlPlayVideo(nlLastProgram);
	});

	var replayDiv    = container.getElementsByClassName('nlOverlayVideoReplay')[0];
	var countdownDiv = container.getElementsByClassName('nlOverlayNextVideoCountdown')[0];
	replayDiv.addEventListener('click', function() {
		clearInterval(nlCountdownTimerInt);
		if(nlConfigs.nextAutoplay!=null)
			countdownDiv.innerHTML = nlGetResourceString("overlay_countdown")+NL_ENDCARD_COUNTDOWN;
		else
			countdownDiv.innerHTML = nlGetResourceString("overlay_next");
		nlReplayVideo();
	});

	var nextDiv = container.getElementsByClassName('nlOverlayNextVideoLeft')[0];
	nextDiv.addEventListener('click', function() {
		clearInterval(nlCountdownTimerInt);
		nlPlayNextVideo();
	});
}

function nlUpdateOverlay()
{
	var container = document.getElementById(nlConfigs.containerId);
	if(container.getElementsByClassName('nlOverlay')[0]!=null)
	{
		container.getElementsByClassName('nlOverlayVideoTitle')[0].innerHTML = nlLastProgram.name;
		container.getElementsByClassName('nlOverlayVideoName')[0].innerHTML  = nlLastProgram.name;

		if(nlLastProgram.image!= null)
			container.getElementsByClassName('nlOverlayVideoThumbnail')[0].src   = nlLastProgram.image;
		
		if(nlLastProgram.bigImage!= null)
			container.getElementsByClassName('nlOverlay')[0].style.backgroundImage  = "url("+nlLastProgram.bigImage+")";
		
		if(nlLastProgram.next!=null)
		{
			container.getElementsByClassName('nlOverlayNextVideoTitle')[0].innerHTML = nlLastProgram.next.name;
			container.getElementsByClassName('nlOverlayNextVideoThumbnail')[0].src   = nlLastProgram.next.image; 
		}	
	}
}

function nlRenderOverlay(show)
{
	nlUpdateOverlay();
	if(show)
		nlShowOverlay(show);
	else
		nlHideOverlay();
}

function nlShowOverlay(isFirstProgram)
{
	var show      = true;
	var container = document.getElementById(nlConfigs.containerId);
	var nextVideo = container.getElementsByClassName('nlOverlayNextVideo')[0];

	if(isFirstProgram)
	{
		container.getElementsByClassName('nlEndCard')[0].style.display   = "none";
		container.getElementsByClassName('nlBeginCard')[0].style.display = "";
		container.getElementsByClassName('nlOverlayVideoDetails')[0].style.display = "none";

		if(nlLastProgram.bigImage!= null)
		{
			container.getElementsByClassName('nlOverlay')[0].style.backgroundImage = "";
		}	
		else if(nlLastProgram.image!= null)
		{
			if(nlConfigs.useCustomControls != null)
				container.getElementsByClassName('nlOverlayVideoDetails')[0].style.display = "";
		}
	}
	else
	{
		container.getElementsByClassName('nlBeginCard')[0].style.display       = "none";
		container.getElementsByClassName('nlEndCard')[0].style.display         = "";
		container.getElementsByClassName('nlOverlay')[0].style.backgroundImage = "";
			
		if(nlLastProgram.next!=null && nlConfigs.nextVideoCallback!=null)
		{
			if(nlConfigs.nextAutoplay!=null)
			{
				nextVideo.style.display = "";
				if(nlConfigs.nextAutoplay>0)
				{	
					var countdownDiv = container.getElementsByClassName('nlOverlayNextVideoCountdown')[0];
					var time         = NL_ENDCARD_COUNTDOWN;
					nlCountdownTimerInt = setInterval(function(){
						if(time>=0)
						{	
							countdownDiv.innerHTML = nlGetResourceString("overlay_countdown")+time;
							time--;
						}
						else
						{
							clearInterval(nlCountdownTimerInt);
							nlPlayNextVideo();
						}
					},1000);
				}
				else
				{
					show = false;
					nlPlayNextVideo();
				}
			}
		}
		else
			nextVideo.style.display = "none";
	}

	if(show)
	{
		nlResizePlayer(true);

		container.getElementsByClassName('nlPlayResumeBtn')[0].style.display = "none";
		container.getElementsByClassName('nlOverlay')[0].classList.remove('nlOverlayHide');
		container.getElementsByClassName('nlOverlay')[0].classList.add('nlOverlayShow');
	}
}

function nlHideOverlay()
{
	var container = document.getElementById(nlConfigs.containerId);
	var overlay   = container.getElementsByClassName('nlOverlay')[0];
	if(overlay!=null)
	{
		nlResizePlayer(false);
		overlay.classList.remove('nlOverlayShow');
		overlay.classList.add('nlOverlayHide');
	}	
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

function nlLoadChromecast(config)
{
	nlLoadScript(config.locResource+"scripts/nlchromecastsenderv3.js");
	nlLoadStyle(config.locResource+"styles/chromecast.css");
	
	setTimeout(function(){nlInitChromecast(config)},200);
}

var nlChromecastCounter = 0;
function nlInitChromecast(config)
{
	if(typeof nlcast == "undefined")
	{
		if((nlChromecastCounter++)<100)
			setTimeout(function(){nlInitChromecast(config)},100);
	}
	else if(typeof ChromeSender == "undefined")
	{
		if(config.senderRequested == null)
		{
			config.senderRequested = true;
			nlLoadScript(config.locResource+"scripts/chromecastsenderv3.js");
		}	
		if((nlChromecastCounter++)<100)
			setTimeout(function(){nlInitChromecast(config)},100);
	}
	else
	{	
		ChromeSender.detectSDK(config.appId);
		if(nlPlayerReady && window.dispatchPlayerReadyEvent!=null)
			dispatchPlayerReadyEvent(nlConfigs.playerId);
		if(nlConfigs.chromecastLoadedCallback!=null)
			nlConfigs.chromecastLoadedCallback();
	}
}

function nlCreateErrorObj(code,details)
{
	return {
		code: code,
		details:details
	}
}

var NLConstants = {

	Error : {
		'AD_BLOCKER_DETECTED'      : "adBlockerDetected",
		'CONNECTION_ERROR'         : "connectionError",
		'EMPTY_PUBLISHPOINT'       : "emptyPublishPoint",
		'GEO_BLOCKED'              : "geoBlocked",
	},
	
	Events : {
	},
	
	Constants : {
	},
};