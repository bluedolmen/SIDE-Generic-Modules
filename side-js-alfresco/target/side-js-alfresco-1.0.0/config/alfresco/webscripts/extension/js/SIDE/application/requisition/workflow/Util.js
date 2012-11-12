<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">

var Util = {};

Util.dump = function (file) {
	logger.log("Filename = " + file.name);
	logger.log("Parent directory = " + file.parent.name);
	for (var p in file.properties) {
		logger.log("file[" + p + "] = " + file.properties[p]);
	}
}

Util.move = function (bpm_package, target) {
	for (var i = 0; i &lt; bpm_package.children.length; i++) {
		var file = bpm_package.children[i];
		var parent = file.parent.parent;
		logger.log(parent.childByNamePath(parent.name));
		try {
			file.move(parent.childByNamePath(target));
		} catch (e) {
			logger.log("File " + file.name + " has not been moved into " + target + ".");
		}
	}
}
