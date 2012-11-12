<import resource="/app:company_home/Sites/side/documentLibrary/SIDE/application/resources/scripts/SIDE/application/initialization/Bootstrap.js">
<import resource="/app:company_home/Sites/side/documentLibrary/SIDE/application/resources/scripts/SIDE/application/requisition/initialization/Config.js">

logger.log("Loading Bootstrap-Spec");

var config = new SIDE.application.requisition.initialization.Config();
var boot = new SIDE.application.initialization.Bootstrap(config);

boot.init = function() {
	//this.createRules();
	this.createApplicationGroups();
}

boot.init();
