<import resource="classpath:alfresco/webscripts/extension/js/SIDE/base.js">

SIDE.define("SIDE.application.requisition.bizrule.OrderFolder");

/**
 * Creates a folder with the name of the provided file.
 *
 * Other bizrules should have been put here instead of generating them
 * or importing them through the 'side' Alfresco Share site
 *
 * @class OrderFolder
 * @module SIDE.Procurement
 * @submodule SIDE.application.requisition.bizrule
 *
 * @author Jean-Christophe Kermagoret
 *
 */
SIDE.application.requisition.bizrule.OrderFolder.create = function(file) {
  // We first check there is not a parent folder with the same name
  // of the file, without the suffix extension
  logger.log("Original file: -" + file.name + ".");
  var filename = file.name.replace(".pdf", "");

  logger.log("New folder: -" + filename + ". Already exists?");
  var dir = file.parent.childByNamePath(filename);

  if (!dir) {
	logger.log("-" + filename + "- folder doesn't exist. Let's create it.");
    dir = file.parent.createFolder(filename);

    // We then move the file into it
    file.move(dir);
    logger.log("Finally, let's move the original file -" + file.name + "- to the just created -" + dir + "- folder.");
    file.name = "Order.pdf";
    logger.log("-" + file.name + "- renamed to Order.pdf");
    file.save();
  }

}

SIDE.application.requisition.bizrule.OrderFolder.create(document);
