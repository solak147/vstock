import{_ as z,p as P,H as V,r as S,a as L,c as A,w as E,e as K,q as T,z as U,E as u,G as x,u as F,I as y,j as m,t as b,J as j,x as D,K as H}from"./index-C-OveHRR.js";import{T as N,E as G}from"./index-C3pTOFXm.js";const O={class:"index"},Z={class:"flex ml-10 bolder fz-18"},g="#FF5B5B",I="#ff3737",v="#91F840",k="#6fda1a",R={__name:"index",setup(W){P(N,"dark");const t=V(),f=S(null),a=L({data:{list:[],volume:[],trend:[],category:[],openPrice:"",closePrice:"",priceUp:"",percent:"",width:"",isBig:!1,currentSel:"走勢"}}),h=A(()=>({red:a.data.closePrice>t.info.data.previousClose,green:a.data.closePrice<t.info.data.previousClose})),$=S(null);E(()=>t.candles.data,()=>{C(),w()},{deep:!0}),K(async()=>{Object.keys(t.candles.data).length===0||Object.keys(t.info.data).length===0||(C(),w())});const w=()=>{a.data.priceUp=(a.data.closePrice-t.info.data.previousClose).toFixed(2),a.data.percent=(a.data.priceUp/t.info.data.previousClose*100).toFixed(2),a.data.width=f.value.getWidth()},C=()=>{a.data.list=t.candles.data.data.map(e=>[e.open,e.close,e.low,e.high]),a.data.trend=t.candles.data.data.map(e=>({value:[_(e.date),e.close]}));let r;a.data.volume=t.candles.data.data.map((e,s)=>{let l=1;return r&&(e.close>r?l=1:l=-1),r=e.close,[s,e.volume,l]}),a.data.category=t.candles.data.data.map(e=>_(e.date)),a.data.closePrice=a.data.list[a.data.list.length-1][1],a.data.openPrice=a.data.list[0][0],$.value={backgroundColor:"#131313",title:{text:"即時走勢",left:10,top:10,bottom:10,textStyle:{fontSize:16,fontWeight:"normal"}},tooltip:{trigger:"axis",axisPointer:{type:"cross"},backgroundColor:"rgba(0,0,0,0.3)",textStyle:{color:"#FFF"},formatter:function(e){let s=e.filter(c=>c.seriesIndex==0)[0],l=e.filter(c=>c.seriesIndex==1)[0],p=e.filter(c=>c.seriesIndex==2)[0],n,o,d;return s?(n=a.data.list[s.dataIndex-1]?a.data.list[s.dataIndex-1][1]:t.info.data.previousClose,o=(s.value[2]-n).toFixed(2),d=(o/n*100).toFixed(2),`<div style=" text-align: left;">
                            ${e[0].name} <br/>
                            <span style="color:${i(s.value[1],n)}">開 :<span style="margin-left: 20px">${s.value[1]}</span></span><br/>
                            <span style="color:${i(s.value[2],n)}">收 :<span style="margin-left: 20px">${s.value[2]}</span></span><br/>
                            <span style="color:${i(s.value[3],n)}">低 :<span style="margin-left: 20px">${s.value[3]}</span></span><br/>
                            <span style="color:${i(s.value[4],n)}">高 :<span style="margin-left: 20px">${s.value[4]}</span></span><br/> 
                            <span style="color:${i(o)}">${o>0?"漲":"跌"} :<span style="margin-left: 20px">${o>0?"+"+o:o}</span></span><br/>
                            <span style="color:${i(o)}">幅 :<span style="margin-left: 20px">${o>0?"+"+d:d}%</span></span><br/>
                            量 :<span style="margin-left: 20px">${(l.value[1]/1e8).toFixed(3)}億元</span><br/> 
                        </div>`):(n=t.info.data.previousClose,o=(p.value[1]-n).toFixed(2),d=(o/n*100).toFixed(2),`<div style=" text-align: left;">
                            ${e[0].name} <br/>
                            <span style="color:${i(p.value[1],t.info.data.previousClose)}">價 :<span style="margin-left: 20px">${p.value[1]}</span></span><br/>
                            <span style="color:${i(o)}">${o>0?"漲":"跌"} :<span style="margin-left: 20px">${o>0?"+"+o:o}</span></span><br/>
                            <span style="color:${i(o)}">幅 :<span style="margin-left: 20px">${o>0?"+"+d:d}%</span></span><br/>
                            量 :<span style="margin-left: 20px">${(l.value[1]/1e8).toFixed(3)}億元</span><br/> 
                        </div>`)},position:function(e,s,l,p,n){const o={top:10};return o[["left","right"][+(e[0]<n.viewSize[0]/2)]]=30,o}},axisPointer:{link:[{xAxisIndex:"all"}],label:{backgroundColor:"#777"}},toolbox:{show:!0,top:10,right:10,feature:{mytooo:{show:!0,title:"Custom Button",icon:"path://m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64z",onclick:function(){f.value.resize({width:a.data.isBig?a.data.width:1500}),a.data.isBig=!a.data.isBig}}}},dataZoom:[{type:"inside",xAxisIndex:[0,1],start:0,end:100},{show:!0,xAxisIndex:[0,1],type:"slider",top:"85%",start:0,end:100}],visualMap:[{show:!1,seriesIndex:1,dimension:2,pieces:[{value:-1,color:v},{value:1,color:g}]},{show:!1,seriesIndex:2,dimension:1,pieces:[{lte:t.info.data.previousClose-1,color:k},{gt:t.info.data.previousClose,color:I}]}],legend:{selected:{一分K:!1,走勢:!0},top:10,selectedMode:"single",data:["走勢","一分K"]},series:[{name:"一分K",type:"candlestick",data:a.data.list,itemStyle:{color:g,color0:v,borderColor:I,borderColor0:k},tooltip:{formatter:function(e){return e.name+"<br>"+(e.data.coord||"")}},emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}},{name:"Volume",type:"bar",xAxisIndex:1,yAxisIndex:1,data:a.data.volume},{name:"走勢",type:"line",showSymbol:!1,data:a.data.trend,markLine:{label:{show:!1},symbol:["none","none"],data:[{yAxis:t.info.data.previousClose,name:"固定值 100"}]},markPoint:{data:[{type:"max",name:"Max",label:{position:"top",distance:-10}},{type:"min",name:"Min",label:{position:"bottom",distance:-10}}],symbol:"image://",label:{show:!0,formatter:function(e){return e.value>t.info.data.previousClose?`{a|${e.value}}`:`{b|${e.value}}`},rich:{a:{color:g},b:{color:v}}}}}],grid:[{left:"10%",right:"8%",height:"50%"},{left:"10%",right:"8%",top:"63%",height:"16%"}],xAxis:[{type:"category",data:a.data.category,boundaryGap:!1,axisLine:{onZero:!1},splitLine:{show:!1},min:"dataMin",max:"dataMax"},{type:"category",gridIndex:1,data:a.data.category,boundaryGap:!1,axisLine:{onZero:!1},axisTick:{show:!1},splitLine:{show:!1},axisLabel:{show:!1},min:"dataMin",max:"dataMax"}],yAxis:[{scale:!0,splitArea:{show:!0},splitLine:{lineStyle:{type:"dashed",color:"#3C3C3C",width:1}},min:e=>a.data.currentSel=="一分K"?e.min:a.data.openPrice>t.info.data.previousClose?(t.info.data.previousClose*.99).toFixed(0):(e.min*.99).toFixed(0),max:e=>a.data.currentSel=="一分K"?e.max:a.data.openPrice>t.info.data.previousClose?(e.max*1.01).toFixed(0):(t.info.data.previousClose*1.01).toFixed(0)},{scale:!0,gridIndex:1,splitNumber:2,axisLabel:{show:!1},axisLine:{show:!1},axisTick:{show:!1},splitLine:{show:!1}}]}},B=r=>{a.data.currentSel=r.name,f.value.resize()},i=(r,e=0)=>{if(r!=e)return r>e?g:v},_=(r,e)=>{let s=r,l=new Date(s),p=l.getFullYear(),n=String(l.getMonth()+1).padStart(2,"0"),o=String(l.getDate()).padStart(2,"0"),d=String(l.getHours()).padStart(2,"0"),c=String(l.getMinutes()).padStart(2,"0"),M=String(l.getSeconds()).padStart(2,"0");return`${d}:${c}`};return(r,e)=>{const s=H,l=j;return T(),U("div",O,[u("div",Z,[u("div",null,x(F(t).info.data.name),1),u("div",{class:y([h.value,"ml-10"])},x(a.data.closePrice),3),u("div",{class:y([h.value,"ml-10"])},x(`${a.data.priceUp>0?"+":"-"}${a.data.priceUp}`),3),u("div",{class:y([h.value,"ml-10"])},x(`${a.data.priceUp>0?"+":"-"}${a.data.percent}%`),3)]),m(l,{gutter:20,class:"row"},{default:b(()=>[m(s,{span:10},{default:b(()=>[m(F(G),{ref_key:"chart",ref:f,class:"chart",option:$.value,onLegendselectchanged:B,autoresize:""},null,8,["option"])]),_:1}),m(s,{span:12},{default:b(()=>[D(" 11 ")]),_:1})]),_:1})])}}},J=z(R,[["__scopeId","data-v-11794f13"]]);export{J as default};
