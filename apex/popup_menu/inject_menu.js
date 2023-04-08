function injectMenu() {
 
  // JavaScript Trim on Internet Explorer? 
  if (typeof String.prototype.trim !== 'function') {
     String.prototype.trim = function() {
         return this.replace(/^\s+|\s+$/g, '');
     }
  }

  var getAjax = new htmldb_Get(null, $v('pFlowId'), 'APPLICATION_PROCESS=Get_Main_Bar_Product_Menu_HTML', $v('pFlowStepId'));
  var gReturn = getAjax.get();
  var code = gReturn;
  code = code.trim();
  getAjax = null;
  
  document.getElementById("MainBarProductMenu").innerHTML = code;

}