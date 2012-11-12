<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/util/Logger.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Helper/Search.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Helper/Folder.js">

SIDE.define("SIDE.application.initialization.DirectoryTree");

/**
 * This class creates the directory structure in the baseDir. In parallel,
 * the corresponding groups are created and the permissions indicated
 * in the folders attribute are assigned.
 *
 * Requirement: Provided base groups must be created so nested groups
 * can be initialized correctly.
 *
 * @class 		DirectoryTree
 * @module 		SIDE.Initialization
 * @submodule 	SIDE.application.initialization
 * @author 		Jean-Christophe Kermagoret
 * @constructor
 *
 * @TODO nested group = inheritance?
 * @TODO Groups are created at a global level and so should be prepended by
 * the site short name
 * @TODO The '_' char is used as a separator in group names which are based
 * on directories' names. This means it's not possible to have '_' in path
 * which is not a good idea. The '_' should be doubled to reduce future
 * problems
 */
SIDE.application.initialization.DirectoryTree = function(baseDir, tree, folders, applicationGroups) {
	this.baseDir = baseDir;
	this.tree = tree;
	this.folders = folders;
	this.groups = applicationGroups; // Those used by the workflow
};

/**
 * Initializes the organization browsing
 *
 * @method initialize
 * @returns {boolean}
 */
SIDE.application.initialization.DirectoryTree.prototype.initialize = function() {
  var result = true;
  for (childIdx in this.tree) {
    // We are processing direct children only
    var child = this.tree[childIdx];
    logger.log("Child name is: " + child.name);

    var parentPath = this.baseDir;
    //var parentPath = "/app:company_home/st:sites/cm:test/cm:documentLibrary";
    //var rootPath =  baseDir + "/cm:" + search.ISO9075Encode(child.name);
    var rootPath =  parentPath + "/cm:" + child.name;
    logger.log("Looking for root: " + rootPath);

    var nodes = SIDE.Alfresco.Helper.Folder.findOrCreateIfNotExists(rootPath);
    if (nodes.length > 0) {
      var baseGroupName = this.convertPathToGroupName(rootPath);
      people.createGroup(baseGroupName);
      nodes[0].setPermission("Read","GROUP_" + baseGroupName);
      // We immediately set inherits permissions to false
      // We are in an explicit strategy
      nodes[0].setInheritsPermissions(false);

      this.browse(nodes[0], child, parentPath + "/cm:" + nodes[0].name);
    } else {
      logger.log("root doesn't seem to exist and it seems there is a problem to create it. Can't go further. Sorry.");
      result = false;
    }
  }

  return result;
}

/**
 * Recursely browses the soft directory (corresponding to the organization)
 * and creates the real one in the same time. Once the soft directory hasn't
 * any more children, the application groups, folders and permissions are
 * set.
 *
 * Note that organization groups is just a structure which isn't in any ways
 * related to the formal idea of an entity. Your soft directory is simply
 * a tree!
 *
 * @method	browse
 * @param 	{nodeRef} hardDirectory the existing parent
 * @param 	{nodeRef} softDirectory the current object in the organization's
 * structure
 * @param 	{String} path
 * @returns
 */
