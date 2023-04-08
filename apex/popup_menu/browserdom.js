if (typeof(saw) == 'undefined')
{

var agt=navigator.userAgent.toLowerCase();

var is_major = parseInt(navigator.appVersion);
var is_minor = parseFloat(navigator.appVersion);

var is_nav  = ((agt.indexOf('mozilla')!=-1) && (agt.indexOf('spoofer')==-1)
            && (agt.indexOf('compatible') == -1) && (agt.indexOf('opera')==-1)
            && (agt.indexOf('webtv')==-1));
var is_nav2 = (is_nav && (is_major == 2));
var is_nav3 = (is_nav && (is_major == 3));
var is_nav4 = (is_nav && (is_major == 4));
var is_nav4up = (is_nav && (is_major >= 4));
var is_navonly      = (is_nav && ((agt.indexOf(";nav") != -1) ||
                     (agt.indexOf("; nav") != -1)) );
var is_nav5 = (is_nav && (is_major == 5));
var is_nav5up = (is_nav && (is_major >= 5));

// SAL - Added
var is_nav6 = is_nav5;
var is_nav6up = is_nav5up;

var is_ieindex = agt.indexOf('msie');

var is_ie   = is_ieindex != -1;
var is_ie3  = (is_ie && (is_major < 4));
// SAL - modified, check for MSIE 5 rather than MSIE 5.0

var is_iemajor = null;

if(is_ie)
{
if(is_major < 4)
	is_iemajor = is_major;
else
{

	is_iemajor = parseFloat(agt.substr(is_ieindex+5));

}
}

var is_ie4  = is_ie && (is_iemajor >= 4 && is_iemajor < 5);
var is_ie4up  = is_ie  && (is_iemajor >= 4);
var is_ie5  = is_ie && (is_iemajor >= 5 && is_iemajor < 5.5);
var is_ie5up  = is_ie && (is_iemajor >= 5);
var is_ie55 = is_ie && (is_iemajor >= 5.5 && is_iemajor < 6);
var is_ie55up = is_ie  && (is_iemajor >= 5.5);
var is_ie6 = is_ie && (is_iemajor >= 6 && is_iemajor < 7);
var is_ie6up = is_ie && (is_iemajor >= 6);
var is_ie7 = is_ie && (is_iemajor >= 7 && is_iemajor < 8);
var is_ie7up = is_ie && (is_iemajor >= 7);

// KNOWN BUG: On AOL4, returns false if IE3 is embedded browser
// or if this is the first browser window opened.  Thus the
// variables is_aol, is_aol3, and is_aol4 aren't 100% reliable.
var is_aol   = (agt.indexOf("aol") != -1);
var is_aol3  = (is_aol && is_ie3);
var is_aol4  = (is_aol && is_ie4);

var is_opera = (agt.indexOf("opera") != -1);
var is_webtv = (agt.indexOf("webtv") != -1);

// *** JAVASCRIPT VERSION CHECK ***
var is_js;
if (is_nav2 || is_ie3) is_js = 1.0 ;
else if (is_nav3 || is_opera) is_js = 1.1 ;
else if ((is_nav4 && (is_minor <= 4.05)) || is_ie4) is_js = 1.2 ;
else if ((is_nav4 && (is_minor > 4.05)) || is_ie5 || is_ie55) is_js = 1.3 ;
else if (is_nav5) is_js = 1.5 ; // nav 5 is JS 1.5
// NOTE: In the future, update this code when newer versions of JS
// are released. For now, we try to provide some upward compatibility
// so that future versions of Nav and IE will show they are at
// *least* JS 1.x capable. Always check for JS version compatibility
// with > or >=.
else if (is_nav && (is_major > 5)) is_js = 1.5 ;
else if (is_ie && (is_major > 5)) is_js = 1.3 ;
// HACK: no idea for other browsers; always check for JS version with > or >=
else is_js = 0.0;

// *** PLATFORM ***
var is_win   = ( (agt.indexOf("win")!=-1) || (agt.indexOf("16bit")!=-1) );
// NOTE: On Opera 3.0, the userAgent string includes "Windows 95/NT4" on all
//        Win32, so you can't distinguish between Win95 and WinNT.
var is_win95 = ((agt.indexOf("win95")!=-1) || (agt.indexOf("windows 95")!=-1));

// is this a 16 bit compiled version?
var is_win16 = ((agt.indexOf("win16")!=-1) ||
         (agt.indexOf("16bit")!=-1) || (agt.indexOf("windows 3.1")!=-1) ||
         (agt.indexOf("windows 16-bit")!=-1) );

var is_win31 = ((agt.indexOf("windows 3.1")!=-1) || (agt.indexOf("win16")!=-1) ||
               (agt.indexOf("windows 16-bit")!=-1));

// NOTE: Reliable detection of Win98 may not be possible. It appears that:
//       - On Nav 4.x and before you'll get plain "Windows" in userAgent.
//       - On Mercury client, the 32-bit version will return "Win98", but
//         the 16-bit version running on Win98 will still return "Win95".
var is_win98 = ((agt.indexOf("win98")!=-1) || (agt.indexOf("windows 98")!=-1));
var is_winnt = ((agt.indexOf("winnt")!=-1) || (agt.indexOf("windows nt")!=-1));
var is_win32 = (is_win95 || is_winnt || is_win98 ||
               ((is_major >= 4) && (navigator.platform == "Win32")) ||
               (agt.indexOf("win32")!=-1) || (agt.indexOf("32bit")!=-1));

var is_linux = agt.indexOf("linux")!=-1;
var is_mac = agt.indexOf("macintosh")!=-1;
var is_solaris = agt.indexOf("sunos")!=-1;

/////////////////////////////////////////////////////////////////////////////
// Browser Compatibility Code; Extend DOM directly, when possible, i.e.
// try to avoid putting wrappers, if we can extend DOM to look like standard
// W3C DOM.
//

/////////////////////////////////////////////////////////////////////////////
// saw namespace for JScript wrappers
//

//If two SAW Websphere portlets are included on one Portal page, scripts will be
//included two times. So "saw" definition could be duplicated.
if(typeof(saw) == 'undefined')
{
   saw = function() { }
}

// used as impl namespace
impl = function () { }

getFrameHeight = function(tFrame)
{
   if (is_ie)
      return tFrame.frameElement.height;
   else
      return tFrame.innerHeight;
}

getFrameWidth = function(tFrame)
{
   if (is_ie)
      return tFrame.frameElement.width;
   else
      return tFrame.innerWidth;
}

getClientHeight = function()
{
	return (
	 self.innerHeight
	 || document.documentElement.clientHeight
	 || document.body.clientHeight
	);
}

//client width excluding scrollable area
getClientWidth = function()
{
	return (
		document.documentElement.clientWidth
		|| document.body.clientWidth
	);
}

// page width including scrollable area
getPageWidth = function()
{
   if (document.documentElement && document.body.scrollWidth)
      return Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
   else
      return getClientWidth();
}

getPageHeight = function()
{
   if (document.documentElement && document.body.scrollWidth)
      return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
   else
      return getClientHeight();
}

//whether or not the window has the horizontal scroll bar
hasHScrollBar = function()
{
   return getPageWidth() > getClientWidth();
}

/////////////////////////////////////////////
//EVENTS
////////////////////////////////////////////

getEvent = function(evt)
{
	if (!evt && is_ie)
		return window.event;
	else
		return evt;
}

getEventTarget = function(evt)
{
	if (is_ie)
		return evt.srcElement;
	else
		return evt.target;
}

getEventCurrentTarget = function(evt)
{
	if (is_ie)
		return evt.srcElement;
	else
		return evt.currentTarget;
}

impl.mozGetEventSrcElement = function(evt)
{
   var node = evt.target;
   while (node != null && node.nodeType != 1) node = node.parentNode;
   return node;
}

// srcElement is different from target because target can be any Node.
// srcElement should be an element.
getEventSrcElement = function(evt)
{
	if (is_ie)
		return evt.srcElement;
	else
		return impl.mozGetEventSrcElement(evt);
}

/*
 * Returns the event's pageX
 * @param {Event} ev the event
 * @return {int} the event's pageX
 */
getEventPageX = function(evt) 
{
    var x = evt.pageX;
    if (!x && 0 !== x) {
        x = evt.clientX || 0;

        if ( is_ie ) {
            x += getDocumentScrollLeft();
        }
    }

    return x;
}

/**
 * Returns the event's pageY
 * @param {Event} ev the event
 * @return {int} the event's pageY
 */
getEventPageY = function(evt) 
{
    var y = evt.pageY;
    if (!y && 0 !== y) {
        y = evt.clientY || 0;

        if ( is_ie ) {
            y += getDocumentScrollTop();
        }
    }

    return y;
}

getEventButton = function(evt)
{
   return evt.button || evt.which;
}


function hasEncodeURIComponent()
{
   if(is_ie55up || is_nav)
   {
      // not all ie5.5's have it.  so we test.  we must do try catch in an eval because some browsers
      // don't like them

      var b = false;

      eval('try { var t = encodeURIComponent; b = t != null; } catch (e) { }');

      return b;
   }

   return false;
}

function substituteEncodeURIComponent(sorig)
{
	// IE 5.0 doesn't have encodeURIComponent

	var s = sorig;

	var nPos = s.search(/[+ ]/);

	var sRet = "";

	while(nPos >= 0)
	{

		if(s.charAt(nPos) == '+')
		{
			sRet += escape(s.substr(0,nPos)) + '%2B';
		} else
			sRet += escape(s.substr(0,nPos)) + '%20';

		s = s.substr(nPos+1);

		nPos = s.search(/[+ ]/);
	}

	return sRet + escape(s);
}

encodeURIComponent = hasEncodeURIComponent() ? encodeURIComponent : substituteEncodeURIComponent;

decodeURIComponent = hasEncodeURIComponent() ? decodeURIComponent : unescape;   //unescape here can't handle unicode, but is should be ok since substituteEncodeURIComponent doesn't handle unicode either

isRToL = function()
{
  if(is_nav)
  {
     var elements = document.getElementsByTagName("html");
     if(elements)
        return "rtl" == elements[0].dir.toLowerCase();
     else
        return false;
  }
  else
     return "rtl" == document.dir.toLowerCase();
}

//getCurrentStyle = function(tNode)
//{
//	if (is_ie)
//		return tNode.currentStyle;
//	else
//		return document.defaultView.getComputedStyle(tNode, '');
//};

//getComputedStyle = getCurrentStyle;

getElementScrollLeft = function(tElement)
{
	if (is_ie)
		return tElement.scrollLeft;//document.body.scrollLeft;
	else if (is_nav)
		return tElement.scrollLeft;//window.pageXOffset;
	else
		return 0;
}
getElementScrollTop = function(tElement)
{
	if (is_ie)
		return tElement.scrollTop;//document.body.scrollTop;
	else if (is_nav)
		return tElement.scrollTop;//window.pageYOffset;
	else
		return 0;
};

getDocumentScrollLeft = function()
{
	return getDocumentScroll()[1];
};

getDocumentScrollTop = function()
{
	return getDocumentScroll()[0];
};


getDocumentScroll = function()
{
	var dd = document.documentElement; 
	var db = document.body;
	
	//if (dd && dd.scrollTop)//HAW: this cause an error when dd.scrollTop is 0 and dd.scrollLeft is not 0 (db.scrollTop is 0)
	if (dd && (dd.scrollTop || dd.scrollLeft)) {
		return [dd.scrollTop, dd.scrollLeft];
	} else if (db) {
		return [db.scrollTop, db.scrollLeft];
	} else {
		return [0, 0];
	}
}

getElementXY = function(el) {

   // has to be part of document to have pageXY
   if (el.parentNode == null || el.style.display == 'none') {
      return false;
   }

   /**
    * Position of the html element (x, y)
    * @private
    * @type Array
    */
   var parent = null;
   var pos = [];
   var box;

   if (el.getBoundingClientRect) { // IE
      box = el.getBoundingClientRect();
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

      return [box.left + scrollLeft, box.top + scrollTop];
   }
   else if (document.getBoxObjectFor) { // mozilla
         box = document.getBoxObjectFor(el);
         pos = [box.x, box.y];
      }

   if (el.parentNode) { parent = el.parentNode; }
   else { parent = null; }

   while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
      pos[0] -= parent.scrollLeft;
      pos[1] -= parent.scrollTop;

      if (parent.parentNode) { parent = parent.parentNode; }
      else { parent = null; }
   }

   return pos;
};

