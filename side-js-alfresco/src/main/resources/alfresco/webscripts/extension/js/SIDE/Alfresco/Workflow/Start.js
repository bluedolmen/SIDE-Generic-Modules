<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Helper/Search.js">

SIDE.define("SIDE.Alfresco.Workflow");
/**
 * This library provides helper functions to dynamically create all kind of
 * workflow start script. A rule will generally be created later to call
 * this script.
 *
 * @author Jean-Christophe Kermagoret
 *
 * @class Start
 * @module SIDE.Alfresco
 * @submodule SIDE.Alfresco.Workflow
 * @param {string} workflowName "jbpm$wfbxRequisition:Requisition"
 * @param {string} description  "Please review this PR: "
 * @param {int}    delay	   7
 */
SIDE.Alfresco.Workflow.Start = function (workflowName, description, delay) {
	//workflow and document are available as native JS objects in Repository context
	logger.log("Configuring " + workflowName + " start workflow action");

	var workflow = actions.create("start-workflow");
	workflow.parameters.workflowName = workflowName;
	workflow.parameters["bpm:workflowDescription"] = description + " " + document.name;

	var futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + delay);
	workflow.parameters["bpm:workflowDueDate"] = futureDate;

	logger.log("Starting -" + workflowName + ".");
	workflow.execute(document);
	logger.log("Workflow -" + workflowName + "- launched on " + document.properties["title"] + ".");
}

SIDE.Alfresco.Workflow.Start.createScript = function(workflowName, description, delay, _space, name, destination) {
	var nodes = null;
	if (_space == null || _space == undefined) {
		nodes = SIDE.Alfresco.Helper.Search.find("/app:company_home/app:dictionary/app:scripts");
	} else {
		nodes = SIDE.Alfresco.Helper.Search.find(_space);
	}

	var space = null;
	logger.log("How many nodes have been found? " + nodes.length + ".");
	if (nodes.length >= 1) {
		logger.log("We only need one. So we take first.");
		space = nodes[0];
	}

	if (space != null) {
		logger.log("Workflow start script directory: " + space.name);

		if (name == null || name == undefined) {
			name = workflowName;
			name = workflowName.replace(/.*:/g, "");
			name = "SIDE." + name + ".Workflow.Start.js";
		}
		logger.log("Worklfow start script name: " + name);

		/* Creates the script into the repository */
        var code = "<import resource='classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Workflow/Start.js'>\n\n"
        			+ "SIDE.Alfresco.Workflow.Start("
		   					+ "\"" + workflowName + "\", "
		   					+ "\"" + description + "\", "
		   					+ delay + ", "
		   					+ "\"" + destination + "\");";

        logger.log("The following code is going to be inserted:\n* " + code + "\ninto: " + space.displayPath + "/" + space.name + "/" + name);
      try {
          script = space.createFile(name);
          script.content = code;
          script.save();
      } catch (e) {
		logger.log("Workflow start script: -" + name + "- already exists.");
      }
	} else {
		logger.log("Workflow start script directory: " + _space + " has not been found");
	}

	return script;
}
