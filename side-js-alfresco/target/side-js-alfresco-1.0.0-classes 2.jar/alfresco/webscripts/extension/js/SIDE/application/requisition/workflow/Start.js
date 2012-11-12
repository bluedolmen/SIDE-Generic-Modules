
logger.log("Start workflow action initilization");

var workflow = actions.create("start-workflow");
workflow.parameters.workflowName = "jbpm$wfbxRequisition:Requisition";
workflow.parameters["bpm:workflowDescription"] = "Please review this PR: " + document.name;

var futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);
workflow.parameters["bpm:workflowDueDate"] = futureDate;

workflow.execute(document);

document.move(document.parent.parent.childByNamePath("3 - FRO"));
