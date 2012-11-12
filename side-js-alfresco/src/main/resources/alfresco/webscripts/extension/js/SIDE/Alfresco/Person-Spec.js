<import resource="classpath:alfresco/webscripts/extension/js/SIDE/Alfresco/Person.js">

logger.log("Deleting mlamenace");
people.deletePerson("mlamenace");
var m = people.getPerson("mlamenace");
if (m) {
  for (p in m.properties) {
    logger.log(p + " = " + m.properties[p]);
  }
}

