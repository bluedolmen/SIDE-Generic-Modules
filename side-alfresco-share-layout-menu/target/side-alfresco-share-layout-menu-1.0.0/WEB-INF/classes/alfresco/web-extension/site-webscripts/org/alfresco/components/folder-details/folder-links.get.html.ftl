<#assign el=args.htmlid?html>
<script type="text/javascript">//<![CDATA[
   new Alfresco.FolderLinks("${el}").setOptions(
   {
      <#if repositoryUrl??>repositoryUrl: "${repositoryUrl}",</#if>
      externalAuth: ${externalAuth?string("true", "false")}
   }).setMessages(${messages});

   // SIDE
   YAHOO.util.Event.onDOMReady(function() {
        Combo.initMouseoverPanel(
        	"show-links-menu", "${el}-body", 250
	   )
    });

//]]></script>

<!-- SIDE + following hidden so by default menu is hidden -->
<a href="#" id="show-links-menu">Partage</a>

<div id="${el}-body" class="folder-links">

	<div class="heading">${msg("folder-links.heading")}</div>

<#if repositoryUrl??>
   <!-- webdav link -->
   <div id="${el}-webdav" class="hidden">
      <div class="url-title"><label for="${el}-webdav-url">${msg("folder-links.webdav")}</label></div>
      <input id="${el}-webdav-url" class="link-value" />
      <input id="${el}-webdav-button" type="button" class="copy-button" value="${msg("folder-links.copy")}" />
   </div>
</#if>

   <#-- cifs link (N/A)
   <div id="${el}-cifs" class="hidden">
      <div class="url-title"><label for="${el}-cifs-url">${msg("folder-links.cifs")}</label></div>
      <input id="${el}-cifs-url" class="link-value" />
      <input id="${el}-cifs-button" type="button" class="copy-button" value="${msg("folder-links.copy")}" />
   </div> -->

   <!-- page link -->
   <div id="${el}-page">
   	<div class="url-title"><label for="${el}-page-url">${msg("folder-links.page")}</label></div>
   	<input id="${el}-page-url" class="link-value" />
   	<input id="${el}-page-button" type="button" class="copy-button" value="${msg("folder-links.copy")}" />
   </div>

</div>