<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Remote.js">

SIDE.define("SIDE.Alfresco.Rule");
/**
 * This class provides a light container to group properties and
 * methods around the rule concept.
 * While elements in hashtable are sometimes not used, even useless,
 * I let them here so you can see available options. By debugging through
 * firebug addon in Firefox or Chrome, you can easily see how json rule
 * are structured by creating such a rule in Alfresco Share.
 *
 * @class Rule
 * @param {String} [alfrescoServer=http://localhost:8080/alfresco]
 * @author Jean-christophe Kermagoret
 *
 */
SIDE.Alfresco.Rule = function (alfrescoServer) {
	this.alfrescoServer = alfrescoServer || "http://localhost:8080/alfresco";
	this.content = SIDE.Alfresco.Rule.base();
}

/**
 * @method create
 * @param {String} [alfrescoServer=http://localhost:8080/alfresco]
 * @author Jean-christophe Kermagoret
 *
 */
SIDE.Alfresco.Rule.prototype.create = function(folderId) {
	var alfrescoServer = this.alfrescoServer ;
    var mimeType = "application/json";

    logger.log("Creating a rule through the rule service from Alfresco: " + alfrescoServer);

    SIDE.Alfresco.Remote.call(
	  alfrescoServer + '/service'
	  + '/api/node/workspace/SpacesStore/' + folderId + '/ruleset/rules'
	  + '?alf_ticket=' + session.getTicket(),
      this.content,
      mimeType
	);
}

/**
 * @static
 * @method base
 * @param {String} [_id] If no id is provided, an random one will
 * be created
 * @author Jean-christophe Kermagoret
 *
 */
SIDE.Alfresco.Rule.base = function (_id) {
  var id = null;
  if (_id == undefined) {
    id = Math.floor((Math.random()*1000000)+1) + "";
  } else {
    id = _id;
  }

  return {
    "id": id,
    "title": "",
    "description": "",
    "disabled": false,
    "executeAsynchronously": false,
    "applyToChildren": false,
    "ruleType": ["inbound", "update", "outbound"],
    "action": {
      "actionDefinitionName": "composite-action",
      "conditions": [],
      "actions": []
    }
  }
};

  /**
   * Compare Property Value
   * operation:= BEGINS|ENDS|CONTAINS
   */
SIDE.Alfresco.Rule.condition = {
  comparePropertyValue: function(id, propertyName, operation, value) {
    // "", "Requisition:ch_unog_dcm_oime_its_Order_n1", "CONTAINS", "234"
    return {
      "id": id,
      "conditionDefinitionName": "compare-property-value",
      "parameterValues": {
        "property": propertyName,
        "operation": operation,
        "value": value
      }
    }
  },
//  cpv: SIDE.Alfresco.Rule.condition.comparePropertyValue,

  hasAspect: function(id, aspectName) {
    // "", "cm:versionable"
    return {
      "id": id,
      "conditionDefinitionName": "has-aspect",
      "parameterValues": {
        "aspect": aspectName
      }
    }
  },
//  ha: SIDE.Alfresco.Rule.condition.hasAspect,

  isSubType: function (id, typeName) {
    return {
      "id": id,
      "conditionDefinitionName": "is-subtype",
      "parameterValues": {
        "type": typeName
      }
    }
  }
//  ,ist: SIDE.Alfresco.Rule.condition.isSubType
};

  /**
   * Action Rules Templates
   */
SIDE.Alfresco.Rule.action = {
  script: function (scriptNodeRef) {
    // {nodeRef} scriptRef
    return {
      "actionDefinitionName": "script",
      "executeAsync": false,
      "parameterValues": {
        "script-ref": scriptNodeRef
      }
    }
  }
}

SIDE.Alfresco.Rule.action.PDFForm = function (id, templateNodeRef, conversionTableNodeRef) {
  return {
    "id": id,
    "actionDefinitionName": "pdf-form",
    "parameterValues": {
      "template-node": templateNodeRef,	// nodeRef
      "converters-node": conversionTableNodeRef	// nodeRef
    }
  }
};
