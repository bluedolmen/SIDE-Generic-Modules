<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">

<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Workflow/Start.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/application/initialization/DirectoryTree.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/application/requisition/initialization/Rule.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Person.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Group.js">

/*
<import resource="/app:company_home/Sites/side/documentLibrary/SIDE/application/resources/scripts/SIDE/Alfresco/Workflow/Start.js">
<import resource="/app:company_home/Sites/side/documentLibrary/SIDE/application/resources/scripts/SIDE/application/initialization/DirectoryTree.js">
<import resource="/app:company_home/Sites/side/documentLibrary/SIDE/application/resources/scripts/SIDE/application/requisition/initialization/Rule.js">
<import resource="/app:company_home/Sites/side/documentLibrary/SIDE/application/resources/scripts/SIDE/Alfresco/Person.js">
<import resource="/app:company_home/Sites/side/documentLibrary/SIDE/application/resources/scripts/SIDE/Alfresco/Group.js">
*/


SIDE.define("SIDE.application.initialization.Bootstrap");

/**
 * This class contains all the initialization data to bootstrap
 * a complete Requisition application. It's the generic part.
 *
 * @class Bootstrap
 * @module SIDE.Initialization
 * @submodule SIDE.application.initialization
 * @constructor
 */
SIDE.application.initialization.Bootstrap = function(config) {
	this.config = config;
}
/**
 * Initializes the bootstrap process by creating all the required
 * elements for a requisition application.
 *
 * @method init
 */
SIDE.application.initialization.Bootstrap.prototype.init = function() {

	var s = this.createSite();

	/**
	 * Base groups must exist before the directories' creation. Indeed,
	 * final directories from the site structure will be included into
	 * these base groups.
	 */
	this.createApplicationGroups();

	/* Creates folder structure, groups and assigns permissions */
	this.createSiteStructure(s);

	/**
	 * Users are created with an avatar if a people-username.png image
	 * is available somewhere in the Alfresco repository
	 */
	this.createUsers();

	/**
	 * Users need to have SiteConsumer right on the application site
	 * in order to see it
	 */
	this.addUsersInApplicationSiteGroup();

	/**
	 * Users are not directly included into the application groups. They
	 * are included into the organization groups which are, in their turn,
	 * included into the application groups, corresponding to the ones
	 * used by the workflows.
	 */
	this.addUsersInOrganizationGroups();

	//this.createWorkflowStartScript(s);
	this.createRules();
}

/**
 * Creates the Alfresco Share site
 *
 * @method createSite
 *
 */
SIDE.application.initialization.Bootstrap.prototype.createSite = function() {
    var s = null;
    try {
      s = siteService.createSite(
		"site-dashboard",	// shortName
		this.config.application.name,
		this.config.application.title,
		this.config.application.description,
		true // visibility
      );
    } catch (e) {
      logger.log(e);
      s = siteService.getSite(this.config.application.name);
    }
  	return s;
}

/**
 * Creates site structure
 *
 * @method createSiteStructure
 *
 */
SIDE.application.initialization.Bootstrap.prototype.createSiteStructure = function(s) {
  if (s != null) {
	var baseDir = "/app:company_home/st:sites/cm:" + s.shortName + "/cm:documentLibrary";
    logger.log(baseDir);

	var tree = new SIDE.application.initialization.DirectoryTree(
		baseDir,
		this.config.organization,
		this.config.applicationFolders,
		this.config.applicationGroups	// used by the workflow
	);

	tree.initialize();

  } else {
    logger.log("The Alfresco Share site is not available. Stop.");
    throw "NotExistingAlfrescoShareSite";
  }
}

/**
 * Creates the js script to start workflow for Requisition
 *
 * @method createWorkflowStartScript
 *
 */