// Set the position of an html element in page coordinates, regardless of how the element is positioned.
// The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
setElementXY = function(el, x, y)
{
   // has to be part of document to have pageXY
   var pageXY = getElementXY(el);
   if (!pageXY) 
      return false;

   //el.style doesn't work here
   var style = getComputedStyle(el);

   // default to relative
   if (style.position == 'static' || !style.position)
      el.style.position = 'relative';

   var deltaY = parseInt(style.top, 10);
   if (isNaN(deltaY))
      deltaY = 0;

   if (y !== null) 
      el.style.top = y - pageXY[1] + deltaY + 'px';

   if (!isRToL())
   {
      var deltaX = parseInt(style.left, 10);
      if ( isNaN(deltaX) ) 
         deltaX = 0;
           
      if (x !== null)
         el.style.left = x - pageXY[0] + deltaX + 'px';
   }
   else
   {
      var deltaX = parseInt(style.right, 10);
      if ( isNaN(deltaX) ) 
         deltaX = 0;
           
      if (x !== null)
         el.style.right = pageXY[0] - x + deltaX + 'px';
   }
   
   return true;      
}

///////////////////////////////////////////////
//event handling
//////////////////////////////////////////////

// Event namespace
Event = function() {}
Event.OBJ = 0;
Event.TYPE = 1;
Event.FN = 2;
Event.SC = 3;
Event.WFN = 3;
Event.OV = 4;

