<import resource="classpath:alfresco/webscripts/extension/js/external/json.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Helper/Search.js">

<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Remote.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Rule.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Workflow/Start.js">

SIDE.define("SIDE.application.requisition.initialization.Rule");

/**
 * This class creates Alfresco Rules required by the Procurement application:
 *
 * * a rule to launch workflow automaticallyinitWorkflowStartScriptCreation();
 * * a rule to fill pdf with Order metadata
 * * a rule to create a directory from a freshly created Order, so the user
 * may add some attachments
 *
 * @class 		Rule
 * @static
 * @module 		SIDE.Initialization
 * @submodule 	SIDE.application.requisition.initialization
 * @author 		Jean-Christophe Kermagoret
 * @constructor
 */
SIDE.application.requisition.initialization.Rule.initCreation = function() {
	SIDE.application.requisition.initialization.Rule.initWorkflowStartScriptCreation();
    SIDE.application.requisition.initialization.Rule.initPDFFillCreation(
      "procurement-requisition-template.pdf",
      "procurement-requisition.properties"
    );
	SIDE.application.requisition.initialization.Rule.initOrderContainerCreation();
}

SIDE.application.requisition.initialization.Rule.initWorkflowStartScriptCreation = function(_scriptPath, _targetFolderName) {
	var scriptPath = null;
	if (_scriptPath == null || _scriptPath == undefined) {
		scriptPath = "/app:company_home/st:sites/cm:side/cm:documentLibrary/cm:SIDE/cm:application/cm:requisition/cm:scripts/cm:SIDE.Requisition.Workflow.Start.js";
		logger.log("Default script path has been provided.");
	} else {
		scriptPath = _scriptPath;
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
//        rule.content.id = Math.floor((Math.random()*1000000)+1) + "";
		rule.content.title = "Starts workflow automatically";
		rule.content.description = "The workflow is started by the system as soon as a document enters into the Ask for approval directory";
		rule.content.ruleType = ["inbound"];
		rule.content.applyToChildren = false;

        rule.content.action.conditions[0] = SIDE.Alfresco.Rule.condition.isSubType(Math.floor((Math.random()*1000000)+1) + "", "cm:folder");

        var script = nodes[0];
        logger.log("Script: " + script.nodeRef);
        rule.content.action.actions[0] = SIDE.Alfresco.Rule.action.script(script.nodeRef);

        var nodes = SIDE.Alfresco.Helper.Search.find("//cm:" + search.ISO9075Encode(targetFolderName));
        logger.log("Nodes: " + nodes);
		for (i in nodes) {
          var node = nodes[i];
          logger.log("Processing -" + node.id + ".");
          rule.create(node.id);
		}
	}
}

SIDE.application.requisition.initialization.Rule.initPDFFillCreation = function(pdfTemplateName, conversionTableName) {
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
          rule.create(node.id);
        }
      }
    }
}

SIDE.application.requisition.initialization.Rule.initOrderContainerCreation = function(_scriptPath, _targetFolderName) {
  /* Creation of Order container rule */
  /* In the 0 - Drafts only */
  var scriptPath = null;
  if (_scriptPath == null || _scriptPath == undefined) {
//	scriptPath = "/app:company_home/st:sites/cm:side/cm:documentLibrary/cm:SIDE/cm:application/cm:requisition/cm:scripts/cm:SIDE.Requisition.Workflow.Start.js";
	scriptPath = "/app:company_home/st:sites/cm:side/cm:documentLibrary/cm:SIDE/cm:application/cm:requisition/cm:scripts/cm:SIDE.application.requisition.bizrule.OrderFolder.js";
//  scriptPath = "/app:company_home/app:dictionary/app:scripts/cm:SIDE.application.requisition.bizrule.OrderFolder.js";
    logger.log("Default script path has been provided.");
  } else {
	scriptPath = _scriptPath;
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
    rule.content.action.actions[0] = SIDE.Alfresco.Rule.action.script(script.nodeRef);

    var nodes = SIDE.Alfresco.Helper.Search.find("//cm:" + search.ISO9075Encode(targetFolderName));
    logger.log("Nodes: " + nodes);
    for (i in nodes) {
      var node = nodes[i];
      logger.log("Processing -" + node.id + ".");
      rule.create(node.id);
    }
  }
}
