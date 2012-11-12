<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Helper/Search.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/util/Logger.js">

/*
var nodes = SIDE.Alfresco.Helper.Search.find("//cm:" + search.ISO9075Encode("0 - Draft"));
for (f in nodes) {
  var file = nodes[f];

  var permStrings = file.permissions;
  for (p in permStrings) {
    logger.log("* " + permStrings[p]);
  }
  logger.log("");
}

var nodes = SIDE.Alfresco.Helper.Search.find("//cm:" + search.ISO9075Encode("1 - Ask for approval"));
for (f in nodes) {
  var file = nodes[f];

  var permStrings = file.permissions;
  for (p in permStrings) {
    logger.log("* " + permStrings[p]);
  }
  logger.log("");
}

var nodes = SIDE.Alfresco.Helper.Search.find("//cm:" + search.ISO9075Encode("3 - FRO"));
for (f in nodes) {
  var file = nodes[f];

  var permStrings = file.permissions;
  for (p in permStrings) {
    logger.log("* " + permStrings[p]);
  }
  logger.log("");
}
*/

/*
var docNodeRef = "workspace://SpacesStore/c5e9e548-4a5a-49f1-bd42-a9edefe28bfc";
var transitionId = "some action";
var theDocument = search.findNode(docNodeRef);

logger.log("There are " + theDocument.activeWorkflows.length + " active workflows.");

for  (var i in theDocument.activeWorkflows)
{
	var currWorkflow = theDocument.activeWorkflows[i];
	logger.log("Current Workflow " + theDocument.activeWorkflows[0]);

    var path = currWorkflow.paths[currWorkflow.paths.length-1];
    logger.log("Path = " + path);
    var task = path.tasks[0];

    for (var transitionKey in task.transitions) {
    	logger.log("Key = " + transitionKey);
        if (task.transitions[transitionKey] == transitionId) {
            //path.signal(transitionId);
            break;
        }
    }
}
*/

var docNodeRef = "workspace://SpacesStore/01324851-825a-4c5f-9749-2e103a450055";
var node = search.findNode(docNodeRef);
logger.log(node);
SIDE.util.Logger.dump(node);
//node.name = "Test.pdf";
//logger.log(node.name);
//node.save();
//node.properties["{http://www.bluexml.com/model/content/Requisition/1.0}ch_unog_dcm_oime_its_Order_fro"] = "test";
node.save();