SIDE.application.initialization.DirectoryTree.prototype.browse = function (hardDirectory, softDirectory, path) {
  SIDE.util.Logger.log("Browsingfolders");

  logger.log("Entering Browse function");
  logger.log("* path = " + path);
  if (softDirectory.children.length == 0) {
    // No children. We can start creating final folders and set permissions
    // We first create application final groups

    this.createApplicationFinalGroups(path)
    this.createFolders(hardDirectory);
    this.createPermissions(hardDirectory, path);
    logger.log("Permissions have been set.");
    return softDirectory;
  } else {
    for (f in softDirectory.children) {
      var child = softDirectory.children[f];
      logger.log("Looking for the -" + path + "/cm:" + child.name + "- folder.");

//      getFolderAndBrowseIt(hardDirectory, child, path + "/cm:" + hardDirectory.name);
      var nodes = SIDE.Alfresco.Helper.Folder.findOrCreateIfNotExists(path + "/cm:" + child.name);
      if (nodes != null && nodes != undefined && nodes.length > 0) {

        var baseGroupName = this.convertPathToGroupName(path + "/cm:" + nodes[0].name);
        var parentGroupName = baseGroupName.replace(/_[^_]*$/g,"");
        logger.log("******** parentGroupName: " + parentGroupName);

        try {
        	people.createGroup(baseGroupName);
        } catch (e) {
        	logger.log(baseGroupName + " already exists.");
        	logger.log(e);
        }

        try {
        	people.addAuthority(
        			people.getGroup("GROUP_" + parentGroupName),
        			people.getGroup("GROUP_" + baseGroupName)
        	);
        } catch (e) {
        	logger.log(baseGroupName + " can't be included in parentGroupName. Does it exist?");
        	logger.log(e);
        }

        nodes[0].setPermission("Read","GROUP_" + baseGroupName);
        nodes[0].setInheritsPermissions(false);
        logger.log(nodes[0].permissions);

        this.browse(nodes[0], child, path + "/cm:" + nodes[0].name);
      } else {
        logger.log(path + "/cm:" + child.name + " doesn't seem to exist and it seems there is a problem to create it. Can't go further. Sorry.");
      }
    }
  }
}

/**
Creates the permissions for the provided parent.

#### Directories' permissions

Permissions are created as a set of russian dolls. Imagine the
following directory structure:

	ACME
	  HR
	    Staffing
	    Training
	  Financial
	    Payroll
	    Accounting

Permissions will be created as a flattened structure:

	ACME
	ACME_HR
	ACME_HR_Staffing
	...
	ACME_Financial_Payroll
	...

And each group includes all the groups that start with its name. So:

	ACME includes ACME_HR and ACME_Financial
	ACME_HR includes ACME_HR_Staffing and ACME_HR_Training
	ACME_Financial includes ACME_Financial_Payroll and ACME_Financial_Accounting

From a security point of view, this way to manage permissions allows to
prevent users to browse directories not corresponding to those they
are not membership of. Explicit permissions are preferred to inheritance which may be dangerous
because of implicit behavior. In security, explicit rules can be viewed like
everything is denied by default.

#### Application permissions

This part tries to implement this kind of security matrix.

Beside this basic permission structure, you can refine it at the leaves
level with more appropriate basic rights corresponding to your application
requirements. The following rights are generated:

	NA: Nothing Available
	RO: Read Only

Else if you are a Drafter, you have Read/Write/CreateChildren (kind of RWC).
Otherwise you have Read rights (Kind of RO)

@method 	createPermissions
@param 	{nodeRef} parent is the directory for which permissions are going
to be created.
@param 	{String} path is the complete path corresponding to the parent
It should normally be deduced from the parent but a bug (?) prevented me to
achieve it, so I needed this path. Don't forget to update the doc if parent
is enough.
@returns
*/
SIDE.application.initialization.DirectoryTree.prototype.createPermissions = function(parent, path) {
  var baseGroupName = this.convertPathToGroupName(path);

  SIDE.util.Logger.log("Setting permissions for " + baseGroupName + " group on " + parent.name);

  for (j in this.folders) {
    var currentFolderName = this.folders[j]["name"];
    logger.log("=================================");
    logger.log("Setting permissions on " + currentFolderName + "\n");

    var currentFolder = SIDE.Alfresco.Helper.Search.findByChildName(currentFolderName, parent);
    var groupAndPerms = this.folders[j]["permissions"];
    if (currentFolder != null && currentFolder != undefined) {
      currentFolder.setInheritsPermissions(false);

      for (i in groupAndPerms) {
        var gap = groupAndPerms[i];
        logger.log("groupAndPerm value: " + gap);
        if (gap.indexOf("_RO") > -1) {
            // RO permissions set (Consumer == RO)
            var groupName = baseGroupName + "_" + gap.replace(/_RO$/g,"");
            currentFolder.setPermission("Read", "GROUP_" + groupName);
            logger.log(gap + ": Adds Read permission for -" + groupName + "- group on -" + currentFolder.name + "- folder.");
        } else if (gap.indexOf("_NA") > -1) {
            var groupName = baseGroupName + "_" + gap.replace(/_NA$/g,"");
            // NA permission which means nothing at all is accessible
            // currentFolder.setInheritsPermissions(false);
            //currentFolder.removePermission("SiteConsumer", "GROUP_" + gap);
            logger.log(gap + ": Removes READ permission for -" + groupName + "- group on -" + currentFolder.name + "- folder and sets inherits = false.");
        } else if (gap.indexOf("Drafters") > -1) {
            // Drafters. RW permission which means:
            // * Collaborator rights for Drafters: they can update and create folders
            var groupName = baseGroupName + "_" + gap;
            currentFolder.setPermission("Read", "GROUP_" + groupName);
            currentFolder.setPermission("Write", "GROUP_" + groupName);
            currentFolder.setPermission("CreateChildren", "GROUP_" + groupName);
            logger.log(gap + ": Adds Write and Create Children permission for -" + groupName + "- group on -" + currentFolder.name + "- folder.");
        } else {
            // FRO, SRO, EO
            // * Contributor rights for FRO/SRO/EO
            var groupName = baseGroupName + "_" +gap;
            currentFolder.setPermission("Read", "GROUP_" + groupName);
            currentFolder.setPermission("Write", "GROUP_" + groupName);
            logger.log(gap + ": Adds Write permission for -" + groupName + "- group on -" + currentFolder.name + "- folder");
        }

        // @TODO A SIDE.util.Logger.dump("sep") would be interesting
        var permStrings = currentFolder.permissions.toString().split(",");
        for (p in permStrings) {
          logger.log("* " + permStrings[p]);
        }
        logger.log("");
      }
    }
  }
}

