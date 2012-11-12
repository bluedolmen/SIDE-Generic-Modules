(function(){var d=YAHOO.util.Dom;
var b=Alfresco.util.encodeHTML,f=Alfresco.util.combinePaths,g=Alfresco.util.siteURL;
Alfresco.FolderActions=function(h){Alfresco.FolderActions.superclass.constructor.call(this,"Alfresco.FolderActions",h,["button"]);
YAHOO.Bubbling.on("folderDetailsAvailable",this.onFolderDetailsAvailable,this);
return this
};
YAHOO.extend(Alfresco.FolderActions,Alfresco.component.Base);
YAHOO.lang.augmentProto(Alfresco.FolderActions,Alfresco.doclib.Actions);
YAHOO.lang.augmentObject(Alfresco.FolderActions.prototype,{options:{workingMode:Alfresco.doclib.MODE_SITE,siteId:"",containerId:"documentLibrary",replicationUrlMapping:{}},assetData:null,doclistMetadata:null,currentPath:null,getActionUrls:function c(h,l){var k=h.nodeRef,m=new Alfresco.util.NodeRef(k).uri,i=YAHOO.lang.isString(l)?{site:l}:null,j=Alfresco.util.bind(function(n){return Alfresco.util.siteURL(n,i)
},this);
return({editMetadataUrl:j("edit-metadata?nodeRef="+k),folderRulesUrl:j("folder-rules?nodeRef="+k),managePermissionsUrl:j("manage-permissions?nodeRef="+k),explorerViewUrl:f(this.options.repositoryUrl,"/n/showSpaceDetails/",m)+'" target="_blank',sourceRepositoryUrl:this.viewInSourceRepositoryURL(h)+'" target="_blank'})
},onFolderDetailsAvailable:function a(E,l){var D=this;
this.assetData=l[1].folderDetails;
this.doclistMetadata=l[1].metadata;
this.currentPath=this.assetData.location.path;
var m=this.assetData,k=d.get(this.id+"-actionSet"),t=m.actionSet,B=d.get(this.id+"-actionSet-"+t).cloneNode(true);
B.innerHTML=YAHOO.lang.substitute(window.unescape(B.innerHTML),this.getActionUrls(this.assetData));
k.innerHTML=B.innerHTML;
d.addClass(k,m.type);
if(m.permissions&&m.permissions.userAccess){var C=m.permissions.userAccess,o=m.actionLabels||{},p=YAHOO.util.Selector.query("div",k),u,h,n,x,r,w,z,q,v,y;
if(this.options.repositoryUrl){C.repository=true
}C.portlet=Alfresco.constants.PORTLET;
for(x=0,r=p.length;
x<r;
x++){u=p[x];
q=true;
v=u.firstChild;
y=v.firstChild;
if(y&&o[u.className]){y.innerHTML=b(o[u.className])
}if(v.rel!==""){h=v.rel.split(",");
for(w=0,z=h.length;
w<z;
w++){n=h[w];
if((n.charAt(0)=="~")?!!C[n.substring(1)]:!C[n]){q=false;
break
}}}d.setStyle(u,"display",q?"block":"none")
}}var A=function s(F,j){var i=YAHOO.Bubbling.getOwnerByTagName(j[1].anchor,"div");
if(i!==null){var G=i.className;
if(typeof D[G]=="function"){j[1].stop=true;
D[G].call(D,D.assetData,i)
}}return true
};
YAHOO.Bubbling.addDefaultAction("action-link",A);
this.modules.actions=new Alfresco.module.DoclibActions(this.options.workingMode)
},_onActionDeleteConfirm:function e(l){var m=l.location.path,h=l.displayName,k=new Alfresco.util.NodeRef(l.nodeRef),n=this.options.workingMode==Alfresco.doclib.MODE_SITE?"documentlibrary":"repository",j=m.length>1?"?path="+encodeURIComponent(m):"";
this.modules.actions.genericAction({success:{callback:{fn:function i(o){window.location=g(n+j)
}}},failure:{message:this.msg("message.delete.failure",h)},webscript:{method:Alfresco.util.Ajax.DELETE,name:"file/node/{nodeRef}",params:{nodeRef:k.uri}}})
}},true)
})();