
var g_tLastMousedownEvent = new Object;
var g_tMenuPrevPopup= null;
var g_bAllowMenuPopup=true;

menuPrivs = function()	{}
menu = function()	{}

activeMenu	= null;

//	Public methods
menuMousedown = function(event)
{
   g_tLastMousedownEvent.clientX = event.clientX;
   g_tLastMousedownEvent.clientY = event.clientY;

   g_bAllowMenuPopup = true;

   // If there is no active	button, exit.

   if (activeMenu == null)
      return;

   // Find the element that	was clicked	on.
   var el = getEventSrcElement(event);

   // If the active button was clicked on, exit.
   if (el == activeMenu)
      return;

   // If the scrollbar of the window is clicked, exit
   if (menuPrivs.isScrollBarClicked(el, event))
      return;

   if (NQWGetContainer(el, 'DIV', 'className', 'NQWMenu') == null)
   {
      menuPrivs.resetMenu(activeMenu);
      activeMenu =	null;

      g_bAllowMenuPopup = false;

      return false;
   }
}

clearActiveMenu = function()
{
	if(activeMenu	!=	null)
	{
		menuPrivs.resetMenu(activeMenu);

		activeMenu	= null;
	}
}

//	tDir can	be	left for	a drop down	list simulation
popupMenu = function(evt, menuId, fInitializeMenu,	tDir)
{
   return popupMenuByRefObj(evt, null, menuId, fInitializeMenu, tDir);
}

// added this function is handle the situation that we don't have the evt object
popupMenuByRefObj = function(evt, tClicked, menuId, fInitializeMenu, tDir)
{
   var clicked = tClicked;
   if (!clicked && evt)
     clicked = getEventTarget(evt);

   if (!menuId)
      menuId = clicked.getAttribute("menuId");

   if(g_bAllowMenuPopup ==	false && g_tMenuPrevPopup == clicked)
      return false;

   g_tMenuPrevPopup = clicked;

   var tMenu =	document.getElementById(menuId);
   if(tMenu == null)
   {
      alert("Menu	'"	+ menuId	+ "' not	found	in	document!");
      return false;
   }

   if (activeMenu != null)
      menuPrivs.resetMenu(activeMenu);

   if (!menuPrivs.init(evt, tMenu, fInitializeMenu, clicked))
      return false;

   if(tMenu != activeMenu)
   {
      NQWPositionPopup(clicked, tMenu,	tDir);
      menuPrivs.show(tMenu)
   }
   return false;
}

// popup menu at position (x, y)
menu.popupAt = function(tMenu, x, y)
{
   if(tMenu == null)
      return false;

	if	(activeMenu != null)
		menuPrivs.resetMenu(activeMenu);

   if (!menuPrivs.init(null, tMenu, null, null))
      return false;

   if(tMenu != activeMenu)
   {
      tMenu.style.position = 'absolute';
      tMenu.style.left = x + getDocumentScrollLeft() + 'px';
      tMenu.style.top = y + getDocumentScrollTop() + 'px';

      menuPrivs.show(tMenu);
   }
   return false;
}

menuMouseOut = function(event)
{
  var	tMenu;

  if (is_ie)
	 tMenu =	NQWGetContainer(getEventTarget(event), 'DIV', 'className',	'NQWMenu');
  else
	 tMenu =	event.currentTarget;

	if(typeof(tMenu.nTimeout) != 'undefined' && tMenu.nTimeout != null)
	{
		window.clearTimeout(tMenu.nTimeout);
		tMenu.nTimeout	= null;
	}
}

menuMouseOver	= function(event)
{
   var	tMenu;

   if (is_ie)
	   tMenu =	NQWGetContainer(getEventTarget(event), 'DIV', 'className',	'NQWMenu');
   else
	   tMenu =	event.currentTarget;

	if(tMenu.subMenuItem	==	null)
		menuPrivs.doMenuMouseOver(tMenu);
	else
	{
		if(typeof(tMenu.nTimeout) != 'undefined' && tMenu.nTimeout != null)
			window.clearTimeout(tMenu.nTimeout);

		tMenu.nTimeout	= window.setTimeout('menuPrivs.timedDoMenuMouseOver("' + tMenu.id +	'")',	200);
	}
}

