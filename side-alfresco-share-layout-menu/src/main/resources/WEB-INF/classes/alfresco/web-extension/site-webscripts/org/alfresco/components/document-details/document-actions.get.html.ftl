<script type="text/javascript">//<![CDATA[
   new Alfresco.DocumentActions("${args.htmlid}").setOptions(
   {
      siteId: "${page.url.templateArgs.site!""}",
      containerId: "${template.properties.container!"documentLibrary"}",
      vtiServer: ${vtiServer},
      replicationUrlMapping: ${replicationUrlMappingJSON!"{}"}
   }).setMessages(
      ${messages}
   );

	// SIDE
    YAHOO.util.Event.onDOMReady(function() {
        Combo.initMouseoverPanel(
        	"show-actions-menu",
        	"${args.htmlid}-body",
        	250,
        	function () {
	            var actions = document.getElementById("${args.htmlid}-actionSet");
        	    YAHOO.util.Dom.setStyle(actions, "visibility", "hidden");
    	    },
        	function () {
	            var actions = document.getElementById("${args.htmlid}-actionSet");
        	    YAHOO.util.Dom.setStyle(actions, "visibility", "visible");
	       }
        )
    });

//]]></script>

<!-- SIDE + following hidden so by default menu is hidden -->
<a href="#" id="show-actions-menu">Actions</a>

<div id="${args.htmlid}-body" class="document-actions">

   <div class="heading">${msg("heading")}</div>
   <div class="doclist">
      <div id="${args.htmlid}-actionSet" class="action-set"></div>
   </div>

   <!-- Action Set Templates -->
   <!-- div style="display:none" -->
   <div style="display:none">
<#list actionSets?keys as key>
   <#assign actionSet = actionSets[key]>
      <div id="${args.htmlid}-actionSet-${key}" class="action-set" style="visibility: inherit">
   <#list actionSet as action>
         <div class="${action.id}"><a rel="${action.permission!""}" href="${action.href}" class="${action.type}" title="${msg(action.label)}"><span>${msg(action.label)}</span></a></div>
   </#list>
      </div>
</#list>
   </div>

</div>