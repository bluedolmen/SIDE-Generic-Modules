<import resource="SIDE/application/initialization/DirectoryTree" >

var tree =
  [{
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
  }];

var folders = [
    { name: "0 - Draft",		permissions: ["Drafters", "FRO_NA", "SRO_NA", "EOF_NA"]},
    { name: "1 - Ask for approval", permissions: ["Drafters", "FRO_NA", "SRO_NA", "EOF_NA"]},
    { name: "2 - Correction",	permissions: ["Drafters", "FRO_NA", "SRO_NA", "EOF_NA"]},
    { name: "3 - FRO",			permissions: ["FRO", "Drafters_RO", "SRO_RO", "EOF_RO"]},
    { name: "4 - SRO",			permissions: ["SRO", "Drafters_RO", "FRO_RO", "EOF_RO"]},
    { name: "5 - EO",			permissions: ["EOF", "Drafters_RO", "FRO_RO", "SRO_RO"]},
    { name: "6 - Approved",  	permissions: ["Drafters","FRO_RO","SRO_RO","EOF_RO"]},
    { name: "7 - Rejected",		permissions: ["Drafters","FRO_RO","SRO_RO","EOF_RO"]}
];

var applicationGroups = {
  "Drafters": {
      "description": "UNO / Drafter's group",
      "members": ["mlamenace", "jck"],
      "siteRole":	["Collaborator"]
  },
  "FRO": {
      "description": "UNO / First Reporting Officer's group",
      "members": ["tcurtis"],
      "siteRole": ["Contributor"]
  },
  "SRO": {
    "description": "UNO / Second Reporting Officer's group",
    "members": ["jbond"],
    "siteRole": ["Contributor"]
  },
  "EOF": {
    "description": "UNO / Executive Officer's group",
    "members": ["epeel"],
    "siteRole": ["Contributor"]
  }
};

var baseDir = "/app:company_home/st:sites/cm:test/cm:documentLibrary";

var tree = new SIDE.application.initialization.DirectoryTree(
		baseDir,
		tree,
		folders,
		applicationGroups);

tree.initialize();