menuItemMouseOver =	function(event, menuId,	optMenuArg)
{

  var	item,	tMenu, x, y;

   if (is_ie)
   {
	   item	= NQWGetContainer(getEventTarget(event),	'A', 'className',	'NQWMenuItem');
      if (!item)
	      item = NQWGetContainer(getEventTarget(event),	'A', 'className',	'NQWLeftMenuItem');
	 }
  else
	 item	= event.currentTarget;
  tMenu = NQWGetContainer(item, 'DIV',	'className', 'NQWMenu');

  // Close any	active sub tMenu and	mark this one as active.

   if (tMenu.subMenuItem	!=	null)
   {
	   if(tMenu.subMenuItem	==	item)
	   {
		   if(typeof(tMenu.nTimeout) != 'undefined' && tMenu.nTimeout != null)
		   {
			   window.clearTimeout(tMenu.nTimeout);
			   tMenu.nTimeout	= null;
		   }
		   if	(is_ie)
			   event.cancelBubble = true;
	   else
			   event.stopPropagation();

		   return;
	   }

	   if(typeof(tMenu.nTimeout) != 'undefined' && tMenu.nTimeout != null)
	   {
		   window.clearTimeout(tMenu.nTimeout);

	   }

	   tMenu.eventItem =	item;

	   tMenu.nTimeout	= window.setTimeout('menuPrivs.timedDoMenuItemMouseOver("'	+
		   tMenu.id	+ '","'+menuId+'","'+optMenuArg+'")',200);
//		menuPrivs.closeSubMenu(tMenu);
   }
   else
	   menuPrivs.doMenuItemMouseOver(tMenu, item, menuId, optMenuArg);

 if (is_ie)
	 event.cancelBubble = true;
  else
	 event.stopPropagation();
}

menuCheckmarkItems = function(tMenu, sAttr,	sValue)
{
	 var tList = tMenu.getElementsByTagName('A')

	for(var i =	0 ; i	!=	tList.length ;	++i)
	{
		var sMIAV =	tList[i].getAttribute(sAttr);

		if(sMIAV	!=	null)
			NQWSetHasClassName(tList[i], 'NQWMenuItemChecked',	sValue == sMIAV);
	}
}

//get the parent object of menu items
// need when changing the menu item in javascript
getMenuItemContainer = function(tMenu)
{
   if (menuPrivs.hasDropShadow(tMenu))
      return getFirstChildElement(tMenu).rows[0].cells[0];
   else
      return tMenu;
}


//call this function after changing the menu item after menu is displayed
//Typical use case: display a menu saying "please wait", use AJAX to retrieve the menu item and update the menu
menu.reposition = function(tMenu, tRefObj)
{
   menuPrivs.adjustShadowSize(tMenu);
   //change the position of the menu if necessary
   var sDir = tMenu.getAttribute("sDir") ? tMenu.getAttribute("sDir") : 'right';
   if (sDir == 'left')
      NQWPositionPopup(tRefObj, tMenu, sDir);
}

///////////////////////////////////////////////////////////////////////////////
//	Private methods

menuPrivs.init = function(evt, tMenu, fInitializeMenu, clicked)
{
   if(tMenu.getAttribute("bInit") == null)
   {
      menuPrivs.menuInit(tMenu);
   }

   if(fInitializeMenu != null)
   {
      fInitializeMenu(evt, clicked.tMenu);
   }
   else if(tMenu.getAttribute("menuInit"))
   {
      //	SAL: 11/24/2004 -	checked out	eval.	necessary because	the value of this
      //	attribute could be something like a.b.c and in that case	eval is probably faster.
      var fFunc = eval(tMenu.getAttribute("menuInit"));

      //	allow	init function to prevt tMenu from	appearing
      if (fFunc(evt, tMenu) == false)
         return false;
   }
   
   return true;
}

menuPrivs.show = function(tMenu)
{
   hideSelects(tMenu);
   if (is_nav)
      hideCharts(tMenu);

   menuPrivs.adjustShadowSize(tMenu);
   tMenu.style.visibility = 'visible';
   activeMenu	= tMenu;

   preventMainBarJump();   
}

menuPrivs.resetMenu	= function(tMenu)	{

   if (tMenu	!=	null)	{
	   showSelects(tMenu);
      if (is_nav)
 		   showCharts(tMenu);
	   menuPrivs.closeSubMenu(tMenu);
	   tMenu.style.visibility	= 'hidden';
	   
	   preventMainBarJump();
   }
}

menuPrivs.doMenuMouseOver	= function(tMenu)
{
  if (tMenu.subMenuItem	!=	null)
	 menuPrivs.closeSubMenu(tMenu);
}