// wrapped listeners that have been added
Event.listeners = [];

// listeners that will be added once page has loaded
Event.delayedListeners = [];

//obj - (element or string id) element that gets event
//sEvent - event type
//func - function to call
//scope - obj that is passed to func
//bOverride - context of function will be scope obj, default is obj
addEventListener = function(obj, sEvent, func, tScope, bOverride)
{
   if (typeof obj == "string")
   {
	  /* lesha
      if (document.body) {
         el = this.getEl(obj);
      } else {
      lesha */
         // defer adding the event until onload fires
         Event.delayedListeners[Event.delayedListeners.length] =
             [obj, sEvent, func, tScope, bOverride];

         return true;
      // lesha}
   }

    // check to see if already there
    //TODO: is there a less expensive way to do this???
    for (i=0; i< Event.listeners.length; ++i) 
   {
      var li = Event.listeners[i];
      if ( li && li[Event.FN] == func  &&
            li[Event.OBJ] == obj  && 
            li[Event.TYPE] == sEvent ) 
      {
        return;
      }      
   }

   // if the user chooses to override the scope, we use the custom
   // object passed in, otherwise the executing scope will be the
   // HTML element that the event is registered on
   
   var scope = (bOverride) ? tScope : obj;

   // wrap the function so we can return the oScope object when
   // the event fires;
   var wrappedFn = function(e) {
         return func.call(scope, e, tScope);
     };


   if (obj.addEventListener) {
         // this.logger.debug("adding DOM event: " + el.id + 
         // ", " + sType);
         obj.addEventListener(sEvent, wrappedFn, false);
      // Internet Explorer abstraction
   } else if (obj.attachEvent) {
      obj.attachEvent("on" + sEvent, wrappedFn);
   }
   
   Event.listeners.push([obj, sEvent, func, wrappedFn, tScope]);
}


