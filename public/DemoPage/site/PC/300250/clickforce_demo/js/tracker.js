(function() {
    if (typeof window.bbkkbbk !== 'object') {
        window.bbkkbbk = (function() {
            'use strict';
            var bbkkbbk,
                pentList = [],
                applyFirst = ['addTracker',
                    'setTrackerUrl',
                    'setDebug',
                    'setEnabeCoookie',
                    'setEnableCookie',
                    'setTPCookie',
                    'setSiteId'
                ],
                debug = false,
                asyncTrackers = new Array();

            /*
             *Tools
             */

            var W = window,
                N = navigator || W.navigator,
                M = document || W.document,
                Un = "Unknown",
                Ud = "undefined";

            var UAP = function() {
                var LIBVERSION = '0.7.17',
                    EMPTY = '',
                    UNKNOWN = '?',
                    FUNC_TYPE = 'function',
                    UNDEF_TYPE = 'undefined',
                    OBJ_TYPE = 'object',
                    STR_TYPE = 'string',
                    MAJOR = 'major', // deprecated
                    MODEL = 'model',
                    NAME = 'name',
                    TYPE = 'type',
                    VENDOR = 'vendor',
                    VERSION = 'version',
                    ARCHITECTURE = 'architecture',
                    CONSOLE = 'console',
                    MOBILE = 'mobile',
                    TABLET = 'tablet',
                    SMARTTV = 'smarttv',
                    WEARABLE = 'wearable',
                    EMBEDDED = 'embedded',
                    SOURCE = 'https://github.com/faisalman/ua-parser-js';


                ///////////
                // Helper
                //////////


                var util = {
                    extend: function(regexes, extensions) {
                        var margedRegexes = {};
                        for (var i in regexes) {
                            if (extensions[i] && extensions[i].length % 2 === 0) {
                                margedRegexes[i] = extensions[i].concat(regexes[i]);
                            } else {
                                margedRegexes[i] = regexes[i];
                            }
                        }
                        return margedRegexes;
                    },
                    has: function(str1, str2) {
                        if (typeof str1 === "string") {
                            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
                        } else {
                            return false;
                        }
                    },
                    lowerize: function(str) {
                        return str.toLowerCase();
                    },
                    major: function(version) {
                        return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g, '').split(".")[0] : undefined;
                    },
                    trim: function(str) {
                        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
                    }
                };


                ///////////////
                // Map helper
                //////////////


                var mapper = {
                    rgx: function(ua, arrays) {
                        var i = 0,
                            j, k, p, q, matches, match;
                        while (i < arrays.length && !matches) {
                            var regex = arrays[i],
                                props = arrays[i + 1];
                            j = k = 0;
                            while (j < regex.length && !matches) {
                                matches = regex[j++].exec(ua);
                                if (!!matches) {
                                    for (p = 0; p < props.length; p++) {
                                        match = matches[++k];
                                        q = props[p];

                                        if (typeof q === OBJ_TYPE && q.length > 0) {
                                            if (q.length == 2) {
                                                if (typeof q[1] == FUNC_TYPE) {

                                                    this[q[0]] = q[1].call(this, match);
                                                } else {

                                                    this[q[0]] = q[1];
                                                }
                                            } else if (q.length == 3) {

                                                if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {

                                                    this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                                } else {

                                                    this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                                }
                                            } else if (q.length == 4) {
                                                this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                            }
                                        } else {
                                            this[q] = match ? match : undefined;
                                        }
                                    }
                                }
                            }
                            i += 2;
                        }
                    },

                    str: function(str, map) {

                        for (var i in map) {
                            if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                                for (var j = 0; j < map[i].length; j++) {
                                    if (util.has(map[i][j], str)) {
                                        return (i === UNKNOWN) ? undefined : i;
                                    }
                                }
                            } else if (util.has(map[i], str)) {
                                return (i === UNKNOWN) ? undefined : i;
                            }
                        }
                        return str;
                    }
                };


                ///////////////
                // String map
                //////////////


                var maps = {

                    browser: {
                        oldsafari: {
                            version: {
                                '1.0': '/8',
                                '1.2': '/1',
                                '1.3': '/3',
                                '2.0': '/412',
                                '2.0.2': '/416',
                                '2.0.3': '/417',
                                '2.0.4': '/419',
                                '?': '/'
                            }
                        }
                    },

                    device: {
                        amazon: {
                            model: {
                                'Fire Phone': ['SD', 'KF']
                            }
                        },
                        sprint: {
                            model: {
                                'Evo Shift 4G': '7373KT'
                            },
                            vendor: {
                                'HTC': 'APA',
                                'Sprint': 'Sprint'
                            }
                        }
                    },

                    os: {
                        windows: {
                            version: {
                                'ME': '4.90',
                                'NT 3.11': 'NT3.51',
                                'NT 4.0': 'NT4.0',
                                '2000': 'NT 5.0',
                                'XP': ['NT 5.1', 'NT 5.2'],
                                'Vista': 'NT 6.0',
                                '7': 'NT 6.1',
                                '8': 'NT 6.2',
                                '8.1': 'NT 6.3',
                                '10': ['NT 6.4', 'NT 10.0'],
                                'RT': 'ARM'
                            }
                        }
                    }
                };


                //////////////
                // Regex map
                /////////////


                var regexes = {

                    browser: [
                        [

                            // Presto based
                            /(opera\smini)\/([\w\.-]+)/i, // Opera Mini
                            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, // Opera Mobi/Tablet
                            /(opera).+version\/([\w\.]+)/i, // Opera > 9.80
                            /(opera)[\/\s]+([\w\.]+)/i // Opera < 9.80
                        ],
                        [NAME, VERSION],
                        [

                            /(opios)[\/\s]+([\w\.]+)/i // Opera mini on iphone >= 8.0
                        ],
                        [
                            [NAME, 'Opera Mini'], VERSION
                        ],
                        [

                            /\s(opr)\/([\w\.]+)/i // Opera Webkit
                        ],
                        [
                            [NAME, 'Opera'], VERSION
                        ],
                        [

                            // Mixed
                            /(kindle)\/([\w\.]+)/i, // Kindle
                            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
                            // Lunascape/Maxthon/Netfront/Jasmine/Blazer

                            // Trident based
                            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                            // Avant/IEMobile/SlimBrowser/Baidu
                            /(?:ms|\()(ie)\s([\w\.]+)/i, // Internet Explorer

                            // Webkit/KHTML based
                            /(rekonq)\/([\w\.]+)*/i, // Rekonq
                            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark)\/([\w\.-]+)/i
                            // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser
                        ],
                        [NAME, VERSION],
                        [

                            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i // IE11
                        ],
                        [
                            [NAME, 'IE'], VERSION
                        ],
                        [

                            /(edge)\/((\d+)?[\w\.]+)/i // Microsoft Edge
                        ],
                        [NAME, VERSION],
                        [

                            /(yabrowser)\/([\w\.]+)/i // Yandex
                        ],
                        [
                            [NAME, 'Yandex'], VERSION
                        ],
                        [

                            /(puffin)\/([\w\.]+)/i // Puffin
                        ],
                        [
                            [NAME, 'Puffin'], VERSION
                        ],
                        [

                            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i
                            // UCBrowser
                        ],
                        [
                            [NAME, 'UCBrowser'], VERSION
                        ],
                        [

                            /(comodo_dragon)\/([\w\.]+)/i // Comodo Dragon
                        ],
                        [
                            [NAME, /_/g, ' '], VERSION
                        ],
                        [

                            /(micromessenger)\/([\w\.]+)/i // WeChat
                        ],
                        [
                            [NAME, 'WeChat'], VERSION
                        ],
                        [

                            /(QQ)\/([\d\.]+)/i // QQ, aka ShouQ
                        ],
                        [NAME, VERSION],
                        [

                            /(Line)\/([\d\.]+)/i //  Line/8.1.1
                        ],
                        [NAME, VERSION],
                        [

                            /m?(qqbrowser)[\/\s]?([\w\.]+)/i // QQBrowser
                        ],
                        [NAME, VERSION],
                        [

                            /xiaomi\/miuibrowser\/([\w\.]+)/i // MIUI Browser
                        ],
                        [VERSION, [NAME, 'MIUI Browser']],
                        [

                            /;fbav\/([\w\.]+);/i // Facebook App for iOS & Android
                        ],
                        [VERSION, [NAME, 'Facebook']],
                        [

                            /headlesschrome(?:\/([\w\.]+)|\s)/i // Chrome Headless
                        ],
                        [VERSION, [NAME, 'Chrome Headless']],
                        [

                            /\swv\).+(chrome)\/([\w\.]+)/i // Chrome WebView
                        ],
                        [
                            [NAME, /(.+)/, '$1 WebView'], VERSION
                        ],
                        [

                            /((?:oculus|samsung)browser)\/([\w\.]+)/i
                        ],
                        [
                            [NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION
                        ],
                        [ // Oculus / Samsung Browser

                            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i // Android Browser
                        ],
                        [VERSION, [NAME, 'Android Browser']],
                        [

                            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
                            // Chrome/OmniWeb/Arora/Tizen/Nokia
                        ],
                        [NAME, VERSION],
                        [

                            /(dolfin)\/([\w\.]+)/i // Dolphin
                        ],
                        [
                            [NAME, 'Dolphin'], VERSION
                        ],
                        [

                            /((?:android.+)crmo|crios)\/([\w\.]+)/i // Chrome for Android/iOS
                        ],
                        [
                            [NAME, 'Chrome'], VERSION
                        ],
                        [

                            /(coast)\/([\w\.]+)/i // Opera Coast
                        ],
                        [
                            [NAME, 'Opera Coast'], VERSION
                        ],
                        [

                            /fxios\/([\w\.-]+)/i // Firefox for iOS
                        ],
                        [VERSION, [NAME, 'Firefox']],
                        [

                            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i // Mobile Safari
                        ],
                        [VERSION, [NAME, 'Mobile Safari']],
                        [

                            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i // Safari & Safari Mobile
                        ],
                        [VERSION, NAME],
                        [

                            /webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i // Google Search Appliance on iOS
                        ],
                        [
                            [NAME, 'GSA'], VERSION
                        ],
                        [

                            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i // Safari < 3.0
                        ],
                        [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]],
                        [

                            /(konqueror)\/([\w\.]+)/i, // Konqueror
                            /(webkit|khtml)\/([\w\.]+)/i
                        ],
                        [NAME, VERSION],
                        [

                            // Gecko based
                            /(navigator|netscape)\/([\w\.-]+)/i // Netscape
                        ],
                        [
                            [NAME, 'Netscape'], VERSION
                        ],
                        [
                            /(swiftfox)/i, // Swiftfox
                            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                            // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
                            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,

                            // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
                            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, // Mozilla

                            // Other
                            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                            // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
                            /(links)\s\(([\w\.]+)/i, // Links
                            /(gobrowser)\/?([\w\.]+)*/i, // GoBrowser
                            /(ice\s?browser)\/v?([\w\._]+)/i, // ICE Browser
                            /(mosaic)[\/\s]([\w\.]+)/i // Mosaic
                        ],
                        [NAME, VERSION]
                    ],

                    cpu: [
                        [

                            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i // AMD64
                        ],
                        [
                            [ARCHITECTURE, 'amd64']
                        ],
                        [

                            /(ia32(?=;))/i // IA32 (quicktime)
                        ],
                        [
                            [ARCHITECTURE, util.lowerize]
                        ],
                        [

                            /((?:i[346]|x)86)[;\)]/i // IA32
                        ],
                        [
                            [ARCHITECTURE, 'ia32']
                        ],
                        [

                            // PocketPC mistakenly identified as PowerPC
                            /windows\s(ce|mobile);\sppc;/i
                        ],
                        [
                            [ARCHITECTURE, 'arm']
                        ],
                        [

                            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i // PowerPC
                        ],
                        [
                            [ARCHITECTURE, /ower/, '', util.lowerize]
                        ],
                        [

                            /(sun4\w)[;\)]/i // SPARC
                        ],
                        [
                            [ARCHITECTURE, 'sparc']
                        ],
                        [

                            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                            // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
                        ],
                        [
                            [ARCHITECTURE, util.lowerize]
                        ]
                    ],

                    device: [
                        [

                            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i // iPad/PlayBook
                        ],
                        [MODEL, VENDOR, [TYPE, TABLET]],
                        [

                            /applecoremedia\/[\w\.]+ \((ipad)/ // iPad
                        ],
                        [MODEL, [VENDOR, 'Apple'],
                            [TYPE, TABLET]
                        ],
                        [

                            /(apple\s{0,1}tv)/i // Apple TV
                        ],
                        [
                            [MODEL, 'Apple TV'],
                            [VENDOR, 'Apple']
                        ],
                        [

                            /(archos)\s(gamepad2?)/i, // Archos
                            /(hp).+(touchpad)/i, // HP TouchPad
                            /(hp).+(tablet)/i, // HP Tablet
                            /(kindle)\/([\w\.]+)/i, // Kindle
                            /\s(nook)[\w\s]+build\/(\w+)/i, // Nook
                            /(dell)\s(strea[kpr\s\d]*[\dko])/i // Dell Streak
                        ],
                        [VENDOR, MODEL, [TYPE, TABLET]],
                        [

                            /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i // Kindle Fire HD
                        ],
                        [MODEL, [VENDOR, 'Amazon'],
                            [TYPE, TABLET]
                        ],
                        [
                            /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i // Fire Phone
                        ],
                        [
                            [MODEL, mapper.str, maps.device.amazon.model],
                            [VENDOR, 'Amazon'],
                            [TYPE, MOBILE]
                        ],
                        [

                            /\((ip[honed|\s\w*]+);.+(apple)/i // iPod/iPhone
                        ],
                        [MODEL, VENDOR, [TYPE, MOBILE]],
                        [
                            /\((ip[honed|\s\w*]+);/i // iPod/iPhone
                        ],
                        [MODEL, [VENDOR, 'Apple'],
                            [TYPE, MOBILE]
                        ],
                        [

                            /(blackberry)[\s-]?(\w+)/i, // BlackBerry
                            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
                            // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
                            /(hp)\s([\w\s]+\w)/i, // HP iPAQ
                            /(asus)-?(\w+)/i // Asus
                        ],
                        [VENDOR, MODEL, [TYPE, MOBILE]],
                        [
                            /\(bb10;\s(\w+)/i // BlackBerry 10
                        ],
                        [MODEL, [VENDOR, 'BlackBerry'],
                            [TYPE, MOBILE]
                        ],
                        [
                            // Asus Tablets
                            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i
                        ],
                        [MODEL, [VENDOR, 'Asus'],
                            [TYPE, TABLET]
                        ],
                        [

                            /(sony)\s(tablet\s[ps])\sbuild\//i, // Sony
                            /(sony)?(?:sgp.+)\sbuild\//i
                        ],
                        [
                            [VENDOR, 'Sony'],
                            [MODEL, 'Xperia Tablet'],
                            [TYPE, TABLET]
                        ],
                        [
                            /android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i
                        ],
                        [MODEL, [VENDOR, 'Sony'],
                            [TYPE, MOBILE]
                        ],
                        [

                            /\s(ouya)\s/i, // Ouya
                            /(nintendo)\s([wids3u]+)/i // Nintendo
                        ],
                        [VENDOR, MODEL, [TYPE, CONSOLE]],
                        [

                            /android.+;\s(shield)\sbuild/i // Nvidia
                        ],
                        [MODEL, [VENDOR, 'Nvidia'],
                            [TYPE, CONSOLE]
                        ],
                        [

                            /(playstation\s[34portablevi]+)/i // Playstation
                        ],
                        [MODEL, [VENDOR, 'Sony'],
                            [TYPE, CONSOLE]
                        ],
                        [

                            /(sprint\s(\w+))/i // Sprint Phones
                        ],
                        [
                            [VENDOR, mapper.str, maps.device.sprint.vendor],
                            [MODEL, mapper.str, maps.device.sprint.model],
                            [TYPE, MOBILE]
                        ],
                        [

                            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i // Lenovo tablets
                        ],
                        [VENDOR, MODEL, [TYPE, TABLET]],
                        [

                            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, // HTC
                            /(zte)-(\w+)*/i, // ZTE
                            /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
                            // Alcatel/GeeksPhone/Lenovo/Nexian/Panasonic/Sony
                        ],
                        [VENDOR, [MODEL, /_/g, ' '],
                            [TYPE, MOBILE]
                        ],
                        [

                            /(nexus\s9)/i // HTC Nexus 9
                        ],
                        [MODEL, [VENDOR, 'HTC'],
                            [TYPE, TABLET]
                        ],
                        [

                            /d\/huawei([\w\s-]+)[;\)]/i,
                            /(nexus\s6p)/i // Huawei
                        ],
                        [MODEL, [VENDOR, 'Huawei'],
                            [TYPE, MOBILE]
                        ],
                        [

                            /(microsoft);\s(lumia[\s\w]+)/i // Microsoft Lumia
                        ],
                        [VENDOR, MODEL, [TYPE, MOBILE]],
                        [

                            /[\s\(;](xbox(?:\sone)?)[\s\);]/i // Microsoft Xbox
                        ],
                        [MODEL, [VENDOR, 'Microsoft'],
                            [TYPE, CONSOLE]
                        ],
                        [
                            /(kin\.[onetw]{3})/i // Microsoft Kin
                        ],
                        [
                            [MODEL, /\./g, ' '],
                            [VENDOR, 'Microsoft'],
                            [TYPE, MOBILE]
                        ],
                        [

                            // Motorola
                            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
                            /mot[\s-]?(\w+)*/i,
                            /(XT\d{3,4}) build\//i,
                            /(nexus\s6)/i
                        ],
                        [MODEL, [VENDOR, 'Motorola'],
                            [TYPE, MOBILE]
                        ],
                        [
                            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
                        ],
                        [MODEL, [VENDOR, 'Motorola'],
                            [TYPE, TABLET]
                        ],
                        [

                            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i // HbbTV devices
                        ],
                        [
                            [VENDOR, util.trim],
                            [MODEL, util.trim],
                            [TYPE, SMARTTV]
                        ],
                        [

                            /hbbtv.+maple;(\d+)/i
                        ],
                        [
                            [MODEL, /^/, 'SmartTV'],
                            [VENDOR, 'Samsung'],
                            [TYPE, SMARTTV]
                        ],
                        [

                            /\(dtv[\);].+(aquos)/i // Sharp
                        ],
                        [MODEL, [VENDOR, 'Sharp'],
                            [TYPE, SMARTTV]
                        ],
                        [

                            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
                            /((SM-T\w+))/i
                        ],
                        [
                            [VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]
                        ],
                        [ // Samsung
                            /smart-tv.+(samsung)/i
                        ],
                        [VENDOR, [TYPE, SMARTTV], MODEL],
                        [
                            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
                            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
                            /sec-((sgh\w+))/i
                        ],
                        [
                            [VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]
                        ],
                        [

                            /sie-(\w+)*/i // Siemens
                        ],
                        [MODEL, [VENDOR, 'Siemens'],
                            [TYPE, MOBILE]
                        ],
                        [

                            /(maemo|nokia).*(n900|lumia\s\d+)/i, // Nokia
                            /(nokia)[\s_-]?([\w-]+)*/i
                        ],
                        [
                            [VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]
                        ],
                        [

                            /android\s3\.[\s\w;-]{10}(a\d{3})/i // Acer
                        ],
                        [MODEL, [VENDOR, 'Acer'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+([vl]k\-?\d{3})\s+build/i // LG Tablet
                        ],
                        [MODEL, [VENDOR, 'LG'],
                            [TYPE, TABLET]
                        ],
                        [
                            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i // LG Tablet
                        ],
                        [
                            [VENDOR, 'LG'], MODEL, [TYPE, TABLET]
                        ],
                        [
                            /(lg) netcast\.tv/i // LG SmartTV
                        ],
                        [VENDOR, MODEL, [TYPE, SMARTTV]],
                        [
                            /(nexus\s[45])/i, // LG
                            /lg[e;\s\/-]+(\w+)*/i,
                            /android.+lg(\-?[\d\w]+)\s+build/i
                        ],
                        [MODEL, [VENDOR, 'LG'],
                            [TYPE, MOBILE]
                        ],
                        [

                            /android.+(ideatab[a-z0-9\-\s]+)/i // Lenovo
                        ],
                        [MODEL, [VENDOR, 'Lenovo'],
                            [TYPE, TABLET]
                        ],
                        [

                            /linux;.+((jolla));/i // Jolla
                        ],
                        [VENDOR, MODEL, [TYPE, MOBILE]],
                        [

                            /((pebble))app\/[\d\.]+\s/i // Pebble
                        ],
                        [VENDOR, MODEL, [TYPE, WEARABLE]],
                        [

                            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i // OPPO
                        ],
                        [VENDOR, MODEL, [TYPE, MOBILE]],
                        [

                            /crkey/i // Google Chromecast
                        ],
                        [
                            [MODEL, 'Chromecast'],
                            [VENDOR, 'Google']
                        ],
                        [

                            /android.+;\s(glass)\s\d/i // Google Glass
                        ],
                        [MODEL, [VENDOR, 'Google'],
                            [TYPE, WEARABLE]
                        ],
                        [

                            /android.+;\s(pixel c)\s/i // Google Pixel C
                        ],
                        [MODEL, [VENDOR, 'Google'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+;\s(pixel xl|pixel)\s/i // Google Pixel
                        ],
                        [MODEL, [VENDOR, 'Google'],
                            [TYPE, MOBILE]
                        ],
                        [

                            /android.+(\w+)\s+build\/hm\1/i, // Xiaomi Hongmi 'numeric' models
                            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, // Xiaomi Hongmi
                            /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w?)?[\s_]*(?:plus)?)\s+build/i, // Xiaomi Mi
                            /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+)?)\s+build/i // Redmi Phones
                        ],
                        [
                            [MODEL, /_/g, ' '],
                            [VENDOR, 'Xiaomi'],
                            [TYPE, MOBILE]
                        ],
                        [
                            /android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+)?)\s+build/i // Mi Pad tablets
                        ],
                        [
                            [MODEL, /_/g, ' '],
                            [VENDOR, 'Xiaomi'],
                            [TYPE, TABLET]
                        ],
                        [
                            /android.+;\s(m[1-5]\snote)\sbuild/i // Meizu Tablet
                        ],
                        [MODEL, [VENDOR, 'Meizu'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+a000(1)\s+build/i, // OnePlus
                            /android.+oneplus\s(a\d{4})\s+build/i
                        ],
                        [MODEL, [VENDOR, 'OnePlus'],
                            [TYPE, MOBILE]
                        ],
                        [

                            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i // RCA Tablets
                        ],
                        [MODEL, [VENDOR, 'RCA'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s*(Venue[\d\s]*)\s+build/i // Dell Venue Tablets
                        ],
                        [MODEL, [VENDOR, 'Dell'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i // Verizon Tablet
                        ],
                        [MODEL, [VENDOR, 'Verizon'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i // Barnes & Noble Tablet
                        ],
                        [
                            [VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i // Barnes & Noble Tablet
                        ],
                        [MODEL, [VENDOR, 'NuVision'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s*(zte)?.+(k\d{2})\s+build/i // ZTE K Series Tablet
                        ],
                        [
                            [VENDOR, 'ZTE'], MODEL, [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i // Swiss GEN Mobile
                        ],
                        [MODEL, [VENDOR, 'Swiss'],
                            [TYPE, MOBILE]
                        ],
                        [

                            /android.+[;\/]\s*(zur\d{3})\s+build/i // Swiss ZUR Tablet
                        ],
                        [MODEL, [VENDOR, 'Swiss'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i // Zeki Tablets
                        ],
                        [MODEL, [VENDOR, 'Zeki'],
                            [TYPE, TABLET]
                        ],
                        [

                            /(android).+[;\/]\s+([YR]\d{2}x?.*)\s+build/i,
                            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(.+)\s+build/i // Dragon Touch Tablet
                        ],
                        [
                            [VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s*(NS-?.+)\s+build/i // Insignia Tablets
                        ],
                        [MODEL, [VENDOR, 'Insignia'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s*((NX|Next)-?.+)\s+build/i // NextBook Tablets
                        ],
                        [MODEL, [VENDOR, 'NextBook'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s*(Xtreme\_?)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
                        ],
                        [
                            [VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]
                        ],
                        [ // Voice Xtreme Phones

                            /android.+[;\/]\s*(LVTEL\-?)?(V1[12])\s+build/i // LvTel Phones
                        ],
                        [
                            [VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]
                        ],
                        [

                            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i // Envizen Tablets
                        ],
                        [MODEL, [VENDOR, 'Envizen'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(.*\b)\s+build/i // Le Pan Tablets
                        ],
                        [VENDOR, MODEL, [TYPE, TABLET]],
                        [

                            /android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i // MachSpeed Tablets
                        ],
                        [MODEL, [VENDOR, 'MachSpeed'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i // Trinity Tablets
                        ],
                        [VENDOR, MODEL, [TYPE, TABLET]],
                        [

                            /android.+[;\/]\s*TU_(1491)\s+build/i // Rotor Tablets
                        ],
                        [MODEL, [VENDOR, 'Rotor'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+(KS(.+))\s+build/i // Amazon Kindle Tablets
                        ],
                        [MODEL, [VENDOR, 'Amazon'],
                            [TYPE, TABLET]
                        ],
                        [

                            /android.+(Gigaset)[\s\-]+(Q.+)\s+build/i // Gigaset Tablets
                        ],
                        [VENDOR, MODEL, [TYPE, TABLET]],
                        [

                            /\s(tablet|tab)[;\/]/i, // Unidentifiable Tablet
                            /\s(mobile)(?:[;\/]|\ssafari)/i // Unidentifiable Mobile
                        ],
                        [
                            [TYPE, util.lowerize], VENDOR, MODEL
                        ],
                        [

                            /(android.+)[;\/].+build/i // Generic Android Device
                        ],
                        [MODEL, [VENDOR, 'Generic']]
                    ],

                    engine: [
                        [

                            /windows.+\sedge\/([\w\.]+)/i // EdgeHTML
                        ],
                        [VERSION, [NAME, 'EdgeHTML']],
                        [

                            /(presto)\/([\w\.]+)/i, // Presto
                            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
                            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, // KHTML/Tasman/Links
                            /(icab)[\/\s]([23]\.[\d\.]+)/i // iCab
                        ],
                        [NAME, VERSION],
                        [

                            /rv\:([\w\.]+).*(gecko)/i // Gecko
                        ],
                        [VERSION, NAME]
                    ],

                    os: [
                        [

                            // Windows based
                            /microsoft\s(windows)\s(vista|xp)/i // Windows (iTunes)
                        ],
                        [NAME, VERSION],
                        [
                            /(windows)\snt\s6\.2;\s(arm)/i, // Windows RT
                            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i, // Windows Phone
                            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
                        ],
                        [NAME, [VERSION, mapper.str, maps.os.windows.version]],
                        [
                            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
                        ],
                        [
                            [NAME, 'Windows'],
                            [VERSION, mapper.str, maps.os.windows.version]
                        ],
                        [

                            // Mobile/Embedded OS
                            /\((bb)(10);/i // BlackBerry 10
                        ],
                        [
                            [NAME, 'BlackBerry'], VERSION
                        ],
                        [
                            /(blackberry)\w*\/?([\w\.]+)*/i, // Blackberry
                            /(tizen)[\/\s]([\w\.]+)/i, // Tizen
                            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
                            // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
                            /linux;.+(sailfish);/i // Sailfish OS
                        ],
                        [NAME, VERSION],
                        [
                            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i // Symbian
                        ],
                        [
                            [NAME, 'Symbian'], VERSION
                        ],
                        [
                            /\((series40);/i // Series 40
                        ],
                        [NAME],
                        [
                            /mozilla.+\(mobile;.+gecko.+firefox/i // Firefox OS
                        ],
                        [
                            [NAME, 'Firefox OS'], VERSION
                        ],
                        [

                            // Console
                            /(nintendo|playstation)\s([wids34portablevu]+)/i, // Nintendo/Playstation

                            // GNU/Linux based
                            /(mint)[\/\s\(]?(\w+)*/i, // Mint
                            /(mageia|vectorlinux)[;\s]/i, // Mageia/VectorLinux
                            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i,
                            // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                            // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
                            /(hurd|linux)\s?([\w\.]+)*/i, // Hurd/Linux
                            /(gnu)\s?([\w\.]+)*/i // GNU
                        ],
                        [NAME, VERSION],
                        [

                            /(cros)\s[\w]+\s([\w\.]+\w)/i // Chromium OS
                        ],
                        [
                            [NAME, 'Chromium OS'], VERSION
                        ],
                        [

                            // Solaris
                            /(sunos)\s?([\w\.]+\d)*/i // Solaris
                        ],
                        [
                            [NAME, 'Solaris'], VERSION
                        ],
                        [

                            // BSD based
                            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
                        ],
                        [NAME, VERSION],
                        [

                            /(haiku)\s(\w+)/i // Haiku
                        ],
                        [NAME, VERSION],
                        [

                            /cfnetwork\/.+darwin/i,
                            /ip[honead]+(?:.*os\s([\w]+)\slike\smac|;\sopera)/i // iOS
                        ],
                        [
                            [VERSION, /_/g, '.'],
                            [NAME, 'iOS']
                        ],
                        [

                            /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
                            /(macintosh|mac(?=_powerpc)\s)/i // Mac OS
                        ],
                        [
                            [NAME, 'Mac OS'],
                            [VERSION, /_/g, '.']
                        ],
                        [

                            // Other
                            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i, // Solaris
                            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, // AIX
                            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
                            // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
                            /(unix)\s?([\w\.]+)*/i // UNIX
                        ],
                        [NAME, VERSION]
                    ]
                };

                var UAParser = function(uastring, extensions) {

                    if (typeof uastring === 'object') {
                        extensions = uastring;
                        uastring = undefined;
                    }

                    if (!(this instanceof UAParser)) {
                        return new UAParser(uastring, extensions).getResult();
                    }

                    var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
                    var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

                    this.getBrowser = function() {
                        var browser = { name: "", version: "" };
                        mapper.rgx.call(browser, ua, rgxmap.browser);
                        browser.major = util.major(browser.version); // deprecated
                        return browser;
                    };
                    this.getCPU = function() {
                        var cpu = { architecture: "" };
                        mapper.rgx.call(cpu, ua, rgxmap.cpu);
                        return cpu;
                    };
                    this.getDevice = function() {
                        var device = { vendor: "", model: "", type: "" };
                        mapper.rgx.call(device, ua, rgxmap.device);
                        return device;
                    };
                    this.getEngine = function() {
                        var engine = { name: "", version: "" };
                        mapper.rgx.call(engine, ua, rgxmap.engine);
                        return engine;
                    };
                    this.getOS = function() {
                        var os = { name: "", version: "" };
                        mapper.rgx.call(os, ua, rgxmap.os);
                        return os;
                    };
                    this.getResult = function() {
                        return {
                            ua: this.getUA(),
                            browser: this.getBrowser(),
                            engine: this.getEngine(),
                            os: this.getOS(),
                            device: this.getDevice(),
                            cpu: this.getCPU()
                        };
                    };
                    this.getUA = function() {
                        return ua;
                    };
                    this.setUA = function(uastring) {
                        ua = uastring;
                        return this;
                    };
                    return this;
                };
                return UAParser(N.userAgent);
            };

            var df = function() {};
            var getISOTime = function() { return (new Date).toISOString().replace(/-|:|\./g, "").substring(0, 15) };
            var getRandomNumber = function() { return Math.round(4251684561 * Math.random()) };
            var D = function(a, b) { return 0 == a.indexOf(b) };
            var en = function(a) {
                if (encodeURIComponent instanceof Function) {
                    return encodeURIComponent(a).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\//g, "%2F").replace('%%','%25%')
                } else {
                    return a
                }
            };
            var stripWwwFromDomain = function(domain) {
                var fp = domain.split('.')[0];
                if ((fp === 'www')||(fp ===  'cdn')) { return domain.substring(3); } else { return domain; }
            };
            var En = function(a, b) {
                if (b == "undefined" || b == "") {
                    return a
                } else {
                    b = en(b)
                    return a + b
                }
            }
            var ae = function(a) {
                function b(a) {
                    var b = (a.hostname || "").split(":")[0].toLowerCase(),
                        c = (a.protocol || "").toLowerCase();
                    c = 1 * a.port || ("http:" == c ? 80 : "https:" == c ? 443 : "");
                    a = a.pathname || "";
                    D(a, "/") || (a = "/" + a);
                    return [b, "" + c, a]
                }
                var c = M.createElement("a");
                c.href = M.location.href;
                var d = (c.protocol || "").toLowerCase(),
                    e = b(c),
                    g = c.search || "",
                    ca = d + "//" + e[0] + (e[1] ? ":" + e[1] : "");
                D(a, "//") ? a = d + a : D(a, "/") ? a = ca + a : !a || D(a, "?") ? a = ca + e[2] + (a || g) : 0 > a.split("/")[0].indexOf(":") && (a = ca + e[2].substring(0,
                    e[2].lastIndexOf("/")) + "/" + a);
                c.href = a;
                d = b(c);
                return { protocol: (c.protocol || "").toLowerCase(), host: d[0], port: d[1], path: d[2], query: c.search || "", url: a || "" }
            };
            var setDebug = function() {
                debug = true;
            };
            var loglog = function(message, color) {
                if (debug) {
                    color = color || "black";
                    switch (color.toLowerCase()) {
                        case "success":
                            color = "Green";
                            break;
                        case "info":
                            color = "DodgerBlue";
                            break;
                        case "error":
                            color = "Red";
                            break;
                        case "warning":
                            color = "Orange";
                            break;
                        case "debug":
                            color = "Orange";
                            break;
                        default:
                            color = color;
                    }
                    if (message === 'object') {
                        message = JSON.stringify(message);
                    }
                    console.trace("%c" + message, "color:" + color);
                }
            };
            var deviceInfo = {
               
                getScreen: function() { return screen ? ([screen.width, screen.height, screen.colorDepth].join("x")) : Un },
                getUserAgent: function() { return UAP().ua },
                getBrowserName: function() { return UAP().browser.name || Un },
                getBrowserVersion: function() { return UAP().browser.major },
                getPlatformName: function() { return UAP().os.name || Un },
                getPlatformVersion: function() { return UAP().os.version },
                getDeviceVendor: function() { return UAP().device.vendor },
                getDeviceModel: function() { return UAP().device.model },
                getDeviceType: function() { return UAP().device.type ||((/window|mac|chromium/i.test(UAP().os.name))?'PC':Un)},


                getTimezone: function() { return (new Date().getTimezoneOffset()) / -60 },
                getTouchEvent: function() {
                    var v = "0";
                    try {
                        if (M.createEvent("TouchEvent")) {
                            v = "1"
                            try {
                                if (N.maxTouchPoints != null) {
                                    v = N.maxTouchPoints.toString();
                                }
                            } catch (x) {}
                        }
                        return v
                    } catch (y) {
                        v = "0";
                        return v
                    }
                },
                getInfo: function() {
                    return [
                        En("sc=", this.getScreen()),
                        // En("ua=", this.getUserAgent()),
                        En("bn=", this.getBrowserName()),
                        En("bv=", this.getBrowserVersion()),
                        En("pn=", this.getPlatformName()),
                        En("pv=", this.getPlatformVersion()),
                        En("dv=", this.getDeviceVendor()),
                        En("dm=", this.getDeviceModel()),
                        En("dt=", this.getDeviceType()),
                        En("tz=", this.getTimezone()),
                        En("tu=", this.getTouchEvent()),
                    ]
                }
            };

            var pageInfo = {
                getEncoding: function() { return M.characterSet || M.charset || Un },
                getLanguage: function() { return N.language.toLowerCase() || Un },
                getTitle: function() { return M.title || Un },
                isInIframe: function() { return window != top ? 'Y' : 'N' },
                // getPreviousUrl: function() {
                //     var a = Un;
                //     try {
                //         a = top.M.referrer
                //     } catch (b) {
                //         try {
                //             a = M.referrer
                //         } catch (c) {}
                //     }
                //     return a
                // },
                // getUri: function() {
                //     var a = "";
                //     try {
                //         a = top.location.href;
                //     } catch (c) {
                //         a = M.location.href;
                //     }
                //     return ae(a);
                // },
                 getPreviousUrl: function() {
                    return M.referrer;
                },
                getUri: function() {                    
                    return ae(M.location.href);
                },
                getHostName: function() { return this.getUri().host },
                getPath: function() { return this.getUri().path },
                getUTM: function() {
                    var b = this.getUri().query.split(/[?&#]+/),
                        d = [] ;
                    for (var c = 0; c < b.length; ++c) {
                        var e ='';
                        if (D(b[c], "utm_id=") ||
                            D(b[c], "utm_campaign=") ||
                            D(b[c], "utm_source=") ||
                            D(b[c], "utm_medium=") ||
                            D(b[c], "utm_term=") ||
                            D(b[c], "utm_content=") ||
                            D(b[c], "gclid=") ||
                            D(b[c], "dclid=") ||
                            D(b[c], "gclsrc=")) {
                            e = b[c].split('='),
                            d.push(En(e[0]+'=',e[1]));
                        }
                    }
                    if (0 < d.length) {
                        return d.join("&");
                    } else {
                        return "";
                    }
                },
                getInfo: function() {
                    return [
                        En("de=", this.getEncoding()),
                        En("ul=", this.getLanguage()),
                        En("if=", this.isInIframe()),
                        En("tt=", this.getTitle()),
                        En("rf=", this.getPreviousUrl()),
                        En("uh=", this.getHostName()),
                        En("up=", this.getPath()),
                        this.getUTM(),
                    ]
                }
            };

            var st = deviceInfo.getInfo().concat(pageInfo.getInfo());

            var eventObjetc = {
                general: {
                    name: 'en',
                    action: 'ea',
                    label: 'el',
                    category: 'ec',
                    value: 'ev'
                },
                ecItem: {
                    id: "ti",
                    sku: "ic",
                    name: "in",
                    category: "iv",
                    price: "ip",
                    quantity: "iq"
                },
                ecommerce: {
                    id: "ti",
                    affiliation: "ta",
                    revenue: "tr",
                    tax: "tx",
                    shipping: "ts",
                    item: []
                }
            }
            // var getScrollPercentage = function() {
            //     var getDocumentHeight = Math.max(M.documentElement.clientHeight,
            //         M.documentElement.scrollHeight,
            //         M.documentElement.offsetHeight,
            //         M.body.scrollHeight,
            //         M.body.offsetHeight
            //     );
            //     var a = (window.pageYOffset || M.documentElement.scrollTop || M.body.scrollTop) / getDocumentHeight + Math.max(M.documentElement.clientHeight, window.innerHeight) / getDocumentHeight;
            //     b = Math.floor(a * 100)
            //     return b;
            // };
            /*
             * Send Tracker Core
             */
            var ta = function(a) {
                var b = M.createElement("img");
                b.width = 1;
                b.height = 1;
                b.src = a + "&z=" + getRandomNumber() + "&t=" + getISOTime();
                loglog('Send img tracker url : ' + b.src, 'success')
                return b
            };

            var wc = function(a, b, c) {
                var d = ta(a + "?" + b);
                var cb = (typeof c == 'function') ? c : df;
                d.onload = d.onerror = function() {
                    d.onload = null;
                    d.onerror = null;
                    cb()
                }
            };

            var cutQuery = function(a, b, c) {
                var re = /[?&#]/;
                b = b.split(re);
                for (e = 0; e < b.length; ++e) {
                    if (500 > b[e].length) {
                        b[e] = b[e].substring(0, 500);
                    }
                }
                return wc(a, b.join("&"), c);
                // return wc(a, b, c);
            };

            var ba = function(a, b, c, d) {
                if (void 0 === d) d = "https://cft.doublemax.net/dmp/analytics";
                a = a.concat(b).concat(st);
                // b = ["sid=" + b] + a + st;hh
                var ar = a.filter(function(n) { return n }).join('&');
                2036 >= b.length ? wc(d, ar, c) : cutQuery(d, ar, c);
            };
            var cftcookie = function(a, b, c) {
                var pr = '_cft';
                a = pr + a;
                if ("undefined" == typeof b) {
                    var e = ";?" + a + "=([^;]*);?",
                        f = new RegExp(e);
                    return f.test(M.cookie) ? RegExp.$1 : null
                }
                null === b && (b = "", c = c || {},
                    c.maxage = -1);
                var d = a + "=" + b;
                c && (c.path && (d += "; path=" + c.path), c.maxage && (d += "; max-age=" + c.maxage), c.domain && (d += "; domain=" + c.domain), c.secure && (d += "; secure")),
                    M.cookie = d
            };
            var creatUid = function() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

            }
            // var createDefaultcftCookie = function(costomerUid) {
            //     var cft_uid = (costomerUid ? costomerUid : cftcookie('_uid') ? cftcookie('_uid') : creatUid());
            //     cftcookie('_uid', cft_uid, {
            //         domain: stripWwwFromDomain(pageInfo.getHostName()),
            //         maxage: (90 * 86400),
            //         path: "/"
            //     })

            // };


            function setMethods(q) {

                loglog('In setMethods : ' + q + '\n Type : ' + typeof q + '\n Length : ' + q.length, 'info');
                var context, parameterArray, f;
                parameterArray = q;
                f = parameterArray.shift();
                context = asyncTrackers[0];
                if (context[f]) {
                    context[f].apply(context, parameterArray);
                } else {
                    loglog("Not Default Method : " + f, 'error');
                }
            }

            function applyMethods(q) {
                var appliedMethods = bbkkbbk.getAsyncTrackers()[0].getAppliedMethods || {};
                var i, j, parameterArray;
                loglog('In applyMethods : ' + q + '\n Type : ' + typeof q + '\n Length : ' + q.length, 'info');


                for (i = 0; i < applyFirst.length; i++) {
                    var methodName = applyFirst[i];
                    appliedMethods[methodName] = 1;
                    for (j = 0; j < q.length; j++) {
                        if (q[j] && q[j][0]) {
                            var listMethodName = q[j][0];
                            if (methodName === listMethodName) {
                                // loglog('ApplyMethods : ' + q[j], 'info');
                                setMethods(q[j]);
                                delete q[j];

                                if (appliedMethods[methodName] > 1) {
                                    loglog('The method ' + methodName + ' is registered', 'warning');
                                }
                            }
                            appliedMethods[methodName]++
                        }
                    }

                }
                bbkkbbk.getAsyncTrackers()[0].setAppliedMethods = appliedMethods;
                return q
            }
            var getScrollTop = function() {
                var getDocumentHeight = Math.max(M.documentElement.clientHeight,
                    M.documentElement.scrollHeight,
                    M.documentElement.offsetHeight,
                    M.body.scrollHeight,
                    M.body.offsetHeight
                );
                var a = (window.pageYOffset || M.documentElement.scrollTop || M.body.scrollTop) / getDocumentHeight + Math.max(M.documentElement.clientHeight, window.innerHeight) / getDocumentHeight

                return Math.round(a * 100)
            }

            /*
             * Tracker Class
             */

            function Tracker(siteId) {
                var sID = siteId || "",
                    trackerServer = 'https://cft.doublemax.net/dmp/analytics',
                    appliedMethods = {},
                    cft_uid = '',
                    _cf_P='',
                    enableCookie = false,
                    spageview = false;

                function setSiteId(siteID, callback) {
                    for (var i = 0; i < asyncTrackers.length; i++) {
                        if (asyncTrackers[i].getSiteId === siteId) {
                            loglog("site id is registered", 'error');
                            return false;
                        }
                    }

                    sID = siteID;
                    setUid();
                    setTPUid();
                    loglog('cft_uid='+cft_uid+'cf_p='+_cf_P,'error');
                    pageview(callback);

                }


                function pageview(c) {
                    if (sID == "") {
                        loglog('No have Site ID, init fail !', 'error');
                        return false;
                    };

                    if (spageview) {
                        loglog('This page has send pageview', 'error');
                        return false;
                    }
                    spageview = true;
                    var xz = [];
                    xz.push('cftuid=' + cft_uid);
                    xz.push('cf_p=' + _cf_P);
                    xz.push('sid=' + sID);

                    ba(['en=pageview'], xz, c, trackerServer);
                }


                function setUid(costomerUid) {
                    cft_uid = (costomerUid ? costomerUid : cftcookie('_uid') ? cftcookie('_uid') : cft_uid ? cft_uid : creatUid());
                }
                function setTPUid(TPUid) {
                    _cf_P = (TPUid ? TPUid : cftcookie('_P') ? cftcookie('_P') : '' );
 
                }
               

                function useCookie() {

                    if (navigator.cookieEnabled) {
                        // cftcookie('_test', 1, {
                        //     domain: stripWwwFromDomain(pageInfo.getHostName()),
                        //     maxage: 86400,
                        //     path: "/"
                        // });
                        cftcookie('_test', 1);
                        if (cftcookie('_test')) {
                            enableCookie = true;
                            loglog('can use cookie', 'info');
                            cftcookie('_test', null)

                        } else {
                            enableCookie = false;
                            loglog('can\'t use cookie', 'info');
                        }
                    }
                    if (cftcookie('_uid')) {
                        enableCookie = true;
                    }
                    return enableCookie;
                }

                function assemble(o, k, c) {
                    var r = new Array,
                        d = {},
                        p = { items: !0 },
                        // track_string = '',
                        xz = [],
                        i, j;
                    for (i in o) {
                        if (o[i] && o["hasOwnProperty"](i)) {
                            if (k["hasOwnProperty"](i)) {
                                // track_string += '&' + k[i] + '=' + en(o[i]);
                                // d["&" + k[i]] = o[i]
                                d[k[i]] = o[i];
                            } else if (!p["hasOwnProperty"](i)) {
                                // track_string += '&' + k[i] + '=' + en(o[i]);
                                d[i] = o[i]
                            }
                        }
                    }
                    for (j in d) {
                        r = r.concat([j + '=' + d[j]]);
                    }

                    var xz = [];
                    xz.push('cftuid=' + cft_uid);
                    xz.push('cf_p=' + _cf_P);
                    xz.push('sid=' + sID);

                    loglog('The track string is ' + r.join('&'), 'info');
                    ba(r, xz, c, trackerServer);

                }
                /*
                 * Constructor
                 */

                this.setAppliedMethods = function(appliedMethod) {
                    appliedMethods = appliedMethod;
                };
                this.getAppliedMethods = function() {
                    return appliedMethods;
                };
                this.getSiteId = function() {
                    return sID;
                };
                this.setSiteId = function(siteID) {
                    setSiteId(siteID);
                };
                this.getTPUid = function(){
                    return _cf_P;
                };
                this.setEnableCookie = function(costomerUid, callback) {
                    if (useCookie()) {
                        setUid(costomerUid);
                        cftcookie('_uid', cft_uid, {
                            domain: stripWwwFromDomain(pageInfo.getHostName()),
                            maxage: (90 * 86400),
                            path: "/"
                        });


                        var cb = (typeof callback == 'function') ? callback : df;
                        cb();
                        return true;
                    } else {
                        loglog('Cookie is not Enable', 'info');
                        return false;
                    }
                };
                this.setTPCookie = function(){
                    if (useCookie()) {
                        //use 3th party cookie
                        setTPUid();
                        if(cftcookie('_P')==null){
                        var a = M.createElement("iframe");
                        a.setAttribute("style", "display:none");
                        a.setAttribute("height", "0");
                        a.setAttribute("width", "0");
                        a.src = 'https://cdn.doublemax.net/js/getP.htm';


                        window.addEventListener('message',function cfGetP(d){
                            var i=d.origin,o=d.data;
                            'https://cdn.doublemax.net' === i && o.constructor === Object && '/js/getP.htm' === o.pathname && (window.removeEventListener('message',cfGetP),
                                setTPUid(o.cf_P),
                                cftcookie('_P', o.cf_P, {
                                    domain: stripWwwFromDomain(pageInfo.getHostName()),
                                    maxage: (90 * 86400),
                                    path: "/"
                                    }))
                                }
                            );
                        M.getElementsByTagName('script')[0].appendChild(a);
                        }
                        
                     } else {
                        loglog('Cookie is not Enable', 'info');
                        return false;
                    }
                }; 
                this.getEnabeCoookie = function() {
                    return enableCookie
                };
                this.setEnabeCoookie = this.setEnableCookie;
                this.setServer = function(serverUrl) {
                    trackerServer = serverUrl
                };
                this.getServer = function() {
                    return trackerServer;
                };
                this.setDebug = function() {
                    setDebug();
                };
                this.setViewPercentage = function(viewPercentage = [30, 60, 90], callback) {
                    var flag = [];
                    var current = 0;

                    var viewScroll = function() {
                        if (getScrollTop() > current) {
                            current = getScrollTop();
                            for (var i = 0; i < viewPercentage.length; i++) {
                                if (current > viewPercentage[i] && flag.indexOf(viewPercentage[i]) == -1) {
                                    flag.push(viewPercentage[i])
                                    assemble({
                                        name:'viewPercentage',
                                        action: 'view',
                                        value: flag[flag.length - 1]
                                    }, eventObjetc['general'], callback);

                                }
                            }
                            loglog("current " + current, 'debug');
                        }
                    }

                    W.onscroll = viewScroll;
                };
                this.pageview = function(c) {
                    pageview(c)
                }
                this.send = function(event, o, callback) {
                    if (sID == "") {
                        loglog('No have Site ID, init fail !', 'error');
                        return false;
                    };
                    if (void 0 === event || event == '') { return false };
                    var N = event.toLowerCase();
                    if (N == 'pageview') { return false } //先暫時不給開放用pageview
                    var z = "general";
                    var o = o || {};
                    o['name'] = N;
                    if ('action' in o && (o['action'] != '')) {
                        loglog('ready to send : ' + JSON.stringify(o), 'debug');
                        assemble(o, eventObjetc[z], callback);
                    }



                };
                this.addTracker = function(siteId) {
                    if (!siteId) {
                        loglog("site id is Undefind", 'error')
                        return false;
                    }

                    for (var i = 0; i < asyncTrackers.length; i++) {
                        if (asyncTrackers[i].getSiteId === siteId) {
                            loglog("site id is registered", 'error');
                            return false;
                        }
                    }

                    var tracker = new Tracker(siteId);
                    asyncTrackers.push(tracker);

                    return tracker;

                };
            }

            function TrackerProxy() {
                return function() {
                    var arg = [];
                    loglog('Your arguments : ' + [].slice.call(arguments), 'debug');
                    arg = applyMethods([].slice.call(arguments));
                    if (arg) {
                        setMethods(arg);
                    }


                };
            }

            function creatTracker(siteId) {
                var tracker = new Tracker(siteId);
                var q = [];
                if (typeof cft !== 'undefined' && typeof cft.q !== 'undefined') { q = cft.q };
                asyncTrackers.push(tracker);
                pentList = applyMethods(q);
                window.cft = new TrackerProxy();
                for (var i = 0; i < pentList.length; i++) {
                    if (pentList[i]) {
                        setMethods(pentList[i]);
                    }
                }

                return tracker
            }

            /*
             * Hacker Controller
             */

            bbkkbbk = {
                initialized: false,
                getAsyncTrackers: function() {
                    return asyncTrackers;
                },
                // getAsyncTracker: function(siteId) {
                //     if (asyncTrackers && asyncTrackers.length && asyncTrackers[0]) {
                //         firstTracker = asyncTrackers[0];
                //     } else {
                //         return creatTracker(siteId);
                //     }
                //     if (!siteId) {
                //         return firstTracker;
                //     }

                // },
                getTracker: function(siteId) {
                    loglog('creatTrackekr', 'success');
                    return creatTracker;
                },
                addTracker: function(siteId) {
                    var tracker;
                    if (!asyncTrackers.length) {
                        tracker = creatTracker(siteId);
                    } else {
                        tracker = asyncTrackers[0].addTracker(siteId);
                    }
                    return tracker;
                },
                getTrackerSt: function() {
                    return st.join('&');
                },
                getUAParser:function(){
                    return UAP();
                }
            }
            return bbkkbbk;
        })();
    }
    bbkkbbk.addTracker();
    bbkkbbk.initialized = true;
})();
// for test
    cft('setEnabeCoookie');
    cft('setTPCookie');