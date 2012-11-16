<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">
<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Helper/Search.js">

SIDE.define("SIDE.Alfresco.Person");
/**
 * This class is a very light design of the Person concept
 * Ideally, it should have augmented the person object provided by Alfresco
 * but it doesn't seem to be possible
 *
 * @class Person
 * @author Jean-Christophe Kermagoret
 *
 */
SIDE.Alfresco.Person.__noSuchMethod__ = function(a) {
  eval("people." + a).apply(eval("people"), arguments[1]);
}

SIDE.Alfresco.Person.uber = function(a) {
  return eval("people");
}

SIDE.Alfresco.Person.createUser = function(uid, firstName, lastName, email, password, activate, location, title) {
  var user = null;
  try {
    user = people.createPerson(uid, firstName, lastName, email, password, true);
    user.properties["cm:location"] = location + "";
    user.properties["cm:jobtitle"] = title + "";
    user.save();
  } catch (e) {
	logger.log("AlreadyExistingPerson? Can't create " + uid + " user");
	logger.log(e);
    //throw "AlreadyExistingPerson: Can't create " + uid + " user";
  }

  logger.log("Looking for " + "people-" + uid + ".png to set as avatar for " + uid);
  try {
    SIDE.Alfresco.Person.addAvatar(uid, "people-" + uid + ".png");
  } catch (e) {
    logger.log("people-" + uid + ".png doesn't seem to exist. Can't be set as avatar for " + uid);
  }
};

/**
 * Based on http://www.techbits.de/2011/12/02/using-the-javascript-console-creating-users-with-avatar-images/
 *
 */
SIDE.Alfresco.Person.addAvatars = function(space) {
  for each (imageNode in space.children) {
    var name = "" + imageNode.name;  // convert to javascript string
    name = name.replace(/\..*/, ""); // remove file extension
  }
}

SIDE.Alfresco.Person.addAvatar = function(name, _avatarName) {
  var user = people.getPerson(name);
  var imagesPath = "/";

  var avatarName = null;
  if (_avatarName == null) {
    avatarName = search.ISO9075Encode(name);
  } else {
    avatarName = search.ISO9075Encode(_avatarName);
  }

  var imageNode = null;
  logger.log("Looking for: " + imagesPath + "/cm:" + avatarName);
  var imageNodes = SIDE.Alfresco.Helper.Search.find(imagesPath + "/cm:" + avatarName);
  if (imageNodes == null || imageNodes == undefined || imageNodes.length == 0) {
    throw "NotExistingContent: " + imagesPath + "/cm:" + avatarName;
  } else {
    imageNode = imageNodes[0];
  }

  if (user) {
    var avatarAssoc = user.assocs["cm:avatar"];

    if (avatarAssoc) {
      var currentAvatar = avatarAssoc[0];

      if (("" + imageNode.nodeRef) != ("" + currentAvatar.nodeRef)) {
        logger.log("changing avatar for " + name + " to " + imageNode.displayPath + "/" + imageNode.name);
        user.removeAssociation(currentAvatar, "cm:avatar");
        user.createAssociation(imageNode, "cm:avatar");
      } else {
        logger.log("no change for user " + name);
      }
    } else {
        logger.log("setting new avatar for " + name + " to " + imageNode.displayPath + "/" + imageNode.name);
        user.createAssociation(imageNode, "cm:avatar");
    }
  }
}

