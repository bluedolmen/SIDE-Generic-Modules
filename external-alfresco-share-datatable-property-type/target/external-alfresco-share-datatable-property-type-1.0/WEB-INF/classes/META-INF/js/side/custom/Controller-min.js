var SIDE=SIDE||{};
SIDE.custom=SIDE.custom||{};
SIDE.custom.Controller=SIDE.custom.Controller||{};
SIDE.custom.Controller.dispatch=function(htmlId){var library={"SIDE.com.iminfo.kinedoc.Ouvrage.":function(){}};
var id=htmlId.replace(/_x002e_/g,"/");
var matches=null;
var property=null;
var association=null;
var pattern=/^.*prop_([^_]*)_(.*)_(.*)$/g;
matches=pattern.exec(id);
if(matches!=null){property={model:matches[1],clazz:matches[2].replace(/_/g,"."),name:matches[3]};
var fn=null;
try{fn="SIDE."+property.clazz+".on";
eval(fn)("created",property.name,htmlId)
}catch(e){var fn2=library[fn];
eval(fn2)
}}else{var pattern=/^.*_assoc_([^_]*)_([^A-Z]*[A-Z][^_]*)_([^_]*)_([^A-Z]*[A-Z][^_]*)$/g;
matches=pattern.exec(id);
if(matches!=null){association={model:matches[1],source:matches[2].replace(/_/g,"."),name:matches[3],target:matches[4].replace(/_/g,".")}
}}};
SIDE.custom.Controller.on=function(a){if(a.match(/Requisition_ch_unog_dcm_oime_its_Order/)){SIDE.custom.requisition.Order.on(a)
}};