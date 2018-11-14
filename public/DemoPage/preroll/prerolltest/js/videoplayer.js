"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * videoplayer.js v0.1.3.180510
 *
 * Dependency: nlplayer2.js, neu.js, modal.js
 * Note: Please add below required and optional info before this file's script tag
 *
 * Required:
 * 1. master.jsp
 <script type="text/javascript">
	 var LOC_SERVER = "${requestScope.locServer}";
	 var LOC_RESOURCE = "${requestScope.locResource}";
	 var ANALYTICS_1 = "${requestScope.groupConfig['analytics_1']}";
	 var LOC_QOS = "${requestScope.groupConfig['qos']}";
	 var LICENSE_PROXY = "${requestScope.groupConfig['license_proxy']}";
	 var PERSONALIZATION_SERVER = "${requestScope.groupConfig['personalization']}";
	 var PCM_SERVER = "${requestScope.groupConfig['pcm']}";
	 var ANALYTICS_1 = "${requestScope.groupConfig['analytics_1']}";
	 var LOC_QOS = "${requestScope.groupConfig['qos']}";
	 var PERSONALIZATION_SERVER = "${requestScope.groupConfig['personalization']}";
	 var SITE_ID = "${requestScope.siteId}";
	 var enablePs = ${!empty sessionScope.sessionSubs || !empty sessionScope.sessionVIP};
	 <c:if test="${!empty requestScope.groupConfig['personalization']}">
	 <script src="${requestScope.locResource}base/site/scripts/nlps.js"></script>
	 <script>
	 var psServer = "${requestScope.groupConfig['personalization']}";
	 var ps = new Personalization(psServer);
	 </script>
	 </c:if>
	 var username = null;
	 var firstname = null;
	 var trackUsername = null;
	 if (${sessionScope.sessionUsername!=null})
	 {
		username = "${sessionScope.sessionUsername}";
		firstname = "<c:out value="${sessionScope.sessionFirstName}" />";
		trackUsername = "${sessionScope.sessionTrackUsername}";
	 }
	 var locale = "${sessionScope.locale}";
 </script>

 <c:if test="${requestScope.isLoggedIn && !empty requestScope.groupConfig['pcm']}">
	 <script src="${requestScope.appPrefix}/site/scripts/sessionpoll.js"></script>
	 <script> SessionPoll.init(); </script>
 </c:if>
 2. properties from neu.properties, please copy from neu.properties.
 ok=OK
 video_unsupported=This video cannot be played on your device. Click <a href="https://neulion-a.akamaihd.net/nlweb/h5support/player.html" target="_blank">HERE</a> for more help.


 * Options:
 * 1. nlCustomPlayerConfig: (config for custom player)
 * Such as:
 *    var nlCustomPlayerConfig = {
 				containerId: 'videoContainer',                              // default: nlPlayerContainer
 				customUnsupportedCallback: unsupportedCallbackFn,           // custom unsupportCallback for Non-Neu not support info
 				useCustomControls: true,                                    // custom player control bar
 				customScripts: [
 					LOC_RESOURCE + "site_4/player/scripts/nlcontrols.js",     // custom player control bar script file
 					LOC_RESOURCE + "site_4/player/scripts/nlplayerstrings.js" // custom player localization file
 				],
 				customStyles: [
 					LOC_RESOURCE + "site_4/player/styles/nlcontrols.css"      // custom player control bar style file
 				],
 			};
 */
