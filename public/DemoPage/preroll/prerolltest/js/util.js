function Util()
{
	// Determine if IE is the browser
	this.isie = (window.navigator.userAgent.indexOf("MSIE")>0);
	this.issafari = (window.navigator.userAgent.indexOf("Safari")>0);
	this.ismac = (window.navigator.userAgent.indexOf("Mac")>0);

	this.setFocusToCtrl = function(strCtrl)
	{
		try
		{ 
			document.getElementById(strCtrl).focus(); 
			document.getElementById(strCtrl).select(); 
		}
		catch (e) {}
	};

	this.selectSingleNodeText = function(currnode,xpath,bRelative)
	{
		if(!currnode)
			return null;

		if (typeof(currnode)=="string")
		   return currnode;
		
		var xml_support = false;
		try
		{
			if(currnode.selectSingleNode) {xml_support = true; }
		} catch(e) {}
				
		if(this.isie && xml_support)
		{
			var node = currnode.selectSingleNode(xpath);
			if(node!=null)
				return node.text;
			else
				return null;
		}
		else if(this.issafari || this.isie || ((currnode.ownerDocument==null && currnode.evaluate==null) || (currnode.ownerDocument!=null && currnode.ownerDocument.evaluate==null)))
		{
			var tags = xpath.split("/");
			if(tags[0].length==0 && tags[1]!=currnode.tagName)
				return null;
			var s = (tags[0].length==0)?2:1;
			
			if (bRelative==true)  // Workaround for Safari
				s=0;
				
			return recurseSingleNodeFind(currnode, tags, s, true);
		}
		else   // isnetscape
		{
			var node = null;
			if(currnode.ownerDocument==null)
				node=currnode.evaluate(xpath,currnode,null,0,null).iterateNext();
			else
				node=currnode.ownerDocument.evaluate(xpath,currnode,null,0,null).iterateNext();
	
			if(node!=null)
			{
				if(node.firstChild!=null)
					return node.firstChild.nodeValue;
				else
					return "";
			}
			else
				return null;
		}
	};
	this.selectSingleChildNodeText = function(currnode,xpath)  // used when currentnode is not the root. xpath starts with the childnode of currnode
	{
		if(!currnode || xpath == null || 0==xpath.indexOf("/"))
			return null;

		if (typeof(currnode)=="string")
		   return currnode;
				
		var xml_support = false;
		try
		{
			if(currnode.selectSingleNode) {xml_support = true; }
		} catch(e) {}
		
		if(this.isie && xml_support)
		{
			var node = currnode.selectSingleNode(xpath);
			if(node!=null)
				return node.text;
			else
				return null;
		}
		else if(this.issafari || this.isie || ((currnode.ownerDocument==null && currnode.evaluate==null) || (currnode.ownerDocument!=null && currnode.ownerDocument.evaluate==null)))
		{
			var tags = xpath.split("/");
			var s = 0;
			return recurseSingleNodeFind(currnode, tags, s, true);
		}
		else   // isnetscape
		{
			var node = null;
			if(currnode.ownerDocument==null)
				node=currnode.evaluate(xpath,currnode,null,0,null).iterateNext();
			else
				node=currnode.ownerDocument.evaluate(xpath,currnode,null,0,null).iterateNext();
	
			if(node!=null)
			{
				if(node.firstChild!=null)
					return node.firstChild.nodeValue;
				else
					return "";
			}
			else
				return null;
		}
	};
	this.selectNodes=function(currnode,xpath,bNoArray)
	{
		if(!currnode)
			return null;
		
		var xml_support = false;
		try
		{
			if(currnode.selectNodes) {xml_support = true; }
		} catch(e) {}
	
		if(this.isie && xml_support)
		{
			try
			{	
				return currnode.selectNodes(xpath);
			}
			catch (e)
			{
				return new Array();
			}
		}
		else if(this.issafari || this.isie || ((currnode.ownerDocument==null && currnode.evaluate==null) || (currnode.ownerDocument!=null && currnode.ownerDocument.evaluate==null)))
		{
			var tags = xpath.split("/");
			if(tags[0].length==0 && tags[1]!=currnode.tagName)
				return null;
			var s = (tags[0].length==0)?2:1;

			var xPathResult = null;
			var singleNode = recurseSingleNodeFind(currnode, tags, s, false);
			if(singleNode != null && singleNode.parentNode != null)
			{
				xPathResult = singleNode.parentNode;
			}

			if (bNoArray==true)
			   return xPathResult;
			var aNodeArray = new Array();
			if (xPathResult)
			{
				for (var i=0; i<xPathResult.childNodes.length; i++)
				{	if (xPathResult.childNodes[i].nodeType==1 && xPathResult.childNodes[i].tagName==tags[tags.length-1])
						aNodeArray[aNodeArray.length] = xPathResult.childNodes[i];
				}
			} 
			return aNodeArray;
		}
		else
		{
			var xPathResult = null;
			if(currnode.ownerDocument==null)
				xPathResult=currnode.evaluate(xpath, currnode, null, 0, null);
			else
				xPathResult=currnode.ownerDocument.evaluate(xpath, currnode, null, 0, null);
			
			if (bNoArray==true)
			   return xPathResult;
			
			var aNodeArray = new Array();
			if (xPathResult)
			{
				var oNode = null;
				while((oNode=xPathResult.iterateNext()))
				{
					aNodeArray[aNodeArray.length] = oNode;
				}
			} 
			return aNodeArray;
		}
	};
	// Trims whitespace from beginning and end of string
	this.trim = function(s)
	{
	    if (s==null)
		   return "";
    
	    return s.replace(/(^\s+)|(\s+$)/g, "");
	};
}
function recurseSingleNodeFind(node, tags, x, getText)
{
	for(var i=0;i<node.childNodes.length;i++)
	{
		if(node.childNodes[i].nodeType==1)
		{
			if(node.childNodes[i].tagName==tags[x])
			{
				if(x==tags.length-1)
				{
					if(getText)
					{
						if(node.childNodes[i].firstChild!=null)
						{
							return node.childNodes[i].firstChild.nodeValue;
						}
						else
						{
							return "";
						}
					}
					else
						return node.childNodes[i];
				}
				else
					return recurseSingleNodeFind(node.childNodes[i], tags, x+1, getText);
			}
		}
	}
}
function getLocalizedString(key)
{
	var obj = document.getElementById("msg_"+key);
	if(obj!=null)
		return obj.innerHTML.replace(/\\n/g,"\n");
	alert("Error - Localization key '"+key+"' not found.");
}
function invokeSyncCall(pfx, url, data, callback)
{
	if(pfx==null)
		pfx = "";
	var requester=null;
	if(window.XMLHttpRequest)
		requester = new XMLHttpRequest();
	else
		requester = new ActiveXObject("Microsoft.XMLHTTP");
				
	requester.open("POST", pfx+url, false);
	requester.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	if(_util.isie){try{requester.responseType="msxml-document";}catch(e){}}
	requester.send(data);
			
	var iStatus=requester.status;
	if (iStatus>=200 && iStatus<300)
	{
		// Success
		if(requester.getResponseHeader("Content-Type").indexOf("text/xml")==0 || requester.getResponseHeader("Content-Type").indexOf("application/xml")==0)
		{
			callback(requester.responseXML.documentElement);
		}
		else
			callback(requester.responseText);
	}
}
function invokeSyncCallbackChangeLocale(xml)
{
	var result = "";	
	try
	{
		result = _util.selectSingleNodeText(xml, "/result/data/refresh");
		if (result!=null && result.length>0)
		{
			location.reload();
		}
	}
	catch (e)
	{
	}
}
function invokeSyncCallbackUnlinkDevice(xml)
{
	var result = "";	
	try
	{
		result = _util.selectSingleNodeText(xml, "/result/code");
		if (result==null)
		{
			alert(getLocalizedString("invalid_returned_xml_value")+" "+xml.xml);
		 	return;
		}
		switch(result)
		{
		case "updatesuccess":
		case "noaccess":
			location.reload();
			break;
		default:
			alert(getLocalizedString("invalid_return_code")+" "+result);
		}
	}
	catch (e)
	{
		alert(getLocalizedString("invalid_returned_xml_value")+" '"+xml+"': "+e.message);
	}
}
function invokeSyncCallbackChangeCurrency(xml)
{
	var result = "";	
	try
	{
		result = _util.selectSingleNodeText(xml, "/result/data/currencyType");
		if(result!=null && result.length>0)
		{
			location.reload();
		}
	}
	catch (e)
	{
	}
}

var _util = new Util();