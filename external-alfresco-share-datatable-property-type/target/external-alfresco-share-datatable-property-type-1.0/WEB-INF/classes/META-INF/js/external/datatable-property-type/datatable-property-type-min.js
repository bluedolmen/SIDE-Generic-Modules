var DTP=DTP||{jsonProp:null,columnDefinitions:new Array(),readOnly:false,label:"Datatable property",init:function(e,c,a,b,d){this.dtConfig=c;
this.label=b;
this.events=d;
if(a=="view"){this.readOnly=true
}DTP.jsonProp=YAHOO.util.Dom.get(e);
DTP.drawDatatable(YAHOO.lang.trim(this.jsonProp.value))
},drawDatatable:function(jsonString){if(!jsonString||jsonString==""){jsonString="{}"
}var jsonData=eval("("+jsonString+")");
DTP.getTableDefinition();
var getMyKeys=function(){var columnsList=[];
for(var i=0;
i<DTP.columnDefinitions.length;
i++){var c=DTP.columnDefinitions[i];
if(c.type=="date"){columnsList.push({key:c.key,parser:"date"})
}else{columnsList.push(c.key)
}}return columnsList
};
var jsonSource=new YAHOO.util.DataSource(jsonData);
jsonSource.responseType=YAHOO.util.DataSource.TYPE_JSARRAY;
jsonSource.responseSchema={fields:getMyKeys()};
this.dtpDatatable=new YAHOO.widget.DataTable("dtp-dt",DTP.columnDefinitions,jsonSource);
DTP.datatableEvents()
},datatableEvents:function(){if(!DTP.readOnly){var a=DTP.dtpDatatable.getTheadEl().rows[0].cells.length-1;
this.newRowButton=DTP.dtpDatatable.getTheadEl().rows[0].cells[a];
var c=document.createElement("span");
c.innerHTML="+";
c.title="Add new row";
c.className="addButton";
YAHOO.util.Event.addListener(c,"click",function(h){var g={"delete":"-"};
var f=YAHOO.widget.DataTable._cloneObject(g);
DTP.dtpDatatable.addRow(f)
});
this.newRowButton.appendChild(c);
for(var b=0;
b<YAHOO.util.Dom.getElementsByClassName("delButton","td").length;
b++){var d=YAHOO.util.Dom.getElementsByClassName("delButton","td")[b];
d.innerHTML="<div class='yui-dt-liner'>-</div>"
}}this.highlightEditableCell=function(e){var f=e.target;
if(YAHOO.util.Dom.hasClass(f,"yui-dt-editable")){this.highlightCell(f)
}};
for(b=0;
b<this.events.length;
b++){this[this.events[b].name]=this.events[b].fn;
DTP.dtpDatatable.subscribe(this.events[b].name,this[this.events[b].name])
}DTP.dtpDatatable.subscribe("cellMouseoverEvent",this.highlightEditableCell);
DTP.dtpDatatable.subscribe("cellMouseoutEvent",DTP.dtpDatatable.onEventUnhighlightCell);
DTP.dtpDatatable.subscribe("editorSaveEvent",function(e){DTP.dtToJson()
});
DTP.dtpDatatable.subscribe("cellClickEvent",function(f){var g=f.target;
var e=DTP.dtpDatatable.getColumn(g);
if(e.key=="delete"){DTP.handleConfirm(g)
}else{DTP.dtpDatatable.onEventShowCellEditor(f)
}});
if(DTP.readOnly){DTP.dtpDatatable.subscribe("cellClickEvent",function(){DTP.popupDT()
});
DTP.tooltip=new YAHOO.widget.Tooltip("dtp-tooltip",{context:"dtp-dt",text:"Click on datagrid to popup!"})
}},handleConfirm:function(b){var c=function(){this.hide();
DTP.dtpDatatable.deleteRow(b);
DTP.dtToJson();
return true
};
var a=function(){this.hide();
return false
};
var d=new YAHOO.widget.SimpleDialog("DTPconfirmDialog",{width:"300px",fixedcenter:true,visible:false,draggable:false,close:true,text:"Are you sure you want to delete this row?",constraintoviewport:true,buttons:[{text:"Yes",handler:c,isDefault:true},{text:"No",handler:a}]});
d.setHeader("Delete row");
d.render(document.body);
d.show()
},popupDT:function(){var a=function(){YAHOO.util.Dom.get("dtContainer").appendChild(YAHOO.util.Dom.get("dtp-dt"));
DTP.dtpDatatable.subscribe("cellClickEvent",function(){DTP.popupDT()
});
this.hide();
return true
};
var b=new YAHOO.widget.SimpleDialog("dtDialog",{fixedcenter:true,visible:false,draggable:true,close:false,constraintoviewport:true,modal:true,buttons:[{text:"Close",handler:a,isDefault:true}]});
DTP.dtpDatatable.unsubscribe("cellClickEvent");
b.setHeader(DTP.label);
b.setBody(YAHOO.util.Dom.get("dtp-dt"));
b.render(document.body);
b.show()
},getTableDefinition:function(){var b=function(c){switch(c){case"currency":return YAHOO.widget.DataTable.formatCurrency;
break;
case"number":return YAHOO.widget.DataTable.formatNumber;
break;
case"date":return YAHOO.widget.DataTable.formatDate;
break;
default:return YAHOO.widget.DataTable.formatText;
break
}return c
};
var d=function(e,c){if(DTP.readOnly==true){return null
}switch(e){case"currency":return new YAHOO.widget.TextboxCellEditor();
break;
case"number":return new YAHOO.widget.TextboxCellEditor();
break;
case"date":return new YAHOO.widget.DateCellEditor();
break;
case"radio":return new YAHOO.widget.RadioCellEditor({radioOptions:c,disableBtns:true});
break;
case"checkbox":return new YAHOO.widget.CheckboxCellEditor({checkboxOptions:c});
break;
case"dropdown":return new YAHOO.widget.DropdownCellEditor({multiple:false,dropdownOptions:c});
break;
default:return new YAHOO.widget.TextboxCellEditor();
break
}};
DTP.dtConfig=h(DTP.dtConfig,["&quot;"]);
definition=DTP.dtConfig.split(";");
for(var j=0;
j<definition.length;
j++){var g=definition[j].split(",");
if(g&&g.length==3){definition[j]=[h(g[0]),h(g[1]),h(g[2]),null]
}else{if(g&&g.length>3){var a=[];
for(f=6;
f<g.length;
f++){a.push(h(g[f],["'","[","]"]))
}definition[j]=[h(g[0]),h(g[1]),h(g[2]),h(g[3]),h(g[4]),h(g[5]),a]
}else{}}}for(var f=0;
f<definition.length;
f++){var k=definition[f];
if(k[0]&&k[0]!=""){this.columnDefinitions.push({key:k[0],label:k[1],type:k[2],sortable:k[3]=="nosort"?false:true,resizeable:k[4]=="noresize"?false:true,readOnly:k[5]=="readonly"?true:false,formatter:b(k[2]),editor:k[5]=="readonly"?null:d(k[2],k[3])})
}}if(!this.readOnly){this.columnDefinitions.push({key:"delete",label:" ",className:"delButton"})
}function h(m,l){for(var e=0;
l!=null&&e<l.length;
e++){var c=l[e];
while(m.indexOf(c)!=-1){m=m.replace(c,"")
}}return YAHOO.lang.trim(m)
}},dtToJson:function(){var a=DTP.dtpDatatable.getRecordSet().getRecords();
var f=new Array();
for(var c=0;
c<a.length;
c++){var e=new Object();
var d=DTP.dtpDatatable.getColumnSet().keys;
for(var b=0;
b<d.length;
b++){e[d[b].getKey()]=a[c].getData(d[b].getKey())
}f.push(e)
}DTP.jsonProp.value=YAHOO.lang.JSON.stringify(f)
}};