menuPrivs.timedDoMenuMouseOver = function(menuId)
{
	var tMenu =	document.getElementById(menuId);

	if(tMenu	!=	null)
	{
		tMenu.nTimeout	= null;

		menuPrivs.doMenuMouseOver(tMenu);
	}
}

menuPrivs.timedDoMenuItemMouseOver	= function(menuId, subMenuId,	optMenuArg)
{
	var tMenu =	document.getElementById(menuId);

	if(tMenu	!=	null)
	{
		tMenu.nTimeout	= null;
		menuPrivs.doMenuItemMouseOver(tMenu, tMenu.eventItem, subMenuId,	optMenuArg);
	}
}

menuPrivs.doMenuItemMouseOver =	function(tMenu,item,	menuId, optMenuArg)
{
	if(tMenu.subMenuItem	!=	null)
		menuPrivs.closeSubMenu(tMenu);

  tMenu.subMenuItem = item;

  NQWAddClassName(item,'NQWMenuItemHighlight');
  if (item.subMenu == null) {
	 item.subMenu = document.getElementById(menuId);
	 if (item.subMenu.bInit	==	null)
		menuPrivs.menuInit(item.subMenu);
  }

  if(item.subMenu.getAttribute("subMenuInit"))
  {
		if(item.subMenu.fSubMenuInit == null)
		{
			item.subMenu.fSubMenuInit = eval(item.subMenu.getAttribute("subMenuInit"));//window[item.subMenu.getAttribute("subMenuInit")];
		}

		item.subMenu.fSubMenuInit(tMenu,	item.subMenu, optMenuArg);
  }

   NQWPositionPopup(item, item.subMenu, item.subMenu.getAttribute("sDir") ? item.subMenu.getAttribute("sDir") : 'right');

   hideSelects(item.subMenu);
   if (is_nav)
 		   hideCharts(item.subMenu);
    
   menuPrivs.adjustShadowSize(item.subMenu);
   
   //move 6px right(width of drop shadow) to make the border of the submenu touch its parent
   if (menuPrivs.hasDropShadow(item.subMenu) && item.subMenu.getAttribute("sDir") == 'left')
   {
      if (!isRToL())
      {
         var nLeftPos = parseInt(item.subMenu.style.left);
         if (nLeftPos)
            item.subMenu.style.left = nLeftPos + menuPrivs.getShadowWidth(item.subMenu) + "px";
      }
      else
      {
         var nRightPos = parseInt(item.subMenu.style.right);
         if (nRightPos)
            item.subMenu.style.right = nRightPos + menuPrivs.getShadowWidth(item.subMenu) + "px";
      }
   }
   
   item.subMenu.style.visibility = 'visible';
   preventMainBarJump();

 }

menuPrivs.closeSubMenu	= function(tMenu)
{

   if (tMenu	==	null || tMenu.subMenuItem == null)
	   return;

   if(typeof(tMenu.nTimeout) != 'undefined' && tMenu.nTimeout != null)
   {
	   window.clearTimeout(tMenu.nTimeout);
	   tMenu.nTimeout	= null;
   }

   if (tMenu.subMenuItem.subMenu != null) {
      showSelects(tMenu.subMenuItem.subMenu);
      if (is_nav)
   	   showCharts(tMenu.subMenuItem.subMenu);
	   menuPrivs.closeSubMenu(tMenu.subMenuItem.subMenu);
	   tMenu.subMenuItem.subMenu.style.visibility = 'hidden';
	   tMenu.subMenuItem.subMenu	= null;
	   
	   preventMainBarJump();
   }

   NQWRemoveClassName(tMenu.subMenuItem, 'NQWMenuItemHighlight');
   tMenu.subMenuItem = null;
}

