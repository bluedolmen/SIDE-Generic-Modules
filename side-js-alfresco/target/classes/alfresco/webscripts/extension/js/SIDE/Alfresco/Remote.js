<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">

/**
 * This class provides a wrapper around a native java class to execute
 * remote web service call through whatever URL. This may be seen as
 * a security hole. Use at your own risk.
 *
 * @class Remote
 * @author Jean-Christophe Kermagoret
 *
 */

/**
The class may be used through instanciation if specific data is required:

	var alfresco = new SIDE.Alfresco.Remote('http://localhost:8080/alfresco/service');
	alfresco.call('/api/node/workspace/SpacesStore/' + folderId + '/ruleset/rules'
						+ '?alf_ticket=' + session.getTicket());

or through static call if default data is ok:

	SIDE.Alfresco.Remote.call(
		'http://localhost:8080/alfresco/service'
			+ '/api/node/workspace/SpacesStore/' + folderId + '/ruleset/rules'
			+ '?alf_ticket=' + session.getTicket()
	);

Requirement: extra-AlfrescoE4XUtil.jar from http://www.unorganizedmachines.com/site/software-and-technology/34-software-development/97-calling-web-services-from-alfresco-web-scripts
*/

SIDE.define("SIDE.Alfresco.Remote");

SIDE.Alfresco.Remote = function (baseUrl) {
	this.baseUrl = baseUrl || 'http://localhost:8080/alfresco/service';
}

//rsp = remote.connect('alfresco').post(uri, jsonRuleBody, 'application/json');
SIDE.Alfresco.Remote.call = function (wsUrl, _jsonBody, mimeType) {
	var jsonBody = jsonUtils.toJSONString(_jsonBody);
	logger.log(jsonBody);
	logger.log(json.parse(jsonBody + "").title);

	var xmlhttpresult = null;
	var result = null;

    XMLHttpRequest.abort();
	//  XMLHttpRequest.open("POST", uri, false, "admin", "admin");
	XMLHttpRequest.open("POST", wsUrl, false, "", "");
	XMLHttpRequest.setRequestHeader("Content-Type", mimeType);

	try {
		XMLHttpRequest.send(jsonBody);
		xmlhttpresult = XMLHttpRequest.getResponseText();
		XMLHttpRequest.close();

		result = xmlhttpresult.replace("\n","") + "";
		logger.log(result);
	} catch (e) {
		logger.log(e);
	}

    return result;
}

SIDE.Alfresco.Remote.prototype.call = function(wsUrl, jsonBody, mimeType) {
	SIDE.Alfresco.Remote.call(wsUrl, jsonBody, mimeType);
}