removeEventListener = function(obj, sEvent, func)
{
   var x = -1;
   for (i=0; i< Event.listeners.length; ++i) 
   {
      var li = Event.listeners[i];
      if ( li && li[Event.FN] == func  &&
            li[Event.OBJ] == obj  && 
            li[Event.TYPE] == sEvent ) 
      {
         x = i;
         break;
      }      
   }

   if (x == -1)
      return;

   var fWrapped = Event.listeners[x][Event.WFN];
	if (is_ie)
		obj.detachEvent('on'+sEvent,fWrapped);
	else
		obj.removeEventListener(sEvent,fWrapped,false);
		
	delete Event.listeners[x][Event.WFN];
   delete Event.listeners[x][Event.FN];
   delete Event.listeners[x];	
};

// lesha attachEvent = addEventListener;
// lesha detachEvent = removeEventListener;

getContentDocument = function(tFrame)
{
   if (tFrame.contentDocument)
      return tFrame.contentDocument;
   else if (is_ie)
      return tFrame.contentWindow.document;
}

stopEvent = function(evt)
{
   stopEventPropagation(evt);

   preventEventDefault(evt);
}

stopEventPropagation = function(evt)
{
   if (is_ie) evt.cancelBubble = true;
   if (is_nav) evt.stopPropagation();
}

