var SIDE=SIDE||{};
SIDE.Util={FORM_PREFIX:"template_x002e_formPortlet_x002e_standalonecreateform",EDIT_PREFIX:"template_x002e_edit-metadata_x002e_edit-metadata",DIRECT_PREFIX:"template_x002e_create-content_x002e_create-content",formatCurrency:function(a){return YAHOO.util.Number.format(a,{prefix:"$",decimalPlaces:2,thousandsSeparator:","})
},getElementById:function(d){var c=[SIDE.Util.FORM_PREFIX,SIDE.Util.EDIT_PREFIX,SIDE.Util.DIRECT_PREFIX];
for(var b=0;
b<c.length;
b++){var a=YAHOO.util.Dom.get(c[b]+"_"+d);
if(a){return a
}var a=YAHOO.util.Dom.get(c[b]+"_prop_"+d);
if(a){return a
}}},getFloatById:function(a){return parseFloat(SIDE.Util.getElementById(a).value)
},getElementId:function(a){return SIDE.Util.getElementById(a).id
}};