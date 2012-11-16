<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">

SIDE.define("SIDE.Alfresco.People");

/**
 * This is a test to augment through people renaming in peopleAlfresco and
 * people inheriting from it
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/NoSuchMethod
 *
 * @author Jean-Christophe Kermagoret
 *
 * @class People
 * @static
 *
 */

/**
 * All the methods available in the native people object are also available
 * through the __noSuchMethod__ mechanism
 *
 * @method all
 * @returns The returned native result
 */
SIDE.Alfresco.People.__noSuchMethod__ = function(a) {
	logger.log("NoSuchMethod -" + arguments[0] + "- on SIDE.Alfresco.People or People.");
    logger.log("Calling parent object -people- with following parameter: -" + arguments[1] + "-.");

	return eval("people." + a).apply(people, arguments[1]);
}

SIDE.Alfresco.People.uber = function(m) {
	if (m == null) {
		return people;
	} else {
		return eval("people." + m);
	}
}

/**
 * This method is transmitted in a second time to the people object
 * @method getPerson
 */
SIDE.Alfresco.People.getPerson = function() {
	// for (p in this) { logger.log(p + " " + this[p]) };
	logger.log(arguments.callee.name);
	// return people.getPerson.apply(people, arguments);
	return SIDE.Alfresco.People.uber("getPerson").apply(people, (arguments));
}

var People = SIDE.Alfresco.People;