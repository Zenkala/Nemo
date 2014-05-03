
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){console.log("slider!!!");var element=sym.$("theSlider");console.log(element);$("#starcrafts2_theSlider").attr("class","");$("#starcrafts2_theSlider").attr("style","");$("#starcrafts2_theSlider").slider();console.log("slider end");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2500,function(sym,e){sym.play(0);});
//Edge binding end
})("stage");
//Edge symbol end:'stage'
})(jQuery,AdobeEdge,"starcrafts2");