preventEventDefault = function(evt)
{
   if (evt.preventDefault)
     evt.preventDefault();
   else
     evt.returnValue = false;
}

_tryPreloadAttach = function() {
    // this.logger.debug("tryPreloadAttach");

    // keep trying until after the page is loaded.  We need to 
    // check the page load state prior to trying to bind the 
    // elements so that we can be certain all elements have been 
    // tested appropriately
    var tryAgain = !document.body;

    for (var i=0; i < Event.delayedListeners.length; ++i) {
        var d = Event.delayedListeners[i];
        // There may be a race condition here, so we need to 
        // verify the array element is usable.
        if (d) {
            var obj = d[Event.EL];
            if (typeof obj == "string")
               obj = document.getElementById(obj);    

            if (obj) {
                // this.logger.debug("attaching: " + d[this.EL]);
                addEventListener(obj, d[Event.TYPE], d[Event.FN], d[Event.SC], d[Event.OV]);
                delete Event.delayedListeners[i];
            }
        }
    }

    if (tryAgain) {
        setTimeout("_tryPreloadAttach()", 50);
    }
}

_tryPreloadAttach();



// Returns true if we have a valid object here (not undefined and not null)
checkObjectReference = function(obj)
{
   return (obj != undefined && obj != null);
}

///////////////////////////////////////////////////////////////////////////////
// Set src to empty file.
// Or cancel a preview request, iframe load
getEmptyHtm = function()
{
    if (typeof(sawEmptyHtm) != 'undefined' && checkObjectReference(sawEmptyHtm) && sawEmptyHtm != '')
        return sawEmptyHtm;
    else
        return commandToURL ? (commandToURL('RetrieveFile') + '&File=empty.htm') : 'empty.htm';
}


///////////////////////////////////////////////////////////////////////////////
//iframe methods