(function (root) {
	var commonPlayerConfig = initCommonPlayerConfig(),
	    playerConfig = deepExtend({}, commonPlayerConfig);

	function initNLPlayer(customPlayerConfig, program) {
		playNLProgram(program, customPlayerConfig);
	}

	function playNLProgram(program, customPlayerConfig) {
		program = postProcessProgram(program);
		if (root.ps != null && root.enablePs && !program.isLive) {
			getPersonalData(program.id, "program", function (data) {
				if (data.length > 0) {
					if (data[0].watchHistory !== undefined) {
						program.offsetStart = data[0].watchHistory.position;
					}
					// handle other program's personal data like watchlist, favorite status
				}
				nlPlayProgramWhenPlayerReady(program, customPlayerConfig);
			});
		} else {
			nlPlayProgramWhenPlayerReady(program, customPlayerConfig);
		}
	}

	function nlPlayProgramWhenPlayerReady(program, customPlayerConfig) {
		var times = 600,
		    timeout = 100;

		checkNLPlayerIsReady();

		function checkNLPlayerIsReady() {
			if (playerConfig.isPlayerReady === undefined) {
				// Extend custom to player config
				customPlayerConfig && deepExtend(playerConfig, customPlayerConfig);

				playerConfig.isPlayerReady = false;
				playerConfig = processNLPlayerConfigWithVideo(playerConfig, program);

				nlRenderPlayer(playerConfig, program);
			} else if (playerConfig.isPlayerReady === true) {
				nlPlayVideo(program);
			} else {
				if (--times) {
					setTimeout(checkNLPlayerIsReady, timeout);
				}
			}
		}
	}

	function initCommonPlayerConfig() {
		var nlPlayerConfig = {
			containerId: "nlPlayerContainer",
			server: root.LOC_SERVER,
			locResource: root.LOC_RESOURCE + "base/site/",
			wmode: 'opaque',
			site: root.SITE_ID,
			nlHTML5: true,
			noFlash: true,
			useCustomControls: true,
			readyCallback: listenNLPlayerReady,
			unsupportedCallback: listenUnsupported
		};

		if (root.ANALYTICS_1) {
			nlPlayerConfig.gaa = root.ANALYTICS_1;
		}
		if (root.LOC_QOS) {
			nlPlayerConfig.locQos = root.LOC_QOS;
			nlPlayerConfig.site = root.SITE_ID;
			if (root.username != null) {
				nlPlayerConfig.uid = root.username;
			}
		}
		if (root.trackUsername != null) {
			nlPlayerConfig.tuid = trackUsername;
		}
		if (navigator.userAgent.indexOf("Chrome") !== -1) {
			nlPlayerConfig.disablesv = "true";
		}
		if (root.locale != null && root.locale.length > 0) {
			nlPlayerConfig.locale = root.locale;
		}
		if (root.firstname == null) {
			nlPlayerConfig.nosp = true;
		}
		if (root.PERSONALIZATION_SERVER) {
			// Personalization
			nlPlayerConfig.personalization = true;
		}
		if (root.PCM_SERVER) {
			nlPlayerConfig.concurrency = {
				pcm: {
					server: root.PCM_SERVER
				},
				callback: videoSessionTimeout
			};
		}

		function listenUnsupported() {
			if (playerConfig.noHTML5 && playerConfig.customUnsupportedCallback) {
				playerConfig.customUnsupportedCallback();
			} else {
				NEU.ui.modal.show({
					desc: NEU.util.getLocalizedString("video_unsupported"),
					buttons: [{
						"title": NEU.util.getLocalizedString("ok"),
						"type": "yes"
					}]
				});
			}
		}

		function videoSessionTimeout() {
			var pcmModalConfig = {
				desc: NEU.util.getLocalizedString("video_session"),
				buttons: [{
					"title": NEU.util.getLocalizedString("continue"),
					"type": "yes",
					"callback": resumePlayer
				}, {
					"title": NEU.util.getLocalizedString("cancel"),
					"type": "no"
				}]
			};
			NEU.ui.modal.show(pcmModalConfig);
		}

		function listenNLPlayerReady() {
			playerConfig.isPlayerReady = true;
			playerConfig.customReadyCallback && playerConfig.customReadyCallback();
		}

		return nlPlayerConfig;
	}

	function processNLPlayerConfigWithVideo(config, video) {
		if (video.drm) {
			config.drm = {};
			if (root.LICENSE_PROXY) {
				var drmlps = root.LICENSE_PROXY.split(",");
				for (var i = 0; i < drmlps.length; i++) {
					var idx = drmlps[i].indexOf("=");
					config.drm[drmlps[i].substring(0, idx)] = drmlps[i].substring(idx + 1);
				}
			}
		}
		return config;
	}

	function postProcessProgram(program) {
		var processedProgram = deepExtend({}, program);
		if (processedProgram.liveState === 1) {
			processedProgram.isLive = true;
		}
		if (processedProgram.liveState === 2) {
			processedProgram.isLive = true;
			processedProgram.isDVRLive = true;
		}

		if (processedProgram.drm) {
			processedProgram.isDRM = true;
			if (processedProgram.publishPointParams != null) processedProgram.publishPointParams.deviceid = "web-" + root.sid;else processedProgram.publishPointParams = { deviceid: "web-" + root.sid };
		}

		if (root.PCM_SERVER) {
			if (processedProgram.publishPointParams == null) {
				processedProgram.publishPointParams = {};
			}
			processedProgram.publishPointParams.pcid = root.sid;
		}

		return processedProgram;
	}

	function sessionTimeout() {
		root.location.href = location.href;
	}

	function resumePlayer() {
		// TODO workaround here to go with page reload, so if personalization service enabled, player will resume.
		parent.location.reload();
	}

	// Personalization
	function getPersonalData(ids, type, callback) {
		var timeout = 3000,
		    failed = false;
		var iid = root.setTimeout(timeoutHandler, timeout);
		ps.personalContent.list(null, type, ids, successCallback);

		function successCallback(data) {
			if (!failed) {
				root.clearTimeout(iid);
				if (typeof callback === "function") {
					// If no match result, server will return empty array.
					callback(data.contents);
				}
			}
		}

		function timeoutHandler() {
			failed = true;
			callback([]);
		}
	}

	function deepExtend(out) // arguments: (source, source1, source2, ...)
	{
		out = out || {};

		for (var i = 1; i < arguments.length; i++) {
			var obj = arguments[i];

			if (!obj) continue;

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (_typeof(obj[key]) === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && !(obj[key] instanceof Date) && !(obj[key] === 'function')) {
						out[key] = deepExtend(out[key], obj[key]);
					} else out[key] = obj[key];
				}
			}
		}
		return out;
	}

	root.nlCommonPlayerConfig = commonPlayerConfig;
	root.playNLProgram = playNLProgram;
	root.initNLPlayer = initNLPlayer;
})(window);

//# sourceMappingURL=videoplayer.js.map