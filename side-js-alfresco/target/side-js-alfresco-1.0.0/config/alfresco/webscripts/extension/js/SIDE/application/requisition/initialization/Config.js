<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">

SIDE.define("SIDE.application.requisition.initialization.Config");

/**
 * This class describes all the initialization data to bootstrap
 * a complete Procurement Requisition application. This part is specific
 * to each application.
 *
 * @class Config
 * @module SIDE.Initialization
 * @submodule SIDE.application.requisition.initialization
 */
SIDE.application.requisition.initialization.Config = function() {

	/**
	 * @property application
	 * @type {Object}
	 */
	this.application = {
		//name: "procurement",				// site's name
		name: "test",				// site's name
		title: "Procurement Requisition",	// site's title
		description: "Procurement Requisition Application" // site's description
	}

	/**
	 * This property stores the organization's structure as a tree.
	 * It is used as a base to create the main directory layout. You may
	 * have as many levels as you want. This is called organization but
	 * could have been called tree. No semantics at all related to an
	 * organization.
	 *
	 * @property organization
	 * @type {Array}
	 */
	this.organization = [
	    {
		    name: "DCM",
		    children: [
		      {
		        name: "OIME",
		        children: [{
		            name: "ITS",
		            children: []
		        }]
		      }
		    ]
	    }
	];

	/**
	 * Once the previous organization structure is available, following
	 * folders are created into the leaves: e.g. ITS in the previous case.
	 * For each folder, permissions for each group are available in
	 * a very simple format of the form: Group(_Permission)? where permission
	 * may be:
	 *
	 * * RO: Read-Only
	 * * NA: Not Available
	 * * nothing
	 *
	 * @property applicationFolders
	 * @type {Array}
	 *
	 * @TODO: manage cases where group contains '_'
	 */
	this.applicationFolders = [
		{ name: "0 - Draft",		permissions: ["Drafters", "FRO_NA", "SRO_NA", "EOF_NA"]},
		{ name: "1 - Ask for approval", permissions: ["Drafters", "FRO_NA", "SRO_NA", "EOF_NA"]},
		{ name: "2 - Correction",	permissions: ["Drafters", "FRO_NA", "SRO_NA", "EOF_NA"]},
		{ name: "3 - FRO",			permissions: ["FRO", "Drafters_RO", "SRO_RO", "EOF_RO"]},
		{ name: "4 - SRO",			permissions: ["SRO", "Drafters_RO", "FRO_RO", "EOF_RO"]},
		{ name: "5 - EO",			permissions: ["EOF", "Drafters_RO", "FRO_RO", "SRO_RO"]},
		{ name: "6 - Approved",  	permissions: ["Drafters","FRO_RO","SRO_RO","EOF_RO"]},
		{ name: "7 - Rejected",		permissions: ["Drafters","FRO_RO","SRO_RO","EOF-RO"]}
	];

	/**
	 * Test users. They are used to populate the application's group
	 * so you can test it in a standalone mode.
	 *
	 * @property persons
	 * @type {Array}
	 *
	 */
	this.persons = [
	  //["userName","firstName","lastName","eMail","password", "active", "location", "title"],
	  ["mlamenace","Max","LA MENACE","max.lamenace@bluexml.com","coucou", true, "Paris", "Assistant"],
	  ["tcurtis","Tony","CURTIS","tony.curtis@bluexml.com","coucou", true, "Nantes", "Project Leader"],
	  ["jbond","James","BOND","james.bond@bluexml.com","coucou", true, "Rome", "Chief Technical Officer"],
	  ["epeel","Emma","PEEL","emma.peel@bluexml.com","coucou", true, "Londres", "Officer In Charge"]
	];

	/**
	 * This property stores the application roles which will be used
	 * to create required application groups. They are also used to create
	 * the base groups for the organization.
	 * You can of course provide your own group and insert them into
	 * the application's groups.
	 *
	 * @property applicationGroups
	 * @type {Object}
	 *
	 */
	this.applicationGroups = {
	  "Drafters": {
		  "description": "UNO / Drafter's group"
	  },
	  "FRO": {
		  "description": "UNO / First Reporting Officer's group"
	  },
	  "SRO": {
		"description": "UNO / Second Reporting Officer's group"
	  },
	  "EOF": {
		"description": "UNO / Executive Officer's group"
	  }
	};

	/**
	 * This property stores the application roles which will be used
	 * to create required application groups. They are also used to create
	 * the base groups for the organization.
	 * You can of course provide your own group and insert them into
	 * the application's groups.
	 *
	 * @property organizationGroups
	 * @type {Object}
	 *
	 */
	this.organizationGroups = {
	  "DCM_OIME_ITS_Drafters": {
		  "members": ["mlamenace"]
	  },
	  "DCM_OIME_ITS_FRO": {
		  "members": ["tcurtis"]
	  },
	  "DCM_OIME_ITS_SRO": {
		"members": ["jbond"]
	  },
	  "DCM_OIME_ITS_EOF": {
		"members": ["epeel"]
	  }
	};

	/**
	 * @property resources
	 * @type {Object}
	 */
	this.resources = {
		pdfTemplatePath: "SIDE/application/requisition/resources/procurement-requisition-template.pdf",
		conversionTablePath: "SIDE/application/requisition/resources/procurement-requisition.properties",
		workflowStartScriptPath: "SIDE/application/requisition/scripts/SIDE.application.requisition.bizrule.OrderFolder.js",
		orderContainerCreationScriptPath: "SIDE/application/requisition/scripts"
	}
};