menuPrivs.menuInit = function(tMenu)
{
   menu.resetShadow(tMenu);

  var	itemList, spanList
  var	textEl, arrowEl;
  var	itemWidth;
  var	w,	dw;
  var	i,	j;

  if (is_ie) {
  //	tMenu.style.lineHeight = '2.5ex';
  }

  itemList = tMenu.getElementsByTagName('A');
  if (itemList.length >	0)
		itemWidth =	itemList[0].offsetWidth;
  else
	 return;

  for	(i	= 0; i <	itemList.length; i++)
  {
		spanList	=	itemList[i].getElementsByTagName('SPAN')
		textEl	= null
		arrowEl	= null;
		for (j =	0;	j	< spanList.length; j++)	{
			if	(NQWHasClassName(spanList[j],	'NQWMenuItemText'))
			textEl	= spanList[j];
			if	(NQWHasClassName(spanList[j],	'NQWMenuItemArrow'))
			arrowEl =	spanList[j];
		}
		if	(textEl	!=	null && arrowEl != null)
			textEl.style.paddingRight = (itemWidth
			- (textEl.offsetWidth	+ arrowEl.offsetWidth))	+ 'px';
  }

  //if (is_ie)
  {
		w	= itemList[0].offsetWidth;
		itemList[0].style.width	=	w + 'px';
		dw	=	itemList[0].offsetWidth	- w;
		w	-=	dw;
		itemList[0].style.width	=	w + 'px';
  }

  tMenu.setAttribute("bInit",	true);
}

//-----------------------------------------------------------------------------
// menu dropshadow

//get the width of the drop shadow
menuPrivs.getShadowWidth = function(tMenu)
{
   if (menuPrivs.hasDropShadow(tMenu))
      return getFirstChildElement(tMenu).rows[2].cells[2].clientWidth;
   else
      return 0;
}

// return true if a menu has dropshadow
menuPrivs.hasDropShadow = function(tMenu)
{
   var tShadowTable = getFirstChildElement(tMenu);
   if (tShadowTable)
      return tShadowTable.className == 'menuShadowWrapper' || tShadowTable.tagName == 'TABLE';
   
   return false;
}

// called just before the popup menu became visible
menuPrivs.adjustShadowSize = function(tMenu)
{
   if (menuPrivs.hasDropShadow(tMenu))
   {
      // ie doesn't generate cell with correct size:( 
      // used to walkaround it
            
      if (is_ie || is_mac)
      {
         menu.resetShadow(tMenu);
         
         var tShadowTable = getFirstChildElement(tMenu);

         //fixDropShowdowStyle(tShadowTable);
         //alert(tShadowTable.rows[1]);
         var height = tMenu.clientHeight - tShadowTable.rows[2].cells[2].clientHeight * 2;
         tShadowTable.rows[1].cells[0].style.height = height + "px";
         var width = tMenu.clientWidth - tShadowTable.rows[2].cells[2].clientWidth * 2;
         tShadowTable.rows[2].cells[1].style.width = width + "px";
      }
   }
   else
   {
      // set the style in case there is no shadow
   	  tMenu.style.border = "#a5a9b6 1px solid";
      if (is_ie)
         tMenu.style.filter = "alpha(opacity=95)";
      else
         tMenu.style.opacity = "0.95";   
      tMenu.style.padding ="0px 1px 1px 1px";
      tMenu.style.backgroundColor = "#f2f2f5";
   }
}

// reset the menu drop-shadow, remove the shadow size set when rendering the menu last time
// this function may be called after menu items are changed
menu.resetShadow = function(tMenu)
{
   if (is_ie && menuPrivs.hasDropShadow(tMenu))
   {
      var tShadowTable = getFirstChildElement(tMenu);
      tShadowTable.rows[1].cells[0].style.height = "auto";
      tShadowTable.rows[2].cells[1].style.width = "auto";
   }
}

menuPrivs.isScrollBarClicked = function(el, evt)
{
   if (el.tagName != 'HTML')
      return false;

   //in case of RTL language, ie have the vertical scroll bar on the left side of the window
   var isVScrollBarOnTheRight = !isRToL() || (isRToL() && !is_ie); 
   
   var x = getEventPageX(evt) - getDocumentScrollLeft();
   if (isVScrollBarOnTheRight && x < getClientWidth()
         || !isVScrollBarOnTheRight && x > 20)
   {
      if (!hasHScrollBar())
         return false;
         
      var y = getEventPageY(evt) - getDocumentScrollTop();
      if (y < getClientHeight() - 20) //getClientHeight() include scrollbar
         return false;
   }
   
   return true;
}


addEventListener(document, 'mousedown', menuMousedown);

//	DEPRECATED
NQWPopupMenu =	popupMenu;
NQWClearActiveMenu =	clearActiveMenu;
NQWMenuMousedown = menuMousedown;
NQWMenuMouseOver = menuMouseOver;
NQWMenuMouseOut =	menuMouseOut;
MQWMenuItemMouseOver	= menuItemMouseOver;
NQWCheckmarkMenuItems =	menuCheckmarkItems;
