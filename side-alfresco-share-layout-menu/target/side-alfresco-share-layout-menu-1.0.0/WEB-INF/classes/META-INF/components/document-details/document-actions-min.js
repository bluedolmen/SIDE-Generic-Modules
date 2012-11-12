(function(){var f=YAHOO.util.Dom;
var c=Alfresco.util.encodeHTML,d=Alfresco.util.combinePaths,e=Alfresco.util.siteURL;
Alfresco.DocumentActions=function(n){Alfresco.DocumentActions.superclass.constructor.call(this,"Alfresco.DocumentActions",n,["button"]);
YAHOO.Bubbling.on("documentDetailsAvailable",this.onDocumentDetailsAvailable,this);
return this
};
YAHOO.extend(Alfresco.DocumentActions,Alfresco.component.Base);
YAHOO.lang.augmentProto(Alfresco.DocumentActions,Alfresco.doclib.Actions);
YAHOO.lang.augmentObject(Alfresco.DocumentActions.prototype,{options:{workingMode:Alfresco.doclib.MODE_SITE,siteId:"",containerId:"documentLibrary",inlineEditMimetypes:{"text/plain":true,"text/html":true,"text/xml":true},vtiServer:{},replicationUrlMapping:{}},assetData:null,doclistMetadata:null,currentPath:null,getActionUrls:function k(n,s){var q=n.nodeRef,r=n.custom||{},o=YAHOO.lang.isString(s)?{site:s}:null,p=Alfresco.util.bind(function(t){return Alfresco.util.siteURL(t,o)
},this);
return({downloadUrl:Alfresco.constants.PROXY_URI+n.contentUrl+"?a=true",viewUrl:Alfresco.constants.PROXY_URI+n.contentUrl+'" target="_blank',viewGoogleDocUrl:r.googleDocUrl+'" target="_blank',documentDetailsUrl:p("document-details?nodeRef="+q),editMetadataUrl:p("edit-metadata?nodeRef="+q),inlineEditUrl:p("inline-edit?nodeRef="+q),managePermissionsUrl:p("manage-permissions?nodeRef="+q),workingCopyUrl:p("document-details?nodeRef="+(r.workingCopyNode||q)),originalUrl:p("document-details?nodeRef="+(r.workingCopyOriginal||q)),sourceRepositoryUrl:this.viewInSourceRepositoryURL(n)+'" target="_blank'})
},onDocumentDetailsAvailable:function h(N,p){var M=this;
this.assetData=p[1].documentDetails;
this.doclistMetadata=p[1].metadata;
this.currentPath=this.assetData.location.path;
var v=this.assetData,o=f.get(this.id+"-actionSet"),C=v.actionSet,K=f.get(this.id+"-actionSet-"+C).cloneNode(true),u=Alfresco.constants.PROXY_URI+v.contentUrl+"?a=true",t=v.displayName;
K.innerHTML=YAHOO.lang.substitute(window.unescape(K.innerHTML),this.getActionUrls(this.assetData));
o.innerHTML=K.innerHTML;
f.addClass(o,v.type);
if(v.permissions&&v.permissions.userAccess){var L=v.permissions.userAccess,x=v.actionLabels||{},z=YAHOO.util.Selector.query("div",o),D,n,w,G,B,F,I,A,E,H;
if(v.mimetype in this.options.inlineEditMimetypes){L["inline-edit"]=true
}L.portlet=Alfresco.constants.PORTLET;
if(YAHOO.env.ua.ie>0&&this.options.vtiServer&&typeof this.options.vtiServer.port=="number"&&this.doclistMetadata.onlineEditing&&v.mimetype in this.onlineEditMimetypes){var y=v.location;
v.onlineEditUrl=window.location.protocol.replace(/https/i,"http")+"//"+this.options.vtiServer.host+":"+this.options.vtiServer.port+"/"+d("alfresco",y.site,y.container,y.path,y.file);
L["online-edit"]=true
}for(G=0,B=z.length;
G<B;
G++){D=z[G];
A=true;
E=D.firstChild;
H=E.firstChild;
if(H&&x[D.className]){H.innerHTML=c(x[D.className])
}if(E.rel!==""){n=E.rel.split(",");
for(F=0,I=n.length;
F<I;
F++){w=n[F];
if((w.charAt(0)=="~")?!!L[w.substring(1)]:!L[w]){A=false;
break
}}}f.setStyle(D,"display",A?"block":"none")
}}var J=function r(Q,P){var O=YAHOO.Bubbling.getOwnerByTagName(P[1].anchor,"div");
if(O!==null){var R=O.className;
if(typeof M[R]=="function"){P[1].stop=true;
M[R].call(M,M.assetData,O)
}}return true
};
YAHOO.Bubbling.addDefaultAction("action-link",J);
this.modules.actions=new Alfresco.module.DoclibActions(this.options.workingMode);
if(window.location.hash=="#editOffline"){window.location.hash="";
if(YAHOO.env.ua.ie>6){Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.edit-offline.success",t),text:this.msg("message.edit-offline.success.ie7"),buttons:[{text:this.msg("button.download"),handler:function q(){window.location=u;
this.destroy()
},isDefault:true},{text:this.msg("button.close"),handler:function s(){this.destroy()
}}]})
}else{Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-offline.success",t)});
YAHOO.lang.later(3000,this,function(){window.location=u
})
}}if(window.location.hash=="#editCancelled"){window.location.hash="";
Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-cancel.success",t)})
}if(window.location.hash=="#checkoutToGoogleDocs"){window.location.hash="";
Alfresco.util.PopupManager.displayMessage({text:this.msg("message.checkout-google.success",t)})
}if(window.location.hash=="#checkinFromGoogleDocs"){window.location.hash="";
Alfresco.util.PopupManager.displayMessage({text:this.msg("message.checkin-google.success",t)})
}},onActionEditOffline:function b(p){var n=p.displayName,o=new Alfresco.util.NodeRef(p.nodeRef);
this.modules.actions.genericAction({success:{callback:{fn:function q(r){this.assetData.nodeRef=r.json.results[0].nodeRef;
window.location=this.getActionUrls(this.assetData).documentDetailsUrl+"#editOffline"
},scope:this}},failure:{message:this.msg("message.edit-offline.failure",n)},webscript:{method:Alfresco.util.Ajax.POST,name:"checkout/node/{nodeRef}",params:{nodeRef:o.uri}}})
},onActionCancelEditing:function i(q){var n=q.displayName,p=new Alfresco.util.NodeRef(q.nodeRef);
this.modules.actions.genericAction({success:{callback:{fn:function o(r){this.assetData.nodeRef=r.json.results[0].nodeRef;
window.location=this.getActionUrls(this.assetData).documentDetailsUrl+"#editCancelled"
},scope:this}},failure:{message:this.msg("message.edit-cancel.failure",n)},webscript:{method:Alfresco.util.Ajax.POST,name:"cancel-checkout/node/{nodeRef}",params:{nodeRef:p.uri}}})
},onActionUploadNewVersion:function j(r){var o=r.displayName,q=new Alfresco.util.NodeRef(r.nodeRef),n=r.version;
if(!this.fileUpload){this.fileUpload=Alfresco.getFileUploadInstance()
}var t=this.msg("label.filter-description",o),p="*";
if(o&&new RegExp(/[^\.]+\.[^\.]+/).exec(o)){p="*"+o.substring(o.lastIndexOf("."))
}if(r.custom&&r.custom.workingCopyVersion){n=r.custom.workingCopyVersion
}var s={updateNodeRef:q.toString(),updateFilename:o,updateVersion:n,suppressRefreshEvent:true,overwrite:true,filter:[{description:t,extensions:p}],mode:this.fileUpload.MODE_SINGLE_UPDATE,onFileUploadComplete:{fn:this.onNewVersionUploadCompleteCustom,scope:this}};
if(this.options.workingMode==Alfresco.doclib.MODE_SITE){s.siteId=this.options.siteId;
s.containerId=this.options.containerId
}this.fileUpload.show(s)
},onNewVersionUploadCompleteCustom:function a(n){this.onNewVersionUploadComplete.call(this,n);
this.assetData.nodeRef=n.successful[0].nodeRef;
YAHOO.lang.later(0,this,function(){window.location=this.getActionUrls(this.assetData).documentDetailsUrl
})
},onActionCheckoutToGoogleDocs:function g(q){var n=q.displayName,p=new Alfresco.util.NodeRef(q.nodeRef),r=q.location.path,u=q.fileName;
var t=Alfresco.util.PopupManager.displayMessage({displayTime:0,effect:null,text:this.msg("message.checkout-google.inprogress",n)});
this.modules.actions.genericAction({success:{callback:{fn:function s(v){this.assetData.nodeRef=v.json.results[0].nodeRef;
window.location=this.getActionUrls(this.assetData).documentDetailsUrl+"#checkoutToGoogleDocs"
},scope:this},activity:{siteId:this.options.siteId,activityType:"google-docs-checkout",page:"document-details",activityData:{fileName:u,path:r,nodeRef:p.toString()}}},failure:{callback:{fn:function o(v){t.destroy();
Alfresco.util.PopupManager.displayMessage({text:this.msg("message.checkout-google.failure",n)})
},scope:this}},webscript:{method:Alfresco.util.Ajax.POST,name:"checkout/node/{nodeRef}",params:{nodeRef:p.uri}}})
},onActionCheckinFromGoogleDocs:function l(r){var t=r.displayName,u=new Alfresco.util.NodeRef(r.nodeRef),o=new Alfresco.util.NodeRef(r.custom.workingCopyOriginal),v=r.location.path,q=r.fileName;
var s=Alfresco.util.PopupManager.displayMessage({displayTime:0,effect:null,text:this.msg("message.checkin-google.inprogress",t)});
this.modules.actions.genericAction({success:{callback:{fn:function n(w){this.assetData.nodeRef=w.json.results[0].nodeRef;
window.location=this.getActionUrls(this.assetData).documentDetailsUrl+"#checkinFromGoogleDocs"
},scope:this},activity:{siteId:this.options.siteId,activityType:"google-docs-checkin",page:"document-details",activityData:{fileName:t,path:v,nodeRef:o.toString()}}},failure:{fn:function p(w){s.destroy();
Alfresco.util.PopupManager.displayMessage({text:this.msg("message.checkin-google.failure",t)})
},scope:this},webscript:{method:Alfresco.util.Ajax.POST,name:"checkin/node/{nodeRef}",params:{nodeRef:u.uri}}})
},_onActionDeleteConfirm:function m(r){var s=r.location.path,u=r.fileName,n=r.displayName,q=new Alfresco.util.NodeRef(r.nodeRef),t=this.options.workingMode==Alfresco.doclib.MODE_SITE?"documentlibrary":"repository",o=s.length>1?"?path="+encodeURIComponent(s):"";
this.modules.actions.genericAction({success:{activity:{siteId:this.options.siteId,activityType:"file-deleted",page:"documentlibrary",activityData:{fileName:u,path:s,nodeRef:q.toString()}},callback:{fn:function p(v){window.location=e(t+o)
}}},failure:{message:this.msg("message.delete.failure",n)},webscript:{method:Alfresco.util.Ajax.DELETE,name:"file/node/{nodeRef}",params:{nodeRef:q.uri}}})
}},true)
})();