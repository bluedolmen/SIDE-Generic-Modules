<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">

SIDE.define("SIDE.Alfresco.Group");

/**
 * This module provides helpers to make use of Alfresco features easier.
 * In a near future, these helpers may augment native Alfresco classes
 * so its use is transparent for developers and can be integrated into
 * existing applications without breaking anything.
 *
 * @module SIDE.Alfresco
 * @author Jean-Christophe Kermagoret
 */

/**
 * This class provides helpers to make Alfresco group
 * management easier. To augment group native Alfresco
 * should be a good idea.
 *
 * @class Group
 * @static
 */
SIDE.Alfresco.Group.create = function(groupName, description) {
  var group = null;
  try {
    group = people.createGroup(groupName);
    if (group == null) {
      group = SIDE.Alfresco.Group.get(groupName);
    }
    group.properties.authorityDisplayName = description;
    group.save();
    logger.log("Successful creation/update of the following group:\n* " + groupName + "\n* description:" + description);
  } catch (e) {
    logger.log(e + "\nAlreadyExistingGroup: Can't create " + groupName + " group");
    //throw "AlreadyExistingGroup: Can't create " + groupName + " group";
  }
}

SIDE.Alfresco.Group.get = function(groupName) {
  return people.getGroup("GROUP_" + groupName);
}
