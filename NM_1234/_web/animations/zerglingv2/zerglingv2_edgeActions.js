
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindTimelineAction(compId,symbolName,"Default Timeline","play",function(sym,e){});
//Edge binding end
})("stage");
//Edge symbol end:'stage'

//=========================================================

//Edge symbol: 'zergling'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",400,function(sym,e){sym.play("Run");});
//Edge binding end
})("zergling");
//Edge symbol end:'zergling'
})(jQuery,AdobeEdge,"zerglingv2");