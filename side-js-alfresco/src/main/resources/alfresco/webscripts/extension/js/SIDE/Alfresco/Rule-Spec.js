<import resource="SIDE/external/json.js">
<import resource="SIDE/Alfresco/Helper/Search.js">
<import resource="SIDE/Alfresco/Remote.js">
<import resource="SIDE/Alfresco/Workflow/Start.js">

var SIDE = SIDE || {};
SIDE.Alfresco = SIDE.Alfresco || {};
/* Creation of the start workflow rule */
/* In the 1 - Ask for approval directory only, no subfolder */

var Bootstrap = Bootstrap || {};
Bootstrap.Rule = Bootstrap.Rule || {};

Bootstrap.Rule.initCreation = function() {
	Bootstrap.Rule.initWorkflowStartScriptCreation();
	Bootstrap.Rule.initWorkflowStartScriptCreation(null, "0 - Draft");
    Bootstrap.Rule.initPDFFillCreation(
      "procurement-requisition-template.pdf",
      "procurement-requisition.properties"
    );
	Bootstrap.Rule.initOrderContainerCreation();
}

Bootstrap.Rule.initWorkflowStartScriptCreation = function(_scriptPath, _targetFolderName) {
	var scriptPath = null;
	if (_scriptPath == null || _scriptPath == undefined) {
		scriptPath = "/app:company_home/app:dictionary/app:scripts/cm:SIDE.application.requisition.workflow.Start.js";
		logger.log("Default script path has been provided.");
	}
    logger.log("Script path: " + scriptPath);

    var targetFolderName = null;
	if (_targetFolderName == null || _targetFolderName == undefined) {
		targetFolderName = "1 - Ask for approval";
        logger.log("Default target directory has been provided.");
	} else {
        targetFolderName = _targetFolderName;
    }
    logger.log("Target directory: " + targetFolderName);

	var nodes = SIDE.Alfresco.Helper.Search.find(scriptPath);
	if (nodes == null) {
		logger.log("The js:\n* " + scriptPath + "\nto launch the workflow doesn't seem to exist. Workflow start script rule creation can't be executed");
	} else {
		var rule = new SIDE.Alfresco.Rule();
//        rule.id = Math.floor((Math.random()*1000000)+1) + "";
		rule.title = "Starts workflow automatically";
		rule.description = "The workflow is started by the system as soon as a document enters into the Ask for approval directory";
		rule.ruleType = ["inbound"];
		rule.applyToChildren = false;

        rule.action.conditions[0] = SIDE.Alfresco.Rule.condition.isSubType(Math.floor((Math.random()*1000000)+1) + "", "Requisition:ch_unog_dcm_oime_its_Order");

        var script = nodes[0];
        logger.log("Script: " + script.nodeRef);
        rule.action.actions[0] = SIDE.Alfresco.Rule.action.script(script.nodeRef);

        var nodes = SIDE.Alfresco.Helper.Search.find("//cm:" + search.ISO9075Encode(targetFolderName));
        logger.log("Nodes: " + nodes);
		for (i in nodes) {
          var node = nodes[i];
          logger.log("Processing -" + node.id + ".");
          SIDE.Alfresco.Rule.create(node.id, rule);
		}
	}
}

