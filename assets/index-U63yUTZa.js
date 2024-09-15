import{w as g,u as z,c as r,g as $,bc as Q,i as d,r as y,bd as M,be as x,e as B,aG as X,aq as ee,o as te,k as ne,a7 as H,aH as se,aL as Y,aC as ie,b3 as oe,bf as ae,d as le,bg as ue,n as re}from"./index-B5KTcbZa.js";const Pe="update:modelValue",ye="change",ce=["","default","small","large"],Ue=({from:e,replacement:t,scope:n,version:s,ref:i,type:l="API"},f)=>{g(()=>z(f),c=>{},{immediate:!0})},k=e=>{const t=$();return r(()=>{var n,s;return(s=(n=t==null?void 0:t.proxy)==null?void 0:n.$props)==null?void 0:s[e]})},Ne=Q({type:String,values:ce,required:!1}),de=Symbol("size"),fe=()=>{const e=d(de,{});return r(()=>z(e.size)||"")},Se=(e,t={})=>{const n=y(void 0),s=t.prop?n:k("size"),i=t.global?n:fe(),l=t.form?{size:void 0}:d(M,void 0),f=t.formItem?{size:void 0}:d(x,void 0);return r(()=>s.value||z(e)||(f==null?void 0:f.size)||(l==null?void 0:l.size)||i.value||"")},De=e=>{const t=k("disabled"),n=d(M,void 0);return r(()=>t.value||z(e)||(n==null?void 0:n.disabled)||!1)},je=()=>{const e=d(M,void 0),t=d(x,void 0);return{form:e,formItem:t}},Re=(e,{formItemContext:t,disableIdGeneration:n,disableIdManagement:s})=>{n||(n=y(!1)),s||(s=y(!1));const i=y();let l;const f=r(()=>{var c;return!!(!(e.label||e.ariaLabel)&&t&&t.inputIds&&((c=t.inputIds)==null?void 0:c.length)<=1)});return B(()=>{l=g([ee(e,"id"),n],([c,u])=>{const v=c??(u?void 0:X().value);v!==i.value&&(t!=null&&t.removeInputId&&(i.value&&t.removeInputId(i.value),!(s!=null&&s.value)&&!u&&v&&t.addInputId(v)),i.value=v)},{immediate:!0})}),te(()=>{l&&l(),t!=null&&t.removeInputId&&i.value&&t.removeInputId(i.value)}),{isLabeledByFormItem:f,inputId:i}},ve=["getWidth","getHeight","getDom","getOption","resize","dispatchAction","convertToPixel","convertFromPixel","containPixel","getDataURL","getConnectedDataURL","appendData","clear","isDisposed","dispose"];function pe(e){function t(s){return(...i)=>{if(!e.value)throw new Error("ECharts is not initialized yet.");return e.value[s].apply(e.value,i)}}function n(){const s=Object.create(null);return ve.forEach(i=>{s[i]=t(i)}),s}return n()}function he(e,t,n){g([n,e,t],([s,i,l],f,c)=>{let u=null;if(s&&i&&l){const{offsetWidth:v,offsetHeight:N}=s,S=l===!0?{}:l,{throttle:T=100,onResize:m}=S;let O=!1;const E=()=>{i.resize(),m==null||m()},D=T?ae(E,T):E;u=new ResizeObserver(()=>{!O&&(O=!0,s.offsetWidth===v&&s.offsetHeight===N)||D()}),u.observe(s)}c(()=>{u&&(u.disconnect(),u=null)})})}const me={autoresize:[Boolean,Object]},ge=/^on[^a-z]/,V=e=>ge.test(e);function Oe(e){const t={};for(const n in e)V(n)||(t[n]=e[n]);return t}function U(e,t){const n=le(e)?z(e):e;return n&&typeof n=="object"&&"value"in n?n.value||t:n||t}const Ee="ecLoadingOptions";function _e(e,t,n){const s=d(Ee,{}),i=r(()=>({...U(s,{}),...n==null?void 0:n.value}));Y(()=>{const l=e.value;l&&(t.value?l.showLoading(i.value):l.hideLoading())})}const be={loading:Boolean,loadingOptions:Object};let I=null;const W="x-vue-echarts";function Ie(){if(I!=null)return I;if(typeof HTMLElement>"u"||typeof customElements>"u")return I=!1;try{new Function("tag","class EChartsElement extends HTMLElement{__dispose=null;disconnectedCallback(){this.__dispose&&(this.__dispose(),this.__dispose=null)}}customElements.get(tag)==null&&customElements.define(tag,EChartsElement);")(W)}catch{return I=!1}return I=!0}document.head.innerHTML+=`<style>x-vue-echarts{display:block;width:100%;height:100%;min-width:0}
</style>`;const ze=Ie(),Te="ecTheme",Le="ecInitOptions",we="ecUpdateOptions",F=/(^&?~?!?)native:/;var Ce=ne({name:"echarts",props:{option:Object,theme:{type:[Object,String]},initOptions:Object,updateOptions:Object,group:String,manualUpdate:Boolean,...me,...be},emits:{},inheritAttrs:!1,setup(e,{attrs:t}){const n=H(),s=H(),i=H(),l=d(Te,null),f=d(Le,null),c=d(we,null),{autoresize:u,manualUpdate:v,loading:N,loadingOptions:S}=se(e),T=r(()=>i.value||e.option||null),m=r(()=>e.theme||U(l,{})),O=r(()=>e.initOptions||U(f,{})),E=r(()=>e.updateOptions||U(c,{})),D=r(()=>Oe(t)),j={},L=$().proxy.$listeners,w={};L?Object.keys(L).forEach(a=>{F.test(a)?j[a.replace(F,"$1")]=L[a]:w[a]=L[a]}):Object.keys(t).filter(a=>V(a)).forEach(a=>{let o=a.charAt(2).toLowerCase()+a.slice(3);if(o.indexOf("native:")===0){const _=`on${o.charAt(7).toUpperCase()}${o.slice(8)}`;j[_]=t[a];return}o.substring(o.length-4)==="Once"&&(o=`~${o.substring(0,o.length-4)}`),w[o]=t[a]});function A(a){if(!n.value)return;const o=s.value=ue(n.value,m.value,O.value);e.group&&(o.group=e.group),Object.keys(w).forEach(b=>{let p=w[b];if(!p)return;let h=b.toLowerCase();h.charAt(0)==="~"&&(h=h.substring(1),p.__once__=!0);let C=o;if(h.indexOf("zr:")===0&&(C=o.getZr(),h=h.substring(3)),p.__once__){delete p.__once__;const Z=p;p=(...J)=>{Z(...J),C.off(h,p)}}C.on(h,p)});function _(){o&&!o.isDisposed()&&o.resize()}function K(){const b=a||T.value;b&&o.setOption(b,E.value)}u.value?re(()=>{_(),K()}):K()}function q(a,o){e.manualUpdate&&(i.value=a),s.value?s.value.setOption(a,o||{}):A(a)}function R(){s.value&&(s.value.dispose(),s.value=void 0)}let P=null;g(v,a=>{typeof P=="function"&&(P(),P=null),a||(P=g(()=>e.option,(o,_)=>{o&&(s.value?s.value.setOption(o,{notMerge:o!==_,...E.value}):A())},{deep:!0}))},{immediate:!0}),g([m,O],()=>{R(),A()},{deep:!0}),Y(()=>{e.group&&s.value&&(s.value.group=e.group)});const G=pe(s);return _e(s,N,S),he(s,u,n),B(()=>{A()}),ie(()=>{ze&&n.value?n.value.__dispose=R:R()}),{chart:s,root:n,setOption:q,nonEventAttrs:D,nativeListeners:j,...G}},render(){const e={...this.nonEventAttrs,...this.nativeListeners};return e.ref="root",e.class=e.class?["echarts"].concat(e.class):"echarts",oe(W,e)}});export{ye as C,Ce as E,Te as T,Pe as U,je as a,Re as b,Se as c,De as d,Ue as e,ce as f,fe as g,Ne as u};
