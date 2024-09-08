import{w as $,u as e,c as g,g as ne,L as se,i as S,r as y,M as k,N as M,e as w,O as T,P as ue,o as re,Q as E,R as F,S as A,U as L,V as D,k as I,W as P,q as B,z as C,E as h,A as K,X as W,d as X,I as _,Y as z,y as N,x as j,G as x,Z as G,n as O,v as ie,$ as de,p as ve,a as q,a0 as ce,a1 as pe,a2 as be,a3 as Y,_ as fe,J as me,j as m,t as R}from"./index-CpIbm6p6.js";import{E as ge}from"./index-aJSnPDNo.js";const U="update:modelValue",ye="change",_e=["","default","small","large"],H=({from:l,replacement:o,scope:t,version:a,ref:u,type:c="API"},s)=>{$(()=>e(s),p=>{},{immediate:!0})},J=l=>{const o=ne();return g(()=>{var t,a;return(a=(t=o==null?void 0:o.proxy)==null?void 0:t.$props)==null?void 0:a[l]})},Q=se({type:String,values:_e,required:!1}),he=Symbol("size"),Se=()=>{const l=S(he,{});return g(()=>e(l.size)||"")},Ie=(l,o={})=>{const t=y(void 0),a=o.prop?t:J("size"),u=o.global?t:Se(),c=o.form?{size:void 0}:S(k,void 0),s=o.formItem?{size:void 0}:S(M,void 0);return g(()=>a.value||e(l)||(s==null?void 0:s.size)||(c==null?void 0:c.size)||u.value||"")},Ve=l=>{const o=J("disabled"),t=S(k,void 0);return g(()=>o.value||e(l)||(t==null?void 0:t.disabled)||!1)},ze=()=>{const l=S(k,void 0),o=S(M,void 0);return{form:l,formItem:o}},Ee=(l,{formItemContext:o,disableIdGeneration:t,disableIdManagement:a})=>{t||(t=y(!1)),a||(a=y(!1));const u=y();let c;const s=g(()=>{var p;return!!(!(l.label||l.ariaLabel)&&o&&o.inputIds&&((p=o.inputIds)==null?void 0:p.length)<=1)});return w(()=>{c=$([ue(l,"id"),t],([p,r])=>{const n=p??(r?void 0:T().value);n!==u.value&&(o!=null&&o.removeInputId&&(u.value&&o.removeInputId(u.value),!(a!=null&&a.value)&&!r&&n&&o.addInputId(n)),u.value=n)},{immediate:!0})}),re(()=>{c&&c(),o!=null&&o.removeInputId&&u.value&&o.removeInputId(u.value)}),{isLabeledByFormItem:s,inputId:u}},Z=E({modelValue:{type:[String,Number,Boolean],default:void 0},size:Q,disabled:Boolean,label:{type:[String,Number,Boolean],default:void 0},value:{type:[String,Number,Boolean],default:void 0},name:{type:String,default:void 0}}),Be=E({...Z,border:Boolean}),ee={[U]:l=>F(l)||A(l)||L(l),[ye]:l=>F(l)||A(l)||L(l)},ae=Symbol("radioGroupKey"),le=(l,o)=>{const t=y(),a=S(ae,void 0),u=g(()=>!!a),c=g(()=>D(l.value)?l.label:l.value),s=g({get(){return u.value?a.modelValue:l.modelValue},set(v){u.value?a.changeEvent(v):o&&o(U,v),t.value.checked=l.modelValue===c.value}}),p=Ie(g(()=>a==null?void 0:a.size)),r=Ve(g(()=>a==null?void 0:a.disabled)),n=y(!1),d=g(()=>r.value||u.value&&s.value!==c.value?-1:0);return H({from:"label act as value",replacement:"value",version:"3.0.0",scope:"el-radio",ref:"https://element-plus.org/en-US/component/radio.html"},g(()=>u.value&&D(l.value))),{radioRef:t,isGroup:u,radioGroup:a,focus:n,size:p,disabled:r,tabIndex:d,modelValue:s,actualValue:c}},Ce=["value","name","disabled"],Re=I({name:"ElRadio"}),$e=I({...Re,props:Be,emits:ee,setup(l,{emit:o}){const t=l,a=P("radio"),{radioRef:u,radioGroup:c,focus:s,size:p,disabled:r,modelValue:n,actualValue:d}=le(t,o);function v(){O(()=>o("change",n.value))}return(i,b)=>{var f;return B(),C("label",{class:_([e(a).b(),e(a).is("disabled",e(r)),e(a).is("focus",e(s)),e(a).is("bordered",i.border),e(a).is("checked",e(n)===e(d)),e(a).m(e(p))])},[h("span",{class:_([e(a).e("input"),e(a).is("disabled",e(r)),e(a).is("checked",e(n)===e(d))])},[K(h("input",{ref_key:"radioRef",ref:u,"onUpdate:modelValue":b[0]||(b[0]=V=>X(n)?n.value=V:null),class:_(e(a).e("original")),value:e(d),name:i.name||((f=e(c))==null?void 0:f.name),disabled:e(r),type:"radio",onFocus:b[1]||(b[1]=V=>s.value=!0),onBlur:b[2]||(b[2]=V=>s.value=!1),onChange:v,onClick:b[3]||(b[3]=z(()=>{},["stop"]))},null,42,Ce),[[W,e(n)]]),h("span",{class:_(e(a).e("inner"))},null,2)],2),h("span",{class:_(e(a).e("label")),onKeydown:b[4]||(b[4]=z(()=>{},["stop"]))},[N(i.$slots,"default",{},()=>[j(x(i.label),1)])],34)],2)}}});var ke=G($e,[["__file","radio.vue"]]);const we=E({...Z}),Pe=["value","name","disabled"],Ne=I({name:"ElRadioButton"}),Ge=I({...Ne,props:we,setup(l){const o=l,t=P("radio"),{radioRef:a,focus:u,size:c,disabled:s,modelValue:p,radioGroup:r,actualValue:n}=le(o),d=g(()=>({backgroundColor:(r==null?void 0:r.fill)||"",borderColor:(r==null?void 0:r.fill)||"",boxShadow:r!=null&&r.fill?`-1px 0 0 0 ${r.fill}`:"",color:(r==null?void 0:r.textColor)||""}));return(v,i)=>{var b;return B(),C("label",{class:_([e(t).b("button"),e(t).is("active",e(p)===e(n)),e(t).is("disabled",e(s)),e(t).is("focus",e(u)),e(t).bm("button",e(c))])},[K(h("input",{ref_key:"radioRef",ref:a,"onUpdate:modelValue":i[0]||(i[0]=f=>X(p)?p.value=f:null),class:_(e(t).be("button","original-radio")),value:e(n),type:"radio",name:v.name||((b=e(r))==null?void 0:b.name),disabled:e(s),onFocus:i[1]||(i[1]=f=>u.value=!0),onBlur:i[2]||(i[2]=f=>u.value=!1),onClick:i[3]||(i[3]=z(()=>{},["stop"]))},null,42,Pe),[[W,e(p)]]),h("span",{class:_(e(t).be("button","inner")),style:ie(e(p)===e(n)?e(d):{}),onKeydown:i[4]||(i[4]=z(()=>{},["stop"]))},[N(v.$slots,"default",{},()=>[j(x(v.label),1)])],38)],2)}}});var oe=G(Ge,[["__file","radio-button.vue"]]);const Ue=E({id:{type:String,default:void 0},size:Q,disabled:Boolean,modelValue:{type:[String,Number,Boolean],default:void 0},fill:{type:String,default:""},label:{type:String,default:void 0},textColor:{type:String,default:""},name:{type:String,default:void 0},validateEvent:{type:Boolean,default:!0},...de(["ariaLabel"])}),Fe=ee,Ae=["id","aria-label","aria-labelledby"],Le=I({name:"ElRadioGroup"}),De=I({...Le,props:Ue,emits:Fe,setup(l,{emit:o}){const t=l,a=P("radio"),u=T(),c=y(),{formItem:s}=ze(),{inputId:p,isLabeledByFormItem:r}=Ee(t,{formItemContext:s}),n=v=>{o(U,v),O(()=>o("change",v))};w(()=>{const v=c.value.querySelectorAll("[type=radio]"),i=v[0];!Array.from(v).some(b=>b.checked)&&i&&(i.tabIndex=0)});const d=g(()=>t.name||u.value);return ve(ae,q({...ce(t),changeEvent:n,name:d})),$(()=>t.modelValue,()=>{t.validateEvent&&(s==null||s.validate("change").catch(v=>pe()))}),H({from:"label",replacement:"aria-label",version:"2.8.0",scope:"el-radio-group",ref:"https://element-plus.org/en-US/component/radio.html"},g(()=>!!t.label)),(v,i)=>(B(),C("div",{id:e(p),ref_key:"radioGroupRef",ref:c,class:_(e(a).b("group")),role:"radiogroup","aria-label":e(r)?void 0:v.label||v.ariaLabel||"radio-group","aria-labelledby":e(r)?e(s).labelId:void 0},[N(v.$slots,"default")],10,Ae))}});var te=G(De,[["__file","radio-group.vue"]]);be(ke,{RadioButton:oe,RadioGroup:te});const Me=Y(te),Te=Y(oe),Ke=[{value:"01",label:"水泥工業"},{value:"02",label:"食品工業"},{value:"03",label:"塑膠工業"},{value:"04",label:"紡織纖維"},{value:"05",label:"電機機械"},{value:"06",label:"電器電纜"},{value:"08",label:"玻璃陶瓷"},{value:"09",label:"造紙工業"},{value:"10",label:"鋼鐵工業"},{value:"11",label:"橡膠工業"},{value:"12",label:"汽車工業"},{value:"14",label:"建材營造"},{value:"15",label:"航運業"},{value:"16",label:"觀光餐旅"},{value:"17",label:"金融保險"},{value:"18",label:"貿易百貨"},{value:"19",label:"綜合"},{value:"20",label:"其他"},{value:"21",label:"化學工業"},{value:"22",label:"生技醫療業"},{value:"23",label:"油電燃氣業"},{value:"24",label:"半導體業"},{value:"25",label:"電腦及週邊設備業"},{value:"26",label:"光電業"},{value:"27",label:"通信網路業"},{value:"28",label:"電子零組件業"},{value:"29",label:"電子通路業"},{value:"30",label:"資訊服務業"},{value:"31",label:"其他電子業"},{value:"32",label:"文化創意業"},{value:"33",label:"農業科技業"},{value:"34",label:"電子商務"},{value:"35",label:"綠能環保"},{value:"36",label:"數位雲端"},{value:"37",label:"運動休閒"},{value:"38",label:"居家生活"},{value:"80",label:"管理股票"}],We={style:{height:"100%"}},Xe={class:"mt-20 mb-20"},je={style:{width:"100%",height:"80%"}},xe="#FF5B5B",Oe="#ff3737",qe="#91F840",Ye="#6fda1a",He={__name:"heatMap",setup(l){const o=y(null),t=y(null),a=y("IX0001"),u=y("industry"),c=y(""),s=q({loading:!0,data:{}});w(async()=>{p()});const p=async()=>{s.loading=!0;let r=a.value;if(c.value&&(r+=`?period=${c.value}`),s.data=await me.Stock.getStockHeatMap(r),u.value=="industry")s.data.data.splice(0,1),s.data.data=s.data.data.filter(n=>n.type=="INDEX"),s.data.data=s.data.data.map(n=>({...n,name:`${n.name.replace("指數","").replace("櫃買","")}
${n.changePercent}%`,value:[n.tradeValue,n.changePercent]}));else{let n=s.data.data.filter(d=>d.type=="EQUITY");s.data.data=[],Ke.forEach(d=>{let v=n.filter(f=>d.value==f.industry),i=v.reduce((f,V)=>f+V.marketValueWeight,0),b={name:d.label,value:i};b.children=[...v],b.children=b.children.map(f=>({...f,name:`${f.name}
${f.changePercent}%`,value:[f.marketValueWeight,f.changePercent]})),s.data.data.push(b)})}t.value={series:[{name:"發行量加權股價指數",type:"treemap",data:s.data.data,visualDimension:1,upperLabel:{show:!0,height:30,backgroundColor:"#131313",textStyle:{color:"#ffffff",fontSize:14}},itemStyle:{borderColor:"#fff",gapWidth:.5}}],visualMap:{type:"continuous",min:c.value?-30:-10,max:c.value?30:10,inRange:{color:[qe,Ye,"#007500","#3C3C3C","#750000",Oe,xe]},calculable:!0,orient:"horizontal",left:"10%"}},s.loading=!1};return(r,n)=>{const d=Te,v=Me;return B(),C("div",We,[h("div",Xe,[m(v,{modelValue:a.value,"onUpdate:modelValue":n[0]||(n[0]=i=>a.value=i),size:"large",onChange:p},{default:R(()=>[m(d,{label:"上市",value:"IX0001"}),m(d,{label:"上櫃",value:"IX0043"})]),_:1},8,["modelValue"]),m(v,{modelValue:u.value,"onUpdate:modelValue":n[1]||(n[1]=i=>u.value=i),size:"large",class:"ml-5",onChange:p},{default:R(()=>[m(d,{label:"產業",value:"industry"}),m(d,{label:"個股",value:"stock"})]),_:1},8,["modelValue"]),m(v,{modelValue:c.value,"onUpdate:modelValue":n[2]||(n[2]=i=>c.value=i),size:"large",class:"ml-5",onChange:p},{default:R(()=>[m(d,{label:"盤中即時",value:""}),m(d,{label:"一週",value:"1w"}),m(d,{label:"一月",value:"1m"}),m(d,{label:"三月",value:"3m"}),m(d,{label:"六月",value:"6m"}),m(d,{label:"一年",value:"1y"}),m(d,{label:"年初至今",value:"ytd"})]),_:1},8,["modelValue"])]),h("div",je,[m(e(ge),{ref_key:"chart",ref:o,option:t.value,loading:s.loading,autoresize:""},null,8,["option","loading"])])])}}},Ze=fe(He,[["__scopeId","data-v-0f9d64a1"]]);export{Ze as default};