Bootstrap.Rule.initPDFFillCreation = function(pdfTemplateName, conversionTableName) {
	/* Creation of the PDF Fill rule */
	/* On the whole tree (with apply to children) except in 1 - Ask for approval */
	var rule = new SIDE.Alfresco.Rule();
	rule.content.title = "Creates and fills PDF from Order and its metadata";
	rule.content.description = "Creates PDF from Order and fills them with Order metadata automatically so they are synchronized";
    rule.content.applyTochildren = true;
    rule.content.ruleType = ["inbound", "update"];
	rule.content.action.conditions[0] = SIDE.Alfresco.Rule.condition.isSubType(Math.floor((Math.random()*1000000)+1) + "", "Requisition:ch_unog_dcm_oime_its_Order");

    var templateNodes = SIDE.Alfresco.Helper.Search.find("//cm:" + search.ISO9075Encode(pdfTemplateName));
    var conversionTableNodes = SIDE.Alfresco.Helper.Search.find("//cm:" + search.ISO9075Encode(conversionTableName));
    if (templateNodes != undefined && templateNodes != null
        && conversionTableNodes != null && conversionTableNodes != undefined) {

      var tplNodeRef = templateNodes[0].nodeRef;
      logger.log("TemplateNodeRef: " + tplNodeRef);

      var convNodeRef = conversionTableNodes[0].nodeRef;
      logger.log("ConversionTableNodeRef: " + convNodeRef);

      rule.content.action.actions[0] = SIDE.Alfresco.Rule.action.PDFForm(
          Math.floor((Math.random()*1000000)+1) + "",
          tplNodeRef,
          convNodeRef
      );

      var dirNodes = SIDE.Alfresco.Helper.Search.find("//cm:DCM/cm:OIME/cm:ITS/*");
//      var dirNodes = SIDE.Alfresco.Helper.Search.find("//cm:DCM/cm:OIME/cm:ITS/cm:"
//                                                        + search.ISO9075Encode("0 - Draft"));
      for (i in dirNodes) {
        var node = dirNodes[i];
        if (node.name != "1 - Ask for approval") {
          rule.content.id = Math.floor((Math.random()*1000000)+1) + "";
          //rule.content.title = rule.content.title + " for " + node.name + " (" + node.id + ")";
          rule.content.action.conditions[0].id = Math.floor((Math.random()*1000000)+1) + "";
          rule.content.action.actions[0].id = Math.floor((Math.random()*1000000)+1) + "";
          logger.log("Adding -" + rule.content.id + "- rule id, -" + rule.content.title + "- rule.");
          SIDE.Alfresco.Rule.create(node.id, rule);
        }
      }
    }
}

Bootstrap.Rule.initOrderContainerCreation = function(_scriptPath, _targetFolderName) {
  /* Creation of Order container rule */
  /* In the 0 - Drafts only */
  var scriptPath = null;
  if (_scriptPath == null || _scriptPath == undefined) {
      scriptPath = "/app:company_home/app:dictionary/app:scripts/cm:SIDE.application.requisition.bizrule.OrderFolder.js";
      logger.log("Default script path has been provided.");
  }
  logger.log("Script path: " + scriptPath);

  var targetFolderName = null;
  if (_targetFolderName == null || _targetFolderName == undefined) {
      targetFolderName = "0 - Draft";
      logger.log("Default target directory has been provided.");
  } else {
      targetFolderName = _targetFolderName;
  }
  logger.log("Target directory: " + targetFolderName);

  var nodes = SIDE.Alfresco.Helper.Search.find(scriptPath);
  if (nodes == null || nodes.length == 0) {
      logger.log("The js:\n* " + scriptPath + "\nto create the Order container doesn't seem to exist. So the container creation rule can't be created.");
  } else {
    var rule = new SIDE.Alfresco.Rule();
    rule.content.title = "Creates the Order folder from the order metadata.";
    rule.content.description = "Creates the folder for the order from its name and rename the Order 'Order.pdf'";
    rule.content.applyToChildren = false;
    rule.content.ruleType = ["inbound"];
    rule.content.action.conditions[0] = SIDE.Alfresco.Rule.condition.isSubType(Math.floor((Math.random()*1000000)+1) + "", "Requisition:ch_unog_dcm_oime_its_Order");

    var script = nodes[0];
    logger.log("Script: " + script.nodeRef);
    rule.action.actions[0] = SIDE.Alfresco.Rule.action.script(script.nodeRef);

    var nodes = SIDE.Alfresco.Helper.Search.find("//cm:" + search.ISO9075Encode(targetFolderName));
    logger.log("Nodes: " + nodes);
    for (i in nodes) {
      var node = nodes[i];
      logger.log("Processing -" + node.id + ".");
      SIDE.Alfresco.Rule.create(node.id, rule);
    }
  }
}

Bootstrap.Rule.initCreation();
