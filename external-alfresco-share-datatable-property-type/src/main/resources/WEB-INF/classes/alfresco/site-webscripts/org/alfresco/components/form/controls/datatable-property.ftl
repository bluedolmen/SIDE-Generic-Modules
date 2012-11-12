<#--
	Title  : Datatable property type for Alfresco Share
	Author : Matija Svoren, msvoren@gmail.com
	Version: 1.0
-->

<link rel="stylesheet" type="text/css" href="${url.context}/yui/datatable/assets/skins/sam/datatable.css" />
<script type="text/javascript" src="${url.context}/yui/datasource/datasource-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/2.8.2r1/build/datatable/datatable-min.js"></script>
<#--script type="text/javascript" src="${url.context}/yui/datatable/datatable-min.js"></script-->
<script type="text/javascript" src="${url.context}/res/js/external/datatable-property-type/datatable-property-type-min.js"></script>

<style>
.delButton {
	font-size:14px; font-wight:strong; color:red;
	width: 16px;  height: 16px; cursor: pointer;
}
.addButton {
	font-size:14px; font-wight:strong; color:blue; padding: 7px;
	cursor: pointer;
}
</style>

<#if field.control.params.config?exists><#assign dtConfig = field.control.params.config><#else><#assign dtConfig = "false"></#if>
<#if field.control.params.events?exists><#assign events = field.control.params.events><#else>  <#assign events = "[]">  </#if>
<#if field.control.params.debug?exists> <#assign debug = field.control.params.debug><#else>    <#assign debug = "false">   </#if>

<#if field??>
	<label for="${fieldHtmlId}">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
	<textarea id="${fieldHtmlId}" name="${field.name}"  rows="5" cols="250"
		<#if field.control.params.styleClass?exists>class="${field.control.params.styleClass}"</#if>
		<#if debug == "false">style="display: none; height:0px;"<#else>type="text"</#if>
	 >${field.value}
	</textarea>

	<div id="dtContainer">
		<div class="yui-skin-sam" id="dtp-dt"></div>
	</div>
</#if>

<script type="text/javascript">//<![CDATA[

	YAHOO.util.Event.onAvailable('${fieldHtmlId}', function() {
		DTP.init("${fieldHtmlId}", "${dtConfig?html}", "${form.mode}", "${field.label?html}", ${events?html});
	}, this);

//]]></script>
