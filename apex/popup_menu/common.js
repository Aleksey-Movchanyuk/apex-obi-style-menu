//////////////////////////////////////////////////////////////////////////////
// commonly used namespaces in script
//

/* lesha
 * 
if (!common)
{

hooks = new Object();
// hooks namespace is used for saw javascript hooks.  Preexisting hook, validateAnalysisCriteria,
// remains in the global namespace.
   
xml = new Object();

// does not work on Mozilla!!!
xml.declareNamespaceOnElement = function(ns, el)
{
   var attr = el.getAttributeNode('xmlns:' + ns.prefix);
   if (attr == null)
      el.setAttribute('xmlns:' + ns.prefix, ns.uri);
// else
//    attr.value = ns.uri;
};



xml.kXsiNamespace = {prefix: 'xsi', uri: 'http://www.w3.org/2001/XMLSchema-instance'};
xml.kXsdNamespace = {prefix: 'xsd', uri: 'http://www.w3.org/2001/XMLSchema'};
xml.kSawNamespace = {prefix: 'saw', uri: 'com.siebel.analytics.web/report/v1'};
xml.kSawxNamespace = {prefix: 'sawx', uri: 'com.siebel.analytics.web/expression/v1'};
xml.kSawbNamespace = {prefix: 'sawb', uri: 'com.siebel.analytics.web/briefingbook/v1'};
xml.kSawdNamespace = {prefix: 'sawd', uri: 'com.siebel.analytics.web/dashboard/v1'};
xml.kSawsecNamespace = {prefix: 'sawsec', uri: 'com.siebel.analytics.web/security/v1'};
xml.kSawrNamespace = {prefix: 'sawr', uri: 'com.siebel.analytics.web/response/v1'};

lesha */

//////////////////////////////////////////////////////////////////////////////
// Browser File Map Section
// Makes browser file map available to JavaScript and specialised
// to include only the files that are really needed, i.e. each view
// requests file it would like available in the global file map.
//

var tWebScriptMap = new Array();
childWindows = new Array();

// this function expects an even number of arguments
// refpath, virtpath, refpath, virtpath ...

function WebScriptMapAdd()
{
   var aArguments = WebScriptMapAdd.arguments;

   var i = 0;
   while (i < aArguments.length)
   {
      key=aArguments[i++];
      value=aArguments[i++];
      tWebScriptMap[key] = value;
   }
}

function WebScriptMapGet(sKey)
{
   return tWebScriptMap[sKey];
}

///////////////////////////////////////////////////////////////////////////////
// sawCommandToURLImpl is written out in C++ by HTMLHead

// lesha commandToURL = sawCommandToURLImpl;

///////////////////////////////////////////////////////////////////////////////
// Arrays

function NQWArrayRemoveIndex(tList, nIndex)
{
   if(nIndex == 0)
      return tList.slice(nIndex+1, tList.length);
   else if(nIndex == tList.length - 1)
      return tList.slice(0, nIndex);

   var aNew = new Array();

   return aNew.concat(tList.slice(0, nIndex), tList.slice(nIndex+1, tList.length));
}

///////////////////////////////////////////////////////////////////////////////
// Escaping
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// we need to produce a string which will resolve to '\\' as this is what the regular
// expression syntax requires. Since we are building it up in JavaScript, we need
// to escape each of the backslashes resulting in the string below.
var g_tBackSlashRE = new RegExp("\\\\","gi");

function escapechar(sorig,c,bNoCase)
{
   // first escape backslashes
   sorig = sorig.replace(g_tBackSlashRE, "\\\\");

   var sFlags = "g";
   if (bNoCase)
      sFlags += "i";

   var tRE = new RegExp(c,sFlags);

   return sorig.replace(tRE, "\\" + c);
}

function escapequotes(sorig, bJS)
{
   // first escape backslashes
   sorig = sorig.replace(g_tBackSlashRE, "\\\\");

   if (!bJS)
   {
      var tRE = new RegExp('"',"g");
      sorig = sorig.replace(tRE, '\\"');

      tRE = new RegExp("'","g");
      sorig = sorig.replace(tRE, "\\'");
   }
   else
   {
      var tRE = new RegExp("'","g");
      sorig = sorig.replace(tRE, '\x27');
   }


   return sorig;
}


///////////////////////////////////////////////
// Expander

function SAWMoreInfo(event, sDivID)
{
   var tDiv = (sDivID == null) ? getEventTarget(event) : document.getElementById(sDivID);
   var tImg;

   if (tDiv.tagName == "IMG")
   {
      tImg = tDiv;
      do
      {
         tDiv = getNextSiblingElement(tDiv);
      }
      while (tDiv.nodeType != 1);
   }

   if(tDiv.getAttribute("compresssrc") == undefined)
      tDiv = getNextSiblingElement(tDiv);

   if (!tDiv)
      return false;

   if (!tImg)
   {
      tImg = getPreviousSiblingElement(tDiv);
      if (!tImg)
         return false;
      while (tImg.nodeType != 1 || tImg.tagName != "IMG")
      {
         tImg = getPreviousSiblingElement(tImg);
         if (!tImg)
            return false;
      }
   }
   var tSrc = tImg.src;
   tImg.src = tDiv.getAttribute("compresssrc");
   tDiv.setAttribute("compresssrc", tSrc);
   tDiv.style.display = tDiv.style.display == 'none' ? '' : 'none';
   return false;
};

//////////////////////////////////////////////////////////////////////////////
// Popup Window

popupWindow = function(sURL, sFrame, nWidth, nHeight, sFeatures)
{
   var vW = nWidth == null ? 912 : nWidth;
   var vH = nHeight == null ? 684 : nHeight;
   var vF = sFeatures == null ? "resizable=yes,scrollbars=yes" : sFeatures;

   var sFeat = "width=" + vW + ",height=" + vH + "," + vF;

   var a = document.cookie.split('; ');

   var sSessionID = '';

   if(sFrame != '_parent' && sFrame != '_top' && sFrame != '_blank')
   {
      if(a != null)
         for(var l = 0 ; l != a.length ; ++l)
         {
            if(a[l].substr(0,9) == 'nQuireID=')
            {
               sSessionID = a[l].substr(a[l].length-10);
               break;
            }
         }
   }

   var vT = sFrame == null ? "_blank" : (sFrame + sSessionID);

   window[name] = window.open(sURL, vT, sFeat);
   window.registerChildWindows(window[name]);
}

popupHelp = function(sUrl)
{
   popupWindow(sUrl, null, null, null, 'menubar=0,toolbar=1,scrollbars=1,location=0,status=0,resizable=1');
}

// To register all child windows
registerChildWindows = function(child){     
  childWindows[childWindows.length]=child;
}

