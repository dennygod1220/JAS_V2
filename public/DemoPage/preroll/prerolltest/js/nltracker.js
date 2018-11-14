function NLTracker()
{
	this.initialized = false;
	
	this.initialize = function(config)
	{
		this.config = config;
	
		if(typeof require != "undefined")
		{
			initializeLater(config);
		}
		else
		{
			nlLoadScript(config.locResource+"scripts/require.js");
			setTimeout(function(){initializeLater(config)},200);
		}	
	};
	
	var requireLoaded = 0;
	function initializeLater(config)
	{
		if(typeof require == "undefined")
		{
			if((requireLoaded++)<100)
				setTimeout(function(){initializeLater(config)},100);
			else
				setTimeout(function(){initializeLater(config)},5000);
		}
		else
		{
			NLTracker.initialized = true;
			require.config({
			    paths: 
			    {
				    nlbase: config.locResource + "scripts"
				},
			    shim : 
			    {
			    	"nlbase/nlqos"     :{ deps : [ "nlbase/nltrack.min"] },
			        "nlbase/comscore"  :{ deps : [ "nlbase/streamsense.min"] },
			        "nlbase/nlcomscore2"  :{ deps : [ "nlbase/streamsense2.min"] },
			        "nlbase/nladobeheartbeat"  :{ deps : [ "nlbase/VideoHeartbeat.min"] }
			    }
			});
	
			requirejs.onError = function (err) 
			{
			    console.log(err.requireType);
			};
			
			var hasGA = false;
			if(isFlash(config))
			{
				if(config.gaa!=null && (config.comscore!=null || config.externalTrackCallback!=null || config.nielsen!=null || config.heartbeat!=null||config.personalization!=null))
					hasGA = true;
			}
			else if(config.gaa!=null)
				hasGA = true;
				
			if(typeof NLGATracker != 'undefined')
			{
				NLGATracker.initialize(config);
				if(hasGA && config.playerId!=null)
					NLGATracker.createVideoTracker(config);
			}
			else if(config.gaa!=null)
			{
				require(["nlbase/nlga"],function(ga){
					if(ga)
					{
						NLGATracker.initialize(config);
						if(config.playerId!=null && hasGA)
							NLGATracker.createVideoTracker(config);
					}
			    });
		    }
	   		
			if(config.locQos!=null)
			{
				require(["nlbase/nlqos", "nlbase/nltrack.min"],function(qos){
					if(qos)
					{
						NLQosTracker.initialize(config);
						if(!isFlash(config) && config.playerId!=null)
							NLQosTracker.createVideoTracker(config);
					}
				});
			}
			if(config.comscore!=null)
			{
				var comscorelib = ["nlbase/comscore", "nlbase/streamsense.min"];
				if(config.comscore[4]!=null)
				{
					var version = config.comscore[4];
					if(version!=null && version.length > 0 && version == 'v2')
					{
						comscorelib = [];
						comscorelib.push("nlbase/nlcomscore2");
						comscorelib.push("nlbase/streamsense2.min");
					}
				}
				require(comscorelib,function(comscore){
					if(comscore)	
					{
						NLComscoreTracker.initialize(config);
						if(config.playerId!=null)
							NLComscoreTracker.createVideoTracker(config);
					}		
				});
			}
			if(config.externalTrackCallback!=null)
			{
				require(["nlbase/externaltracker"],function(external){
					if(external)
					{
						NLExternalTracker.initialize(config);
						if(config.playerId!=null)
							NLExternalTracker.createVideoTracker(config);
					}				
				});
			}
			if(config.nielsen!=null)
			{
				if(!Array.isArray(config.nielsen))
				{
					require(["nlbase/nlnielsen2"],function(nielsen){
						if(nielsen)
						{
							NLNielsenTracker.initialize(config);
							if(config.playerId!=null)
								NLNielsenTracker.createVideoTracker(config);
						}
					});
				}
				else
				{
					var nielsenlib = [];
					var prefix = "http://secure-";
					if(window.location.protocol == "https:")
						prefix = "https://secure-";
					if(config.nielsen[3])
						nielsenlib.push(prefix+config.nielsen[1]+".imrworldwide.com/novms/js/2/ggcmb500.js");
					if(config.nielsen[4])
						nielsenlib.push(prefix+config.nielsen[1]+".imrworldwide.com/novms/js/2/ggcmb510.js");
					
					require(nielsenlib,function(){
						require(["nlbase/nlnielsen"],function(nielsen){
							if(nielsen)
							{
								NLNielsenTracker.initialize(config);
								if(config.playerId!=null)
									NLNielsenTracker.createVideoTracker(config);
							}
						});
					});
				}
			}
			if(config.heartbeat!=null)
			{
				require(["nlbase/nladobeheartbeat", "nlbase/VideoHeartbeat.min"],function(heartbeat){
					if(heartbeat)	
					{
						NLAdobeHeartbeatTracker.initialize(config);
						if(config.playerId!=null)
							NLAdobeHeartbeatTracker.createVideoTracker(config);
					}		
				});
			}
			if(config.personalization!=null)
			{
				require(["nlbase/nlplayerps"],function(ps){
					if(ps)	
					{
						NLPSTracker.initialize(config);
						if(config.playerId!=null)
							NLPSTracker.createVideoTracker(config);
					}		
				});
			}		
		}	
	}
	
	this.reInitialize = function(config)
	{
		if(typeof NLGATracker != 'undefined')
			NLGATracker.reInit(config);
		if(typeof NLQosTracker != 'undefined')
			NLQosTracker.reInit(config);
	};
	
	var trackerInitCounter = 0;
	this.trackPage = function(pageName)
	{
		if(NLTracker.initialized)
		{
			if(NLTracker.config.gaa!=null)
			{
				if(typeof NLGATracker != 'undefined')
					NLGATracker.trackPage(pageName);
				else
				{
					require(['nlbase/nlga'], function (ga) {
			        	NLGATracker.trackPage(pageName);
			    	});
		    	}
		    }
			
			if(NLTracker.config.locQos!=null)
			{
				require(["nlbase/nlqos", "nlbase/nltrack.min"],function(qos){
					NLQosTracker.trackPage(pageName);
				});
			}
		}
		else
		{
			if((trackerInitCounter++)<100)
				setTimeout(function(){NLTracker.trackPage(pageName)},100);
			else
				setTimeout(function(){NLTracker.trackPage(pageName)},5000);
		}
	};
	
	this.trackLogin = function(userId, userType, tuid)
	{
		if(typeof NLGATracker != 'undefined' && tuid!=null)
			NLGATracker.trackLogin(tuid, userType);
		
		if(typeof NLQosTracker != 'undefined')
			NLQosTracker.trackLogin(userId, userType);
	};
	
	this.trackMVPDLogin = function(mvpdId, userId)
	{
		if(typeof NLGATracker != 'undefined')
			NLGATracker.trackMVPDLogin(mvpdId, userId);
			
		if(typeof NLQosTracker != 'undefined')
			NLQosTracker.trackMVPDLogin(mvpdId, userId);
	};
	
	this.trackLogout = function()
	{
		if(typeof NLQosTracker != 'undefined')
			NLQosTracker.trackLogout();
	};
	
	this.trackRegistration = function()
	{
		if(typeof NLGATracker != 'undefined')
			NLGATracker.trackRegistration();
		
		if(typeof NLQosTracker != 'undefined')
			NLQosTracker.trackRegistration();
	};
	
	this.trackPurchaseSelection = function(packageInfo)
	{
		if(typeof NLQosTracker != 'undefined')
			NLQosTracker.trackPurchaseSelection(packageInfo);
	};
	
	this.trackPurchaseBilling = function(packageInfo)
	{
		if(typeof NLGATracker != 'undefined')
			NLGATracker.trackPurchaseBilling();
		
		if(typeof NLQosTracker != 'undefined')
			NLQosTracker.trackPurchaseBilling(packageInfo);
	};
	
	this.trackPurchaseConfirmation = function(packageInfo)
	{
		if(typeof NLGATracker != 'undefined')
			NLGATracker.trackPurchaseConfirmation(packageInfo);
		
		if(typeof NLQosTracker != 'undefined')
			NLQosTracker.trackPurchaseConfirmation(packageInfo);
	};
	
	this.trackError = function(err)
	{
		if(typeof NLQosTracker != 'undefined')
			NLQosTracker.trackError(err);
	};
	
	this.updatePlayheadTime = function(id, time, type)
	{
		if(typeof NLNielsenTracker != 'undefined')
			NLNielsenTracker.updatePlayheadTime(id, time, type);
	};
	
	this.createVideoTracker = function(config)
	{
		if(config.gaa!=null)
		{
			var hasGA = false;
			if(isFlash(config))
			{
				if(config.gaa!=null && (config.comscore!=null || config.externalTrackCallback!=null || config.nielsen!=null || config.heartbeat!=null||config.personalization!=null))
					hasGA = true;
			}
			else if(config.gaa!=null)
				hasGA = true;
				
			if(hasGA)
			{
				if(typeof NLGATracker!= 'undefined')
					NLGATracker.createVideoTracker(config);
				else
				{
					require(["nlbase/nlga"],function(ga){
					if(ga)
						NLGATracker.createVideoTracker(config);
					});
				}
			}
		}
		
		if(config.locQos!=null && !isFlash(config))
		{
			if(typeof NLQosTracker!= 'undefined')
				NLQosTracker.createVideoTracker(config);
			else
			{
				require(["nlbase/nlqos", "nlbase/nltrack.min"],function(qos){
					if(qos)
						NLQosTracker.createVideoTracker(config);
				});
			}
		}
		
		if(config.comscore!=null)
		{
			if(typeof NLComscoreTracker!= 'undefined')
				NLComscoreTracker.createVideoTracker(config);
			else
			{
				var comscorelib = ["nlbase/comscore", "nlbase/streamsense.min"];
				if(config.comscore[4]!=null)
				{
					var version = config.comscore[4];
					if(version!=null && version.length > 0 && version == 'v2')
					{
						comscorelib = [];
						comscorelib.push("nlbase/nlcomscore2");
						comscorelib.push("nlbase/streamsense2.min");
					}
				}
				require(comscorelib,function(comscore){
					if(comscore)	
						NLComscoreTracker.createVideoTracker(config);
				});	
			}
		}
		
		if(config.externalTrackCallback!=null)
		{
			if(typeof NLExternalTracker!= 'undefined')
				NLExternalTracker.createVideoTracker(config);
			else
			{
				require(["nlbase/externaltracker"],function(external){
					if(external)
						NLExternalTracker.createVideoTracker(config);
				});
			}
		}
		
		if(config.nielsen!=null)
		{
			if(typeof NLNielsenTracker!= 'undefined')
				NLNielsenTracker.createVideoTracker(config);
			else
			{
				if(!Array.isArray(config.nielsen))
				{
					require(["nlbase/nlnielsen2"],function(nielsen){
						if(nielsen)
						{
							if(config.playerId!=null)
								NLNielsenTracker.createVideoTracker(config);
						}
					});
				}
				else
				{
					var nielsenlib = [];
					var prefix = "http://secure-";
					if(window.location.protocol == "https:")
						prefix = "https://secure-";
					if(config.nielsen[3])
						nielsenlib.push(prefix+config.nielsen[1]+".imrworldwide.com/novms/js/2/ggcmb500.js");
					if(config.nielsen[4])
						nielsenlib.push(prefix+config.nielsen[1]+".imrworldwide.com/novms/js/2/ggcmb510.js");
					
					require(nielsenlib,function(){
						require(["nlbase/nlnielsen"],function(nielsen){
							if(nielsen)
								NLNielsenTracker.createVideoTracker(config);
						});
					});
				}
			}
		}
		
		if(config.heartbeat!=null)
		{
			if(typeof NLAdobeHeartbeatTracker!= 'undefined')
				NLAdobeHeartbeatTracker.createVideoTracker(config);
			else
			{
				require(["nlbase/nladobeheartbeat", "nlbase/VideoHeartbeat.min"],function(heartbeat){
					if(heartbeat)	
						NLAdobeHeartbeatTracker.createVideoTracker(config);
				});
			}
		}
		
		if(config.personalization!=null)
		{
			if(typeof NLPSTracker!= 'undefined')
				NLPSTracker.createVideoTracker(config);
			else
			{
				require(["nlbase/nlplayerps"],function(ps)
				{
					if(ps)	
						NLPSTracker.createVideoTracker(config);
				});
			}	
		}	
	};
	
	this.trackEvent = function(htmlid, action, data)
	{
		data.htmlid = htmlid;
		if(data.video.id!=null)
		{
			switch(action)
			{
				case "videostart":
					nlTriggerEvent('nlvideostart','playerEvent',data);
					break;
					
				case "videocomplete":
					nlTriggerEvent('nlvideocomplete','playerEvent',data);
					break;
					
				case "videopercent":
					nlTriggerEvent('nlvideopercent','playerEvent',data);
					break;
					
				case "videoduration":
					nlTriggerEvent('nlvideoduration','playerEvent',data);
					break;
				
				case "videostate":
					nlTriggerEvent('nlvideostate','playerEvent',data);
					break;
					
				case "videostatus":
					nlTriggerEvent('nlvideostatus','playerEvent',data);
					break;
					
				case "videoerror":
					nlTriggerEvent('nlvideoerror','playerEvent',data);
					break;
					
				case "adstart":
				    nlTriggerEvent('nladstart','playerEvent',data);
					break;
					
				case "adpause":
					nlTriggerEvent('nladpause','playerEvent',data);
					break;
					
				case "adresume":
				    nlTriggerEvent('nladresume','playerEvent',data);
					break;
					
				case "adcomplete":
					nlTriggerEvent('nladcomplete','playerEvent',data);
					break;
					
				case "customevent":
					nlTriggerEvent('nlcustomevent','playerEvent',data);
					break;

				case "streamrating":
					nlTriggerEvent('nlstreamrating','playerEvent',data);
			}
		}	
	};
	
	function nlTriggerEvent(eventName,eventType,data)
	{
		var element = null;
		if(data.htmlid.indexOf(':')>0)
		{
			var arr = data.htmlid.split(':');
			element = document.getElementById(arr[0]);
		}
		else
		{
			element = document.getElementById(data.htmlid);
		}
		if(element && document.createEvent) 
		{
	    	var event = document.createEvent("CustomEvent");
	    	event.initCustomEvent(eventName, true, true,{'data':data});
	    	event.eventName = eventName;
	    	
	    	try
			{
				element.dispatchEvent(event);
	   		}
	    	catch(err){};
	  	} 
	}
	
	function nlLoadScript(src)
	{
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = src;
		var stag = document.getElementsByTagName("script")[0];
		stag.parentNode.insertBefore(script, stag);
	}
	
	function isFlash(config)
	{
		var isFlash = false;
		if(config.noFlash)
		{
			isFlash = false;
		}
		else if(window.swfobject!=null)
		{
			var pv = swfobject.getFlashPlayerVersion();
			if((pv!=null && pv.major==0))
				isFlash = false;
			else
				isFlash = true;
		}
		return isFlash;	
	}
}
var NLTracker = new NLTracker();