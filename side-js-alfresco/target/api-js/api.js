YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Bootstrap",
        "Config",
        "DirectoryTree",
        "Group",
        "OrderFolder",
        "People",
        "Person",
        "Remote",
        "Rule",
        "Start"
    ],
    "modules": [
        "SIDE.Initialization",
        "SIDE.Procurement",
        "SIDE.application.initialization",
        "SIDE.application.requisition.bizrule",
        "SIDE.application.requisition.initialization"
    ],
    "allModules": [
        {
            "displayName": "SIDE.Alfresco.Workflow",
            "name": "SIDE.Alfresco.Workflow",
            "description": "This library provides helper functions to dynamically create all kind of\nworkflow start script. A rule will generally be created later to call\nthis script."
        },
        {
            "displayName": "SIDE.application.initialization",
            "name": "SIDE.application.initialization",
            "description": "This class contains all the initialization data to bootstrap\na complete Requisition application. It's the generic part."
        },
        {
            "displayName": "SIDE.application.requisition.bizrule",
            "name": "SIDE.application.requisition.bizrule",
            "description": "Creates a folder with the name of the provided file.\n\nOther bizrules should have been put here instead of generating them\nor importing them through the 'side' Alfresco Share site"
        },
        {
            "displayName": "SIDE.application.requisition.initialization",
            "name": "SIDE.application.requisition.initialization",
            "description": "This class creates Alfresco Rules required by the Procurement application:\n\n* a rule to launch workflow automaticallyinitWorkflowStartScriptCreation();\n* a rule to fill pdf with Order metadata\n* a rule to create a directory from a freshly created Order, so the user\nmay add some attachments"
        },
        {
            "displayName": "SIDE.Initialization",
            "name": "SIDE.Initialization"
        },
        {
            "displayName": "SIDE.Procurement",
            "name": "SIDE.Procurement"
        }
    ]
} };
});