SIDE.application.initialization.Bootstrap.prototype.createWorkflowStartScript = function(s) {
//	var baseDir = "/app:company_home/st:sites/cm:" + s.shortName + "/cm:documentLibrary";
	var baseDir = "/app:company_home/st:sites/cm:" + "side" + "/cm:documentLibrary";
	SIDE.Alfresco.Workflow.Start.createScript(
		"jbpm$wfbxRequisition:Requisition",
		"Please review this PR: ",
		7,
//		"/app:company_home/app:dictionary/app:scripts",
		baseDir + "/cm:SIDE/cm:application/cm:requisition/cm:scripts",
		null
	);
}

/**
 * Creates rules for requisition application into the leaves of the
 * previously created directory structure
 *
 * @method createRules
 */
SIDE.application.initialization.Bootstrap.prototype.createRules = function() {
	SIDE.application.requisition.initialization.Rule.initCreation();
}

/**
 * Creates users so you can play with the application directly
 *
 * @method createUsers
 *
 */
SIDE.application.initialization.Bootstrap.prototype.createUsers = function() {
	logger.log("Creating Users");

	for (p in this.config.persons) {
	  var user = this.config.persons[p];
	  SIDE.Alfresco.Person.createUser(user[0],user[1],user[2],user[3],user[4],user[5],user[6],user[7]);
	};
}

/**
 * Adds users in the groups used by the workflow. They are different from
 * the ones created for the directory structure which manage content access
 * through a set of explicit permissions.
 *
 * @method addUsersInApplicationSiteGroup
 */
SIDE.application.initialization.Bootstrap.prototype.addUsersInApplicationSiteGroup = function() {
	logger.log("Adding users in application site group as consumer");

	for (p in this.config.persons) {
	  var user = this.config.persons[p];
	  var userName = user[0];
	  logger.log("Adding -" + userName + "- into -" + "site_" + this.config.application.name + "_SiteConsumer.");
	  people.addAuthority(
		  people.getGroup("GROUP_" + "site_" + this.config.application.name + "_SiteConsumer"),
		  people.getPerson(userName)
	  );
	};
}

/**
 * Creates groups used by the workflows. Without these groups, workflows
 * are unusable.
 *
 * @method createApplicationGroups
 *
 */
SIDE.application.initialization.Bootstrap.prototype.createApplicationGroups = function() {
	for (g in this.config.applicationGroups) {
      var group = this.config.applicationGroups[g];
	  logger.log("Creating -" + g + "- group / -" + group.description + ".");
	  SIDE.Alfresco.Group.create(g, group.description);
	}
}

/**
 * Adds users in organization groups so you can really access the data
 * and use the application. Indeed, organization groups are included into
 * application groups so, by transitivity, you'll be able to manage the
 * workflow in relation with your membership.
 *
 * @method addUsersInOrganizationGroups
 *
 */
SIDE.application.initialization.Bootstrap.prototype.addUsersInOrganizationGroups = function() {
	for (g in this.config.organizationGroups) {
      var group = this.config.organizationGroups[g];
	  logger.log("Adding members (users or groups) to -" + g + ".");

	  for (i in group.members) {
	    var member = group.members[i];

        var _member = null;
        if (member.indexOf("GROUP_") == -1) {
          _member = people.getPerson(member);
          logger.log("Person name: " + member + " / " + "Person object: " + _member);
        } else {
          _member = people.getGroup(member);
          logger.log("Group name: " + member + " / " + "Group object: " + _member);
        }

	    var _g = SIDE.Alfresco.Group.get(g);
	    logger.log("Group name: " + g + " / " + "Group object: " + _g);

	    try {
	      var a = people.addAuthority(_g, _member);
          var name = _member.properties["userName"] || _member.properties["authorityDisplayName"];
	      logger.log(name + " has been successfully added to group " + _g.properties["authorityDisplayName"]);
	    } catch (e) {
	      logger.log(e);
	      logger.log(member + " can't be added to group " + g + ". Do the user/group and parent group exist? Is it already configured?");
	    }
	  }
	}
}