closeChildWindows = function()
{     
    for (var i=0;i<childWindows.length;i++)
    {  
      if (childWindows[i] && childWindows[i].open && !childWindows[i].closed){   
            childWindows[i].close();
          }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////

function NQWDynamicLoadJS(sJSUrl, sID, sAfterwards)
{
   var tScript = document.getElementById(sID);

   if(tScript != null)
   {
      if(!tScript.loaded)
      {
         return false;
      }

      if(sAfterwards != null)
         eval(sAfterwards);

      return true;
   }


   tScript = document.createElement('SCRIPT');
   tScript.src = sJSUrl;
   tScript.id = sID;
   tScript.loaded = false;

   if(is_ie55up && sAfterwards != null)
   {
      tScript.prevCursor = document.body.style.cursor;

      document.body.style.cursor = 'wait';
   }

   if(sAfterwards != null)
      tScript.afterwards = sAfterwards;
   else tScript.afterwards = '0';

   document.body.appendChild(tScript);

   return true;
}

///////////////////////////////////////////////////////////////////////////////
function NQWHandleAfterwards(sID)
{
   var tScript = document.getElementById(sID);

   if(tScript != null)
   {
      if(is_ie55up && document.body.style.cursor == 'wait')
      {
         document.body.style.cursor = tScript.prevCursor;
      }
      if(tScript.afterwards != null)
      {
         tScript.loaded = true;
         sEval = tScript.afterwards;

         eval(sEval);
      }
   }
}

///////////////////////////////////////////////////////////////////////////////
function NQWLoadStyleSheet(sURL)
{
   var s = document.createStyleSheet(sURL);
}

///////////////////////////////////////////////////////////////////////////////
calcAbsoluteLeft = function(tObj)
{
   if(isRToL())
     return NQWGetTopRight(tObj);
     
   var x = 0;
   while(tObj != null)
   {
      x += tObj.offsetLeft;
      tObj = tObj.offsetParent;
   }
   return x;
}

///////////////////////////////////////////////////////////////////////////////
calcAbsoluteTop = function(tObj)
{
   var y = 0;
   while(tObj != null)
   {
      y += tObj.offsetTop;
      tObj = tObj.offsetParent;
   }
   return y;
}

///////////////////////////////////////////////////////////////////////////////
calcAbsoluteRight = function(tObj)
{
   var x = 0;
   if (tObj != null)
      x += tObj.offsetWidth;

   while(tObj != null)
   {
      x += tObj.offsetLeft;
      tObj = tObj.offsetParent;
   }

   return x;
}

///////////////////////////////////////////////////////////////////////////////
calcAbsoluteBottom = function(tObj)
{
   var y = 0;
   if (tObj != null)
      y += tObj.offsetHeight;

   while(tObj != null)
   {
      y += tObj.offsetTop;
      tObj = tObj.offsetParent;
   }

   return y;
}

// computes the relative position of a event to the source element
calcRelativePositionX=function(tObj, evt)
{
   return (evt.clientX + window.document.body.scrollLeft-calcAbsoluteLeft(tObj));
}

calcRelativePositionY=function(tObj, evt)
{
   return (evt.clientY + window.document.body.scrollTop-calcAbsoluteTop(tObj));
}

///////////////////////////////////////////////////////////////////////////////
calcAbsoluteLeftOffsetParent = function(tObj)
{
   if(isRToL())
      return NQWGetAbsoluteRightOffsetParent(tObj);

   var x = 0;
   while(tObj != null)
   {
      if (tObj.style.position=="absolute")
         x += tObj.offsetLeft;

      tObj = tObj.offsetParent;
   }
   return x;
}

///////////////////////////////////////////////////////////////////////////////
calcAbsoluteTopOffsetParent = function(tObj)
{
   var y = 0;
   while(tObj != null)
   {
      if (tObj.style.position=="absolute")
         y += tObj.offsetTop;

      tObj = tObj.offsetParent;
   }
   return y;
}

///////////////////////////////////////////////////////////////////////////////
var g_NQWPrevDocumentClick = null;
var g_NQWCurrentPopup = null;

//function NQWClearPopup(oEvent)
//{
//   g_NQWCurrentPopup.style.display = "none";

//   //document.onclick = g_NQWPrevDocumentClick;
//   removeEventListener(document, 'click', NQWClearPopup);

//   showSelects(g_NQWCurrentPopup);
//   g_NQWCurrentPopup = null;
//}

///////////////////////////////////////////////////////////////////////////////
function NQWOverlaps(tObj1, tObj2)
{
   var t1top = calcAbsoluteTop(tObj1);
   var t2top = calcAbsoluteTop(tObj2);
   var t1left = calcAbsoluteLeft(tObj1);
   var t2left = calcAbsoluteLeft(tObj2);

   //special case for charts (Flash OBJECT tag)
   var t1height = tObj1.tagName == "OBJECT" ? tObj1.getAttribute("height") : tObj1.clientHeight;
   var t2height = tObj2.tagName == "OBJECT" ? tObj2.getAttribute("height") : tObj2.clientHeight;
   var t1width = tObj1.tagName == "OBJECT" ? tObj1.getAttribute("width") : tObj1.clientWidth;
   var t2width = tObj2.tagName == "OBJECT" ? tObj2.getAttribute("width") : tObj2.clientWidth;

   if (tObj2.tagName == "OBJECT")
   {
      // for FLASH, top is actually bottom of the displayed object
      t2top = calcAbsoluteTop(tObj2) - t2height;
/*
      var y = parseInt(t1top) + parseInt(t1height);
      var x = (parseInt(t2top) + parseInt(t2height));
      var z = parseInt(t1left) + parseInt(t1width);
      var w = (parseInt(t2left) + parseInt(t2width));
      alert(t1top + t1height + "<= " + t2top + "||" + x + "<=" + t1top + "," + z + " <= " + t2left + " || " + w + "<=" + t1left);
*/
   }
   if((parseInt(t1top) + parseInt(t1height) <= parseInt(t2top) || parseInt(t2top) + parseInt(t2height) <= parseInt(t1top)) || (parseInt(t1left) + parseInt(t1width) <= parseInt(t2left) || parseInt(t2left) + parseInt(t2width) <= parseInt(t1left)))
      return false;

   return true;
}

///////////////////////////////////////////////////////////////////////////////
isDescendantOf = function(tParent,tChild)
{
    for(var t = tChild; t != null ; t = t.parentNode)
    {
        if(t == tParent)
            return true;
    }

    return false;
}

///////////////////////////////////////////////////////////////////////////////
// tObj is the object that is potentially overlapping with the Tag Type
hideTypeByTag = function(sTag, tObj, bAll)
{
   var aObjs = document.getElementsByTagName(sTag);

   for(var s = 0 ; s != aObjs.length ; ++s)
   {
      var tElement = aObjs[s];

      if(bAll == true || NQWOverlaps(tObj,tElement))
      {
         if(tElement.oldVisibility == null && !isDescendantOf(tObj, tElement))
         {
            var tParent = tElement;

            var bParentVisible = true;
            while(tParent != null)
            {
               if(tParent.style != undefined && tParent.style.display == 'none')
               {
                  bParentVisible = false;
                  break;
               }

               tParent = getParentElement(tParent);
            }

            if(bParentVisible)
            {
               tElement.oldVisibility = tElement.style.visibility;
               tElement.underObject = tObj;
               tElement.style.visibility = 'hidden';
            }
         }
      }
   }
}

///////////////////////////////////////////////////////////////////////////////
// tObj is the object that is potentially overlapping with the Tag Type
hideSelects = function(tObj, bAll)
{
   if (is_ie)
      hideTypeByTag("SELECT", tObj, bAll);
}

hideAllSelects = function(tObj)
{
   hideSelects(tObj,true);
}

///////////////////////////////////////////////////////////////////////////////
// tObj is the object that is potentially overlapping with the Tag Type
hideCharts = function(tObj, bAll)
{
   if (is_linux || is_mac || is_solaris)
   {
      hideTypeByTag("EMBED", tObj, bAll);
   }
}

hideAllCharts = function(tObj)
{
   hideCharts(tObj,true);
}


///////////////////////////////////////////////////////////////////////////////
// tObj is the object that is potentially overlapping with the Tag Type
showTypeByTag = function(sTag, tObj)
{
   var aSelects = document.getElementsByTagName(sTag);
   for(var s = 0 ; s != aSelects.length ; ++s)
   {
      var tElement = aSelects[s];
      if(tElement.oldVisibility != null && tElement.underObject == tObj)
      {
         tElement.style.visibility = tElement.oldVisibility;
         tElement.oldVisibility = null;
      }
   }
}

///////////////////////////////////////////////////////////////////////////////
showSelects = function(tObj, bAll)
{
   if (is_ie)
      showTypeByTag("SELECT", tObj, bAll);
}

///////////////////////////////////////////////////////////////////////////////
showCharts = function(tObj, bAll)
{
   if (is_linux || is_mac || is_solaris)
   {
      showTypeByTag("EMBED", tObj, bAll);
   }
}
///////////////////////////////////////////////////////////////////////////////

getDocumentClientDims = function()
{
   var v =  new Object();
   if (self.innerHeight) // all except Explorer
   {
	   v.x = self.innerWidth;
	   v.y = self.innerHeight;
   }
   else if (document.documentElement && document.documentElement.clientHeight)
	   // Explorer 6 Strict Mode
   {
	   v.x = document.documentElement.clientWidth;
	   v.y = document.documentElement.clientHeight;
   }
   else if (document.body) // other Explorers
   {
	   v.x = document.body.clientWidth;
	   v.y = document.body.clientHeight;
   }
   return v;
}

setStyleLeft = function(tObj, xPos)
{
  if(isRToL())
     tObj.style.right = xPos;
  else
     tObj.style.left = xPos;
}

///////////////////////////////////////////////////////////////////////////////
function NQWZThis(tObj,z)
{
   if(tObj.style != null)
      tObj.style.zIndex = z;

   var i;
   for(i = 0 ; i < tObj.childNodes.length ; ++i)
   {
      NQWZThis(tObj.childNodes[i],z);
   }
}

///////////////////////////////////////////////////////////////////////////////
//function NQWIsPopupObject()
//{
//   return g_NQWCurrentPopup != null;
//}
///////////////////////////////////////////////////////////////////////////////
     
function NQWPositionPopupH(tClicked, tPopup, tDir)
{
   if(isRToL())
     NQWPositionPopupRToL(tClicked, tPopup, tDir);
   else
     NQWPositionPopupLToR(tClicked, tPopup, tDir);
}

///////////////////////////////////////////////////////////////////////////////
function NQWPositionPopupLToR(tClicked, tPopup, tDir)
{
   var eL = calcAbsoluteLeft(tClicked);
   var peL = calcAbsoluteLeftOffsetParent(tPopup.offsetParent);
   var eW = tClicked.offsetWidth;
   var dW = tPopup.clientWidth;
   var sL = 0//document.body.scrollLeft;
   var scL = 0;
   
   if(tPopup.popupScrollContainer)
   {
      var tContainer = document.getElementById(tPopup.popupScrollContainer);
      if (null != tContainer)
         scL = tContainer.scrollLeft;
   }
   
   var maxX = getClientWidth() + getDocumentScrollLeft(); 
   
   if("right" == tDir)
   {
      if(eL+eW + dW < maxX)
         tPopup.style.left = eL+eW - peL - scL+"px";
      else tPopup.style.left = maxX - dW- peL - scL+"px";
   }
   else if("left" == tDir)
   {
      if(eL - dW > 0)
         tPopup.style.left = eL - dW-peL - scL+"px";
      else tPopup.style.left = 0-peL - scL+"px";
   }
   else
   {
      if(eL-dW >= sL && eL+eW+dW > maxX)
         tPopup.style.left = eL-dW+eW-peL - scL+"px";
      else
      {
         if(eL + dW > maxX)
            tPopup.style.left = Math.max(0,maxX-dW)-peL - scL + "px";
         else
            tPopup.style.left = eL-peL - scL+"px";
      }
   }
   
   //if somehow we calculated wrong (if item was wrapped on browser)
   if (parseInt(tPopup.style.left) + dW > parseInt(0+maxX))
      tPopup.style.left = maxX-dW - scL > 0? maxX-dW - scL +"px" : "0px";  // set to 0 if maxX-dW - scL is less than 0
}

function NQWGetAbsoluteRightOffsetParent(tObj)
{
   var x = 0;
   
   while(tObj != null && tObj.style.position != "absolute")
      tObj = tObj.offsetParent;
   
   if(tObj != null)
   {
      x += tObj.offsetWidth;
      
      do
      {
	     x += tObj.offsetLeft;
	     
	     if(tObj.offsetLeft < 0)
	        break;

      } while((tObj = tObj.offsetParent) != null);
   }

   return 0 == x ? 0 : document.documentElement.clientWidth - x;
}

///////////////////////////////////////////////////////////////////////////////
function NQWPositionPopupRToL(tClicked, tPopup, tDir)
{
   var bw = tClicked.offsetWidth;
   var pw = tPopup.clientWidth;
   var cw = document.documentElement.clientWidth;
   var topRight = NQWGetTopRight(tClicked);
   var realSL = 0;
   var peL = NQWGetAbsoluteRightOffsetParent(tPopup.offsetParent);
       
   if(document.body.offsetLeft < 0)
   {
      realSL = document.body.offsetWidth - cw - document.documentElement.scrollLeft;
      if(realSL < 0)
         realSL = 0;
   }
      
   var maxLeft = cw + realSL - 16; 
   var maxRight = realSL;
   
   if("left" == tDir) // put on the right in RToL
   {
      if(topRight - pw < maxRight)
         tPopup.style.right = maxRight - peL + "px";
      else
         tPopup.style.right = topRight - pw - peL + "px";
   }
   else if("right" == tDir)
   {
      if(topRight + bw + pw > maxLeft)
         tPopup.style.right = maxLeft - pw - peL + "px";
      else
         tPopup.style.right = topRight + bw - peL + "px";
   }
   else // down
   {
      var right = 0;
      if(topRight + pw <= maxLeft)
         right = topRight;
      else if(topRight + bw <= maxLeft)
         right = topRight + bw - pw;
      else
         right = maxLeft - pw;
         
      if(right < maxRight)
        right = maxRight;
        
      tPopup.style.right = right - peL + "px";
   }

}

///////////////////////////////////////////////////////////////////////////////
function NQWGetTopRight(tClicked)
{
   var x = tClicked.offsetWidth;
   var bBeginWithNeg = false;
   var bPrevNeg = false;
   var firstOffset = tClicked.offsetLeft;
   
   if(!is_nav && "a" == tClicked.tagName.toLowerCase() && tClicked.children[0] && "img" == tClicked.children[0].tagName.toLowerCase())
      firstOffset = tClicked.children[0].offsetLeft;
      
   if(firstOffset >= 0)
      x += firstOffset;
   else
      bBeginWithNeg = true;
     
   while(tClicked = tClicked.offsetParent)
   {
      if(tClicked.offsetLeft < 0)
      {
         if(bBeginWithNeg)
           continue;
         
         if(!bPrevNeg)
         {
           bPrevNeg = true;
		   x += tClicked.offsetLeft;
         }
         else
           break;  // consecutive negative offsetLeft
      }
      else
      {
         bBeginWithNeg = false;
         if(bPrevNeg)
           bPrevNeg = false;
           
         x += tClicked.offsetLeft;
      }
   }
   
   if(!is_nav && x > document.documentElement.clientWidth) // In IE it's never negative while it can be negative in Mozilla
      x -= document.documentElement.scrollWidth - document.documentElement.clientWidth;

   return document.documentElement.clientWidth - x;
}

///////////////////////////////////////////////////////////////////////////////
function NQWPositionPopup(tClicked, tPopup, tDir)
{
   var eT = calcAbsoluteTop(tClicked);
   var peT = calcAbsoluteTopOffsetParent(tPopup.offsetParent);
   var eH = tClicked.offsetHeight;
   var dH = tPopup.clientHeight;

   //scrollTop and scrollLeft not supported in strict mode
   var sT = 0;//document.body.scrollTop;
   tPopup.style.position = 'absolute';

   // if there's a scrollable container (other than the body) for the popup
   // compensate for the scroll in the container
   var scT = 0;

   if (tPopup.popupScrollContainer)
   {
      var tContainer = document.getElementById(tPopup.popupScrollContainer);
      if(null != tContainer)
         scT = tContainer.scrollTop;
   }

   var maxY = getClientHeight() + getDocumentScrollTop(); 


   if("right" == tDir || "left" == tDir)
   {
      if(eT+dH < maxY)
         tPopup.style.top = eT - peT - scT + "px";
      else 
         tPopup.style.top = Math.max(sT, eT+eH-dH) - peT - scT + "px";
   }
   else // bottom
   {
      if(eT-dH >= sT && eT+eH+dH > maxY)
         tPopup.style.top = eT-dH-peT - scT+"px";
      else
         tPopup.style.top = eT+eH-peT - scT+"px";
   }
   
   NQWPositionPopupH(tClicked, tPopup, tDir);
}

///////////////////////////////////////////////////////////////////////////////
//function NQWPopupObject(tClicked,tPopup, event)
//{
//   if(NQWIsPopupObject())
//      return false;

//   //g_NQWPreviousDocumentClick = document.onclick;
//   //document.onclick = NQWClearPopup;
//   addEventListener(document, 'click', NQWClearPopup);

//   g_NQWCurrentPopup = tPopup;

//   var eT = calcAbsoluteTop(tClicked);
//   var eL = calcAbsoluteLeft(tClicked); // tClicked.offsetLeft;
//   var eH = tClicked.offsetHeight;
//   var eW = tClicked.offsetWidth;
//   var dH = tPopup.clientHeight;
//   var dW = tPopup.clientWidth;
//   if(dH == 0 || dH == null)
//   {
//      tPopup.style.display = "block";

//      dH = tPopup.clientHeight;
//      dW = tPopup.clientWidth;
//   }

//   var sT = document.body.scrollTop;
//   var sL = document.body.scrollLeft;
//   tPopup.style.position = 'absolute';
//   if(eT-dH >= sT && eT+eH+dH > document.body.clientHeight+sT) tPopup.style.top = eT-dH+"px";
//   else tPopup.style.top = eT+eH+"px";
//   if(eL-dW >= sL && eL+eW+dW > document.body.clientWidth+sL)
//      tPopup.style.left = eL-dW+eW+"px";
//   else
//   {
//      if(eL + dW > document.body.clientWidth+sL)
//         tPopup.style.left = Math.max(0,document.body.clientWidth+sL-dW)+"px";
//      else tPopup.style.left = eL+"px";
//   }

//   tPopup.style.display="block";
//   hideSelects(tPopup);

//   // SAL: why do we need to stop propogation?
//   stopEventPropagation(event);

//   return true;
//}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// New and improved
//

clearPopup = function(oEvent)
{
   g_NQWCurrentPopup.style.display = 'none';

   removeEventListener(document, 'click', clearPopup);

   showSelects(g_NQWCurrentPopup);

   if (is_nav)
      showCharts(g_NQWCurrentPopup);

   g_NQWCurrentPopup = null;
}

popupObject = function(oEvent, tClicked, tPopup, sDirection)
{
   if (g_NQWCurrentPopup != null)
   {
      if (g_NQWCurrentPopup == tPopup)
         return;
      else
         clearPopup(oEvent); // clear old popup and them popup the new one
   }

   if (!tClicked && oEvent)
      tClicked = getEventTarget(oEvent);

   // this must be before NQWPositionPopup, otherwise offsetParent will be null in firefox
   tPopup.style.display = 'block';

   NQWPositionPopup(tClicked, tPopup, sDirection);

   addEventListener(document, 'click', clearPopup);

   hideSelects(tPopup);

   if (is_nav)
      showCharts(tPopup);

   g_NQWCurrentPopup = tPopup;

   // SAL: Why do we have to stop propogation?
   if (oEvent)
      stopEventPropagation(oEvent);
}


///////////////////////////////////////////////////////////////////////////////
// Called by form onsubmits
function NQWWaitCursor()
{
   document.body.style.cursor = 'wait';
   return true;
}

function NQWDefaultCursor()
{
   document.body.style.cursor = '';
   return true;
}


submitForm = function(tForm, sNewAction)
{
   if(sNewAction != null)
   {
      tForm.action = sNewAction;
   }

   if (typeof (onBeforeSubmitNQWForm) != "undefined" && onBeforeSubmitNQWForm != null)
      onBeforeSubmitNQWForm(tForm,null);

   tForm.submit();

   if (typeof (onAfterSubmitNQWForm) != "undefined" && onAfterSubmitNQWForm != null)
      onAfterSubmitNQWForm(tForm,null);
}

function NQWSubmitFormWithView(tForm, viewID, sNewAction)
{
   if(sNewAction != null)
   {
      tForm.action = sNewAction;
   }

   if (typeof (onBeforeSubmitNQWForm) != "undefined" && onBeforeSubmitNQWForm != null)
      onBeforeSubmitNQWForm(tForm,viewID);

   tForm.submit();

   if (typeof (onAfterSubmitNQWForm) != "undefined" && onAfterSubmitNQWForm != null)
      onAfterSubmitNQWForm(tForm,viewID);
}


function NQWMoreInfo(tAnchor, sDivID)
{
   var tDiv = sDivID == null ? tAnchor.nextSibling :
      document.getElementById(sDivID);

   var tImg = tAnchor.firstChild;

   var tSrc = tImg.src;
   tImg.src = tDiv.compresssrc;
   tDiv.compresssrc = tSrc;

   tDiv.style.display =
      tDiv.style.display == 'none' ? '' : 'none';
}

///////////////////////////////////////////////////////////////////////////////

function NQWHasClassName(tObj, sClass)
{
   if(tObj.className == null)
      return false;

   var tClasses = tObj.className.split(' ');
   for (var n = 0; n < tClasses.length; n++)
   if (tClasses[n] == sClass)
      return true;

   return false;
}

function NQWAddClassName(tObj, sClass)
{
   if(tObj.className == null)
      tObj.className = sClass;
   else tObj.className += ' ' + sClass;
}

function NQWRemoveClassName(tObj, sClass)
{
   if (tObj.className == null)
      return;

   var tClasses = tObj.className.split(' ');

   for(var i = 0 ; i != tClasses.length ; )
   {
      if(tClasses[i] == sClass)
         tClasses = NQWArrayRemoveIndex(tClasses,i);
      else ++i;
   }

   tObj.className = tClasses.join(' ');
}

function NQWSetHasClassName(tObj, sClass, bHasIt)
{
   if(bHasIt)
      if(!NQWHasClassName(tObj,sClass))
         NQWAddClassName(tObj,sClass);
      else;
   else NQWRemoveClassName(tObj,sClass);
}

// If tObj has sClass, it will remove it, otherwise it will add it
function NQWToggleClassName(tObj, sClass)
{
   if (NQWHasClassName(tObj,sClass))
      NQWRemoveClassName(tObj,sClass);
   else
      NQWAddClassName(tObj,sClass);
}

///////////////////////////////////////////////////////////////////////////////
// sAttr can be null
function NQWGetContainer(tObj, sTagName, sAttr, sValue)
{
   while(tObj != null)
   {
      if(tObj.tagName != null && tObj.tagName == sTagName)
      {
         if(sAttr == null || (tObj[sAttr] == sValue)
            || (sAttr == 'className' && NQWHasClassName(tObj, sValue)))
            return tObj;
      }

      tObj = tObj.parentNode; //tObj.parentElement;
   }

   return tObj;
}

////////////////////////////////////////////////////////////////////////////
// url arg parser
getURLArgs = function()
{
   var args = new Object();
   var namePairs = location.search.substring(1).split("&");
   for( var i = 0; i < namePairs.length; i++)
   {
      var pos = namePairs[i].indexOf('=');
      if(pos == -1) continue;
      
      var argname = unescape(namePairs[i].substring(0, pos));
      var value = unescape(namePairs[i].substring(pos+1));
      
      if(argname != '_scid')
	      args[argname] = value;
   }

   return args;
}

///////////////////////////////////////////////////////////////////////////////

function NQWNull()
{
}

///////////////////////////////////////////////////////////////////////////////

function NQWGetRadioGroupValue(tRadioGrp)
{
   for(var i = 0 ; i < tRadioGrp.length ; ++i)
   {
      if(tRadioGrp[i].checked)
         return tRadioGrp[i].value;
   }

   return null;
}

///////////////////////////////////////////////////////////////////////////////

function NQWSetRadioGroupValue(tRadioGrp, sValue)
{
   for(var i = 0 ; i < tRadioGrp.length ; ++i)
      tRadioGrp[i].checked = (tRadioGrp[i].value == sValue);
}

///////////////////////////////////////////////////////////////////////////////

function NQWGetSelectValue(tSelect)
{
   return tSelect.options[tSelect.selectedIndex].value;
}

///////////////////////////////////////////////////////////////////////////////

function NQWSetSelectValue(tSelect, sValue)
{
   for (var i = 0 ; i < tSelect.options.length ; ++i)
   {
      if (tSelect.options[i].value == sValue)
      {
         tSelect.selectedIndex = i;
         break;
      }
   }
}

///////////////////////////////////////////////////////////////////////////////

disableSelectionOnNode = function(tNode)
{
   if (!tNode)
      tNode = document;
   if (is_ie) tNode.onselectstart = function() { return false; };
   if (is_nav) tNode.onmousedown = function(evt) { evt.preventDefault(); };
}

///////////////////////////////////////////////////////////////////////////////

enableSelectionOnNode = function(tNode)
{
   if (!tNode)
      tNode = document;
   if (is_ie) tNode.onselectstart = null;
   if (is_nav) tNode.onmousedown = null;
}

///////////////////////////////////////////////////////////////////////////////

findAncestorElement = function(tNode,sTagName)
{
   if (tNode == null)
      return null;

    for(var t = tNode.parentNode; t != null ; t = t.parentNode)
    {
        if (t.tagName == sTagName)
            return t;
    }

    return null;
}

///////////////////////////////////////////////////////////////////////////////

findAncestorElementOrSelf = function(tNode,sTagName)
{
    for(var t = tNode; t != null ; t = t.parentNode)
    {
        if (t.tagName == sTagName)
            return t;
    }

    return null;
}

///////////////////////////////////////////////////////////////////////////////

findFirstChildElement = function(tNode,sTagName)
{
   for (var i = tNode.firstChild; i != null; i = i.nextSibling)
    {
        if (i.tagName == sTagName)
            return i;
    }

    return null;
}

///////////////////////////////////////////////////////////////////////////////
// Tri-State checkbox
// 0 - default, 1 - unchecked, 2 - checked
//
TriStateCheckbox = function()
{
}

TriStateCheckbox.kDefault = 0;
TriStateCheckbox.kUnchecked = 1;
TriStateCheckbox.kChecked = 2;

TriStateCheckbox.ksMagicNodeName = 'DIV';

TriStateCheckbox.isDefaultChecked = function(tcb)
{
   return (tcb.getAttribute('sawDefaultChecked') == "true");
}

TriStateCheckbox.hideDiv = function(tcb)
{
   var tDiv = tcb.nextSibling;
   while (tDiv != null && tDiv.nodeName != TriStateCheckbox.ksMagicNodeName)
      tDiv = tDiv.nextSibling;
   tDiv.style.display = 'none';
}

TriStateCheckbox.onDisplay = function(tcb)
{
   switch (TriStateCheckbox.getState(tcb))
   {
      case 0:
      {
         TriStateCheckbox.showDiv(tcb);
         break;
      }
      case 1:
      case 2:
      {
         TriStateCheckbox.hideDiv(tcb);
         break;
      }
   }
}

TriStateCheckbox.showDiv = function(tcb)
{
   var tDiv = tcb.nextSibling;
   while (tDiv != null && tDiv.nodeName != TriStateCheckbox.ksMagicNodeName)
      tDiv = tDiv.nextSibling;

   tDiv.style.display = 'block';

   setStyleLeft(tDiv, calcAbsoluteLeft(tcb) -  calcAbsoluteLeftOffsetParent(tcb) + (is_ie ? 3 : 0) + 'px');
   tDiv.style.top = calcAbsoluteTop(tcb) - calcAbsoluteTopOffsetParent(tcb) + (is_ie ? 5 : 0) + 'px';
   
}

TriStateCheckbox.onClick = function(evt)
{
   var tcb = getEventTarget(evt);

   if (tcb.nodeName == TriStateCheckbox.ksMagicNodeName)
      tcb = tcb.parentNode.firstChild;

   if (tcb.nodeName != 'INPUT')
      return true;

   var bDefaultChecked = TriStateCheckbox.isDefaultChecked(tcb);

   if (tcb.disabled)
   {
      tcb.nState = (bDefaultChecked ? 1 : 2);
      tcb.checked = !bDefaultChecked;
      tcb.disabled = false;

      TriStateCheckbox.hideDiv(tcb);
   }
   else
   {
      if (!(tcb.checked ^ bDefaultChecked))
      {
         tcb.nState = (tcb.checked ? 2 : 1);
      }
      else
      {
         tcb.nState = 0;
         tcb.checked = (!tcb.checked || bDefaultChecked);
         tcb.disabled = true;

         TriStateCheckbox.showDiv(tcb);
      }
   }

   // Allow someone to process change in state
   if (tcb.onClickThis != undefined)
      tcb.onClickThis.triStateCallback(tcb.name, tcb.nState);

   //blur this makes the checkbox look better, otherwise it is difficult to distinguish default state with other state on firefox
   tcb.blur();
   
   return true;
}

TriStateCheckbox.getState = function(tcb)
{
   if ((typeof(tcb.nState) == "undefined") || (tcb.nState == null))
   {
      if (tcb.disabled)
         return 0;
      else if (tcb.checked)
         return 2;
      else
         return 1;
   }
   else
      return tcb.nState;
}

TriStateCheckbox.setState = function(tcb, nState)
{
   switch (nState)
   {
   case 0:
      {
         tcb.disabled = true;
         tcb.checked = TriStateCheckbox.isDefaultChecked(tcb);
         TriStateCheckbox.showDiv(tcb);

         break;
      }

   case 1:
      {
         tcb.disabled = false;
         tcb.checked = false;
         TriStateCheckbox.hideDiv(tcb);
         break;
      }

   case 2:
      {
         tcb.disabled = false;
         tcb.checked = true;
         TriStateCheckbox.hideDiv(tcb);
         break;
      }

   default:
      {
         alert('Invalid state \'' + nState + '\' passed to tri-state checkbox.');
         return;
      }
   }

   tcb.nState = nState;
}


///////////////////////////////////////////////////////////////////////////////
// Form manipulation
findFormInputElement = function(tForm, sName)
{
    for (var i = 0;i < tForm.elements.length; i++)
    {
        if (tForm.elements[i].name == sName)
            return tForm.elements[i];
    }
    return  null;
}

createForm = function(sName, sAction)
{
   var tForm = document.createElement("FORM");
   tForm.name = sName;
   tForm.method = "post";
   if (sAction)
      tForm.action = sAction;
   document.body.appendChild(tForm);
   return tForm;
}

createInput = function(sName, sValue, sType, tDoc)
{
   if (!tDoc)
      tDoc = document;
   if (is_ie)
      tInput = tDoc.createElement("<input name=\""+sName+"\">");
   else
   {
      tInput = tDoc.createElement("INPUT");
      tInput.setAttribute("name", sName);
   }

   tInput.setAttribute("type", sType);
   if (sValue)
      tInput.value = sValue;
   else
      tInput.value = "";
   return tInput;
}

addInput = function(tForm, sName, sValue, sType, tDoc)
{
   var tInput = findFormInputElement(tForm,sName);
   if (tInput == null)
      tInput = createInput(sName, sValue, sType, tDoc);

   if (sValue)
      tInput.value = sValue;
   else
      tInput.value = "";

   tForm.appendChild(tInput);
}

addHiddenInput = function(tForm, sName, sValue, tDoc)
{
   addInput(tForm, sName, sValue, "hidden", tDoc);
}

convertFormToString = function(tForm)
{
	var sArgs = "";
	for (i=0; i<tForm.elements.length; i++)
	{
	   //For checkbox value property "sets or retrieves the default or selected value of the control" (MSDN), 
	   //that is it wouldn't change when checbox state is modified
	   var curElem = tForm.elements[i];
	   var bSkip =  (curElem.tagName == "INPUT" && curElem.type == "checkbox" && !curElem.checked);
		sArgs += encodeURIComponent(tForm.elements[i].name);
		sArgs += "=" ;
		if (!bSkip)
         sArgs += encodeURIComponent(tForm.elements[i].value);
		if ((i+1) < tForm.elements.length)
			sArgs += "&";
	}
	return sArgs;
}

/****
 *  Creates a form and populates the returned form's action 
 *  from the passed string.  
 *  
 *  The following are valid to pass as the sData params:
 *
 *  http://host:port/context/function?command&param1=value1&param2=value2
 *  http://host:port/context/servlet?param1=value1&param2=value2
 *
 **/
createFormFromString = function(sData)
{
   var tForm = createForm("tempForm");
   var tData = sData;
   
   if(sData.indexOf('?') >= 0)
   {
      tData = sData.substr(sData.indexOf('?') + 1);
   }
	
   var aPairs = tData.split('&');
   for (var i=0; i<aPairs.length ; i++)
   {
      var iAmp = aPairs[i].indexOf('=');
      if (iAmp != -1)
      {
         var sName = decodeURIComponent(aPairs[i].substring(0, iAmp));
         var sValue = decodeURIComponent(aPairs[i].substring(iAmp+1, aPairs[i].length));
         addHiddenInput(tForm, sName, sValue);
      }		
   }
	
   var isMFCUrlRegExp = /.+\?[^\=]+\&.+/;
   var isMFCUrl = isMFCUrlRegExp.exec(sData);
        
   if(isMFCUrl) // url is: http://host:port/function?command&p1=v1&p2=v2
   {
      // Everything to the left of & is the action
      // Evertying to the right of & is the params
      var andIndex = sData.indexOf('&');
      tForm.action = sData.substr(0, andIndex);
   }
   else  
   {
      if(sData.indexOf('=') > 0)
      {
          // url is: http://host:port/context?p1=v1&p2=v2
          // url is: http://host:port/context?p1=v1
          var qIndex = sData.indexOf('?');
          tForm.action = sData.substr(0, qIndex);
      }
      else
      {
         // url is: http://host:port/context?command
         // url is: http://host:port/context
         tForm.action = sData;
      }
   }        
	
   return tForm;
}

runThisURL = function (sURL,sTarget)
{
    var tForm = createFormFromString(sURL);
    if (tForm)
    {
        if (sTarget != null && sTarget != "")
           tForm.target = sTarget;
                    
        tForm.submit();
    }
    
    return false;
}


///////////////////////////////////////////////////////////////////////////////
//common "gets"
getFrameWindowByName = function(sName)
{
   return window.frames[sName];
}


///////////////////////////////////////////////////////////////////////////////
// Catalog path utils
// RIE: used to be getItemName, now it is getLastPathPart
// this function will return the escaped last part of the path.
// for example if your path is /shared/test/my\/itemname.
// it will return my\/itemname
getLastPathPart = function(sPath)
{
   var i = sPath.lastIndexOf("/");
   var sTemp = sPath;
   
   while (i >= 0)
   {
      var j = 1;
      while (i>=j && sPath.charAt(i-j) == '\\')
         j++;
      // if even number of backslashes, then forward slash is path separator
      if (i<j || (j-1)%2 == 0)
         break;
      //i-j+1 is length since we're starting at 0
      sTemp = sTemp.substr(0, i-j+1);
      i = sTemp.lastIndexOf("/");
   }
   return sPath.substr(i+1, sPath.length-i-1);
}

getItemName = function(sPath)
{
   return pathPartToItemName(getLastPathPart(sPath));
}

getFolder = function(sPath)
{
   var sItemName = getLastPathPart(sPath);
   //sPath.lastIndexOf(sItemName)-1 is length since we're starting at 0
   return sPath.substr(0, sPath.lastIndexOf(sItemName)-1);
}


//returns array with parent folder path, itemname, and caption
getPathComponents = function(sPath)
{
   if (sPath.charAt(0) != '/')
   {
      alert("Invalid Path: " + sPath);
      return new Array();  
   }
   var sPathPart = getLastPathPart(sPath);
   var sFolder = sPath.substr(0, sPath.lastIndexOf(sPathPart)-1);
   if (!sFolder)
      sFolder = '/';
   var sItemName = pathPartToItemName(sPathPart);
   
   return new Array(sFolder, sPathPart, sItemName);
}

// returns array of all itemnames in path in REVERSE ORDER
getPathParts = function(sPath)
{
   var aParts = new Array();
   var sTemp = sPath;
   do
   {
      var aComp = getPathComponents(sTemp);
      aParts.push(aComp[1]);
      sTemp = aComp[0];
   }
   while (aComp[0] != '/');
   return aParts;
}

pathPartToItemName = function(sItemName)
{
   var sCaption = sItemName;
   var tRE = new RegExp("\\\\\\\*","gi");
   sCaption = sCaption.replace(tRE, "*");
   tRE = new RegExp("\\\\\\\?","gi");
   sCaption = sCaption.replace(tRE, "?");
   tRE = new RegExp("\\\\\\\\","gi");
   sCaption = sCaption.replace(tRE, "\\");
   tRE = new RegExp("\\\\\\\/","gi");
   sCaption = sCaption.replace(tRE, "/");
   tRE = new RegExp("\\\\\\\~","gi");
   sCaption = sCaption.replace(tRE, "~");

   return sCaption;
}

captionToItemName = function(sCaption)
{
   var sItemName = sCaption;

   var tRE = new RegExp("\\\\","gi");
   sItemName = sItemName.replace(tRE, "\\\\");
   tRE = new RegExp("\\\*","gi");
   sItemName = sItemName.replace(tRE, "\\*");
   tRE = new RegExp("\\\?","gi");
   sItemName = sItemName.replace(tRE, "\\?");
   tRE = new RegExp("\\\/","gi");
   sItemName = sItemName.replace(tRE, "\\/");
   tRE = new RegExp("\\\~","gi");
   sItemName = sItemName.replace(tRE, "\\~");

   return sItemName;
}

///////////////////////////////////////////////////////////////////////////////
// Event handler for InfoPopup
//

infoPopupGetDiv = function(oEvent)
{
   var target = getEventTarget(oEvent);

   var tParentCell = findAncestorElementOrSelf(target, 'TD');

   if (tParentCell)
   {
      var vDivs = tParentCell.getElementsByTagName('DIV');

      // assume only one DIV
      if (vDivs.length > 0)
         return vDivs[0];
   }

   return null;
}

showInfoPopup = function(oEvent)
{
   var target = getEventTarget(oEvent);

   var div = infoPopupGetDiv(oEvent);

   if (getCurrentStyle(div).display == 'none')
   {
      //div.style.display = 'block';
      popupObject(oEvent, target, div, 'right');
   }
   else
      div.style.display = 'none';
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// String utils

reWhitespaceString = /^\s*$/;

isBlankLine = function(s)
{
   return s == null || (s.replace(reWhitespaceString,'').length == 0);
}

noCaseEquals = function(s1,s2)
{
   return (s1.toLowerCase() == s2.toLowerCase());
}

encodeHTML = function(sText)
{
   // SWE people claim this is much faster than going through the string
   // character by character,
   if (sText == null)
      return "";

   return sText.replace (/&/g, "&amp;").
      replace (/\'/g, "&#039;").
      replace (/\"/g, "&quot;").
      replace (/>/g, "&gt;").
      replace (/</g, "&lt;");
}

encodeHTMLAttrValue = encodeHTML;

/***********/
encodeXML = encodeHTML;

///////////////////////////////////////////////////////////////////////////////
// Object utils

//where are we util
function NQWIsInAnswers()
{
   try
   {
      return window.bAnswers || parent.bAnswers;
   }
   catch (e)
   {
      return false;
   }
}

// are we in the SWE integrated mode?
function NQWIsInSWE()
{
   try
   {
      return checkObjectReference(top.SWEPersonalizationGotoview);
   }
   catch (e)
   {
      return false;
   }
}


///////////////////////////////////////////////////////////////////////////
// String Validation

validateInt = function(sValue)
{
  var objRegExp  = new RegExp("(^\\s*-?\\d\\d*\\s*$)");
  return objRegExp.test(sValue);
}

///////////////////////////////////////////////////////////////////////////
//portable implementations

// *.firstChild - elements only
getFirstChildElement = function(node)
{
   if (node != null && node.childNodes != null)
   {
      for (var i=0; i<node.childNodes.length; i++)
      {
         if (node.childNodes[i].nodeType == 1)
            return node.childNodes[i];
      }
   }
   return null;
}

// *.lastChild - elements only
getLastChildElement = function(node)
{
   if (node != null && node.childNodes != null)
   {
      for (var i=node.childNodes.length-1; i>=0; i--)
      {
         if (node.childNodes[i].nodeType == 1)
            return node.childNodes[i];
      }
   }
   return null;
}

// *.nextSibling - elements only
getNextSiblingElement = function(t)
{
   var sibling = t.nextSibling;
   while (sibling && sibling.nodeType != 1)
      sibling = sibling.nextSibling;
   return sibling;
}

// *.previousSibling - elements only
getPreviousSiblingElement = function(t)
{
   var sibling = t.previousSibling;
   while (sibling && sibling.nodeType != 1)
      sibling = sibling.previousSibling;
   return sibling;
}

// *.childNodes.length - elements only
getChildElementsLength = function(t)
{
   var iNumChildren = 0;
   for (var i=0; i<t.childNodes.length; i++)
   {
      if (t.childNodes[i].nodeType == 1)
         ++iNumChildren;
   }
   return iNumChildren;
}

// elements only
getChildElementByIndex = function(node, nIndex)
{
   for (var i=0; i<node.childNodes.length; i++)
   {
      if (node.childNodes[i].nodeType == 1)
      {
         if (nIndex == 0)
            return node.childNodes[i];
         nIndex--;
      }
   }
   return null;
}

// NOTE: the return value is the logical (element) child node offset
getChildElementLogicalIndex = function(node, childNode)
{
   var nIndex = -1;

   var iNodeCounter = -1;
   for (var i=0; i<node.childNodes.length; i++)
   {
      if (node.childNodes[i].nodeType == 1)
      {
         ++iNodeCounter;

         if (node.childNodes[i] == childNode)
         {
            nIndex = iNodeCounter;
            break;
         }
      }
   }
   return nIndex;
}

// gets cell number in row of table.  does not take into account other rows
getCellNumber = function(row, cell)
{
   for (var i=0; i<row.cells.length;i++)
   {
      if (row.cells[i] == cell)
         break;
   }

   if (i == row.cells.length)
   {
      alert("could not find cell:" + cell + " in row:" + row);
      return null;
   }
   return i;
}

// gets row number in table
getRowNumber = function(table, row)
{
   
   for (var i=0; i<table.rows.length; i++)
   {
      if (table.rows[i] == row)
         break;
   }
   if (i == table.rows.length)
   {
      alert("could not find row:" + row + " in table:" + table);
      return null;
   }
   return i;
}

//////////////////////////////////////////
//Region - region on window defined by coordinates
//////////////////////////////////////////
Region = function(t, r, b, l) {
    this.top = t;
    this.right = r;
    this.bottom = b;
    this.left = l;
}

//Returns whether region is in this
Region.prototype.contains = function(region) {
     return ( region.left >= this.left && 
             region.right <= this.right && 
             region.top >= this.top && 
             region.bottom <= this.bottom);
}


//Returns a region that is occupied by the DOM element
Region.getRegion = function(obj) { 
    var p = getElementXY(obj);
    var t = p[1];
    var r = p[0] + obj.offsetWidth;
    var b = p[1] + obj.offsetHeight;
    var l = p[0];
      
    //window.status = obj + " "  + t + " " + r + " " + b + " " + l;
    return new Region(t, r, b, l);
}

/////////////////////////////////////////////////////////////////////////////
// specialized version of region (no width or height)
Point = function(x, y) 
{
    this.x      = x;
    this.y      = y;

    this.top    = y;
    this.right  = x;
    this.bottom = y;
    this.left   = x;
}

Point.prototype = new Region();


screenToWindowRToL = function(x)
{
   return document.body.offsetWidth - document.documentElement.scrollLeft - x;
}

///////////////////////////////////////////////////////////////////////////////
// XML Stuff
///////////////////////////////////////////////////////////////////////////////

getXmlText = function(node)
{
   return node.xml;
}

////////////////////////////////////////////////////////////
getParentElement = function(tNode, nNum)
{
   if (!nNum) nNum = 1;
   while (nNum > 0)
   {
      tNode = tNode.parentNode;
      if (!tNode)
         return null;
      if (tNode.nodeType == 1)
         nNum--;
   }

   return tNode;
}

//////////////////////////////////////////////////////////////

impl.g_vBlockElements = new Array();
impl.g_vBlockElements["DIV"] = true;
impl.g_vBlockElements["TABLE"] = true;
impl.g_vBlockElements["P"] = true;
impl.g_vBlockElements["BLOCKQUOTE"] = true;
impl.g_vBlockElements["H1"] = true;
impl.g_vBlockElements["H2"] = true;
impl.g_vBlockElements["H3"] = true;
impl.g_vBlockElements["H4"] = true;
impl.g_vBlockElements["H5"] = true;
impl.g_vBlockElements["H6"] = true;
impl.g_vBlockElements["CENTER"] == true;
impl.g_vBlockElements["PRE"] = true;
impl.g_vBlockElements["FORM"] = true;
impl.g_vBlockElements["HR"] = true;

// mimics IE's innerText function
// ideally we should not have to use this
getInnerText = function(tNode)
{
   if (is_ie)
      return tNode.innerText;
   else
   {
      var sText;
      //add space for block element because IE does
      //could we also test for block elements by doing: display == "block"?
      if (impl.g_vBlockElements[tNode.tagName])
         sText = " ";
      else
         sText = "";
      for (var i=0; i<tNode.childNodes.length; i++)
      {
         if (tNode.childNodes[i].nodeType == 3)
            sText += tNode.childNodes[i].data;
         else if (tNode.childNodes[i].nodeType == 1)
            sText += getInnerText(tNode.childNodes[i])
      }
      //trim consecutive spaces because IE does
      return sText.replace(new RegExp("\\s+", "g"), " ");
   }
}



///////////////////////////////////////////////////////////////////////////////
// FScommand

doFSCommand = function(command, args)
{
   // In Corda 5.1.2h it looks like global object has changed inside of the FSCommand handler.
   // We now have to provide the window scope explicitly to find the SAW code.
   eval("window." + command);
};

/////////////////////////////////////////////////////////////////////////////////
//Identifies the consumer of the analytics (right now only Siebel Web
// Engine) and generates the right URL for the object tag
getContextAwareObjectTagMovieURL = function(tMovieURL)
{
   var tNewMovieURL = tMovieURL;
   if ( (isSWEInline == 'undefined') || (isSWEInline == null) ||
      //if true, we want to search for the proxy URL each time. 
        (isSWEInline == 'true') )
   {
      var tLinkList = document.getElementsByTagName('link');
      for (var i=0;i<tLinkList.length;i++)
      {
         var tHREF = tLinkList[i].href;
     
         // A dirty hack to identify if the syndicate (SWE) is running in inline mode.
         // Check for the analytics link tag that is guaranteed to exist all time and
         // verify if the source is a SWE URL. 
         // Note that this hack is specific to Siebel and we will need additional checkings
         // if we need to integrate charts in other apps like peoplesoft etc.
	      if ( (tHREF.search(/views\.css/i) != -1) && (tHREF.search(/SWEMethod=ProxyUrl/i) != -1) )
	      {
	         isSWEInline = true;
	         var tEncodedMovieURL = encodeURIComponent(tMovieURL);
		      tNewMovieURL = tHREF.replace(/Res%2fs_oracle10%2fb_mozilla_4%2fViews.css$/i, tEncodedMovieURL);
	         break;
	      }
	   }
	   
	   if (i >= tLinkList.length)
	      isSWEInline = false;
	}
	return tNewMovieURL;
}
/////////////////////////////////////////////////////////////////////////////////
//    IE ActiveX Update 
ieActiveXFix = function(classid, width, height, id, codebase, movie, divID)
{
   // CR 12-1FD4L5N. Generating object tag using js is breaking
	// charts in siebel apps (call center etc) because the syndicate(SWE)
	// cannot find the object tag in the source markup to modify. The analytics 
	// URL (the 'movie'parameter) needs to be converted into SWE URL in the 
	// inline mode for the charts to be displayed in the apps.
	
   var tNewMovie = getContextAwareObjectTagMovieURL(movie);
   var tDiv = document.getElementById(divID+'_ActiveXDiv');
   var str = '<object classid="'+classid+'" width="'+width+'" height="'+height+'" id="'+id+'" codebase="'+codebase+'"><param name="wmode" value="transparent"><param name="movie" value="'+tNewMovie+'"></object>';
   if (tDiv)
      tDiv.innerHTML = str;
}

///////////////////////////////////////////////////////////////////////////////
// OO Utils

//instanceof emulator
function instanceOf(obj, constructorFunction) {
	while (obj != null) 
	{
		if (obj == constructorFunction.prototype)
			{return true}
		obj = obj.__proto__;
	}
	return false;
}

///////////////////////////////////////////////////////////////////////////////
// String Utils
StringBuffer = function StringBuffer() { 
   this.buffer = []; 
 } 

StringBuffer.prototype.append = function append(string) { 
   this.buffer.push(string); 
   return this; 
 }; 

StringBuffer.prototype.toString = function toString() { 
   return this.buffer.join(""); 
 }; 


/////////////////////////////////////////////////////////////////////////////////////
// HAW: this is used to solve the problem that in case the window has a horz scrollbar and 
// when the menu or dialog popups/hides, the main menu bar jumps.
// The idea is by changing the dom IE redraws the page (it is fast, i don't see any flash)
// I know this is is a weird solution, but I can't think of any other solution
preventMainBarJump = function()
{
   if (is_ie6 && hasHScrollBar())
   {
      var tMummyObject = document.getElementById('idSawDummyObject');
      if (!tMummyObject)
      {
         tMummyObject = document.createElement('span');
         tMummyObject.id = 'idSawDummyObject';
         tMummyObject.style.visibility = 'hidden';
         document.body.appendChild(tMummyObject);
      }
      tMummyObject.style.display = tMummyObject.style.display == 'none'? '' : 'none';
   }
}

/////////////////////////////////////////////////////////////////////////////////////
// DEPRECATED
function NQWGetXMLText(node)
{
   return getXmlText(node);
}

// DEPRECATED
// lesha NQWCommand = commandToURL;

// DEPRECATED
function escapespaces(sorig)
{
   var a = sorig.split('\\');

   var s = a.join('\\\\');

   a = s.split(' ');

   return a.join('\\ ');
}

// DEPRECATED
escapeplus = encodeURIComponent;

//DEPRECATED
function escapeamp(sorig)
{
   var a = sorig.split('&');

   var s = a.join("&amp;");

   return s;
}

// DEPRECATED
PopupWindow = popupWindow;

// DEPRECATED
NQWFindAncestorElement = findAncestorElement;
NQWFindAncestorElementOrSelf = findAncestorElementOrSelf;
NQWIsDescendantOf = isDescendantOf;
NQWHideAllSelects = hideAllSelects;
NQWHideSelects = hideSelects;
NQWShowSelects = showSelects;
NQWDisableSelectionOnNode = disableSelectionOnNode;
NQWEnableSelectionOnNode = enableSelectionOnNode;

// DEPRECATED
function NQWFindFirstChildElement(tNode,sTagName)
{
   return findFirstChildElement(tNode,sTagName);
}

/* lesha common = true;
}
lesha */
