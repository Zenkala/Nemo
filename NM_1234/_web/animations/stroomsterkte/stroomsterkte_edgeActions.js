
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindSymbolAction(compId,symbolName,"creationComplete",function(sym,e){console.log("doing stuff2");sym.setFlag2=function(givenValue)
{console.log("setting flag2 to: "+givenValue);sym.flag2=givenValue;}
console.log("doing stuff");sym.setFlag=function(givenValue)
{console.log("setting flag to: "+givenValue);sym.flag=givenValue;}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",5250,function(sym,e){sym.play("loop");});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1750,function(sym,e){console.log("word");if(sym.flag==true)
{sym.stop();}});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",4500,function(sym,e){if(sym.flag2==true){sym.stop();}});
//Edge binding end
})("stage");
//Edge symbol end:'stage'

//=========================================================

//Edge symbol: 'magnet'
(function(symbolName){})("magnet");
//Edge symbol end:'magnet'

//=========================================================

//Edge symbol: 'wijzer'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",1000,function(sym,e){sym.stop();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",2000,function(sym,e){sym.stop()});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3000,function(sym,e){sym.stop();});
//Edge binding end
})("wijzer");
//Edge symbol end:'wijzer'
})(jQuery,AdobeEdge,"stroomsterkte");