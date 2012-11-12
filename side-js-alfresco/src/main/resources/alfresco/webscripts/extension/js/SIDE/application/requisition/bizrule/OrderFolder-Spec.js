/**
 * Creates a folder with the name of the provided file.
 */

  for (f in space.children) {
    var file = space.children[f];
    if (file.name.indexOf(".pdf") != -1) {
      logger.log(file.name);
      SIDE.requisition.bizrule.OrderFolder.create();
    }
  }

function testCreateParentFolder() {
  var root = space.childByNamePath("Test");
  logger.log("Root: " + root);

  var orderName = "Beer order";
  var order = root.childByNamePath(orderName + ".pdf");

  File.createParentFolder(order);
}
