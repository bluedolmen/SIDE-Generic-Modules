<#assign viewFormat>${msg("form.control.date-picker.view.date.format")}</#assign>

<div class="form-field">
   <#assign controlId = fieldHtmlId + "-cntrl">

   <script type="text/javascript">//<![CDATA[
   (function()
   {
      new Alfresco.NumberRange("${controlId}", "${fieldHtmlId}").setMessages(
         ${messages}
      );
   })();
   //]]></script>

   <label for="${controlId}">${field.label?html}:</label>

   <input id="${fieldHtmlId}" type="hidden" name="${field.name}-range" value="" />

   <div id="${controlId}" class="number-range">
  		<#if field.control.params.ui?? && field.control.params.ui == "nospan">
            <#-- min value -->
            <input id="${controlId}-min" name="-" type="text" class="number" <#if field.description??>title="${field.description}"</#if> tabindex="0"
            	title="${msg("form.control.range.min")}"
            	value="${msg("form.control.range.min")}"/>

            <#-- max value -->
            <input id="${controlId}-max" name="-" type="text" class="number" <#if field.description??>title="${field.description}"</#if> tabindex="1"
            	title="${msg("form.control.range.max")}"
            	value="${msg("form.control.range.max")}"
            	/>
        <#else>
            <span>${msg("form.control.range.min")}:</span>
            <#-- min value -->
            <input id="${controlId}-min" name="-" type="text" class="number" <#if field.description??>title="${field.description}"</#if> tabindex="0" />
            <span>${msg("form.control.range.max")}:</span>
            <#-- max value -->
            <input id="${controlId}-max" name="-" type="text" class="number" <#if field.description??>title="${field.description}"</#if> tabindex="1" />
		</#if>
   </div>

</div>