createHiddenIFrame = function(sId, sName, targetDocument, sSrc)
{
   var tDoc = document;
   if (targetDocument)
      tDoc = targetDocument;

   var iframe = tDoc.getElementById(sId);

   if (iframe)
   {
      if (sSrc)
         iframe.src = sSrc;
      return iframe;
   }

   //empty.htm is included in CHTMLHead
   if (sSrc == undefined || sSrc == null || sSrc == '')
      sSrc = getEmptyHtm();

	if (is_ie)
	{
	   var sHtml = "<iframe src='" + sSrc + "' style='display:none' id='" + sId;
	   if ((typeof(sName) != 'undefined') && (sName != null) && (sName.length > 0))
	      sHtml += "' name='" + sName;
	   sHtml += "'></iframe>";

		iframe = tDoc.createElement(sHtml);

		tDoc.body.appendChild(iframe);
	}
	else if (is_nav)
	{
	   var iframe = tDoc.createElement('IFRAME');
	   iframe.style.visibility = 'hidden';
	   iframe.style.width = '0px';
	   iframe.style.height = '0px';
	   iframe.style.position = 'absolute';
	   iframe.id = sId;
	   iframe.src = sSrc;

	   if ((typeof(sName) != 'undefined') && (sName != null) && (sName.length > 0))
	      iframe.name = sName;

	   tDoc.body.appendChild(iframe);
	}

	return iframe;
};


//note: removing iframe removes it's entries in history
removeIFrame = function (sId, sName)
{
   // this is causing mozilla to always be loading...investigating...
   if (is_ie)
   {
      if (!sName)
         sName = sId;

	   var tIFrameObject = document.getElementById(sId);
	   if (tIFrameObject)
	   {
   	   tIFrameObject.parentNode.removeChild(tIFrameObject);
   	   if (is_nav)
      	   delete window.frames[sName];
      }
   }
}


///////////////////////////////////////////////////////////////////////////////
insertTableRow = function(tTable, nPos)
{
   if (!nPos)
      nPos = tTable.rows.length;
   return tTable.insertRow(nPos);
};

insertTableRowCell = function(tRow, nPos)
{
   if (!nPos)
      nPos = tRow.cells.length;
   return tRow.insertCell(nPos);
};