/**
 * Creates the folders provided during DirectoryTree instanciation. This
 * corresponds to leaves in the directory tree.
 *
 * @method 	createFolder
 * @param 	{Object} parent is the directory under which will be created
 * the folders
 * @returns
 */
SIDE.application.initialization.DirectoryTree.prototype.createFolders = function(parent) {
  SIDE.util.Logger.log("Creating following folders into " + parent.name + " root.");

  for (j in this.folders) {
    // Switch beetween folder definition to alternate behavior
    //var folder = folders[j];
    var folder = this.folders[j]["name"];
    logger.log("Creating " + folder);
    try {
      var child = parent.createFolder(folder);
      logger.log(child.name + " created\n");
    } catch (e) {
      logger.log(e + "\n* " + folder + " can't be created because it already exists.\n");
    }
  }
}

/**
 * Creates the application groups for the current parent corresponding
 * to directory leaves
 *
 * @method createApplicationFinalGroups
 * @returns
*/
SIDE.application.initialization.DirectoryTree.prototype.createApplicationFinalGroups = function(parent) {
  var baseGroupName = this.convertPathToGroupName(parent);

  for (grp in this.groups) {
	  logger.log("Creating -" + baseGroupName + "_" + grp + "- group.");

	  try {
		  people.createGroup(baseGroupName + "_" + grp);
	  } catch (e) {
		  logger.log(e);
	  }

	  logger.log("-" + baseGroupName + "- group includes -" + baseGroupName + "_" + grp  +".");
	  try {
		  people.addAuthority(
			  people.getGroup("GROUP_" + baseGroupName),
			  people.getGroup("GROUP_" + baseGroupName + "_" + grp)
		  );
	  } catch (e) {
		  logger.log(e);
	  }

	  logger.log("-" + grp + "- group includes -" + baseGroupName + "_" + grp  +".");
	  try {
		  people.addAuthority(
			  people.getGroup("GROUP_" + grp),
			  people.getGroup("GROUP_" + baseGroupName + "_" + grp)
		  );
	  } catch (e) {
		  logger.log(e);
	  }
  }
}

/**
 * Converts path to a group name by removing all the Alfresco Share site
 * part (documentLibrary included). In fact, Group name corresponds to the relative
 * part of the path in a Share site from a user point of view.
 *
 */
SIDE.application.initialization.DirectoryTree.prototype.convertPathToGroupName = function(path) {
  var baseGroupName = path.replace(/^.*documentLibrary/g,"");
  baseGroupName = baseGroupName.replace(/\/[^:]*:/g,"_");
  baseGroupName = baseGroupName.replace(/^_/g,"");

  return baseGroupName;
}
