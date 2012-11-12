<#assign viewFormat>${msg("form.control.date-picker.view.date.format")}</#assign>

<div class="form-field">
   <#assign controlId = fieldHtmlId + "-cntrl">

   <script type="text/javascript">//<![CDATA[
   (function()
   {
      new Alfresco.DateRange("${controlId}", "${fieldHtmlId}").setMessages(
         ${messages}
      );
   })();
   //]]></script>

   <label for="${controlId}">${field.label?html}:</label>

   <input id="${fieldHtmlId}" type="hidden" name="${field.name}-date-range" value="" />

   <div id="${controlId}" class="date-range">
		<span>${msg("form.control.date-range.from")}:</span>
		<#-- from date -->
		<input id="${controlId}-date-from" name="-" type="text" class="date-entry" <#if field.description??>title="${field.description}"</#if> tabindex="0" />
		<a id="${controlId}-icon-from"><img src="${url.context}/res/components/form/images/calendar.png" class="datepicker-icon" tabindex="0"/></a>
		<div id="${controlId}-from" class="datepicker"></div>

		<span>${msg("form.control.date-range.to")}:</span>
		<#-- to date -->
		<input id="${controlId}-date-to" name="-" type="text" class="date-entry" <#if field.description??>title="${field.description}"</#if> tabindex="0" />
		<a id="${controlId}-icon-to"><img src="${url.context}/res/components/form/images/calendar.png" class="datepicker-icon" tabindex="0"/></a>
		<div id="${controlId}-to" class="datepicker"></div>
</div>

</div>