/////////////////////////////////////////////
//Exception
getExceptionMessage = function(e)
{
   if (is_ie)
      return e.description;
   else
      return e;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//xml functions

//we really should not be using "all"
/*if (!document.all) {
   Node.prototype.__defineGetter__("all", function() {
      if (document.getElementsByTagName("*").length) {
         switch (this.nodeType) {
            case 9:
               return document.getElementsByTagName("*")
               break;
            case 1:
               return this.getElementsByTagName("*")
               break;
         }
      }
      return ""
   });
   Node.prototype.__defineSetter__("all", function() {})
}*/

createXMLDocument = function(tDoc)
{
	if (is_nav)
		tIsland = tDoc.implementation.createDocument("", "", null);
	else
   		tIsland = tDoc.createElement('XML');
	return tIsland;
}

s_tXMLIsland = new Array();

// if sID is not sent to this function, we return the common island that is used for element creation
// if you are calling this function with intent to load a xml string into it, you must pass sID.
// tIslandFrame is the frame/window in which your xml document is to reside
// tStringFrame is the frame/window in which your string xml resides
getXmlIsland = function(sID, tIslandFrame, tStringFrame)
{
   if (!sID)
      sID = "idCreationIsland";

   if (!tIslandFrame)
      tIslandFrame = window;
   if (!tStringFrame)
      tStringFrame = window;

   var tActualIslandFrame;
   var tIsland;
   if (checkObjectReference(tIslandFrame.tagName)
         && tIslandFrame.tagName == "IFRAME"){
      tActualIslandFrame = tIslandFrame.contentWindow;
   }
   else
      tActualIslandFrame = tIslandFrame;

   var tDoc = tActualIslandFrame.document;
   tIsland = tActualIslandFrame.s_tXMLIsland[sID];

   // if island is already created, just return it
	if (tIsland)
	   return tIsland;

	// else create new one
   tIsland = createXMLDocument(tDoc);

   // load xml string into island is present
   var tActualStringFrame ;
   if (checkObjectReference(tStringFrame.tagName)  && tStringFrame.tagName == "IFRAME")
      tActualStringFrame = tStringFrame.contentWindow;
   else
      tActualStringFrame = tStringFrame;
   var sXml = tActualStringFrame["sawXmlIsland" + sID];
   if (sXml)
   {
      if (!tIsland.loadXML(sXml))
      {
         alert("error parsing xml island");
         return null;
      }
   }

   tActualIslandFrame.s_tXMLIsland[sID] = tIsland;
   return tIsland;
};

// IE emulation for Mozilla.
if (is_nav)
{
   // Note that srcElement is subtly different from event.target :-)
   Event.prototype.__defineGetter__("srcElement", function () {
      return impl.mozGetEventSrcElement(this);
   });

   // just in case people put bad code out there :-)
   Event.prototype.__defineSetter__("cancelBubble", function (b) {
      // Samar said to do this!
      alert('DON\'T USE cancelBubble. THAT IS IE ONLY. USE stopEventPropagation.');
      //if (b) this.stopPropagation();
   });

   Event.prototype.__defineGetter__("offsetX", function () {
      return this.layerX;
   });

   Event.prototype.__defineGetter__("offsetY", function () {
      return this.layerY;
   });

   HTMLElement.prototype.__defineGetter__("parentElement", function () {
      if (this.parentNode == this.ownerDocument) return null;
      return this.parentNode;
   });

	// Emulates IE's xml property. Gives an XML serialization of the DOM Object
   XMLDocument.prototype.__defineGetter__("xml", function ()
	{
		return (new XMLSerializer()).serializeToString(this);
	});

	// Emulates IE's xml property. Gives an XML serialization of the DOM Object
   Node.prototype.__defineGetter__("xml", function ()
	{
		return (new XMLSerializer()).serializeToString(this);
	});

	// Sets the readyState property
	//impl.setReadyState = function(tDoc, nState)
	//{
	//	tDoc.readyState = nState;
	//	if (tDoc.onreadystatechange != null && typeof tDoc.onreadystatechange == "function")
	//		tDoc.onreadystatechange();
	//};

	// Replaces the contents of the object with the contents of
	// the object given as the parameter
	XMLDocument.prototype.copyDOM = function(tDoc)
	{
		while(this.hasChildNodes())
			this.removeChild(this.firstChild);

      for(i=0; i<tDoc.childNodes.length; i++)
         this.appendChild(this.importNode(tDoc.childNodes[i], true));
	};

	// Parses the String given as parameter to build the document content
	// for the object, exactly like IE's loadXML().
	// @return the old contents serialized to String (xml)
	XMLDocument.prototype.loadXML = function(strXML)
	{
		//impl.setReadyState(this, 1);
		var tDoc = (new DOMParser()).parseFromString(strXML, "text/xml");
		//impl.setReadyState(this, 2);
		this.copyDOM(tDoc);
		//impl.setReadyState(this, 3);

		if (!tDoc.documentElement || tDoc.documentElement.tagName == "parsererror")
			//tDoc.parseError = -1;
			return false;

		//impl.setReadyState(tDoc, 4);
		return true;
	};

	// Emulate IE's onreadystatechange attribute
	// used as a listener to the onreadystatechange event (also emulated)
   //Document.prototype.onreadystatechange = null;
   // Emulate IE's parseError attribute
   //Document.prototype.parseError = 0;
	// Emulates IE's readyState property, which always gives an integer from 0 to 4:
	// 1 == LOADING
	// 2 == LOADED
	// 3 == INTERACTIVE
	// 4 == COMPLETED
   //XMLDocument.prototype.readyState = 0;

//xml.kXsiNamespace = {prefix: 'xsi', uri: 'http://www.w3.org/2001/XMLSchema-instance'};
//xml.kXsdNamespace = {prefix: 'xsd', uri: 'http://www.w3.org/2001/XMLSchema'};
//xml.kSawNamespace = {prefix: 'saw', uri: 'com.siebel.analytics.web/report/v1'};
//xml.kSawxNamespace = {prefix: 'sawx', uri: 'com.siebel.analytics.web/expression/v1'};
//xml.kSawbNamespace = {prefix: 'sawb', uri: 'com.siebel.analytics.web/briefingbook/v1'};
//xml.kSawdNamespace = {prefix: 'sawd', uri: 'com.siebel.analytics.web/dashboard/v1'};

   function NSResolver(prefix) {

      if(prefix == 'saw') {
         return 'com.siebel.analytics.web/report/v1';
      }
      else if(prefix == 'sawx') {
         return 'com.siebel.analytics.web/expression/v1'
      }
      else if(prefix == 'sawb') {
         return 'com.siebel.analytics.web/briefingbook/v1'
      }
      else if(prefix == 'sawd') {
         return 'com.siebel.analytics.web/dashboard/v1'
      }
      else if(prefix == 'xsi') {
         return 'http://www.w3.org/2001/XMLSchema-instance'
      }
      else if(prefix == 'xsd') {
         return 'http://www.w3.org/2001/XMLSchema'
      }
      else if(prefix == 'sawc') {
         return 'com.siebel.analytics.web/chart/template/v1'
      }
      else if(prefix == 'sawsec') {
         return 'com.siebel.analytics.web/security/v1'
      }
      else if(prefix == 'sawr') {
         return 'com.siebel.analytics.web/response/v1'
      }
      else if(prefix == 'sawprefs') {
         return 'com.siebel.analytics.web/userPrefs/v1'
      }
      else
      //this shouldn't ever happen
         return null;
   }
	XMLDocument.prototype.g_BackupNSResolver = NSResolver;

	XMLDocument.prototype.selectNodes = function(sXPath, context)
	{
	   // For some stupid reason, FF 1.5.0.4 can't resolve 'NSResolver'
	   // without explicit qualification of 'window' in situations where
	   // we are trying to reference previous IFrame elements.
	   var tNSResolver = window.NSResolver;
	   
	   if (!tNSResolver) //Have to do this for some other stupid and unknown reason in FF
	      tNSResolver = this.g_BackupNSResolver;

		var tNodes = this.evaluate(sXPath, context ? context : this, tNSResolver,
							XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var vResult = new Array(tNodes.snapshotLength);
		for(var i=0; i<vResult.length; i++)
			vResult[i] = tNodes.snapshotItem(i);
		return vResult;
	};

	Element.prototype.selectNodes = function(sXPath)
	{
		if(this.ownerDocument.selectNodes)
			return this.ownerDocument.selectNodes(sXPath, this);
		else
			return null;
	};

   XMLDocument.prototype.selectSingleNode = function(sXPath, context)
   {
      sXPath += "[1]";
      var vNodes = this.selectNodes(sXPath, context ? context : this);
      if(vNodes.length > 0)
         return vNodes[0];
      else
         return null;
   };

	Element.prototype.selectSingleNode = function(sXPath)
	{
		if(this.ownerDocument.selectSingleNode)
			return this.ownerDocument.selectSingleNode(sXPath, this);
      else
         return null;
	};

}

appendOptionToSelect = function(tSelect, tOption)
{
   if (is_ie)
      tSelect.add(tOption);
   else
      tSelect.add(tOption, null);
};

impl.reXPathConcatFixer = /'/g;

createXPathStringLiteral = function(sSrc)
{
   if (sSrc.indexOf("'") != -1)
   {
      if (is_ie)
         return "'" + escapequotes(sSrc) + "'";
      else
      {
         var s = "concat('";
         s += sSrc.replace(impl.reXPathConcatFixer, "',\"'\",'");
         s += "')";
         return s;
      }
   }
   else
      return "'" + sSrc + "'";
};

}