var Combo=Combo||{};
Combo.initMouseoverPanel=function(b,f,d){var h;
var g=document.getElementById(b);
var c=document.getElementById(f);
var a=new YAHOO.widget.Panel(f,{context:[b,"tl","bl"],width:"300px",draggable:false,visible:false,close:false,underlay:"shadow"});
a.render(document.body);
var e=function(){a.hide()
};
YAHOO.util.Event.addListener(g,"mouseover",function(i){a.align("tl","bl");
a.show();
if(h){clearTimeout(h)
}});
YAHOO.util.Event.addListener(c,"mouseover",function(i){if(h){clearTimeout(h)
}});
YAHOO.util.Event.addListener(g,"mouseout",function(i){if(h){clearTimeout(h)
}h=setTimeout(e,d)
});
YAHOO.util.Event.addListener(c,"mouseout",function(i){if(h){clearTimeout(h)
}h=setTimeout(e,d)
})
};