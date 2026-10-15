import{$ as e,At as t,Bt as n,Dt as r,Et as i,Ft as a,Gt as o,Ht as s,It as c,Kt as l,Lt as u,Mt as d,Nt as f,Ot as p,Pt as m,Q as h,Rt as g,Tt as _,Ut as v,Vt as y,Wt as b,X as x,Z as S,_t as C,at as w,bt as T,ct as E,dt as D,et as O,ft as k,gt as A,ht as ee,it as te,jt as j,kt as M,lt as N,mt as P,nt as F,ot as I,pt as L,qt as ne,rt as re,st as ie,tt as R,ut as ae,vt as oe,wt as se,xt as ce,yt as le,zt as z}from"./index-C01A5VPA.js";var ue=e=>e!=null,de=e=>e.filter(ue);function fe(e){return(...t)=>{for(let n of e)n&&n(...t)}}var B=e=>typeof e==`function`&&!e.length?e():e,pe=e=>Array.isArray(e)?e:e?[e]:[];function me(e,...t){return typeof e==`function`?e(...t):e}var he=f;function ge(e,t,n,r){let i=e.length,a=t.length,o=0;if(!a){for(;o<i;o++)n(e[o]);return}if(!i){for(;o<a;o++)r(t[o]);return}for(;o<a&&t[o]===e[o];o++);let s,c;t=t.slice(o),e=e.slice(o);for(s of t)e.includes(s)||r(s);for(c of e)t.includes(c)||n(c)}function _e(e){let[t,n]=A(),r=e?.throw?(e,t)=>{throw n(e instanceof Error?e:Error(t)),e}:(e,t)=>{n(e instanceof Error?e:Error(t))},i=e?.api?Array.isArray(e.api)?e.api:[e.api]:[globalThis.localStorage].filter(Boolean),a=e?.prefix?`${e.prefix}.`:``,o=new Map,s=new Proxy({},{get(t,n){let s=o.get(n);s||(s=A(void 0,{equals:!1}),o.set(n,s)),s[0]();let c=i.reduce((e,t)=>{if(e!==null||!t)return e;try{return t.getItem(`${a}${n}`)}catch(e){return r(e,`Error reading ${a}${n} from ${t.name}`),null}},null);return c!==null&&e?.deserializer?e.deserializer(c,n,e.options):c}});return e?.sync!==!1&&m(()=>{let e=e=>{let t=!1;i.forEach(n=>{try{n!==e.storageArea&&e.key&&e.newValue!==n.getItem(e.key)&&(e.newValue?n.setItem(e.key,e.newValue):n.removeItem(e.key),t=!0)}catch(t){r(t,`Error synching api ${n.name} from storage event (${e.key}=${e.newValue})`)}}),t&&e.key&&o.get(e.key)?.[1]()};`addEventListener`in globalThis?(globalThis.addEventListener(`storage`,e),f(()=>globalThis.removeEventListener(`storage`,e))):(i.forEach(t=>t.addEventListener?.(`storage`,e)),f(()=>i.forEach(t=>t.removeEventListener?.(`storage`,e))))}),[s,(t,n,s)=>{let c=e?.serializer?e.serializer(n,t,s??e.options):n,l=`${a}${t}`;i.forEach(e=>{try{e.getItem(l)!==c&&e.setItem(l,c)}catch(n){r(n,`Error setting ${a}${t} to ${c} in ${e.name}`)}});let u=o.get(t);u&&u[1]()},{clear:()=>i.forEach(e=>{try{e.clear()}catch(t){r(t,`Error clearing ${e.name}`)}}),error:t,remove:e=>i.forEach(t=>{try{t.removeItem(`${a}${e}`)}catch(n){r(n,`Error removing ${a}${e} from ${t.name}`)}}),toJSON:()=>{let t={},n=(n,r)=>{if(!t.hasOwnProperty(n)){let i=r&&e?.deserializer?e.deserializer(r,n,e.options):r;i&&(t[n]=i)}};return i.forEach(e=>{if(typeof e.getAll==`function`){let t;try{t=e.getAll()}catch(t){r(t,`Error getting all values from in ${e.name}`)}for(let e of t)n(e,t[e])}else{let i=0,a;try{for(;a=e.key(i++);)t.hasOwnProperty(a)||n(a,e.getItem(a))}catch(t){r(t,`Error getting all values from ${e.name}`)}}}),t}}]}var ve=_e,ye=e=>(typeof e.clear==`function`||(e.clear=()=>{let t;for(;t=e.key(0);)e.removeItem(t)}),e),be=e=>{if(!e)return``;let t=``;for(let n in e){if(!e.hasOwnProperty(n))continue;let r=e[n];t+=r instanceof Date?`; ${n}=${r.toUTCString()}`:typeof r==`boolean`?`; ${n}`:`; ${n}=${r}`}return t},xe=ye({_cookies:[globalThis.document,`cookie`],getItem:e=>xe._cookies[0][xe._cookies[1]].match(`(^|;)\\s*`+e+`\\s*=\\s*([^;]+)`)?.pop()??null,setItem:(e,t,n)=>{let r=xe.getItem(e);xe._cookies[0][xe._cookies[1]]=`${e}=${t}${be(n)}`;let i=Object.assign(new Event(`storage`),{key:e,oldValue:r,newValue:t,url:globalThis.document.URL,storageArea:xe});window.dispatchEvent(i)},removeItem:e=>{xe._cookies[0][xe._cookies[1]]=`${e}=deleted${be({expires:new Date(0)})}`},key:e=>{let t=null,n=0;return xe._cookies[0][xe._cookies[1]].replace(/(?:^|;)\s*(.+?)\s*=\s*[^;]+/g,(r,i)=>(!t&&i&&n++===e&&(t=i),``)),t},get length(){let e=0;return xe._cookies[0][xe._cookies[1]].replace(/(?:^|;)\s*.+?\s*=\s*[^;]+/g,t=>(e+=+!!t,``)),e}}),Se=1024,Ce=796,we=700,Te=`bottom-right`,Ee=`bottom`,De=`system`,Oe=!1,ke=500,Ae=500,je=500,Me=Object.keys(g)[0],Ne=1,Pe=Object.keys(j)[0],Fe=D({client:void 0,onlineManager:void 0,queryFlavor:``,version:``,shadowDOMTarget:void 0});function V(){return l(Fe)}var Ie=class extends Error{},Le=D(void 0),Re=e=>{let[t,n]=A(null),r=()=>{let e=t();e!=null&&(e.close(),n(null))},i=(r,i)=>{if(t()!=null)return;let a=window.open(``,`TSQD-Devtools-Panel`,`width=${r},height=${i},popup`);if(!a)throw new Ie(`Failed to open popup. Please allow popups for this site to view the devtools in picture-in-picture mode.`);a.document.head.innerHTML=``,a.document.body.innerHTML=``,ie(a.document),a.document.title=`TanStack Query Devtools`,a.document.body.style.margin=`0`,a.addEventListener(`pagehide`,()=>{e.setLocalStore(`pip_open`,`false`),n(null)}),[...(V().shadowDOMTarget||document).styleSheets].forEach(e=>{try{let t=[...e.cssRules].map(e=>e.cssText).join(``),n=document.createElement(`style`),r=e.ownerNode,i=``;r&&`id`in r&&(i=r.id),i&&n.setAttribute(`id`,i),n.textContent=t,a.document.head.appendChild(n)}catch{let t=document.createElement(`link`);if(e.href==null)return;t.rel=`stylesheet`,t.type=e.type,t.media=e.media.toString(),t.href=e.href,a.document.head.appendChild(t)}}),oe([`focusin`,`focusout`,`pointermove`,`keydown`,`pointerdown`,`pointerup`,`click`,`mousedown`,`input`],a.document),e.setLocalStore(`pip_open`,`true`),n(a)};k(()=>{if((e.localStore.pip_open??`false`)===`true`&&!e.disabled)try{i(Number(window.innerWidth),Number(e.localStore.height||Ae))}catch(t){if(t instanceof Ie){e.setLocalStore(`pip_open`,`false`),e.setLocalStore(`open`,`false`);return}throw t}}),k(()=>{let e=(V().shadowDOMTarget||document).querySelector(`#_goober`),n=t();if(e&&n){let t=new MutationObserver(()=>{let t=(V().shadowDOMTarget||n.document).querySelector(`#_goober`);t&&(t.textContent=e.textContent)});t.observe(e,{childList:!0,subtree:!0,characterDataOldValue:!0}),f(()=>{t.disconnect()})}});let a=L(()=>({pipWindow:t(),requestPipWindow:i,closePipWindow:r,disabled:e.disabled??!1}));return N(Le.Provider,{value:a,get children(){return e.children}})},ze=()=>L(()=>{let e=l(Le);if(!e)throw Error(`usePiPWindow must be used within a PiPProvider`);return e()}),Be=D(()=>`dark`);function H(){return l(Be)}var Ve={À:`A`,Á:`A`,Â:`A`,Ã:`A`,Ä:`A`,Å:`A`,Ấ:`A`,Ắ:`A`,Ẳ:`A`,Ẵ:`A`,Ặ:`A`,Æ:`AE`,Ầ:`A`,Ằ:`A`,Ȃ:`A`,Ç:`C`,Ḉ:`C`,È:`E`,É:`E`,Ê:`E`,Ë:`E`,Ế:`E`,Ḗ:`E`,Ề:`E`,Ḕ:`E`,Ḝ:`E`,Ȇ:`E`,Ì:`I`,Í:`I`,Î:`I`,Ï:`I`,Ḯ:`I`,Ȋ:`I`,Ð:`D`,Ñ:`N`,Ò:`O`,Ó:`O`,Ô:`O`,Õ:`O`,Ö:`O`,Ø:`O`,Ố:`O`,Ṍ:`O`,Ṓ:`O`,Ȏ:`O`,Ù:`U`,Ú:`U`,Û:`U`,Ü:`U`,Ý:`Y`,à:`a`,á:`a`,â:`a`,ã:`a`,ä:`a`,å:`a`,ấ:`a`,ắ:`a`,ẳ:`a`,ẵ:`a`,ặ:`a`,æ:`ae`,ầ:`a`,ằ:`a`,ȃ:`a`,ç:`c`,ḉ:`c`,è:`e`,é:`e`,ê:`e`,ë:`e`,ế:`e`,ḗ:`e`,ề:`e`,ḕ:`e`,ḝ:`e`,ȇ:`e`,ì:`i`,í:`i`,î:`i`,ï:`i`,ḯ:`i`,ȋ:`i`,ð:`d`,ñ:`n`,ò:`o`,ó:`o`,ô:`o`,õ:`o`,ö:`o`,ø:`o`,ố:`o`,ṍ:`o`,ṓ:`o`,ȏ:`o`,ù:`u`,ú:`u`,û:`u`,ü:`u`,ý:`y`,ÿ:`y`,Ā:`A`,ā:`a`,Ă:`A`,ă:`a`,Ą:`A`,ą:`a`,Ć:`C`,ć:`c`,Ĉ:`C`,ĉ:`c`,Ċ:`C`,ċ:`c`,Č:`C`,č:`c`,C̆:`C`,c̆:`c`,Ď:`D`,ď:`d`,Đ:`D`,đ:`d`,Ē:`E`,ē:`e`,Ĕ:`E`,ĕ:`e`,Ė:`E`,ė:`e`,Ę:`E`,ę:`e`,Ě:`E`,ě:`e`,Ĝ:`G`,Ǵ:`G`,ĝ:`g`,ǵ:`g`,Ğ:`G`,ğ:`g`,Ġ:`G`,ġ:`g`,Ģ:`G`,ģ:`g`,Ĥ:`H`,ĥ:`h`,Ħ:`H`,ħ:`h`,Ḫ:`H`,ḫ:`h`,Ĩ:`I`,ĩ:`i`,Ī:`I`,ī:`i`,Ĭ:`I`,ĭ:`i`,Į:`I`,į:`i`,İ:`I`,ı:`i`,Ĳ:`IJ`,ĳ:`ij`,Ĵ:`J`,ĵ:`j`,Ķ:`K`,ķ:`k`,Ḱ:`K`,ḱ:`k`,K̆:`K`,k̆:`k`,Ĺ:`L`,ĺ:`l`,Ļ:`L`,ļ:`l`,Ľ:`L`,ľ:`l`,Ŀ:`L`,ŀ:`l`,Ł:`l`,ł:`l`,Ḿ:`M`,ḿ:`m`,M̆:`M`,m̆:`m`,Ń:`N`,ń:`n`,Ņ:`N`,ņ:`n`,Ň:`N`,ň:`n`,ŉ:`n`,N̆:`N`,n̆:`n`,Ō:`O`,ō:`o`,Ŏ:`O`,ŏ:`o`,Ő:`O`,ő:`o`,Œ:`OE`,œ:`oe`,P̆:`P`,p̆:`p`,Ŕ:`R`,ŕ:`r`,Ŗ:`R`,ŗ:`r`,Ř:`R`,ř:`r`,R̆:`R`,r̆:`r`,Ȓ:`R`,ȓ:`r`,Ś:`S`,ś:`s`,Ŝ:`S`,ŝ:`s`,Ş:`S`,Ș:`S`,ș:`s`,ş:`s`,Š:`S`,š:`s`,Ţ:`T`,ţ:`t`,ț:`t`,Ț:`T`,Ť:`T`,ť:`t`,Ŧ:`T`,ŧ:`t`,T̆:`T`,t̆:`t`,Ũ:`U`,ũ:`u`,Ū:`U`,ū:`u`,Ŭ:`U`,ŭ:`u`,Ů:`U`,ů:`u`,Ű:`U`,ű:`u`,Ų:`U`,ų:`u`,Ȗ:`U`,ȗ:`u`,V̆:`V`,v̆:`v`,Ŵ:`W`,ŵ:`w`,Ẃ:`W`,ẃ:`w`,X̆:`X`,x̆:`x`,Ŷ:`Y`,ŷ:`y`,Ÿ:`Y`,Y̆:`Y`,y̆:`y`,Ź:`Z`,ź:`z`,Ż:`Z`,ż:`z`,Ž:`Z`,ž:`z`,ſ:`s`,ƒ:`f`,Ơ:`O`,ơ:`o`,Ư:`U`,ư:`u`,Ǎ:`A`,ǎ:`a`,Ǐ:`I`,ǐ:`i`,Ǒ:`O`,ǒ:`o`,Ǔ:`U`,ǔ:`u`,Ǖ:`U`,ǖ:`u`,Ǘ:`U`,ǘ:`u`,Ǚ:`U`,ǚ:`u`,Ǜ:`U`,ǜ:`u`,Ứ:`U`,ứ:`u`,Ṹ:`U`,ṹ:`u`,Ǻ:`A`,ǻ:`a`,Ǽ:`AE`,ǽ:`ae`,Ǿ:`O`,ǿ:`o`,Þ:`TH`,þ:`th`,Ṕ:`P`,ṕ:`p`,Ṥ:`S`,ṥ:`s`,X́:`X`,x́:`x`,Ѓ:`Г`,ѓ:`г`,Ќ:`К`,ќ:`к`,A̋:`A`,a̋:`a`,E̋:`E`,e̋:`e`,I̋:`I`,i̋:`i`,Ǹ:`N`,ǹ:`n`,Ồ:`O`,ồ:`o`,Ṑ:`O`,ṑ:`o`,Ừ:`U`,ừ:`u`,Ẁ:`W`,ẁ:`w`,Ỳ:`Y`,ỳ:`y`,Ȁ:`A`,ȁ:`a`,Ȅ:`E`,ȅ:`e`,Ȉ:`I`,ȉ:`i`,Ȍ:`O`,ȍ:`o`,Ȑ:`R`,ȑ:`r`,Ȕ:`U`,ȕ:`u`,B̌:`B`,b̌:`b`,Č̣:`C`,č̣:`c`,Ê̌:`E`,ê̌:`e`,F̌:`F`,f̌:`f`,Ǧ:`G`,ǧ:`g`,Ȟ:`H`,ȟ:`h`,J̌:`J`,ǰ:`j`,Ǩ:`K`,ǩ:`k`,M̌:`M`,m̌:`m`,P̌:`P`,p̌:`p`,Q̌:`Q`,q̌:`q`,Ř̩:`R`,ř̩:`r`,Ṧ:`S`,ṧ:`s`,V̌:`V`,v̌:`v`,W̌:`W`,w̌:`w`,X̌:`X`,x̌:`x`,Y̌:`Y`,y̌:`y`,A̧:`A`,a̧:`a`,B̧:`B`,b̧:`b`,Ḑ:`D`,ḑ:`d`,Ȩ:`E`,ȩ:`e`,Ɛ̧:`E`,ɛ̧:`e`,Ḩ:`H`,ḩ:`h`,I̧:`I`,i̧:`i`,Ɨ̧:`I`,ɨ̧:`i`,M̧:`M`,m̧:`m`,O̧:`O`,o̧:`o`,Q̧:`Q`,q̧:`q`,U̧:`U`,u̧:`u`,X̧:`X`,x̧:`x`,Z̧:`Z`,z̧:`z`},He=Object.keys(Ve).join(`|`),Ue=new RegExp(He,`g`);function We(e){return e.replace(Ue,e=>Ve[e])}var U={CASE_SENSITIVE_EQUAL:7,EQUAL:6,STARTS_WITH:5,WORD_STARTS_WITH:4,CONTAINS:3,ACRONYM:2,MATCHES:1,NO_MATCH:0};function Ge(e,t,n){if(n||={},n.threshold=n.threshold??U.MATCHES,!n.accessors){let r=Ke(e,t,n);return{rankedValue:e,rank:r,accessorIndex:-1,accessorThreshold:n.threshold,passed:r>=n.threshold}}let r=Ze(e,n.accessors),i={rankedValue:e,rank:U.NO_MATCH,accessorIndex:-1,accessorThreshold:n.threshold,passed:!1};for(let e=0;e<r.length;e++){let a=r[e],o=Ke(a.itemValue,t,n),{minRanking:s,maxRanking:c,threshold:l=n.threshold}=a.attributes;o<s&&o>=U.MATCHES?o=s:o>c&&(o=c),o=Math.min(o,c),o>=l&&o>i.rank&&(i.rank=o,i.passed=!0,i.accessorIndex=e,i.accessorThreshold=l,i.rankedValue=a.itemValue)}return i}function Ke(e,t,n){return e=Ye(e,n),t=Ye(t,n),t.length>e.length?U.NO_MATCH:e===t?U.CASE_SENSITIVE_EQUAL:(e=e.toLowerCase(),t=t.toLowerCase(),e===t?U.EQUAL:e.startsWith(t)?U.STARTS_WITH:e.includes(` ${t}`)?U.WORD_STARTS_WITH:e.includes(t)?U.CONTAINS:t.length===1?U.NO_MATCH:qe(e).includes(t)?U.ACRONYM:Je(e,t))}function qe(e){let t=``;return e.split(` `).forEach(e=>{e.split(`-`).forEach(e=>{t+=e.substr(0,1)})}),t}function Je(e,t){let n=0,r=0;function i(e,t,r){for(let i=r,a=t.length;i<a;i++)if(t[i]===e)return n+=1,i+1;return-1}function a(e){let r=1/e,i=n/t.length;return U.MATCHES+i*r}let o=i(t[0],e,0);if(o<0)return U.NO_MATCH;r=o;for(let n=1,a=t.length;n<a;n++){let a=t[n];if(r=i(a,e,r),!(r>-1))return U.NO_MATCH}return a(r-o)}function Ye(e,t){let{keepDiacritics:n}=t;return e=`${e}`,n||(e=We(e)),e}function Xe(e,t){let n=t;typeof t==`object`&&(n=t.accessor);let r=n(e);return r==null?[]:Array.isArray(r)?r:[String(r)]}function Ze(e,t){let n=[];for(let r=0,i=t.length;r<i;r++){let i=t[r],a=$e(i),o=Xe(e,i);for(let e=0,t=o.length;e<t;e++)n.push({itemValue:o[e],attributes:a})}return n}var Qe={maxRanking:1/0,minRanking:-1/0};function $e(e){return typeof e==`function`?Qe:{...Qe,...e}}var et={data:``},tt=e=>{if(typeof window==`object`){let t=(e?e.querySelector(`#_goober`):window._goober)||Object.assign(document.createElement(`style`),{innerHTML:` `,id:`_goober`});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||et},nt=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,rt=/\/\*[^]*?\*\/|  +/g,it=/\n+/g,at=(e,t)=>{let n=``,r=``,i=``;for(let a in e){let o=e[a];a[0]==`@`?a[1]==`i`?n=a+` `+o+`;`:r+=a[1]==`f`?at(o,a):a+`{`+at(o,a[1]==`k`?``:t)+`}`:typeof o==`object`?r+=at(o,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+` `+t:t)):a):o!=null&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,`-$&`).toLowerCase(),i+=at.p?at.p(a,o):a+`:`+o+`;`)}return n+(t&&i?t+`{`+i+`}`:i)+r},ot={},st=e=>{if(typeof e==`object`){let t=``;for(let n in e)t+=n+st(e[n]);return t}return e},ct=(e,t,n,r,i)=>{let a=st(e),o=ot[a]||(ot[a]=(e=>{let t=0,n=11;for(;t<e.length;)n=101*n+e.charCodeAt(t++)>>>0;return`go`+n})(a));if(!ot[o]){let t=a===e?(e=>{let t,n,r=[{}];for(;t=nt.exec(e.replace(rt,``));)t[4]?r.shift():t[3]?(n=t[3].replace(it,` `).trim(),r.unshift(r[0][n]=r[0][n]||{})):r[0][t[1]]=t[2].replace(it,` `).trim();return r[0]})(e):e;ot[o]=at(i?{[`@keyframes `+o]:t}:t,n?``:`.`+o)}let s=n&&ot.g?ot.g:null;return n&&(ot.g=ot[o]),((e,t,n,r)=>{r?t.data=t.data.replace(r,e):t.data.indexOf(e)===-1&&(t.data=n?e+t.data:t.data+e)})(ot[o],t,r,s),o},lt=(e,t,n)=>e.reduce((e,r,i)=>{let a=t[i];if(a&&a.call){let e=a(n),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?`.`+t:e&&typeof e==`object`?e.props?``:at(e,``):!1===e?``:e}return e+r+(a??``)},``);function W(e){let t=this||{},n=e.call?e(t.p):e;return ct(n.unshift?n.raw?lt(n,[].slice.call(arguments,1),t.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(t.p):n),{}):n,tt(t.target),t.g,t.o,t.k)}W.bind({g:1}),W.bind({k:1});function ut(e){var t,n,r=``;if(typeof e==`string`||typeof e==`number`)r+=e;else if(typeof e==`object`){if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(n=ut(e[t]))&&(r&&(r+=` `),r+=n)}else for(n in e)e[n]&&(r&&(r+=` `),r+=n)}return r}function G(){for(var e,t,n=0,r=``,i=arguments.length;n<i;n++)(e=arguments[n])&&(t=ut(e))&&(r&&(r+=` `),r+=t);return r}function dt(e,t){let n=v(e),{onChange:r}=t,i=new Set(t.appear?void 0:n),a=new WeakSet,[o,s]=A([],{equals:!1}),[c]=ne(),l=e=>{s(t=>(t.push.apply(t,e),t));for(let t of e)a.delete(t)},u=(e,t,n)=>e.splice(n,0,t);return L(t=>{let n=o(),s=e();if(s[x],v(c))return c(),t;if(n.length){let e=t.filter(e=>!n.includes(e));return n.length=0,r({list:e,added:[],removed:[],unchanged:e,finishRemoved:l}),e}return v(()=>{let e=new Set(s),n=s.slice(),o=[],c=[],d=[];for(let e of s)(i.has(e)?d:o).push(e);let f=!o.length;for(let r=0;r<t.length;r++){let i=t[r];e.has(i)||(a.has(i)||(c.push(i),a.add(i)),u(n,i,r)),f&&i!==n[r]&&(f=!1)}return!c.length&&f?t:(r({list:n,added:o,removed:c,unchanged:d,finishRemoved:l}),i=e,n)})},t.appear?[]:n.slice())}function ft(...e){return fe(e)}var pt=e=>e instanceof Element;function mt(e,t){if(t(e))return e;if(typeof e==`function`&&!e.length)return mt(e(),t);if(Array.isArray(e)){let n=[];for(let r of e){let e=mt(r,t);e&&(Array.isArray(e)?n.push.apply(n,e):n.push(e))}return n.length?n:null}return null}function ht(e,t=pt,n=pt){let r=L(e),i=L(()=>mt(r(),t));return i.toArray=()=>{let e=i();return Array.isArray(e)?e:e?[e]:[]},i}function gt(e){return L(()=>{let t=e.name||`s`;return{enterActive:(e.enterActiveClass||t+`-enter-active`).split(` `),enter:(e.enterClass||t+`-enter`).split(` `),enterTo:(e.enterToClass||t+`-enter-to`).split(` `),exitActive:(e.exitActiveClass||t+`-exit-active`).split(` `),exit:(e.exitClass||t+`-exit`).split(` `),exitTo:(e.exitToClass||t+`-exit-to`).split(` `),move:(e.moveClass||t+`-move`).split(` `)}})}function _t(e){requestAnimationFrame(()=>requestAnimationFrame(e))}function vt(e,t,n,r){let{onBeforeEnter:i,onEnter:a,onAfterEnter:o}=t;i?.(n),n.classList.add(...e.enter),n.classList.add(...e.enterActive),queueMicrotask(()=>{if(!n.parentNode)return r?.();a?.(n,()=>s())}),_t(()=>{n.classList.remove(...e.enter),n.classList.add(...e.enterTo),(!a||a.length<2)&&(n.addEventListener(`transitionend`,s),n.addEventListener(`animationend`,s))});function s(t){(!t||t.target===n)&&(n.removeEventListener(`transitionend`,s),n.removeEventListener(`animationend`,s),n.classList.remove(...e.enterActive),n.classList.remove(...e.enterTo),o?.(n))}}function yt(e,t,n,r){let{onBeforeExit:i,onExit:a,onAfterExit:o}=t;if(!n.parentNode)return r?.();i?.(n),n.classList.add(...e.exit),n.classList.add(...e.exitActive),a?.(n,()=>s()),_t(()=>{n.classList.remove(...e.exit),n.classList.add(...e.exitTo),(!a||a.length<2)&&(n.addEventListener(`transitionend`,s),n.addEventListener(`animationend`,s))});function s(t){(!t||t.target===n)&&(r?.(),n.removeEventListener(`transitionend`,s),n.removeEventListener(`animationend`,s),n.classList.remove(...e.exitActive),n.classList.remove(...e.exitTo),o?.(n))}}var bt=e=>{let t=gt(e);return dt(ht(()=>e.children).toArray,{appear:e.appear,onChange({added:n,removed:r,finishRemoved:i,list:a}){let o=t();for(let t of n)vt(o,e,t);let s=[];for(let e of a)e.isConnected&&(e instanceof HTMLElement||e instanceof SVGElement)&&s.push({el:e,rect:e.getBoundingClientRect()});queueMicrotask(()=>{let e=[];for(let{el:t,rect:n}of s)if(t.isConnected){let r=t.getBoundingClientRect(),i=n.left-r.left,a=n.top-r.top;(i||a)&&(t.style.transform=`translate(${i}px, ${a}px)`,t.style.transitionDuration=`0s`,e.push(t))}document.body.offsetHeight;for(let t of e){let e=function(n){(n.target===t||/transform$/.test(n.propertyName))&&(t.removeEventListener(`transitionend`,e),t.classList.remove(...o.move))};t.classList.add(...o.move),t.style.transform=t.style.transitionDuration=``,t.addEventListener(`transitionend`,e)}});for(let t of r)yt(o,e,t,()=>i([t]))}})},xt=Symbol(`fallback`);function St(e){for(let t of e)t.dispose()}function Ct(e,t,n,r={}){let i=new Map;return f(()=>St(i.values())),()=>{let n=e()||[];return n[x],v(()=>{if(!n.length)return St(i.values()),i.clear(),r.fallback?[ee(e=>(i.set(xt,{dispose:e}),r.fallback()))]:[];let e=Array(n.length),o=i.get(xt);if(!i.size||o){o?.dispose(),i.delete(xt);for(let r=0;r<n.length;r++){let i=n[r],o=t(i,r);a(e,i,r,o)}return e}let s=new Set(i.keys());for(let r=0;r<n.length;r++){let o=n[r],c=t(o,r);s.delete(c);let l=i.get(c);l?(e[r]=l.mapped,l.setIndex?.(r),l.setItem(()=>o)):a(e,o,r,c)}for(let e of s)i.get(e)?.dispose(),i.delete(e);return e})};function a(e,t,r,a){ee(o=>{let[s,c]=A(t),l={setItem:c,dispose:o};if(n.length>1){let[e,t]=A(r);l.setIndex=t,l.mapped=n(s,e)}else l.mapped=n(s);i.set(a,l),e[r]=l.mapped})}}function wt(e){let{by:t}=e;return L(Ct(()=>e.each,typeof t==`function`?t:e=>e[t],e.children,`fallback`in e?{fallback:()=>e.fallback}:void 0))}function Tt(e,t,n,r){return e.addEventListener(t,n,r),he(e.removeEventListener.bind(e,t,n,r))}function Et(e,t,n,r){let i=()=>{pe(B(e)).forEach(e=>{e&&pe(B(t)).forEach(t=>Tt(e,t,n,r))})};typeof e==`function`?k(i):P(i)}function Dt(e,t){let n=new ResizeObserver(e);return f(n.disconnect.bind(n)),{observe:e=>n.observe(e,t),unobserve:n.unobserve.bind(n)}}function Ot(e,t,n){let r=new WeakMap,{observe:i,unobserve:a}=Dt(e=>{for(let n of e){let{contentRect:e,target:i}=n,a=Math.round(e.width),o=Math.round(e.height),s=r.get(i);(!s||s.width!==a||s.height!==o)&&(t(e,i,n),r.set(i,{width:a,height:o}))}},n);k(t=>{let n=de(pe(B(e)));return ge(n,t,i,a),n},[])}var kt=/((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;function At(e){let t={},n;for(;n=kt.exec(e);)t[n[1]]=n[2];return t}function jt(e,t){if(typeof e==`string`){if(typeof t==`string`)return`${e};${t}`;e=At(e)}else typeof t==`string`&&(t=At(t));return{...e,...t}}function Mt(e,t,n=-1){return n in e?[...e.slice(0,n),t,...e.slice(n)]:[...e,t]}function Nt(e,t){let n=[...e],r=n.indexOf(t);return r!==-1&&n.splice(r,1),n}function Pt(e){return typeof e==`number`}function Ft(e){return Object.prototype.toString.call(e)===`[object String]`}function It(e){return typeof e==`function`}function Lt(e){return t=>`${e()}-${t}`}function Rt(e,t){return e?e===t||e.contains(t):!1}function zt(e,t=!1){let{activeElement:n}=Vt(e);if(!n?.nodeName)return null;if(Ht(n)&&n.contentDocument)return zt(n.contentDocument.body,t);if(t){let e=n.getAttribute(`aria-activedescendant`);if(e){let t=Vt(n).getElementById(e);if(t)return t}}return n}function Bt(e){return Vt(e).defaultView||window}function Vt(e){return e?e.ownerDocument||e:document}function Ht(e){return e.tagName===`IFRAME`}var Ut=(e=>(e.Escape=`Escape`,e.Enter=`Enter`,e.Tab=`Tab`,e.Space=` `,e.ArrowDown=`ArrowDown`,e.ArrowLeft=`ArrowLeft`,e.ArrowRight=`ArrowRight`,e.ArrowUp=`ArrowUp`,e.End=`End`,e.Home=`Home`,e.PageDown=`PageDown`,e.PageUp=`PageUp`,e))(Ut||{});function Wt(e){return typeof window<`u`&&window.navigator!=null&&e.test(window.navigator.userAgentData?.platform||window.navigator.platform)}function Gt(){return Wt(/^Mac/i)}function Kt(){return Wt(/^iPhone/i)}function qt(){return Wt(/^iPad/i)||Gt()&&navigator.maxTouchPoints>1}function Jt(){return Kt()||qt()}function Yt(){return Gt()||Jt()}function K(e,t){return t&&(It(t)?t(e):t[0](t[1],e)),e?.defaultPrevented}function q(e){return t=>{for(let n of e)K(t,n)}}function Xt(e){return Gt()?e.metaKey&&!e.ctrlKey:e.ctrlKey&&!e.metaKey}function J(e){if(e){if(Qt())e.focus({preventScroll:!0});else{let t=$t(e);e.focus(),en(t)}}}var Zt=null;function Qt(){if(Zt==null){Zt=!1;try{document.createElement(`div`).focus({get preventScroll(){return Zt=!0,!0}})}catch{}}return Zt}function $t(e){let t=e.parentNode,n=[],r=document.scrollingElement||document.documentElement;for(;t instanceof HTMLElement&&t!==r;)(t.offsetHeight<t.scrollHeight||t.offsetWidth<t.scrollWidth)&&n.push({element:t,scrollTop:t.scrollTop,scrollLeft:t.scrollLeft}),t=t.parentNode;return r instanceof HTMLElement&&n.push({element:r,scrollTop:r.scrollTop,scrollLeft:r.scrollLeft}),n}function en(e){for(let{element:t,scrollTop:n,scrollLeft:r}of e)t.scrollTop=n,t.scrollLeft=r}var tn=[`input:not([type='hidden']):not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`button:not([disabled])`,`a[href]`,`area[href]`,`[tabindex]`,`iframe`,`object`,`embed`,`audio[controls]`,`video[controls]`,`[contenteditable]:not([contenteditable='false'])`],nn=[...tn,`[tabindex]:not([tabindex="-1"]):not([disabled])`],rn=`${tn.join(`:not([hidden]),`)},[tabindex]:not([disabled]):not([hidden])`,an=nn.join(`:not([hidden]):not([tabindex="-1"]),`);function on(e,t){let n=Array.from(e.querySelectorAll(rn)).filter(sn);return t&&sn(e)&&n.unshift(e),n.forEach((e,t)=>{if(Ht(e)&&e.contentDocument){let r=e.contentDocument.body,i=on(r,!1);n.splice(t,1,...i)}}),n}function sn(e){return cn(e)&&!ln(e)}function cn(e){return e.matches(rn)&&un(e)}function ln(e){return Number.parseInt(e.getAttribute(`tabindex`)||`0`,10)<0}function un(e,t){return e.nodeName!==`#comment`&&dn(e)&&fn(e,t)&&(!e.parentElement||un(e.parentElement,e))}function dn(e){if(!(e instanceof HTMLElement)&&!(e instanceof SVGElement))return!1;let{display:t,visibility:n}=e.style,r=t!==`none`&&n!==`hidden`&&n!==`collapse`;if(r){if(!e.ownerDocument.defaultView)return r;let{getComputedStyle:t}=e.ownerDocument.defaultView,{display:n,visibility:i}=t(e);r=n!==`none`&&i!==`hidden`&&i!==`collapse`}return r}function fn(e,t){return!e.hasAttribute(`hidden`)&&(e.nodeName===`DETAILS`&&t&&t.nodeName!==`SUMMARY`?e.hasAttribute(`open`):!0)}function pn(e,t,n){let r=t?.tabbable?an:rn,i=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode(e){return t?.from?.contains(e)?NodeFilter.FILTER_REJECT:e.matches(r)&&un(e)&&(!t?.accept||t.accept(e))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});return t?.from&&(i.currentNode=t.from),i}function mn(e){let t=e;for(;t&&!hn(t);)t=t.parentElement;return t||document.scrollingElement||document.documentElement}function hn(e){let t=window.getComputedStyle(e);return/(auto|scroll)/.test(t.overflow+t.overflowX+t.overflowY)}function gn(){}function _n(e,t){let[n,r]=e,i=!1,a=t.length;for(let e=a,o=0,s=e-1;o<e;s=o++){let[a,c]=t[o],[l,u]=t[s],[,d]=t[s===0?e-1:s-1]||[0,0],f=(c-u)*(n-a)-(a-l)*(r-c);if(u<c){if(r>=u&&r<c){if(f===0)return!0;f>0&&(r===u?r>d&&(i=!i):i=!i)}}else if(c<u){if(r>c&&r<=u){if(f===0)return!0;f<0&&(r===u?r<d&&(i=!i):i=!i)}}else if(r===c&&(n>=l&&n<=a||n>=a&&n<=l))return!0}return i}function Y(e,n){return t(e,n)}var vn=new Map,yn=new Set;function bn(){if(typeof window>`u`)return;let e=e=>{if(!e.target)return;let n=vn.get(e.target);n||(n=new Set,vn.set(e.target,n),e.target.addEventListener(`transitioncancel`,t)),n.add(e.propertyName)},t=e=>{if(!e.target)return;let n=vn.get(e.target);if(n&&(n.delete(e.propertyName),n.size===0&&(e.target.removeEventListener(`transitioncancel`,t),vn.delete(e.target)),vn.size===0)){for(let e of yn)e();yn.clear()}};document.body.addEventListener(`transitionrun`,e),document.body.addEventListener(`transitionend`,t)}typeof document<`u`&&(document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,bn):bn());function xn(e,t){let n=Sn(e,t,`left`),r=Sn(e,t,`top`),i=t.offsetWidth,a=t.offsetHeight,o=e.scrollLeft,s=e.scrollTop,c=o+e.offsetWidth,l=s+e.offsetHeight;n<=o?o=n:n+i>c&&(o+=n+i-c),r<=s?s=r:r+a>l&&(s+=r+a-l),e.scrollLeft=o,e.scrollTop=s}function Sn(e,t,n){let r=n===`left`?`offsetLeft`:`offsetTop`,i=0;for(;t.offsetParent&&(i+=t[r],t.offsetParent!==e);){if(t.offsetParent.contains(e)){i-=e[r];break}t=t.offsetParent}return i}function Cn(e,t){if(document.contains(e)){let t=document.scrollingElement||document.documentElement;if(window.getComputedStyle(t).overflow!==`hidden`){let{left:t,top:n}=e.getBoundingClientRect();e?.scrollIntoView?.({block:`nearest`});let{left:r,top:i}=e.getBoundingClientRect();(Math.abs(t-r)>1||Math.abs(n-i)>1)&&e.scrollIntoView?.({block:`nearest`})}else{let n=mn(e);for(;e&&n&&e!==t&&n!==t;)xn(n,e),e=n,n=mn(e)}}}var wn={border:`0`,clip:`rect(0 0 0 0)`,"clip-path":`inset(50%)`,height:`1px`,margin:`0 -1px -1px 0`,overflow:`hidden`,padding:`0`,position:`absolute`,width:`1px`,"white-space":`nowrap`};function Tn(e,t){let[n,r]=A(En(t?.()));return k(()=>{r(e()?.tagName.toLowerCase()||En(t?.()))}),n}function En(e){return Ft(e)?e:void 0}function X(e){let[n,r]=z(e,[`as`]);if(!n.as)throw Error("[kobalte]: Polymorphic is missing the required `as` prop.");return N(S,t(r,{get component(){return n.as}}))}var Dn=Object.defineProperty,On=(e,t)=>{for(var n in t)Dn(e,n,{get:t[n],enumerable:!0})};On({},{Button:()=>Mn,Root:()=>jn});var kn=[`button`,`color`,`file`,`image`,`reset`,`submit`];function An(e){let t=e.tagName.toLowerCase();return t===`button`?!0:t===`input`&&e.type?kn.indexOf(e.type)!==-1:!1}function jn(e){let n,r=Y({type:`button`},e),[i,a]=z(r,[`ref`,`type`,`disabled`]),o=Tn(()=>n,()=>`button`),s=L(()=>{let e=o();return e!=null&&An({tagName:e,type:i.type})}),c=L(()=>o()===`input`),l=L(()=>o()===`a`&&n?.getAttribute(`href`)!=null);return N(X,t({as:`button`,ref(e){let t=ft(e=>n=e,i.ref);typeof t==`function`&&t(e)},get type(){return s()||c()?i.type:void 0},get role(){return!s()&&!l()?`button`:void 0},get tabIndex(){return!s()&&!l()&&!i.disabled?0:void 0},get disabled(){return s()||c()?i.disabled:void 0},get"aria-disabled"(){return!s()&&!c()&&i.disabled?!0:void 0},get"data-disabled"(){return i.disabled?``:void 0}},a))}var Mn=jn;function Nn(e){let[t,n]=A(e.defaultValue?.()),r=L(()=>e.value?.()!==void 0),i=L(()=>r()?e.value?.():t());return[i,t=>{v(()=>{let a=me(t,i());return Object.is(a,i())||(r()||n(a),e.onChange?.(a)),a})}]}function Pn(e){let[t,n]=Nn(e);return[()=>t()??!1,n]}function Fn(e){let[t,n]=Nn(e);return[()=>t()??[],n]}function In(e={}){let[t,n]=Pn({value:()=>B(e.isSelected),defaultValue:()=>!!B(e.defaultIsSelected),onChange:t=>e.onSelectedChange?.(t)});return{isSelected:t,setIsSelected:t=>{!B(e.isReadOnly)&&!B(e.isDisabled)&&n(t)},toggle:()=>{!B(e.isReadOnly)&&!B(e.isDisabled)&&n(!t())}}}function Ln(e){let t=e.startIndex??0,n=e.startLevel??0,r=[],i=t=>{if(t==null)return``;let n=e.getKey??`key`,r=Ft(n)?t[n]:n(t);return r==null?``:String(r)},a=t=>{if(t==null)return``;let n=e.getTextValue??`textValue`,r=Ft(n)?t[n]:n(t);return r==null?``:String(r)},o=t=>{if(t==null)return!1;let n=e.getDisabled??`disabled`;return(Ft(n)?t[n]:n(t))??!1},s=t=>{if(t!=null)return Ft(e.getSectionChildren)?t[e.getSectionChildren]:e.getSectionChildren?.(t)};for(let c of e.dataSource){if(Ft(c)||Pt(c)){r.push({type:`item`,rawValue:c,key:String(c),textValue:String(c),disabled:o(c),level:n,index:t}),t++;continue}if(s(c)!=null){r.push({type:`section`,rawValue:c,key:``,textValue:``,disabled:!1,level:n,index:t}),t++;let i=s(c)??[];if(i.length>0){let a=Ln({dataSource:i,getKey:e.getKey,getTextValue:e.getTextValue,getDisabled:e.getDisabled,getSectionChildren:e.getSectionChildren,startIndex:t,startLevel:n+1});r.push(...a),t+=a.length}}else r.push({type:`item`,rawValue:c,key:i(c),textValue:a(c),disabled:o(c),level:n,index:t}),t++}return r}function Rn(e,t=[]){return L(()=>{let n=Ln({dataSource:B(e.dataSource),getKey:B(e.getKey),getTextValue:B(e.getTextValue),getDisabled:B(e.getDisabled),getSectionChildren:B(e.getSectionChildren)});for(let e=0;e<t.length;e++)t[e]();return e.factory(n)})}var zn=new Set([`Avst`,`Arab`,`Armi`,`Syrc`,`Samr`,`Mand`,`Thaa`,`Mend`,`Nkoo`,`Adlm`,`Rohg`,`Hebr`]),Bn=new Set([`ae`,`ar`,`arc`,`bcc`,`bqi`,`ckb`,`dv`,`fa`,`glk`,`he`,`ku`,`mzn`,`nqo`,`pnb`,`ps`,`sd`,`ug`,`ur`,`yi`]);function Vn(e){if(Intl.Locale){let t=new Intl.Locale(e).maximize().script??``;return zn.has(t)}let t=e.split(`-`)[0];return Bn.has(t)}function Hn(e){return Vn(e)?`rtl`:`ltr`}function Un(){let e=typeof navigator<`u`&&(navigator.language||navigator.userLanguage)||`en-US`;return{locale:e,direction:Hn(e)}}var Wn=Un(),Gn=new Set;function Kn(){Wn=Un();for(let e of Gn)e(Wn)}function qn(){let[e,t]=A(Wn),n=L(()=>e());return m(()=>{Gn.size===0&&window.addEventListener(`languagechange`,Kn),Gn.add(t),f(()=>{Gn.delete(t),Gn.size===0&&window.removeEventListener(`languagechange`,Kn)})}),{locale:()=>n().locale,direction:()=>n().direction}}var Jn=D();function Yn(){let e=qn();return l(Jn)||e}var Xn=new Map;function Zn(e){let{locale:t}=Yn(),n=L(()=>t()+(e?Object.entries(e).sort((e,t)=>e[0]<t[0]?-1:1).join():``));return L(()=>{let r=n(),i;return Xn.has(r)&&(i=Xn.get(r)),i||(i=new Intl.Collator(t(),e),Xn.set(r,i)),i})}var Qn=class e extends Set{anchorKey;currentKey;constructor(t,n,r){super(t),t instanceof e?(this.anchorKey=n||t.anchorKey,this.currentKey=r||t.currentKey):(this.anchorKey=n,this.currentKey=r)}};function $n(e){let[t,n]=Nn(e);return[()=>t()??new Qn,n]}function er(e){return Yt()?e.altKey:e.ctrlKey}function tr(e){return Gt()?e.metaKey:e.ctrlKey}function nr(e){return new Qn(e)}function rr(e,t){if(e.size!==t.size)return!1;for(let n of e)if(!t.has(n))return!1;return!0}function ir(e){let t=Y({selectionMode:`none`,selectionBehavior:`toggle`},e),[n,r]=A(!1),[i,a]=A(),[o,s]=$n({value:L(()=>{let e=B(t.selectedKeys);return e==null?e:nr(e)}),defaultValue:L(()=>{let e=B(t.defaultSelectedKeys);return e==null?new Qn:nr(e)}),onChange:e=>t.onSelectionChange?.(e)}),[c,l]=A(B(t.selectionBehavior));return k(()=>{let e=o();B(t.selectionBehavior)===`replace`&&c()===`toggle`&&typeof e==`object`&&e.size===0&&l(`replace`)}),k(()=>{l(B(t.selectionBehavior)??`toggle`)}),{selectionMode:()=>B(t.selectionMode),disallowEmptySelection:()=>B(t.disallowEmptySelection)??!1,selectionBehavior:c,setSelectionBehavior:l,isFocused:n,setFocused:r,focusedKey:i,setFocusedKey:a,selectedKeys:o,setSelectedKeys:e=>{(B(t.allowDuplicateSelectionEvents)||!rr(e,o()))&&s(e)}}}function ar(e){let[t,n]=A(``),[r,i]=A(-1);return{typeSelectHandlers:{onKeyDown:a=>{if(B(e.isDisabled))return;let o=B(e.keyboardDelegate),s=B(e.selectionManager);if(!o.getKeyForSearch)return;let c=or(a.key);if(!c||a.ctrlKey||a.metaKey)return;c===` `&&t().trim().length>0&&(a.preventDefault(),a.stopPropagation());let l=n(e=>e+c),u=o.getKeyForSearch(l,s.focusedKey())??o.getKeyForSearch(l);u==null&&sr(l)&&(l=l[0],u=o.getKeyForSearch(l,s.focusedKey())??o.getKeyForSearch(l)),u!=null&&(s.setFocusedKey(u),e.onTypeSelect?.(u)),clearTimeout(r()),i(window.setTimeout(()=>n(``),500))}}}}function or(e){return e.length===1||!/^[A-Z]/i.test(e)?e:``}function sr(e){return e.split(``).every(t=>t===e[0])}function cr(e,n,r){let i=t({selectOnFocus:()=>B(e.selectionManager).selectionBehavior()===`replace`},e),a=()=>n(),{direction:o}=Yn(),s={top:0,left:0};Et(()=>B(i.isVirtualized)?void 0:a(),`scroll`,()=>{let e=a();e&&(s={top:e.scrollTop,left:e.scrollLeft})});let{typeSelectHandlers:c}=ar({isDisabled:()=>B(i.disallowTypeAhead),keyboardDelegate:()=>B(i.keyboardDelegate),selectionManager:()=>B(i.selectionManager)}),l=()=>B(i.orientation)??`vertical`,u=e=>{K(e,c.onKeyDown),e.altKey&&e.key===`Tab`&&e.preventDefault();let t=n();if(!t?.contains(e.target))return;let r=B(i.selectionManager),a=B(i.selectOnFocus),s=t=>{t!=null&&(r.setFocusedKey(t),e.shiftKey&&r.selectionMode()===`multiple`?r.extendSelection(t):a&&!er(e)&&r.replaceSelection(t))},u=B(i.keyboardDelegate),d=B(i.shouldFocusWrap),f=r.focusedKey();switch(e.key){case l()===`vertical`?`ArrowDown`:`ArrowRight`:if(u.getKeyBelow){e.preventDefault();let t;t=f==null?u.getFirstKey?.():u.getKeyBelow(f),t==null&&d&&(t=u.getFirstKey?.(f)),s(t)}break;case l()===`vertical`?`ArrowUp`:`ArrowLeft`:if(u.getKeyAbove){e.preventDefault();let t;t=f==null?u.getLastKey?.():u.getKeyAbove(f),t==null&&d&&(t=u.getLastKey?.(f)),s(t)}break;case l()===`vertical`?`ArrowLeft`:`ArrowUp`:if(u.getKeyLeftOf){e.preventDefault();let t=o()===`rtl`,n;n=f==null?t?u.getFirstKey?.():u.getLastKey?.():u.getKeyLeftOf(f),s(n)}break;case l()===`vertical`?`ArrowRight`:`ArrowDown`:if(u.getKeyRightOf){e.preventDefault();let t=o()===`rtl`,n;n=f==null?t?u.getLastKey?.():u.getFirstKey?.():u.getKeyRightOf(f),s(n)}break;case`Home`:if(u.getFirstKey){e.preventDefault();let t=u.getFirstKey(f,tr(e));t!=null&&(r.setFocusedKey(t),tr(e)&&e.shiftKey&&r.selectionMode()===`multiple`?r.extendSelection(t):a&&r.replaceSelection(t))}break;case`End`:if(u.getLastKey){e.preventDefault();let t=u.getLastKey(f,tr(e));t!=null&&(r.setFocusedKey(t),tr(e)&&e.shiftKey&&r.selectionMode()===`multiple`?r.extendSelection(t):a&&r.replaceSelection(t))}break;case`PageDown`:u.getKeyPageBelow&&f!=null&&(e.preventDefault(),s(u.getKeyPageBelow(f)));break;case`PageUp`:u.getKeyPageAbove&&f!=null&&(e.preventDefault(),s(u.getKeyPageAbove(f)));break;case`a`:tr(e)&&r.selectionMode()===`multiple`&&B(i.disallowSelectAll)!==!0&&(e.preventDefault(),r.selectAll());break;case`Escape`:e.defaultPrevented||(e.preventDefault(),B(i.disallowEmptySelection)||r.clearSelection());break;case`Tab`:if(!B(i.allowsTabNavigation)){if(e.shiftKey)t.focus();else{let e=pn(t,{tabbable:!0}),n,r;do r=e.lastChild(),r&&(n=r);while(r);n&&!n.contains(document.activeElement)&&J(n)}break}}},f=e=>{let t=B(i.selectionManager),n=B(i.keyboardDelegate),r=B(i.selectOnFocus);if(t.isFocused()){e.currentTarget.contains(e.target)||t.setFocused(!1);return}if(e.currentTarget.contains(e.target)){if(t.setFocused(!0),t.focusedKey()==null){let i=e=>{e!=null&&(t.setFocusedKey(e),r&&t.replaceSelection(e))},a=e.relatedTarget;a&&e.currentTarget.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_FOLLOWING?i(t.lastSelectedKey()??n.getLastKey?.()):i(t.firstSelectedKey()??n.getFirstKey?.())}else if(!B(i.isVirtualized)){let e=a();if(e){e.scrollTop=s.top,e.scrollLeft=s.left;let n=e.querySelector(`[data-key="${t.focusedKey()}"]`);n&&(J(n),xn(e,n))}}}},p=e=>{let t=B(i.selectionManager);e.currentTarget.contains(e.relatedTarget)||t.setFocused(!1)},h=e=>{a()===e.target&&e.preventDefault()},g=()=>{let e=B(i.autoFocus);if(!e)return;let t=B(i.selectionManager),r=B(i.keyboardDelegate),a;e===`first`&&(a=r.getFirstKey?.()),e===`last`&&(a=r.getLastKey?.());let o=t.selectedKeys();o.size&&(a=o.values().next().value),t.setFocused(!0),t.setFocusedKey(a);let s=n();s&&a==null&&!B(i.shouldUseVirtualFocus)&&J(s)};return m(()=>{i.deferAutoFocus?setTimeout(g,0):g()}),k(d([a,()=>B(i.isVirtualized),()=>B(i.selectionManager).focusedKey()],e=>{let[t,n,r]=e;if(n)r&&i.scrollToKey?.(r);else if(r&&t){let e=t.querySelector(`[data-key="${r}"]`);e&&xn(t,e)}})),{tabIndex:L(()=>{if(!B(i.shouldUseVirtualFocus))return B(i.selectionManager).focusedKey()==null?0:-1}),onKeyDown:u,onMouseDown:h,onFocusIn:f,onFocusOut:p}}function lr(e,t){let n=()=>B(e.selectionManager),r=()=>B(e.key),i=()=>B(e.shouldUseVirtualFocus),a=e=>{n().selectionMode()!==`none`&&(n().selectionMode()===`single`?n().isSelected(r())&&!n().disallowEmptySelection()?n().toggleSelection(r()):n().replaceSelection(r()):e?.shiftKey?n().extendSelection(r()):n().selectionBehavior()===`toggle`||tr(e)||`pointerType`in e&&e.pointerType===`touch`?n().toggleSelection(r()):n().replaceSelection(r()))},o=()=>n().isSelected(r()),s=()=>B(e.disabled)||n().isDisabled(r()),c=()=>!s()&&n().canSelectItem(r()),l=null,u=t=>{c()&&(l=t.pointerType,t.pointerType===`mouse`&&t.button===0&&!B(e.shouldSelectOnPressUp)&&a(t))},f=t=>{c()&&t.pointerType===`mouse`&&t.button===0&&B(e.shouldSelectOnPressUp)&&B(e.allowsDifferentPressOrigin)&&a(t)},p=t=>{c()&&(B(e.shouldSelectOnPressUp)&&!B(e.allowsDifferentPressOrigin)||l!==`mouse`)&&a(t)},m=e=>{c()&&[`Enter`,` `].includes(e.key)&&(er(e)?n().toggleSelection(r()):a(e))},h=e=>{s()&&e.preventDefault()},g=e=>{let a=t();i()||s()||!a||e.target===a&&n().setFocusedKey(r())},_=L(()=>{if(!(i()||s()))return r()===n().focusedKey()?0:-1}),v=L(()=>B(e.virtualized)?void 0:r());return k(d([t,r,i,()=>n().focusedKey(),()=>n().isFocused()],([t,n,r,i,a])=>{t&&n===i&&a&&!r&&document.activeElement!==t&&(e.focus?e.focus():J(t))})),{isSelected:o,isDisabled:s,allowsSelection:c,tabIndex:_,dataKey:v,onPointerDown:u,onPointerUp:f,onClick:p,onKeyDown:m,onMouseDown:h,onFocus:g}}var ur=class{collection;state;constructor(e,t){this.collection=e,this.state=t}selectionMode(){return this.state.selectionMode()}disallowEmptySelection(){return this.state.disallowEmptySelection()}selectionBehavior(){return this.state.selectionBehavior()}setSelectionBehavior(e){this.state.setSelectionBehavior(e)}isFocused(){return this.state.isFocused()}setFocused(e){this.state.setFocused(e)}focusedKey(){return this.state.focusedKey()}setFocusedKey(e){(e==null||this.collection().getItem(e))&&this.state.setFocusedKey(e)}selectedKeys(){return this.state.selectedKeys()}isSelected(e){if(this.state.selectionMode()===`none`)return!1;let t=this.getKey(e);return t!=null&&this.state.selectedKeys().has(t)}isEmpty(){return this.state.selectedKeys().size===0}isSelectAll(){if(this.isEmpty())return!1;let e=this.state.selectedKeys();return this.getAllSelectableKeys().every(t=>e.has(t))}firstSelectedKey(){let e;for(let t of this.state.selectedKeys()){let n=this.collection().getItem(t),r=n?.index!=null&&e?.index!=null&&n.index<e.index;(!e||r)&&(e=n)}return e?.key}lastSelectedKey(){let e;for(let t of this.state.selectedKeys()){let n=this.collection().getItem(t),r=n?.index!=null&&e?.index!=null&&n.index>e.index;(!e||r)&&(e=n)}return e?.key}extendSelection(e){if(this.selectionMode()===`none`)return;if(this.selectionMode()===`single`){this.replaceSelection(e);return}let t=this.getKey(e);if(t==null)return;let n=this.state.selectedKeys(),r=n.anchorKey||t,i=new Qn(n,r,t);for(let e of this.getKeyRange(r,n.currentKey||t))i.delete(e);for(let e of this.getKeyRange(t,r))this.canSelectItem(e)&&i.add(e);this.state.setSelectedKeys(i)}getKeyRange(e,t){let n=this.collection().getItem(e),r=this.collection().getItem(t);return n&&r?n.index!=null&&r.index!=null&&n.index<=r.index?this.getKeyRangeInternal(e,t):this.getKeyRangeInternal(t,e):[]}getKeyRangeInternal(e,t){let n=[],r=e;for(;r!=null;){let e=this.collection().getItem(r);if(e&&e.type===`item`&&n.push(r),r===t)return n;r=this.collection().getKeyAfter(r)}return[]}getKey(e){let t=this.collection().getItem(e);return t?!t||t.type!==`item`?null:t.key:e}toggleSelection(e){if(this.selectionMode()===`none`)return;if(this.selectionMode()===`single`&&!this.isSelected(e)){this.replaceSelection(e);return}let t=this.getKey(e);if(t==null)return;let n=new Qn(this.state.selectedKeys());n.has(t)?n.delete(t):this.canSelectItem(t)&&(n.add(t),n.anchorKey=t,n.currentKey=t),!(this.disallowEmptySelection()&&n.size===0)&&this.state.setSelectedKeys(n)}replaceSelection(e){if(this.selectionMode()===`none`)return;let t=this.getKey(e);if(t==null)return;let n=this.canSelectItem(t)?new Qn([t],t,t):new Qn;this.state.setSelectedKeys(n)}setSelectedKeys(e){if(this.selectionMode()===`none`)return;let t=new Qn;for(let n of e){let e=this.getKey(n);if(e!=null&&(t.add(e),this.selectionMode()===`single`))break}this.state.setSelectedKeys(t)}selectAll(){this.selectionMode()===`multiple`&&this.state.setSelectedKeys(new Set(this.getAllSelectableKeys()))}clearSelection(){let e=this.state.selectedKeys();!this.disallowEmptySelection()&&e.size>0&&this.state.setSelectedKeys(new Qn)}toggleSelectAll(){this.isSelectAll()?this.clearSelection():this.selectAll()}select(e,t){this.selectionMode()!==`none`&&(this.selectionMode()===`single`?this.isSelected(e)&&!this.disallowEmptySelection()?this.toggleSelection(e):this.replaceSelection(e):this.selectionBehavior()===`toggle`||t&&t.pointerType===`touch`?this.toggleSelection(e):this.replaceSelection(e))}isSelectionEqual(e){if(e===this.state.selectedKeys())return!0;let t=this.selectedKeys();if(e.size!==t.size)return!1;for(let n of e)if(!t.has(n))return!1;for(let n of t)if(!e.has(n))return!1;return!0}canSelectItem(e){if(this.state.selectionMode()===`none`)return!1;let t=this.collection().getItem(e);return t!=null&&!t.disabled}isDisabled(e){let t=this.collection().getItem(e);return!t||t.disabled}getAllSelectableKeys(){let e=[];return(t=>{for(;t!=null;){if(this.canSelectItem(t)){let n=this.collection().getItem(t);if(!n)continue;n.type===`item`&&e.push(t)}t=this.collection().getKeyAfter(t)}})(this.collection().getFirstKey()),e}},dr=class{keyMap=new Map;iterable;firstKey;lastKey;constructor(e){this.iterable=e;for(let t of e)this.keyMap.set(t.key,t);if(this.keyMap.size===0)return;let t,n=0;for(let[e,r]of this.keyMap)t?(t.nextKey=e,r.prevKey=t.key):(this.firstKey=e,r.prevKey=void 0),r.type===`item`&&(r.index=n++),t=r,t.nextKey=void 0;this.lastKey=t.key}*[Symbol.iterator](){yield*this.iterable}getSize(){return this.keyMap.size}getKeys(){return this.keyMap.keys()}getKeyBefore(e){return this.keyMap.get(e)?.prevKey}getKeyAfter(e){return this.keyMap.get(e)?.nextKey}getFirstKey(){return this.firstKey}getLastKey(){return this.lastKey}getItem(e){return this.keyMap.get(e)}at(e){let t=[...this.getKeys()];return this.getItem(t[e])}};function fr(e){let t=ir(e),n=Rn({dataSource:()=>B(e.dataSource),getKey:()=>B(e.getKey),getTextValue:()=>B(e.getTextValue),getDisabled:()=>B(e.getDisabled),getSectionChildren:()=>B(e.getSectionChildren),factory:t=>e.filter?new dr(e.filter(t)):new dr(t)},[()=>e.filter]),r=new ur(n,t);return ae(()=>{let e=t.focusedKey();e!=null&&!n().getItem(e)&&t.setFocusedKey(void 0)}),{collection:n,selectionManager:()=>r}}var pr=D();function mr(){return l(pr)}function hr(){let e=mr();if(e===void 0)throw Error("[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component");return e}function gr(e,t){return!!(t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_PRECEDING)}function _r(e,t){let n=t.ref();if(!n)return-1;let r=e.length;if(!r)return-1;for(;r--;){let t=e[r]?.ref();if(t&&gr(t,n))return r+1}return 0}function vr(e){let t=e.map((e,t)=>[t,e]),n=!1;return t.sort(([e,t],[r,i])=>{let a=t.ref(),o=i.ref();return a===o||!a||!o?0:gr(a,o)?(e>r&&(n=!0),-1):(e<r&&(n=!0),1)}),n?t.map(([e,t])=>t):e}function yr(e,t){let n=vr(e);e!==n&&t(n)}function br(e){let t=e[0],n=e[e.length-1]?.ref(),r=t?.ref()?.parentElement;for(;r;){if(n&&r.contains(n))return r;r=r.parentElement}return Vt(r).body}function xr(e,t){k(()=>{let n=setTimeout(()=>{yr(e(),t)});f(()=>clearTimeout(n))})}function Sr(e,t){if(typeof IntersectionObserver!=`function`){xr(e,t);return}let n=[];k(()=>{let r=()=>{let r=!!n.length;n=e(),r&&yr(e(),t)},i=br(e()),a=new IntersectionObserver(r,{root:i});for(let t of e()){let e=t.ref();e&&a.observe(e)}f(()=>a.disconnect())})}function Cr(e={}){let[t,n]=Fn({value:()=>B(e.items),onChange:t=>e.onItemsChange?.(t)});Sr(t,n);let r=e=>(n(t=>Mt(t,e,_r(t,e))),()=>{n(t=>{let n=t.filter(t=>t.ref()!==e.ref());return t.length===n.length?t:n})});return{DomCollectionProvider:e=>N(pr.Provider,{value:{registerItem:r},get children(){return e.children}})}}function wr(e){let t=hr(),n=Y({shouldRegisterItem:!0},e);k(()=>{if(!n.shouldRegisterItem)return;let e=t.registerItem(n.getItem());f(e)})}var Tr=[`top`,`right`,`bottom`,`left`],Er=Math.min,Dr=Math.max,Or=Math.round,kr=Math.floor,Ar=e=>({x:e,y:e}),jr={left:`right`,right:`left`,bottom:`top`,top:`bottom`};function Mr(e,t,n){return Dr(e,Er(t,n))}function Nr(e,t){return typeof e==`function`?e(t):e}function Pr(e){return e.split(`-`)[0]}function Fr(e){return e.split(`-`)[1]}function Ir(e){return e===`x`?`y`:`x`}function Lr(e){return e===`y`?`height`:`width`}function Rr(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function zr(e){return Ir(Rr(e))}function Br(e,t,n){n===void 0&&(n=!1);let r=Fr(e),i=zr(e),a=Lr(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=Yr(o)),[o,Yr(o)]}function Vr(e){let t=Yr(e);return[Hr(e),t,Hr(t)]}function Hr(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}var Ur=[`left`,`right`],Wr=[`right`,`left`],Gr=[`top`,`bottom`],Kr=[`bottom`,`top`];function qr(e,t,n){switch(e){case`top`:case`bottom`:return n?t?Wr:Ur:t?Ur:Wr;case`left`:case`right`:return t?Gr:Kr;default:return[]}}function Jr(e,t,n,r){let i=Fr(e),a=qr(Pr(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(Hr)))),a}function Yr(e){let t=Pr(e);return jr[t]+e.slice(t.length)}function Xr(e){return{top:0,right:0,bottom:0,left:0,...e}}function Zr(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:Xr(e)}function Qr(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}function $r(e,t,n){let{reference:r,floating:i}=e,a=Rr(t),o=zr(t),s=Lr(o),c=Pr(t),l=a===`y`,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,p;switch(c){case`top`:p={x:u,y:r.y-i.height};break;case`bottom`:p={x:u,y:r.y+r.height};break;case`right`:p={x:r.x+r.width,y:d};break;case`left`:p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}switch(Fr(t)){case`start`:p[o]-=f*(n&&l?-1:1);break;case`end`:p[o]+=f*(n&&l?-1:1)}return p}async function ei(e,t){t===void 0&&(t={});let{x:n,y:r,platform:i,rects:a,elements:o,strategy:s}=e,{boundary:c=`clippingAncestors`,rootBoundary:l=`viewport`,elementContext:u=`floating`,altBoundary:d=!1,padding:f=0}=Nr(t,e),p=Zr(f),m=o[d?u===`floating`?`reference`:`floating`:u],h=Qr(await i.getClippingRect({element:await(i.isElement==null?void 0:i.isElement(m))??!0?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(o.floating)),boundary:c,rootBoundary:l,strategy:s})),g=u===`floating`?{x:n,y:r,width:a.floating.width,height:a.floating.height}:a.reference,_=await(i.getOffsetParent==null?void 0:i.getOffsetParent(o.floating)),v=await(i.isElement==null?void 0:i.isElement(_))&&await(i.getScale==null?void 0:i.getScale(_))||{x:1,y:1},y=Qr(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:g,offsetParent:_,strategy:s}):g);return{top:(h.top-y.top+p.top)/v.y,bottom:(y.bottom-h.bottom+p.bottom)/v.y,left:(h.left-y.left+p.left)/v.x,right:(y.right-h.right+p.right)/v.x}}var ti=50,ni=async(e,t,n)=>{let{placement:r=`bottom`,strategy:i=`absolute`,middleware:a=[],platform:o}=n,s=o.detectOverflow?o:{...o,detectOverflow:ei},c=await(o.isRTL==null?void 0:o.isRTL(t)),l=await o.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=$r(l,r,c),f=r,p=0,m={};for(let n=0;n<a.length;n++){let h=a[n];if(!h)continue;let{name:g,fn:_}=h,{x:v,y,data:b,reset:x}=await _({x:u,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:m,rects:l,platform:s,elements:{reference:e,floating:t}});u=v??u,d=y??d,m[g]={...m[g],...b},x&&p<ti&&(p++,typeof x==`object`&&(x.placement&&(f=x.placement),x.rects&&(l=x.rects===!0?await o.getElementRects({reference:e,floating:t,strategy:i}):x.rects),{x:u,y:d}=$r(l,f,c)),n=-1)}return{x:u,y:d,placement:f,strategy:i,middlewareData:m}},ri=e=>({name:`arrow`,options:e,async fn(t){let{x:n,y:r,placement:i,rects:a,platform:o,elements:s,middlewareData:c}=t,{element:l,padding:u=0}=Nr(e,t)||{};if(l==null)return{};let d=Zr(u),f={x:n,y:r},p=zr(i),m=Lr(p),h=await o.getDimensions(l),g=p===`y`,_=g?`top`:`left`,v=g?`bottom`:`right`,y=g?`clientHeight`:`clientWidth`,b=a.reference[m]+a.reference[p]-f[p]-a.floating[m],x=f[p]-a.reference[p],S=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l)),C=S?S[y]:0;(!C||!await(o.isElement==null?void 0:o.isElement(S)))&&(C=s.floating[y]||a.floating[m]);let w=b/2-x/2,T=C/2-h[m]/2-1,E=Er(d[_],T),D=Er(d[v],T),O=E,k=C-h[m]-D,A=C/2-h[m]/2+w,ee=Mr(O,A,k),te=!c.arrow&&Fr(i)!=null&&A!==ee&&a.reference[m]/2-(A<O?E:D)-h[m]/2<0,j=te?A<O?A-O:A-k:0;return{[p]:f[p]+j,data:{[p]:ee,centerOffset:A-ee-j,...te&&{alignmentOffset:j}},reset:te}}}),ii=function(e){return e===void 0&&(e={}),{name:`flip`,options:e,async fn(t){var n;let{placement:r,middlewareData:i,rects:a,initialPlacement:o,platform:s,elements:c}=t,{mainAxis:l=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:f=`bestFit`,fallbackAxisSideDirection:p=`none`,flipAlignment:m=!0,...h}=Nr(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};let g=Pr(r),_=Rr(o),v=Pr(o)===o,y=await(s.isRTL==null?void 0:s.isRTL(c.floating)),b=d||(v||!m?[Yr(o)]:Vr(o)),x=p!==`none`;!d&&x&&b.push(...Jr(o,m,p,y));let S=[o,...b],C=await s.detectOverflow(t,h),w=[],T=i.flip?.overflows||[];if(l&&w.push(C[g]),u){let e=Br(r,a,y);w.push(C[e[0]],C[e[1]])}if(T=[...T,{placement:r,overflows:w}],!w.every(e=>e<=0)){let e=(i.flip?.index||0)+1,t=S[e];if(t&&(u!==`alignment`||_===Rr(t)||T.every(e=>Rr(e.placement)!==_||e.overflows[0]>0)))return{data:{index:e,overflows:T},reset:{placement:t}};let n=T.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0]?.placement;if(!n)switch(f){case`bestFit`:{let e=T.filter(e=>{if(x){let t=Rr(e.placement);return t===_||t===`y`}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0]?.[0];e&&(n=e);break}case`initialPlacement`:n=o}if(r!==n)return{reset:{placement:n}}}return{}}}};function ai(e,t){return{top:e.top-t.height,right:e.right-t.width,bottom:e.bottom-t.height,left:e.left-t.width}}function oi(e){return Tr.some(t=>e[t]>=0)}var si=function(e){return e===void 0&&(e={}),{name:`hide`,options:e,async fn(t){let{rects:n,platform:r}=t,{strategy:i=`referenceHidden`,...a}=Nr(e,t);switch(i){case`referenceHidden`:{let e=ai(await r.detectOverflow(t,{...a,elementContext:`reference`}),n.reference);return{data:{referenceHiddenOffsets:e,referenceHidden:oi(e)}}}case`escaped`:{let e=ai(await r.detectOverflow(t,{...a,altBoundary:!0}),n.floating);return{data:{escapedOffsets:e,escaped:oi(e)}}}default:return{}}}}},ci=new Set([`left`,`top`]);async function li(e,t){let{placement:n,platform:r,elements:i}=e,a=await(r.isRTL==null?void 0:r.isRTL(i.floating)),o=Pr(n),s=Fr(n),c=Rr(n)===`y`,l=ci.has(o)?-1:1,u=a&&c?-1:1,d=Nr(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:m}=typeof d==`number`?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&typeof m==`number`&&(p=s===`end`?m*-1:m),c?{x:p*u,y:f*l}:{x:f*l,y:p*u}}var ui=function(e){return e===void 0&&(e=0),{name:`offset`,options:e,async fn(t){var n;let{x:r,y:i,placement:a,middlewareData:o}=t,s=await li(t,e);return a===o.offset?.placement&&(n=o.arrow)!=null&&n.alignmentOffset?{}:{x:r+s.x,y:i+s.y,data:{...s,placement:a}}}}},di=function(e){return e===void 0&&(e={}),{name:`shift`,options:e,async fn(t){let{x:n,y:r,placement:i,platform:a}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:c={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=Nr(e,t),u={x:n,y:r},d=await a.detectOverflow(t,l),f=Rr(Pr(i)),p=Ir(f),m=u[p],h=u[f];if(o){let e=p===`y`?`top`:`left`,t=p===`y`?`bottom`:`right`,n=m+d[e],r=m-d[t];m=Mr(n,m,r)}if(s){let e=f===`y`?`top`:`left`,t=f===`y`?`bottom`:`right`,n=h+d[e],r=h-d[t];h=Mr(n,h,r)}let g=c.fn({...t,[p]:m,[f]:h});return{...g,data:{x:g.x-n,y:g.y-r,enabled:{[p]:o,[f]:s}}}}}},fi=function(e){return e===void 0&&(e={}),{name:`size`,options:e,async fn(t){var n,r;let{placement:i,rects:a,platform:o,elements:s}=t,{apply:c=()=>{},...l}=Nr(e,t),u=await o.detectOverflow(t,l),d=Pr(i),f=Fr(i),p=Rr(i)===`y`,{width:m,height:h}=a.floating,g,_;d===`top`||d===`bottom`?(g=d,_=f===(await(o.isRTL==null?void 0:o.isRTL(s.floating))?`start`:`end`)?`left`:`right`):(_=d,g=f===`end`?`top`:`bottom`);let v=h-u.top-u.bottom,y=m-u.left-u.right,b=Er(h-u[g],v),x=Er(m-u[_],y),S=!t.middlewareData.shift,C=b,w=x;if((n=t.middlewareData.shift)!=null&&n.enabled.x&&(w=y),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(C=v),S&&!f){let e=Dr(u.left,0),t=Dr(u.right,0),n=Dr(u.top,0),r=Dr(u.bottom,0);p?w=m-2*(e!==0||t!==0?e+t:Dr(u.left,u.right)):C=h-2*(n!==0||r!==0?n+r:Dr(u.top,u.bottom))}await c({...t,availableWidth:w,availableHeight:C});let T=await o.getDimensions(s.floating);return m!==T.width||h!==T.height?{reset:{rects:!0}}:{}}}};function pi(){return typeof window<`u`}function mi(e){return _i(e)?(e.nodeName||``).toLowerCase():`#document`}function hi(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function gi(e){return((_i(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function _i(e){return pi()?e instanceof Node||e instanceof hi(e).Node:!1}function vi(e){return pi()?e instanceof Element||e instanceof hi(e).Element:!1}function yi(e){return pi()?e instanceof HTMLElement||e instanceof hi(e).HTMLElement:!1}function bi(e){return!pi()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof hi(e).ShadowRoot}function xi(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=Mi(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function Si(e){return/^(table|td|th)$/.test(mi(e))}function Ci(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}var wi=/transform|translate|scale|rotate|perspective|filter/,Ti=/paint|layout|strict|content/,Ei=e=>!!e&&e!==`none`,Di;function Oi(e){let t=vi(e)?Mi(e):e;return Ei(t.transform)||Ei(t.translate)||Ei(t.scale)||Ei(t.rotate)||Ei(t.perspective)||!Ai()&&(Ei(t.backdropFilter)||Ei(t.filter))||wi.test(t.willChange||``)||Ti.test(t.contain||``)}function ki(e){let t=Pi(e);for(;yi(t)&&!ji(t);){if(Oi(t))return t;if(Ci(t))return null;t=Pi(t)}return null}function Ai(){return Di??=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`),Di}function ji(e){return/^(html|body|#document)$/.test(mi(e))}function Mi(e){return hi(e).getComputedStyle(e)}function Ni(e){return vi(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Pi(e){if(mi(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||bi(e)&&e.host||gi(e);return bi(t)?t.host:t}function Fi(e){let t=Pi(e);return ji(t)?e.ownerDocument?e.ownerDocument.body:e.body:yi(t)&&xi(t)?t:Fi(t)}function Ii(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=Fi(e),i=r===e.ownerDocument?.body,a=hi(r);if(i){let e=Li(a);return t.concat(a,a.visualViewport||[],xi(r)?r:[],e&&n?Ii(e):[])}return t.concat(r,Ii(r,[],n))}function Li(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Ri(e){let t=Mi(e),n=parseFloat(t.width)||0,r=parseFloat(t.height)||0,i=yi(e),a=i?e.offsetWidth:n,o=i?e.offsetHeight:r,s=Or(n)!==a||Or(r)!==o;return s&&(n=a,r=o),{width:n,height:r,$:s}}function zi(e){return vi(e)?e:e.contextElement}function Bi(e){let t=zi(e);if(!yi(t))return Ar(1);let n=t.getBoundingClientRect(),{width:r,height:i,$:a}=Ri(t),o=(a?Or(n.width):n.width)/r,s=(a?Or(n.height):n.height)/i;return(!o||!Number.isFinite(o))&&(o=1),(!s||!Number.isFinite(s))&&(s=1),{x:o,y:s}}var Vi=Ar(0);function Hi(e){let t=hi(e);return!Ai()||!t.visualViewport?Vi:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Ui(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==hi(e)?!1:t}function Wi(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);let i=e.getBoundingClientRect(),a=zi(e),o=Ar(1);t&&(r?vi(r)&&(o=Bi(r)):o=Bi(e));let s=Ui(a,n,r)?Hi(a):Ar(0),c=(i.left+s.x)/o.x,l=(i.top+s.y)/o.y,u=i.width/o.x,d=i.height/o.y;if(a){let e=hi(a),t=r&&vi(r)?hi(r):r,n=e,i=Li(n);for(;i&&r&&t!==n;){let e=Bi(i),t=i.getBoundingClientRect(),r=Mi(i),a=t.left+(i.clientLeft+parseFloat(r.paddingLeft))*e.x,o=t.top+(i.clientTop+parseFloat(r.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=a,l+=o,n=hi(i),i=Li(n)}}return Qr({width:u,height:d,x:c,y:l})}function Gi(e,t){let n=Ni(e).scrollLeft;return t?t.left+n:Wi(gi(e)).left+n}function Ki(e,t){let n=e.getBoundingClientRect();return{x:n.left+t.scrollLeft-Gi(e,n),y:n.top+t.scrollTop}}function qi(e){let{elements:t,rect:n,offsetParent:r,strategy:i}=e,a=i===`fixed`,o=gi(r),s=t?Ci(t.floating):!1;if(r===o||s&&a)return n;let c={scrollLeft:0,scrollTop:0},l=Ar(1),u=Ar(0),d=yi(r);if((d||!d&&!a)&&((mi(r)!==`body`||xi(o))&&(c=Ni(r)),d)){let e=Wi(r);l=Bi(r),u.x=e.x+r.clientLeft,u.y=e.y+r.clientTop}let f=o&&!d&&!a?Ki(o,c):Ar(0);return{width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x+f.x,y:n.y*l.y-c.scrollTop*l.y+u.y+f.y}}function Ji(e){return Array.from(e.getClientRects())}function Yi(e){let t=gi(e),n=Ni(e),r=e.ownerDocument.body,i=Dr(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),a=Dr(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight),o=-n.scrollLeft+Gi(e),s=-n.scrollTop;return Mi(r).direction===`rtl`&&(o+=Dr(t.clientWidth,r.clientWidth)-i),{width:i,height:a,x:o,y:s}}var Xi=25;function Zi(e,t){let n=hi(e),r=gi(e),i=n.visualViewport,a=r.clientWidth,o=r.clientHeight,s=0,c=0;if(i){a=i.width,o=i.height;let e=Ai();(!e||e&&t===`fixed`)&&(s=i.offsetLeft,c=i.offsetTop)}let l=Gi(r);if(l<=0){let e=r.ownerDocument,t=e.body,n=getComputedStyle(t),i=e.compatMode===`CSS1Compat`&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,o=Math.abs(r.clientWidth-t.clientWidth-i);o<=Xi&&(a-=o)}else l<=Xi&&(a+=l);return{width:a,height:o,x:s,y:c}}function Qi(e,t){let n=Wi(e,!0,t===`fixed`),r=n.top+e.clientTop,i=n.left+e.clientLeft,a=yi(e)?Bi(e):Ar(1);return{width:e.clientWidth*a.x,height:e.clientHeight*a.y,x:i*a.x,y:r*a.y}}function $i(e,t,n){let r;if(t===`viewport`)r=Zi(e,n);else if(t===`document`)r=Yi(gi(e));else if(vi(t))r=Qi(t,n);else{let n=Hi(e);r={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return Qr(r)}function ea(e,t){let n=Pi(e);return n===t||!vi(n)||ji(n)?!1:Mi(n).position===`fixed`||ea(n,t)}function ta(e,t){let n=t.get(e);if(n)return n;let r=Ii(e,[],!1).filter(e=>vi(e)&&mi(e)!==`body`),i=null,a=Mi(e).position===`fixed`,o=a?Pi(e):e;for(;vi(o)&&!ji(o);){let t=Mi(o),n=Oi(o);!n&&t.position===`fixed`&&(i=null),(a?!n&&!i:!n&&t.position===`static`&&i&&(i.position===`absolute`||i.position===`fixed`)||xi(o)&&!n&&ea(e,o))?r=r.filter(e=>e!==o):i=t,o=Pi(o)}return t.set(e,r),r}function na(e){let{element:t,boundary:n,rootBoundary:r,strategy:i}=e,a=[...n===`clippingAncestors`?Ci(t)?[]:ta(t,this._c):[].concat(n),r],o=$i(t,a[0],i),s=o.top,c=o.right,l=o.bottom,u=o.left;for(let e=1;e<a.length;e++){let n=$i(t,a[e],i);s=Dr(n.top,s),c=Er(n.right,c),l=Er(n.bottom,l),u=Dr(n.left,u)}return{width:c-u,height:l-s,x:u,y:s}}function ra(e){let{width:t,height:n}=Ri(e);return{width:t,height:n}}function ia(e,t,n){let r=yi(t),i=gi(t),a=n===`fixed`,o=Wi(e,!0,a,t),s={scrollLeft:0,scrollTop:0},c=Ar(0);function l(){c.x=Gi(i)}if(r||!r&&!a){if((mi(t)!==`body`||xi(i))&&(s=Ni(t)),r){let e=Wi(t,!0,a,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}else i&&l()}a&&!r&&i&&l();let u=i&&!r&&!a?Ki(i,s):Ar(0);return{x:o.left+s.scrollLeft-c.x-u.x,y:o.top+s.scrollTop-c.y-u.y,width:o.width,height:o.height}}function aa(e){return Mi(e).position===`static`}function oa(e,t){if(!yi(e)||Mi(e).position===`fixed`)return null;if(t)return t(e);let n=e.offsetParent;return gi(e)===n&&(n=n.ownerDocument.body),n}function sa(e,t){let n=hi(e);if(Ci(e))return n;if(!yi(e)){let t=Pi(e);for(;t&&!ji(t);){if(vi(t)&&!aa(t))return t;t=Pi(t)}return n}let r=oa(e,t);for(;r&&Si(r)&&aa(r);)r=oa(r,t);return r&&ji(r)&&aa(r)&&!Oi(r)?n:r||ki(e)||n}var ca=async function(e){let t=this.getOffsetParent||sa,n=this.getDimensions,r=await n(e.floating);return{reference:ia(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function la(e){return Mi(e).direction===`rtl`}var ua={convertOffsetParentRelativeRectToViewportRelativeRect:qi,getDocumentElement:gi,getClippingRect:na,getOffsetParent:sa,getElementRects:ca,getClientRects:Ji,getDimensions:ra,getScale:Bi,isElement:vi,isRTL:la};function da(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function fa(e,t){let n=null,r,i=gi(e);function a(){var e;clearTimeout(r),(e=n)==null||e.disconnect(),n=null}function o(s,c){s===void 0&&(s=!1),c===void 0&&(c=1),a();let l=e.getBoundingClientRect(),{left:u,top:d,width:f,height:p}=l;if(s||t(),!f||!p)return;let m=kr(d),h=kr(i.clientWidth-(u+f)),g=kr(i.clientHeight-(d+p)),_=kr(u),v={rootMargin:-m+`px `+-h+`px `+-g+`px `+-_+`px`,threshold:Dr(0,Er(1,c))||1},y=!0;function b(t){let n=t[0].intersectionRatio;if(n!==c){if(!y)return o();n?o(!1,n):r=setTimeout(()=>{o(!1,1e-7)},1e3)}n===1&&!da(l,e.getBoundingClientRect())&&o(),y=!1}try{n=new IntersectionObserver(b,{...v,root:i.ownerDocument})}catch{n=new IntersectionObserver(b,v)}n.observe(e)}return o(!0),a}function pa(e,t,n,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:a=!0,elementResize:o=typeof ResizeObserver==`function`,layoutShift:s=typeof IntersectionObserver==`function`,animationFrame:c=!1}=r,l=zi(e),u=i||a?[...l?Ii(l):[],...t?Ii(t):[]]:[];u.forEach(e=>{i&&e.addEventListener(`scroll`,n,{passive:!0}),a&&e.addEventListener(`resize`,n)});let d=l&&s?fa(l,n):null,f=-1,p=null;o&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===l&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;(e=p)==null||e.observe(t)})),n()}),l&&!c&&p.observe(l),t&&p.observe(t));let m,h=c?Wi(e):null;c&&g();function g(){let t=Wi(e);h&&!da(h,t)&&n(),h=t,m=requestAnimationFrame(g)}return n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener(`scroll`,n),a&&e.removeEventListener(`resize`,n)}),d?.(),(e=p)==null||e.disconnect(),p=null,c&&cancelAnimationFrame(m)}}var ma=ui,ha=di,ga=ii,_a=fi,va=si,ya=ri,ba=(e,t,n)=>{let r=new Map,i={platform:ua,...n},a={...i.platform,_c:r};return ni(e,t,{...i,platform:a})},xa=D();function Sa(){let e=l(xa);if(e===void 0)throw Error("[kobalte]: `usePopperContext` must be used within a `Popper` component");return e}var Ca=s(`<svg display="block" viewBox="0 0 30 30" style="transform:scale(1.02)"><g><path fill="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z"></path><path stroke="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z">`),wa=30,Ta=wa/2,Ea={top:180,right:-90,bottom:0,left:90};function Da(e){let n=Sa(),r=Y({size:wa},e),[i,a]=z(r,[`ref`,`style`,`size`]),o=()=>n.currentPlacement().split(`-`)[0],s=Oa(n.contentRef),l=()=>s()?.getPropertyValue(`background-color`)||`none`,u=()=>s()?.getPropertyValue(`border-${o()}-color`)||`none`,d=()=>s()?.getPropertyValue(`border-${o()}-width`)||`0px`,f=()=>Number.parseInt(d())*2*(wa/i.size),p=()=>`rotate(${Ea[o()]} ${Ta} ${Ta}) translate(0 2)`;return N(X,t({as:`div`,ref(e){let t=ft(n.setArrowRef,i.ref);typeof t==`function`&&t(e)},"aria-hidden":`true`,get style(){return jt({position:`absolute`,"font-size":`${i.size}px`,width:`1em`,height:`1em`,"pointer-events":`none`,fill:l(),stroke:u(),"stroke-width":f()},i.style)}},a,{get children(){let e=Ca(),t=e.firstChild;return P(()=>c(t,`transform`,p())),e}}))}function Oa(e){let[t,n]=A();return k(()=>{let t=e();t&&n(Bt(t).getComputedStyle(t))}),t}function ka(e){let n=Sa(),[r,i]=z(e,[`ref`,`style`]);return N(X,t({as:`div`,ref(e){let t=ft(n.setPositionerRef,r.ref);typeof t==`function`&&t(e)},"data-popper-positioner":``,get style(){return jt({position:`absolute`,top:0,left:0,"min-width":`max-content`},r.style)}},i))}function Aa(e){let{x:t=0,y:n=0,width:r=0,height:i=0}=e??{};if(typeof DOMRect==`function`)return new DOMRect(t,n,r,i);let a={x:t,y:n,width:r,height:i,top:n,right:t+r,bottom:n+i,left:t};return{...a,toJSON:()=>a}}function ja(e,t){return{contextElement:e,getBoundingClientRect:()=>{let n=t(e);return n?Aa(n):e?e.getBoundingClientRect():Aa()}}}function Ma(e){return/^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(e)}var Na={top:`bottom`,right:`left`,bottom:`top`,left:`right`};function Pa(e,t){let[n,r]=e.split(`-`),i=Na[n];return r?n===`left`||n===`right`?`${i} ${r===`start`?`top`:`bottom`}`:r===`start`?`${i} ${t===`rtl`?`right`:`left`}`:`${i} ${t===`rtl`?`left`:`right`}`:`${i} center`}function Fa(e){let t=Y({getAnchorRect:e=>e?.getBoundingClientRect(),placement:`bottom`,gutter:0,shift:0,flip:!0,slide:!0,overlap:!1,sameWidth:!1,fitViewport:!1,hideWhenDetached:!1,detachedPadding:0,arrowPadding:4,overflowPadding:8},e),[n,r]=A(),[i,a]=A(),[o,s]=A(t.placement),c=()=>ja(t.anchorRef?.(),t.getAnchorRect),{direction:l}=Yn();async function u(){let e=c(),r=n(),a=i();if(!e||!r)return;let o=(a?.clientHeight||0)/2,u=typeof t.gutter==`number`?t.gutter+o:t.gutter??o;r.style.setProperty(`--kb-popper-content-overflow-padding`,`${t.overflowPadding}px`),e.getBoundingClientRect();let d=[ma(({placement:e})=>{let n=!!e.split(`-`)[1];return{mainAxis:u,crossAxis:n?void 0:t.shift,alignmentAxis:t.shift}})];if(t.flip!==!1){let e=typeof t.flip==`string`?t.flip.split(` `):void 0;if(e!==void 0&&!e.every(Ma))throw Error("`flip` expects a spaced-delimited list of placements");d.push(ga({padding:t.overflowPadding,fallbackPlacements:e}))}(t.slide||t.overlap)&&d.push(ha({mainAxis:t.slide,crossAxis:t.overlap,padding:t.overflowPadding})),d.push(_a({padding:t.overflowPadding,apply({availableWidth:e,availableHeight:n,rects:i}){let a=Math.round(i.reference.width);e=Math.floor(e),n=Math.floor(n),r.style.setProperty(`--kb-popper-anchor-width`,`${a}px`),r.style.setProperty(`--kb-popper-content-available-width`,`${e}px`),r.style.setProperty(`--kb-popper-content-available-height`,`${n}px`),t.sameWidth&&(r.style.width=`${a}px`),t.fitViewport&&(r.style.maxWidth=`${e}px`,r.style.maxHeight=`${n}px`)}})),t.hideWhenDetached&&d.push(va({padding:t.detachedPadding})),a&&d.push(ya({element:a,padding:t.arrowPadding}));let f=await ba(e,r,{placement:t.placement,strategy:`absolute`,middleware:d,platform:{...ua,isRTL:()=>l()===`rtl`}});if(s(f.placement),t.onCurrentPlacementChange?.(f.placement),!r)return;r.style.setProperty(`--kb-popper-content-transform-origin`,Pa(f.placement,l()));let p=Math.round(f.x),m=Math.round(f.y),h;if(t.hideWhenDetached&&(h=f.middlewareData.hide?.referenceHidden?`hidden`:`visible`),Object.assign(r.style,{top:`0`,left:`0`,transform:`translate3d(${p}px, ${m}px, 0)`,visibility:h}),a&&f.middlewareData.arrow){let{x:e,y:t}=f.middlewareData.arrow,n=f.placement.split(`-`)[0];Object.assign(a.style,{left:e==null?``:`${e}px`,top:t==null?``:`${t}px`,[n]:`100%`})}}k(()=>{let e=c(),t=n();if(!e||!t)return;let r=pa(e,t,u,{elementResize:typeof ResizeObserver==`function`});f(r)}),k(()=>{let e=n(),r=t.contentRef?.();e&&r&&queueMicrotask(()=>{e.style.zIndex=getComputedStyle(r).zIndex})});let d={currentPlacement:o,contentRef:()=>t.contentRef?.(),setPositionerRef:r,setArrowRef:a};return N(xa.Provider,{value:d,get children(){return t.children}})}var Ia=Object.assign(Fa,{Arrow:Da,Context:xa,usePopperContext:Sa,Positioner:ka}),La=`data-kb-top-layer`,Ra,za=!1,Ba=[];function Va(e){return Ba.findIndex(t=>t.node===e)}function Ha(e){return Ba[Va(e)]}function Ua(e){return Ba[Ba.length-1].node===e}function Wa(){return Ba.filter(e=>e.isPointerBlocking)}function Ga(){return[...Wa()].slice(-1)[0]}function Ka(){return Wa().length>0}function qa(e){let t=Va(Ga()?.node);return Va(e)<t}function Ja(e){Ba.push(e)}function Ya(e){let t=Va(e);t<0||Ba.splice(t,1)}function Xa(){for(let{node:e}of Ba)e.style.pointerEvents=qa(e)?`none`:`auto`}function Za(e){if(Ka()&&!za){let t=Vt(e);Ra=document.body.style.pointerEvents,t.body.style.pointerEvents=`none`,za=!0}}function Qa(e){if(Ka())return;let t=Vt(e);t.body.style.pointerEvents=Ra,t.body.style.length===0&&t.body.removeAttribute(`style`),za=!1}var $a={layers:Ba,isTopMostLayer:Ua,hasPointerBlockingLayer:Ka,isBelowPointerBlockingLayer:qa,addLayer:Ja,removeLayer:Ya,indexOf:Va,find:Ha,assignPointerEventToLayers:Xa,disableBodyPointerEvents:Za,restoreBodyPointerEvents:Qa},eo=`interactOutside.pointerDownOutside`,to=`interactOutside.focusOutside`;function no(e,t){let n,r=gn,i=()=>Vt(t()),a=t=>e.onPointerDownOutside?.(t),o=t=>e.onFocusOutside?.(t),s=t=>e.onInteractOutside?.(t),c=n=>{let r=n.target;return!(r instanceof Element)||r.closest(`[${La}]`)||!Rt(i(),r)||Rt(t(),r)?!1:!e.shouldExcludeElement?.(r)},l=e=>{function n(){let n=t(),r=e.target;if(!n||!r||!c(e))return;let i=q([a,s]);r.addEventListener(eo,i,{once:!0});let o=new CustomEvent(eo,{bubbles:!1,cancelable:!0,detail:{originalEvent:e,isContextMenu:e.button===2||Xt(e)&&e.button===0}});r.dispatchEvent(o)}e.pointerType===`touch`?(i().removeEventListener(`click`,n),r=n,i().addEventListener(`click`,n,{once:!0})):n()},u=e=>{let n=t(),r=e.target;if(!n||!r||!c(e))return;let i=q([o,s]);r.addEventListener(to,i,{once:!0});let a=new CustomEvent(to,{bubbles:!1,cancelable:!0,detail:{originalEvent:e,isContextMenu:!1}});r.dispatchEvent(a)};k(()=>{B(e.isDisabled)||(n=window.setTimeout(()=>{i().addEventListener(`pointerdown`,l,!0)},0),i().addEventListener(`focusin`,u,!0),f(()=>{window.clearTimeout(n),i().removeEventListener(`click`,r),i().removeEventListener(`pointerdown`,l,!0),i().removeEventListener(`focusin`,u,!0)}))})}function ro(e){let t=t=>{t.key===Ut.Escape&&e.onEscapeKeyDown?.(t)};k(()=>{if(B(e.isDisabled))return;let n=e.ownerDocument?.()??Vt();n.addEventListener(`keydown`,t),f(()=>{n.removeEventListener(`keydown`,t)})})}var io=D();function ao(){return l(io)}function oo(e){let n,r=ao(),[i,a]=z(e,[`ref`,`disableOutsidePointerEvents`,`excludedElements`,`onEscapeKeyDown`,`onPointerDownOutside`,`onFocusOutside`,`onInteractOutside`,`onDismiss`,`bypassTopMostLayerCheck`]),o=new Set([]),s=e=>{o.add(e);let t=r?.registerNestedLayer(e);return()=>{o.delete(e),t?.()}};no({shouldExcludeElement:e=>n?i.excludedElements?.some(t=>Rt(t(),e))||[...o].some(t=>Rt(t,e)):!1,onPointerDownOutside:e=>{n&&!$a.isBelowPointerBlockingLayer(n)&&(i.bypassTopMostLayerCheck||$a.isTopMostLayer(n))&&(i.onPointerDownOutside?.(e),i.onInteractOutside?.(e),e.defaultPrevented||i.onDismiss?.())},onFocusOutside:e=>{i.onFocusOutside?.(e),i.onInteractOutside?.(e),e.defaultPrevented||i.onDismiss?.()}},()=>n),ro({ownerDocument:()=>Vt(n),onEscapeKeyDown:e=>{n&&$a.isTopMostLayer(n)&&(i.onEscapeKeyDown?.(e),!e.defaultPrevented&&i.onDismiss&&(e.preventDefault(),i.onDismiss()))}}),m(()=>{if(!n)return;$a.addLayer({node:n,isPointerBlocking:i.disableOutsidePointerEvents,dismiss:i.onDismiss});let e=r?.registerNestedLayer(n);$a.assignPointerEventToLayers(),$a.disableBodyPointerEvents(n),f(()=>{n&&($a.removeLayer(n),e?.(),$a.assignPointerEventToLayers(),$a.restoreBodyPointerEvents(n))})}),k(d([()=>n,()=>i.disableOutsidePointerEvents],([e,t])=>{if(!e)return;let n=$a.find(e);n&&n.isPointerBlocking!==t&&(n.isPointerBlocking=t,$a.assignPointerEventToLayers()),t&&$a.disableBodyPointerEvents(e),f(()=>{$a.restoreBodyPointerEvents(e)})},{defer:!0}));let c={registerNestedLayer:s};return N(io.Provider,{value:c,get children(){return N(X,t({as:`div`,ref(e){let t=ft(e=>n=e,i.ref);typeof t==`function`&&t(e)}},a))}})}function so(e={}){let[t,n]=Pn({value:()=>B(e.open),defaultValue:()=>!!B(e.defaultOpen),onChange:t=>e.onOpenChange?.(t)}),r=()=>{n(!0)},i=()=>{n(!1)};return{isOpen:t,setIsOpen:n,open:r,close:i,toggle:()=>{t()?i():r()}}}function co(e){return t=>(e(t),()=>e(void 0))}var lo=e=>typeof e==`function`?e():e,uo=e=>{let t=L(()=>{let t=lo(e.element);if(t)return getComputedStyle(t)}),n=()=>t()?.animationName??`none`,[r,i]=A(lo(e.show)?`present`:`hidden`),a=`none`;return k(r=>{let o=lo(e.show);return v(()=>{if(r===o)return o;let e=a,s=n();o?i(`present`):s===`none`||t()?.display===`none`?i(`hidden`):i(r===!0&&e!==s?`hiding`:`hidden`)}),o}),k(()=>{let t=lo(e.element);if(!t)return;let o=e=>{e.target===t&&(a=n())},s=e=>{let a=n().includes(e.animationName);e.target===t&&a&&r()===`hiding`&&i(`hidden`)};t.addEventListener(`animationstart`,o),t.addEventListener(`animationcancel`,s),t.addEventListener(`animationend`,s),f(()=>{t.removeEventListener(`animationstart`,o),t.removeEventListener(`animationcancel`,s),t.removeEventListener(`animationend`,s)})}),{present:()=>r()===`present`||r()===`hiding`,state:r,setState:i}},fo=[`id`,`name`,`validationState`,`required`,`disabled`,`readOnly`];function po(e){let t=Y({id:`form-control-${C()}`},e),[n,r]=A(),[i,a]=A(),[o,s]=A(),[c,l]=A();return{formControlContext:{name:()=>B(t.name)??B(t.id),dataset:L(()=>({"data-valid":B(t.validationState)===`valid`?``:void 0,"data-invalid":B(t.validationState)===`invalid`?``:void 0,"data-required":B(t.required)?``:void 0,"data-disabled":B(t.disabled)?``:void 0,"data-readonly":B(t.readOnly)?``:void 0})),validationState:()=>B(t.validationState),isRequired:()=>B(t.required),isDisabled:()=>B(t.disabled),isReadOnly:()=>B(t.readOnly),labelId:n,fieldId:i,descriptionId:o,errorMessageId:c,getAriaLabelledBy:(e,t,r)=>{let i=r!=null||n()!=null;return[r,n(),i&&t!=null?e:void 0].filter(Boolean).join(` `)||void 0},getAriaDescribedBy:e=>[o(),c(),e].filter(Boolean).join(` `)||void 0,generateId:Lt(()=>B(t.id)),registerLabel:co(r),registerField:co(a),registerDescription:co(s),registerErrorMessage:co(l)}}}var mo=D();function ho(){let e=l(mo);if(e===void 0)throw Error("[kobalte]: `useFormControlContext` must be used within a `FormControlContext.Provider` component");return e}function go(e){let n=ho(),r=Y({id:n.generateId(`description`)},e);return k(()=>f(n.registerDescription(r.id))),N(X,t({as:`div`},()=>n.dataset(),r))}function _o(e){let n,r=ho(),i=Y({id:r.generateId(`label`)},e),[a,o]=z(i,[`ref`]),s=Tn(()=>n,()=>`label`);return k(()=>f(r.registerLabel(o.id))),N(X,t({as:`label`,ref(e){let t=ft(e=>n=e,a.ref);typeof t==`function`&&t(e)},get for(){return M(()=>s()===`label`)()?r.fieldId():void 0}},()=>r.dataset(),o))}function vo(e,t){k(d(e,e=>{if(e==null)return;let n=yo(e);n!=null&&(n.addEventListener(`reset`,t,{passive:!0}),f(()=>{n.removeEventListener(`reset`,t)}))}))}function yo(e){return bo(e)?e.form:e.closest(`form`)}function bo(e){return e.matches(`textarea, input, select, button`)}function xo(e){let n=ho(),r=Y({id:n.generateId(`error-message`)},e),[i,a]=z(r,[`forceMount`]),o=()=>n.validationState()===`invalid`;return k(()=>{o()&&f(n.registerErrorMessage(a.id))}),N(F,{get when(){return i.forceMount||o()},get children(){return N(X,t({as:`div`},()=>n.dataset(),a))}})}var So=`focusScope.autoFocusOnMount`,Co=`focusScope.autoFocusOnUnmount`,wo={bubbles:!1,cancelable:!0},To={stack:[],active(){return this.stack[0]},add(e){e!==this.active()&&this.active()?.pause(),this.stack=Nt(this.stack,e),this.stack.unshift(e)},remove(e){this.stack=Nt(this.stack,e),this.active()?.resume()}};function Eo(e,t){let[n,r]=A(!1),i={pause(){r(!0)},resume(){r(!1)}},a=null,o=t=>e.onMountAutoFocus?.(t),s=t=>e.onUnmountAutoFocus?.(t),c=()=>Vt(t()),l=()=>{let e=c().createElement(`span`);return e.setAttribute(`data-focus-trap`,``),e.tabIndex=0,Object.assign(e.style,wn),e},u=()=>{let e=t();return e?on(e,!0).filter(e=>!e.hasAttribute(`data-focus-trap`)):[]},d=()=>{let e=u();return e.length>0?e[0]:null},p=()=>{let e=u();return e.length>0?e[e.length-1]:null},m=()=>{let e=t();if(!e)return!1;let n=zt(e);return!n||Rt(e,n)?!1:cn(n)};k(()=>{let e=t();if(!e)return;To.add(i);let n=zt(e);if(!Rt(e,n)){let t=new CustomEvent(So,wo);e.addEventListener(So,o),e.dispatchEvent(t),t.defaultPrevented||setTimeout(()=>{J(d()),zt(e)===n&&J(e)},0)}f(()=>{e.removeEventListener(So,o),setTimeout(()=>{let t=new CustomEvent(Co,wo);m()&&t.preventDefault(),e.addEventListener(Co,s),e.dispatchEvent(t),t.defaultPrevented||J(n??c().body),e.removeEventListener(Co,s),To.remove(i)},0)})}),k(()=>{let r=t();if(!r||!B(e.trapFocus)||n())return;let i=e=>{let t=e.target;t?.closest(`[${La}]`)||(Rt(r,t)?a=t:J(a))},o=e=>{let t=e.relatedTarget??zt(r);t?.closest(`[${La}]`)||Rt(r,t)||J(a)};c().addEventListener(`focusin`,i),c().addEventListener(`focusout`,o),f(()=>{c().removeEventListener(`focusin`,i),c().removeEventListener(`focusout`,o)})}),k(()=>{let r=t();if(!r||!B(e.trapFocus)||n())return;let i=l();r.insertAdjacentElement(`afterbegin`,i);let a=l();r.insertAdjacentElement(`beforeend`,a);function o(e){let t=d(),n=p();e.relatedTarget===t?J(n):J(t)}i.addEventListener(`focusin`,o),a.addEventListener(`focusin`,o);let s=new MutationObserver(e=>{for(let t of e)t.previousSibling===a&&(a.remove(),r.insertAdjacentElement(`beforeend`,a)),t.nextSibling===i&&(i.remove(),r.insertAdjacentElement(`afterbegin`,i))});s.observe(r,{childList:!0,subtree:!1}),f(()=>{i.removeEventListener(`focusin`,o),a.removeEventListener(`focusin`,o),i.remove(),a.remove(),s.disconnect()})})}var Do=`data-live-announcer`;function Oo(e){k(()=>{B(e.isDisabled)||f(jo(B(e.targets),B(e.root)))})}var ko=new WeakMap,Ao=[];function jo(e,t=document.body){let n=new Set(e),r=new Set,i=e=>{for(let t of e.querySelectorAll(`[${Do}], [${La}]`))n.add(t);let t=e=>{if(n.has(e)||e.parentElement&&r.has(e.parentElement)&&e.parentElement.getAttribute(`role`)!==`row`)return NodeFilter.FILTER_REJECT;for(let t of n)if(e.contains(t))return NodeFilter.FILTER_SKIP;return NodeFilter.FILTER_ACCEPT},i=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:t}),o=t(e);if(o===NodeFilter.FILTER_ACCEPT&&a(e),o!==NodeFilter.FILTER_REJECT){let e=i.nextNode();for(;e!=null;)a(e),e=i.nextNode()}},a=e=>{let t=ko.get(e)??0;(e.getAttribute(`aria-hidden`)!==`true`||t!==0)&&(t===0&&e.setAttribute(`aria-hidden`,`true`),r.add(e),ko.set(e,t+1))};Ao.length&&Ao[Ao.length-1].disconnect(),i(t);let o=new MutationObserver(e=>{for(let t of e)if(t.type===`childList`&&t.addedNodes.length!==0&&![...n,...r].some(e=>e.contains(t.target))){for(let e of t.removedNodes)e instanceof Element&&(n.delete(e),r.delete(e));for(let e of t.addedNodes)(e instanceof HTMLElement||e instanceof SVGElement)&&(e.dataset.liveAnnouncer===`true`||e.dataset.reactAriaTopLayer===`true`)?n.add(e):e instanceof Element&&i(e)}});o.observe(t,{childList:!0,subtree:!0});let s={observe(){o.observe(t,{childList:!0,subtree:!0})},disconnect(){o.disconnect()}};return Ao.push(s),()=>{o.disconnect();for(let e of r){let t=ko.get(e);if(t==null)return;t===1?(e.removeAttribute(`aria-hidden`),ko.delete(e)):ko.set(e,t-1)}s===Ao[Ao.length-1]?(Ao.pop(),Ao.length&&Ao[Ao.length-1].observe()):Ao.splice(Ao.indexOf(s),1)}}var Mo=(e,t)=>{if(e.contains(t))return!0;let n=t;for(;n;){if(n===e)return!0;n=n._$host??n.parentElement}return!1},No=new Map,Po=e=>{k(()=>{let t=lo(e.style)??{},n=lo(e.properties)??[],r={};for(let n in t)r[n]=e.element.style[n];let i=No.get(e.key);i?i.activeCount++:No.set(e.key,{activeCount:1,originalStyles:r,properties:n.map(e=>e.key)}),Object.assign(e.element.style,e.style);for(let t of n)e.element.style.setProperty(t.key,t.value);f(()=>{let t=No.get(e.key);if(t){if(t.activeCount!==1){t.activeCount--;return}No.delete(e.key);for(let[n,r]of Object.entries(t.originalStyles))e.element.style[n]=r;for(let n of t.properties)e.element.style.removeProperty(n);e.element.style.length===0&&e.element.removeAttribute(`style`),e.cleanup?.()}})})},Fo=(e,t)=>{switch(t){case`x`:return[e.clientWidth,e.scrollLeft,e.scrollWidth];case`y`:return[e.clientHeight,e.scrollTop,e.scrollHeight]}},Io=(e,t)=>{let n=getComputedStyle(e),r=t===`x`?n.overflowX:n.overflowY;return r===`auto`||r===`scroll`||e.tagName===`HTML`&&r===`visible`},Lo=(e,t,n)=>{let r=t===`x`&&window.getComputedStyle(e).direction===`rtl`?-1:1,i=e,a=0,o=0,s=!1;do{let[e,c,l]=Fo(i,t),u=l-e-r*c;(c!==0||u!==0)&&Io(i,t)&&(a+=u,o+=c),i===(n??document.documentElement)?s=!0:i=i._$host??i.parentElement}while(i&&!s);return[a,o]},[Ro,zo]=A([]),Bo=e=>Ro().indexOf(e)===Ro().length-1,Vo=e=>{let n=t({element:null,enabled:!0,hideScrollbar:!0,preventScrollbarShift:!0,preventScrollbarShiftMode:`padding`,restoreScrollPosition:!0,allowPinchZoom:!1},e),r=C(),i=[0,0],a=null,o=null;k(()=>{lo(n.enabled)&&(zo(e=>[...e,r]),f(()=>{zo(e=>e.filter(e=>e!==r))}))}),k(()=>{if(!lo(n.enabled)||!lo(n.hideScrollbar))return;let{body:e}=document,t=window.innerWidth-e.offsetWidth;if(lo(n.preventScrollbarShift)){let r={overflow:`hidden`},i=[];t>0&&(lo(n.preventScrollbarShiftMode)===`padding`?r.paddingRight=`calc(${window.getComputedStyle(e).paddingRight} + ${t}px)`:r.marginRight=`calc(${window.getComputedStyle(e).marginRight} + ${t}px)`,i.push({key:`--scrollbar-width`,value:`${t}px`}));let a=window.scrollY,o=window.scrollX;Po({key:`prevent-scroll`,element:e,style:r,properties:i,cleanup:()=>{lo(n.restoreScrollPosition)&&t>0&&window.scrollTo(o,a)}})}else Po({key:`prevent-scroll`,element:e,style:{overflow:`hidden`}})}),k(()=>{Bo(r)&&lo(n.enabled)&&(document.addEventListener(`wheel`,c,{passive:!1}),document.addEventListener(`touchstart`,s,{passive:!1}),document.addEventListener(`touchmove`,l,{passive:!1}),f(()=>{document.removeEventListener(`wheel`,c),document.removeEventListener(`touchstart`,s),document.removeEventListener(`touchmove`,l)}))});let s=e=>{i=Uo(e),a=null,o=null},c=e=>{let t=e.target,r=lo(n.element),i=Ho(e),a=Math.abs(i[0])>Math.abs(i[1])?`x`:`y`,o=Wo(t,a,a===`x`?i[0]:i[1],r),s;s=r&&Mo(r,t)?!o:!0,s&&e.cancelable&&e.preventDefault()},l=e=>{let t=lo(n.element),r=e.target,s;if(e.touches.length===2)s=!lo(n.allowPinchZoom);else{if(a==null||o===null){let t=Uo(e).map((e,t)=>i[t]-e),n=Math.abs(t[0])>Math.abs(t[1])?`x`:`y`;a=n,o=n===`x`?t[0]:t[1]}if(r.type===`range`)s=!1;else{let e=Wo(r,a,o,t);s=t&&Mo(t,r)?!e:!0}}s&&e.cancelable&&e.preventDefault()}},Ho=e=>[e.deltaX,e.deltaY],Uo=e=>e.changedTouches[0]?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0],Wo=(e,t,n,r)=>{let[i,a]=Lo(e,t,r!==null&&Mo(r,e)?r:void 0);return!(n>0&&Math.abs(i)<=1||n<0&&Math.abs(a)<1)},Go=Vo,Ko={};On(Ko,{Description:()=>go,ErrorMessage:()=>xo,Item:()=>Zo,ItemControl:()=>Qo,ItemDescription:()=>$o,ItemIndicator:()=>es,ItemInput:()=>ts,ItemLabel:()=>ns,Label:()=>rs,RadioGroup:()=>as,Root:()=>is,useRadioGroupContext:()=>Jo});var qo=D();function Jo(){let e=l(qo);if(e===void 0)throw Error("[kobalte]: `useRadioGroupContext` must be used within a `RadioGroup` component");return e}var Yo=D();function Xo(){let e=l(Yo);if(e===void 0)throw Error("[kobalte]: `useRadioGroupItemContext` must be used within a `RadioGroup.Item` component");return e}function Zo(e){let n=ho(),r=Jo(),i=Y({id:`${n.generateId(`item`)}-${C()}`},e),[a,o]=z(i,[`value`,`disabled`,`onPointerDown`]),[s,c]=A(),[l,u]=A(),[d,f]=A(),[p,m]=A(),[h,g]=A(!1),_=L(()=>r.isDefaultValue(a.value)),v=L(()=>r.isSelectedValue(a.value)),y=L(()=>a.disabled||n.isDisabled()||!1),b=e=>{K(e,a.onPointerDown),h()&&e.preventDefault()},x=L(()=>({...n.dataset(),"data-disabled":y()?``:void 0,"data-checked":v()?``:void 0})),S={value:()=>a.value,dataset:x,isDefault:_,isSelected:v,isDisabled:y,inputId:s,labelId:l,descriptionId:d,inputRef:p,select:()=>r.setSelectedValue(a.value),generateId:Lt(()=>o.id),registerInput:co(c),registerLabel:co(u),registerDescription:co(f),setIsFocused:g,setInputRef:m};return N(Yo.Provider,{value:S,get children(){return N(X,t({as:`div`,role:`group`,onPointerDown:b},x,o))}})}function Qo(e){let n=Xo(),r=Y({id:n.generateId(`control`)},e),[i,a]=z(r,[`onClick`,`onKeyDown`]);return N(X,t({as:`div`,onClick:e=>{K(e,i.onClick),n.select(),n.inputRef()?.focus()},onKeyDown:e=>{K(e,i.onKeyDown),e.key===Ut.Space&&(n.select(),n.inputRef()?.focus())}},()=>n.dataset(),a))}function $o(e){let n=Xo(),r=Y({id:n.generateId(`description`)},e);return k(()=>f(n.registerDescription(r.id))),N(X,t({as:`div`},()=>n.dataset(),r))}function es(e){let n=Xo(),r=Y({id:n.generateId(`indicator`)},e),[i,a]=z(r,[`ref`,`forceMount`]),[o,s]=A(),{present:c}=uo({show:()=>i.forceMount||n.isSelected(),element:()=>o()??null});return N(F,{get when(){return c()},get children(){return N(X,t({as:`div`,ref(e){let t=ft(s,i.ref);typeof t==`function`&&t(e)}},()=>n.dataset(),a))}})}function ts(e){let n=ho(),r=Jo(),i=Xo(),a=Y({id:i.generateId(`input`)},e),[o,s]=z(a,[`ref`,`style`,`aria-labelledby`,`aria-describedby`,`onChange`,`onFocus`,`onBlur`]),c=()=>[o[`aria-labelledby`],i.labelId(),o[`aria-labelledby`]!=null&&s[`aria-label`]!=null?s.id:void 0].filter(Boolean).join(` `)||void 0,l=()=>[o[`aria-describedby`],i.descriptionId(),r.ariaDescribedBy()].filter(Boolean).join(` `)||void 0,[u,p]=A(!1);return k(d([()=>i.isSelected(),()=>i.value()],e=>{if(!e[0]&&e[1]===i.value())return;p(!0);let t=i.inputRef();t?.dispatchEvent(new Event(`input`,{bubbles:!0,cancelable:!0})),t?.dispatchEvent(new Event(`change`,{bubbles:!0,cancelable:!0}))},{defer:!0})),k(()=>f(i.registerInput(s.id))),N(X,t({as:`input`,ref(e){let t=ft(i.setInputRef,o.ref);typeof t==`function`&&t(e)},type:`radio`,get name(){return n.name()},get value(){return i.value()},get checked(){return i.isSelected()},get required(){return n.isRequired()},get disabled(){return i.isDisabled()},get readonly(){return n.isReadOnly()},get style(){return jt({...wn},o.style)},get"aria-labelledby"(){return c()},get"aria-describedby"(){return l()},onChange:e=>{if(K(e,o.onChange),e.stopPropagation(),!u()){r.setSelectedValue(i.value());let t=e.target;t.checked=i.isSelected()}p(!1)},onFocus:e=>{K(e,o.onFocus),i.setIsFocused(!0)},onBlur:e=>{K(e,o.onBlur),i.setIsFocused(!1)}},()=>i.dataset(),s))}function ns(e){let n=Xo(),r=Y({id:n.generateId(`label`)},e);return k(()=>f(n.registerLabel(r.id))),N(X,t({as:`label`,get for(){return n.inputId()}},()=>n.dataset(),r))}function rs(e){return N(_o,t({as:`span`},e))}function is(e){let n,r=Y({id:`radiogroup-${C()}`,orientation:`vertical`},e),[i,a,o]=z(r,[`ref`,`value`,`defaultValue`,`onChange`,`orientation`,`aria-labelledby`,`aria-describedby`],fo),[s,c]=Nn({value:()=>i.value,defaultValue:()=>i.defaultValue,onChange:e=>i.onChange?.(e)}),{formControlContext:l}=po(a);vo(()=>n,()=>c(i.defaultValue??``));let u=()=>l.getAriaLabelledBy(B(a.id),o[`aria-label`],i[`aria-labelledby`]),d=()=>l.getAriaDescribedBy(i[`aria-describedby`]),f=t=>t===e.defaultValue,p=e=>e===s(),m={ariaDescribedBy:d,isDefaultValue:f,isSelectedValue:p,setSelectedValue:e=>{if(!(l.isReadOnly()||l.isDisabled())&&(c(e),n))for(let e of n.querySelectorAll(`[type='radio']`)){let t=e;t.checked=p(t.value)}}};return N(mo.Provider,{value:l,get children(){return N(qo.Provider,{value:m,get children(){return N(X,t({as:`div`,ref(e){let t=ft(e=>n=e,i.ref);typeof t==`function`&&t(e)},role:`radiogroup`,get id(){return B(a.id)},get"aria-invalid"(){return l.validationState()===`invalid`||void 0},get"aria-required"(){return l.isRequired()||void 0},get"aria-disabled"(){return l.isDisabled()||void 0},get"aria-readonly"(){return l.isReadOnly()||void 0},get"aria-orientation"(){return i.orientation},get"aria-labelledby"(){return u()},get"aria-describedby"(){return d()}},()=>l.dataset(),o))}})}})}var as=Object.assign(is,{Description:go,ErrorMessage:xo,Item:Zo,ItemControl:Qo,ItemDescription:$o,ItemIndicator:es,ItemInput:ts,ItemLabel:ns,Label:rs}),os=class{collection;ref;collator;constructor(e,t,n){this.collection=e,this.ref=t,this.collator=n}getKeyBelow(e){let t=this.collection().getKeyAfter(e);for(;t!=null;){let e=this.collection().getItem(t);if(e&&e.type===`item`&&!e.disabled)return t;t=this.collection().getKeyAfter(t)}}getKeyAbove(e){let t=this.collection().getKeyBefore(e);for(;t!=null;){let e=this.collection().getItem(t);if(e&&e.type===`item`&&!e.disabled)return t;t=this.collection().getKeyBefore(t)}}getFirstKey(){let e=this.collection().getFirstKey();for(;e!=null;){let t=this.collection().getItem(e);if(t&&t.type===`item`&&!t.disabled)return e;e=this.collection().getKeyAfter(e)}}getLastKey(){let e=this.collection().getLastKey();for(;e!=null;){let t=this.collection().getItem(e);if(t&&t.type===`item`&&!t.disabled)return e;e=this.collection().getKeyBefore(e)}}getItem(e){return this.ref?.()?.querySelector(`[data-key="${e}"]`)??null}getKeyPageAbove(e){let t=this.ref?.(),n=this.getItem(e);if(!t||!n)return;let r=Math.max(0,n.offsetTop+n.offsetHeight-t.offsetHeight),i=e;for(;i&&n&&n.offsetTop>r;)i=this.getKeyAbove(i),n=i==null?null:this.getItem(i);return i}getKeyPageBelow(e){let t=this.ref?.(),n=this.getItem(e);if(!t||!n)return;let r=Math.min(t.scrollHeight,n.offsetTop-n.offsetHeight+t.offsetHeight),i=e;for(;i&&n&&n.offsetTop<r;)i=this.getKeyBelow(i),n=i==null?null:this.getItem(i);return i}getKeyForSearch(e,t){let n=this.collator?.();if(!n)return;let r=t==null?this.getFirstKey():this.getKeyBelow(t);for(;r!=null;){let t=this.collection().getItem(r);if(t){let i=t.textValue.slice(0,e.length);if(t.textValue&&n.compare(i,e)===0)return r}r=this.getKeyBelow(r)}}};function ss(e,t,n){let r=Zn({usage:`search`,sensitivity:`base`});return cr({selectionManager:()=>B(e.selectionManager),keyboardDelegate:L(()=>B(e.keyboardDelegate)||new os(e.collection,t,r)),autoFocus:()=>B(e.autoFocus),deferAutoFocus:()=>B(e.deferAutoFocus),shouldFocusWrap:()=>B(e.shouldFocusWrap),disallowEmptySelection:()=>B(e.disallowEmptySelection),selectOnFocus:()=>B(e.selectOnFocus),disallowTypeAhead:()=>B(e.disallowTypeAhead),shouldUseVirtualFocus:()=>B(e.shouldUseVirtualFocus),allowsTabNavigation:()=>B(e.allowsTabNavigation),isVirtualized:()=>B(e.isVirtualized),scrollToKey:t=>B(e.scrollToKey)?.(t),orientation:()=>B(e.orientation)},t)}var cs=D();function ls(){return l(cs)}var us=D();function ds(){return l(us)}var fs=D();function ps(){return l(fs)}function ms(){let e=ps();if(e===void 0)throw Error("[kobalte]: `useMenuContext` must be used within a `Menu` component");return e}var hs=D();function gs(){let e=l(hs);if(e===void 0)throw Error("[kobalte]: `useMenuItemContext` must be used within a `Menu.Item` component");return e}var _s=D();function vs(){let e=l(_s);if(e===void 0)throw Error("[kobalte]: `useMenuRootContext` must be used within a `MenuRoot` component");return e}function ys(e){let n,r=vs(),i=ms(),a=Y({id:r.generateId(`item-${C()}`)},e),[o,s]=z(a,[`ref`,`textValue`,`disabled`,`closeOnSelect`,`checked`,`indeterminate`,`onSelect`,`onPointerMove`,`onPointerLeave`,`onPointerDown`,`onPointerUp`,`onClick`,`onKeyDown`,`onMouseDown`,`onFocus`]),[c,l]=A(),[u,d]=A(),[f,p]=A(),m=()=>i.listState().selectionManager(),h=()=>s.id,g=()=>m().focusedKey()===h(),_=()=>{o.onSelect?.(),o.closeOnSelect&&setTimeout(()=>{i.close(!0)})};wr({getItem:()=>({ref:()=>n,type:`item`,key:h(),textValue:o.textValue??f()?.textContent??n?.textContent??``,disabled:o.disabled??!1})});let v=lr({key:h,selectionManager:m,shouldSelectOnPressUp:!0,allowsDifferentPressOrigin:!0,disabled:()=>o.disabled},()=>n),y=e=>{K(e,o.onPointerMove),e.pointerType===`mouse`&&(o.disabled?i.onItemLeave(e):(i.onItemEnter(e),e.defaultPrevented||(J(e.currentTarget),i.listState().selectionManager().setFocused(!0),i.listState().selectionManager().setFocusedKey(h()))))},b=e=>{K(e,o.onPointerLeave),e.pointerType===`mouse`&&i.onItemLeave(e)},x=e=>{K(e,o.onPointerUp),!o.disabled&&e.button===0&&_()},S=e=>{if(K(e,o.onKeyDown),!e.repeat&&!o.disabled)switch(e.key){case`Enter`:case` `:_()}},w=L(()=>{if(o.indeterminate)return`mixed`;if(o.checked!=null)return o.checked}),T=L(()=>({"data-indeterminate":o.indeterminate?``:void 0,"data-checked":o.checked&&!o.indeterminate?``:void 0,"data-disabled":o.disabled?``:void 0,"data-highlighted":g()?``:void 0})),E={isChecked:()=>o.checked,dataset:T,setLabelRef:p,generateId:Lt(()=>s.id),registerLabel:co(l),registerDescription:co(d)};return N(hs.Provider,{value:E,get children(){return N(X,t({as:`div`,ref(e){let t=ft(e=>n=e,o.ref);typeof t==`function`&&t(e)},get tabIndex(){return v.tabIndex()},get"aria-checked"(){return w()},get"aria-disabled"(){return o.disabled},get"aria-labelledby"(){return c()},get"aria-describedby"(){return u()},get"data-key"(){return v.dataKey()},get onPointerDown(){return q([o.onPointerDown,v.onPointerDown])},get onPointerUp(){return q([x,v.onPointerUp])},get onClick(){return q([o.onClick,v.onClick])},get onKeyDown(){return q([S,v.onKeyDown])},get onMouseDown(){return q([o.onMouseDown,v.onMouseDown])},get onFocus(){return q([o.onFocus,v.onFocus])},onPointerMove:y,onPointerLeave:b},T,s))}})}function bs(e){let n=Y({closeOnSelect:!1},e),[r,i]=z(n,[`checked`,`defaultChecked`,`onChange`,`onSelect`]),a=In({isSelected:()=>r.checked,defaultIsSelected:()=>r.defaultChecked,onSelectedChange:e=>r.onChange?.(e),isDisabled:()=>i.disabled});return N(ys,t({role:`menuitemcheckbox`,get checked(){return a.isSelected()},onSelect:()=>{r.onSelect?.(),a.toggle()}},i))}var xs={next:(e,t)=>e===`ltr`?t===`horizontal`?`ArrowRight`:`ArrowDown`:t===`horizontal`?`ArrowLeft`:`ArrowUp`,previous:(e,t)=>xs.next(e===`ltr`?`rtl`:`ltr`,t)},Ss={first:e=>e===`horizontal`?`ArrowDown`:`ArrowRight`,last:e=>e===`horizontal`?`ArrowUp`:`ArrowLeft`};function Cs(e){let n=vs(),r=ms(),i=ls(),{direction:a}=Yn(),o=Y({id:n.generateId(`trigger`)},e),[s,c]=z(o,[`ref`,`id`,`disabled`,`onPointerDown`,`onClick`,`onKeyDown`,`onMouseOver`,`onFocus`]),l=()=>n.value();i!==void 0&&(l=()=>n.value()??s.id,i.lastValue()===void 0&&i.setLastValue(l));let u=Tn(()=>r.triggerRef(),()=>`button`),p=L(()=>u()===`a`&&r.triggerRef()?.getAttribute(`href`)!=null);k(d(()=>i?.value(),e=>{p()&&e===l()&&r.triggerRef()?.focus()}));let m=()=>{i===void 0?r.toggle(!0):r.isOpen()?i.value()===l()&&i.closeMenu():(i.autoFocusMenu()||i.setAutoFocusMenu(!0),r.open(!1))};return k(()=>f(r.registerTriggerId(s.id))),N(jn,t({ref(e){let t=ft(r.setTriggerRef,s.ref);typeof t==`function`&&t(e)},get"data-kb-menu-value-trigger"(){return n.value()},get id(){return s.id},get disabled(){return s.disabled},"aria-haspopup":`true`,get"aria-expanded"(){return r.isOpen()},get"aria-controls"(){return M(()=>!!r.isOpen())()?r.contentId():void 0},get"data-highlighted"(){return l()!==void 0&&i?.value()===l()||void 0},get tabIndex(){return i===void 0?void 0:i.value()===l()||i.lastValue()===l()?0:-1},onPointerDown:e=>{K(e,s.onPointerDown),e.currentTarget.dataset.pointerType=e.pointerType,!s.disabled&&e.pointerType!==`touch`&&e.button===0&&m()},onMouseOver:e=>{K(e,s.onMouseOver),r.triggerRef()?.dataset.pointerType!==`touch`&&!s.disabled&&i!==void 0&&i.value()!==void 0&&i.setValue(l)},onClick:e=>{K(e,s.onClick),s.disabled||e.currentTarget.dataset.pointerType===`touch`&&m()},onKeyDown:e=>{if(K(e,s.onKeyDown),!s.disabled){if(p())switch(e.key){case`Enter`:case` `:return}switch(e.key){case`Enter`:case` `:case Ss.first(n.orientation()):e.stopPropagation(),e.preventDefault(),Cn(e.currentTarget),r.open(`first`),i?.setAutoFocusMenu(!0),i?.setValue(l);break;case Ss.last(n.orientation()):e.stopPropagation(),e.preventDefault(),r.open(`last`);break;case xs.next(a(),n.orientation()):if(i===void 0)break;e.stopPropagation(),e.preventDefault(),i.nextMenu();break;case xs.previous(a(),n.orientation()):if(i===void 0)break;e.stopPropagation(),e.preventDefault(),i.previousMenu()}}},onFocus:e=>{K(e,s.onFocus),i!==void 0&&e.currentTarget.dataset.pointerType!==`touch`&&i.setValue(l)},role:i===void 0?void 0:`menuitem`},()=>r.dataset(),c))}function ws(e){let n,r=vs(),i=ms(),a=ls(),o=ds(),{direction:s}=Yn(),c=Y({id:r.generateId(`content-${C()}`)},e),[l,u]=z(c,[`ref`,`id`,`style`,`onOpenAutoFocus`,`onCloseAutoFocus`,`onEscapeKeyDown`,`onFocusOutside`,`onPointerEnter`,`onPointerMove`,`onKeyDown`,`onMouseDown`,`onFocusIn`,`onFocusOut`]),d=0,p=()=>i.parentMenuContext()==null&&a===void 0&&r.isModal(),m=ss({selectionManager:i.listState().selectionManager,collection:i.listState().collection,autoFocus:i.autoFocus,deferAutoFocus:!0,shouldFocusWrap:!0,disallowTypeAhead:()=>!i.listState().selectionManager().isFocused(),orientation:()=>r.orientation()===`horizontal`?`vertical`:`horizontal`},()=>n);Eo({trapFocus:()=>p()&&i.isOpen(),onMountAutoFocus:e=>{a===void 0&&l.onOpenAutoFocus?.(e)},onUnmountAutoFocus:l.onCloseAutoFocus},()=>n);let h=e=>{if(Rt(e.currentTarget,e.target)&&(e.key===`Tab`&&i.isOpen()&&e.preventDefault(),a!==void 0&&e.currentTarget.getAttribute(`aria-haspopup`)!==`true`))switch(e.key){case xs.next(s(),r.orientation()):e.stopPropagation(),e.preventDefault(),i.close(!0),a.setAutoFocusMenu(!0),a.nextMenu();break;case xs.previous(s(),r.orientation()):if(e.currentTarget.hasAttribute(`data-closed`))break;e.stopPropagation(),e.preventDefault(),i.close(!0),a.setAutoFocusMenu(!0),a.previousMenu()}},g=e=>{l.onEscapeKeyDown?.(e),a?.setAutoFocusMenu(!1),i.close(!0)},_=e=>{l.onFocusOutside?.(e),r.isModal()&&e.preventDefault()},v=e=>{K(e,l.onPointerEnter),i.isOpen()&&(i.parentMenuContext()?.listState().selectionManager().setFocused(!1),i.parentMenuContext()?.listState().selectionManager().setFocusedKey(void 0))},y=e=>{if(K(e,l.onPointerMove),e.pointerType!==`mouse`)return;let t=e.target,n=d!==e.clientX;Rt(e.currentTarget,t)&&n&&(i.setPointerDir(e.clientX>d?`right`:`left`),d=e.clientX)};k(()=>f(i.registerContentId(l.id))),f(()=>i.setContentRef(void 0));let b={ref:ft(e=>{i.setContentRef(e),n=e},l.ref),role:`menu`,get id(){return l.id},get tabIndex(){return m.tabIndex()},get"aria-labelledby"(){return i.triggerId()},onKeyDown:q([l.onKeyDown,m.onKeyDown,h]),onMouseDown:q([l.onMouseDown,m.onMouseDown]),onFocusIn:q([l.onFocusIn,m.onFocusIn]),onFocusOut:q([l.onFocusOut,m.onFocusOut]),onPointerEnter:v,onPointerMove:y,get"data-orientation"(){return r.orientation()}};return N(F,{get when(){return i.contentPresent()},get children(){return N(F,{get when(){return o===void 0||i.parentMenuContext()!=null},get fallback(){return N(X,t({as:`div`},()=>i.dataset(),b,u))},get children(){return N(Ia.Positioner,{get children(){return N(oo,t({get disableOutsidePointerEvents(){return M(()=>!!p())()&&i.isOpen()},get excludedElements(){return[i.triggerRef]},bypassTopMostLayerCheck:!0,get style(){return jt({"--kb-menu-content-transform-origin":`var(--kb-popper-content-transform-origin)`,position:`relative`},l.style)},onEscapeKeyDown:g,onFocusOutside:_,get onDismiss(){return i.close}},()=>i.dataset(),b,u))}})}})}})}function Ts(e){let n,r=vs(),i=ms(),[a,o]=z(e,[`ref`]);return Go({element:()=>n??null,enabled:()=>i.contentPresent()&&r.preventScroll()}),N(ws,t({ref(e){let t=ft(e=>{n=e},a.ref);typeof t==`function`&&t(e)}},o))}var Es=D();function Ds(){let e=l(Es);if(e===void 0)throw Error("[kobalte]: `useMenuGroupContext` must be used within a `Menu.Group` component");return e}function Os(e){let n=Y({id:vs().generateId(`group-${C()}`)},e),[r,i]=A(),a={generateId:Lt(()=>n.id),registerLabelId:co(i)};return N(Es.Provider,{value:a,get children(){return N(X,t({as:`div`,role:`group`,get"aria-labelledby"(){return r()}},n))}})}function ks(e){let n=Ds(),r=Y({id:n.generateId(`label`)},e),[i,a]=z(r,[`id`]);return k(()=>f(n.registerLabelId(i.id))),N(X,t({as:`span`,get id(){return i.id},"aria-hidden":`true`},a))}function As(e){let n=ms(),r=Y({children:`▼`},e);return N(X,t({as:`span`,"aria-hidden":`true`},()=>n.dataset(),r))}function js(e){return N(ys,t({role:`menuitem`,closeOnSelect:!0},e))}function Ms(e){let n=gs(),r=Y({id:n.generateId(`description`)},e),[i,a]=z(r,[`id`]);return k(()=>f(n.registerDescription(i.id))),N(X,t({as:`div`,get id(){return i.id}},()=>n.dataset(),a))}function Ns(e){let n=gs(),r=Y({id:n.generateId(`indicator`)},e),[i,a]=z(r,[`forceMount`]);return N(F,{get when(){return i.forceMount||n.isChecked()},get children(){return N(X,t({as:`div`},()=>n.dataset(),a))}})}function Ps(e){let n=gs(),r=Y({id:n.generateId(`label`)},e),[i,a]=z(r,[`ref`,`id`]);return k(()=>f(n.registerLabel(i.id))),N(X,t({as:`div`,ref(e){let t=ft(n.setLabelRef,i.ref);typeof t==`function`&&t(e)},get id(){return i.id}},()=>n.dataset(),a))}function Fs(e){let t=ms();return N(F,{get when(){return t.contentPresent()},get children(){return N(R,e)}})}var Is=D();function Ls(){let e=l(Is);if(e===void 0)throw Error("[kobalte]: `useMenuRadioGroupContext` must be used within a `Menu.RadioGroup` component");return e}function Rs(e){let t=Y({id:vs().generateId(`radiogroup-${C()}`)},e),[n,r]=z(t,[`value`,`defaultValue`,`onChange`,`disabled`]),[i,a]=Nn({value:()=>n.value,defaultValue:()=>n.defaultValue,onChange:e=>n.onChange?.(e)});return N(Is.Provider,{value:{isDisabled:()=>n.disabled,isSelectedValue:e=>e===i(),setSelectedValue:e=>a(e)},get children(){return N(Os,r)}})}function zs(e){let n=Ls(),r=Y({closeOnSelect:!1},e),[i,a]=z(r,[`value`,`onSelect`]);return N(ys,t({role:`menuitemradio`,get checked(){return n.isSelectedValue(i.value)},onSelect:()=>{i.onSelect?.(),n.setSelectedValue(i.value)}},a))}function Bs(e,t,n){let r=e.split(`-`)[0],i=n.getBoundingClientRect(),a=[],o=t.clientX,s=t.clientY;switch(r){case`top`:a.push([o,s+5]),a.push([i.left,i.bottom]),a.push([i.left,i.top]),a.push([i.right,i.top]),a.push([i.right,i.bottom]);break;case`right`:a.push([o-5,s]),a.push([i.left,i.top]),a.push([i.right,i.top]),a.push([i.right,i.bottom]),a.push([i.left,i.bottom]);break;case`bottom`:a.push([o,s-5]),a.push([i.right,i.top]),a.push([i.right,i.bottom]),a.push([i.left,i.bottom]),a.push([i.left,i.top]);break;case`left`:a.push([o+5,s]),a.push([i.right,i.bottom]),a.push([i.left,i.bottom]),a.push([i.left,i.top]),a.push([i.right,i.top])}return a}function Vs(e,t){return t?_n([e.clientX,e.clientY],t):!1}function Hs(e){let n=vs(),r=mr(),i=ps(),a=ls(),o=ds(),s=Y({placement:n.orientation()===`horizontal`?`bottom-start`:`right-start`},e),[c,l]=z(s,[`open`,`defaultOpen`,`onOpenChange`]),u=0,d=null,p=`right`,[m,h]=A(),[g,_]=A(),[v,y]=A(),[b,x]=A(),[S,C]=A(!0),[w,T]=A(l.placement),[E,D]=A([]),[O,ee]=A([]),{DomCollectionProvider:te}=Cr({items:O,onItemsChange:ee}),j=so({open:()=>c.open,defaultOpen:()=>c.defaultOpen,onOpenChange:e=>c.onOpenChange?.(e)}),{present:M}=uo({show:()=>n.forceMount()||j.isOpen(),element:()=>b()??null}),P=fr({selectionMode:`none`,dataSource:O}),I=e=>{C(e),j.open()},ne=(e=!1)=>{j.close(),e&&i&&i.close(!0)},re=e=>{C(e),j.toggle()},ie=()=>{let e=b();e&&(J(e),P.selectionManager().setFocused(!0),P.selectionManager().setFocusedKey(void 0))},R=()=>{o==null?ie():setTimeout(()=>ie())},ae=e=>{D(t=>[...t,e]);let t=i?.registerNestedMenu(e);return()=>{D(t=>Nt(t,e)),t?.()}},oe=e=>p===d?.side&&Vs(e,d?.area),se=e=>{oe(e)&&e.preventDefault()},ce=e=>{oe(e)||R()},le=e=>{oe(e)&&e.preventDefault()};Oo({isDisabled:()=>!(i==null&&j.isOpen()&&n.isModal()),targets:()=>[b(),...E()].filter(Boolean)}),k(()=>{let e=b();if(!e||!i)return;let t=i.registerNestedMenu(e);f(()=>{t()})}),k(()=>{i===void 0&&a?.registerMenu(n.value(),[b(),...E()])}),k(()=>{i===void 0&&a!==void 0&&(a.value()===n.value()?(v()?.focus(),a.autoFocusMenu()&&I(!0)):ne())}),k(()=>{i===void 0&&a!==void 0&&j.isOpen()&&a.setValue(n.value())}),f(()=>{i===void 0&&a?.unregisterMenu(n.value())});let ue={dataset:L(()=>({"data-expanded":j.isOpen()?``:void 0,"data-closed":j.isOpen()?void 0:``})),isOpen:j.isOpen,contentPresent:M,nestedMenus:E,currentPlacement:w,pointerGraceTimeoutId:()=>u,autoFocus:S,listState:()=>P,parentMenuContext:()=>i,triggerRef:v,contentRef:b,triggerId:m,contentId:g,setTriggerRef:y,setContentRef:x,open:I,close:ne,toggle:re,focusContent:R,onItemEnter:se,onItemLeave:ce,onTriggerLeave:le,setPointerDir:e=>p=e,setPointerGraceTimeoutId:e=>u=e,setPointerGraceIntent:e=>d=e,registerNestedMenu:ae,registerItemToParentDomCollection:r?.registerItem,registerTriggerId:co(h),registerContentId:co(_)};return N(te,{get children(){return N(fs.Provider,{value:ue,get children(){return N(F,{when:o===void 0,get fallback(){return l.children},get children(){return N(Ia,t({anchorRef:v,contentRef:b,onCurrentPlacementChange:T},l))}})}})}})}function Us(e){let{direction:n}=Yn();return N(Hs,t({get placement(){return n()===`rtl`?`left-start`:`right-start`},flip:!0},e))}var Ws={close:(e,t)=>e===`ltr`?[t===`horizontal`?`ArrowLeft`:`ArrowUp`]:[t===`horizontal`?`ArrowRight`:`ArrowDown`]};function Gs(e){let n=ms(),r=vs(),[i,a]=z(e,[`onFocusOutside`,`onKeyDown`]),{direction:o}=Yn();return N(ws,t({onOpenAutoFocus:e=>{e.preventDefault()},onCloseAutoFocus:e=>{e.preventDefault()},onFocusOutside:e=>{i.onFocusOutside?.(e);let t=e.target;Rt(n.triggerRef(),t)||n.close()},onKeyDown:e=>{K(e,i.onKeyDown);let t=Rt(e.currentTarget,e.target),a=Ws.close(o(),r.orientation()).includes(e.key),s=n.parentMenuContext()!=null;t&&a&&s&&(n.close(),J(n.triggerRef()))}},a))}var Ks=[`Enter`,` `],qs={open:(e,t)=>e===`ltr`?[...Ks,t===`horizontal`?`ArrowRight`:`ArrowDown`]:[...Ks,t===`horizontal`?`ArrowLeft`:`ArrowUp`]};function Js(e){let n,r=vs(),i=ms(),a=Y({id:r.generateId(`sub-trigger-${C()}`)},e),[o,s]=z(a,[`ref`,`id`,`textValue`,`disabled`,`onPointerMove`,`onPointerLeave`,`onPointerDown`,`onPointerUp`,`onClick`,`onKeyDown`,`onMouseDown`,`onFocus`]),c=null,l=()=>{c&&window.clearTimeout(c),c=null},{direction:u}=Yn(),p=()=>o.id,m=()=>{let e=i.parentMenuContext();if(e==null)throw Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");return e.listState().selectionManager()},h=()=>i.listState().collection(),g=()=>m().focusedKey()===p(),_=lr({key:p,selectionManager:m,shouldSelectOnPressUp:!0,allowsDifferentPressOrigin:!0,disabled:()=>o.disabled},()=>n),v=e=>{K(e,o.onClick),!i.isOpen()&&!o.disabled&&i.open(!0)},y=e=>{if(K(e,o.onPointerMove),e.pointerType!==`mouse`)return;let t=i.parentMenuContext();if(t?.onItemEnter(e),!e.defaultPrevented){if(o.disabled){t?.onItemLeave(e);return}!i.isOpen()&&!c&&(i.parentMenuContext()?.setPointerGraceIntent(null),c=window.setTimeout(()=>{i.open(!1),l()},100)),t?.onItemEnter(e),e.defaultPrevented||(i.listState().selectionManager().isFocused()&&(i.listState().selectionManager().setFocused(!1),i.listState().selectionManager().setFocusedKey(void 0)),J(e.currentTarget),t?.listState().selectionManager().setFocused(!0),t?.listState().selectionManager().setFocusedKey(p()))}},b=e=>{if(K(e,o.onPointerLeave),e.pointerType!==`mouse`)return;l();let t=i.parentMenuContext(),n=i.contentRef();if(n){t?.setPointerGraceIntent({area:Bs(i.currentPlacement(),e,n),side:i.currentPlacement().split(`-`)[0]}),window.clearTimeout(t?.pointerGraceTimeoutId());let r=window.setTimeout(()=>{t?.setPointerGraceIntent(null)},300);t?.setPointerGraceTimeoutId(r)}else{if(t?.onTriggerLeave(e),e.defaultPrevented)return;t?.setPointerGraceIntent(null)}t?.onItemLeave(e)},x=e=>{K(e,o.onKeyDown),!e.repeat&&(o.disabled||qs.open(u(),r.orientation()).includes(e.key)&&(e.stopPropagation(),e.preventDefault(),m().setFocused(!1),m().setFocusedKey(void 0),i.isOpen()||i.open(`first`),i.focusContent(),i.listState().selectionManager().setFocused(!0),i.listState().selectionManager().setFocusedKey(h().getFirstKey())))};return k(()=>{if(i.registerItemToParentDomCollection==null)throw Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");let e=i.registerItemToParentDomCollection({ref:()=>n,type:`item`,key:p(),textValue:o.textValue??n?.textContent??``,disabled:o.disabled??!1});f(e)}),k(d(()=>i.parentMenuContext()?.pointerGraceTimeoutId(),e=>{f(()=>{window.clearTimeout(e),i.parentMenuContext()?.setPointerGraceIntent(null)})})),k(()=>f(i.registerTriggerId(o.id))),f(()=>{l()}),N(X,t({as:`div`,ref(e){let t=ft(e=>{i.setTriggerRef(e),n=e},o.ref);typeof t==`function`&&t(e)},get id(){return o.id},role:`menuitem`,get tabIndex(){return _.tabIndex()},"aria-haspopup":`true`,get"aria-expanded"(){return i.isOpen()},get"aria-controls"(){return M(()=>!!i.isOpen())()?i.contentId():void 0},get"aria-disabled"(){return o.disabled},get"data-key"(){return _.dataKey()},get"data-highlighted"(){return g()?``:void 0},get"data-disabled"(){return o.disabled?``:void 0},get onPointerDown(){return q([o.onPointerDown,_.onPointerDown])},get onPointerUp(){return q([o.onPointerUp,_.onPointerUp])},get onClick(){return q([v,_.onClick])},get onKeyDown(){return q([x,_.onKeyDown])},get onMouseDown(){return q([o.onMouseDown,_.onMouseDown])},get onFocus(){return q([o.onFocus,_.onFocus])},onPointerMove:y,onPointerLeave:b},()=>i.dataset(),s))}function Ys(e){let n=ls(),r=Y({id:`menu-${C()}`,modal:!0},e),[i,a]=z(r,[`id`,`modal`,`preventScroll`,`forceMount`,`open`,`defaultOpen`,`onOpenChange`,`value`,`orientation`]),o=so({open:()=>i.open,defaultOpen:()=>i.defaultOpen,onOpenChange:e=>i.onOpenChange?.(e)}),s={isModal:()=>i.modal??!0,preventScroll:()=>i.preventScroll??s.isModal(),forceMount:()=>i.forceMount??!1,generateId:Lt(()=>i.id),value:()=>i.value,orientation:()=>i.orientation??n?.orientation()??`horizontal`};return N(_s.Provider,{value:s,get children(){return N(Hs,t({get open(){return o.isOpen()},get onOpenChange(){return o.setIsOpen}},a))}})}On({},{Root:()=>Xs,Separator:()=>Zs});function Xs(e){let n,r=Y({orientation:`horizontal`},e),[i,a]=z(r,[`ref`,`orientation`]),o=Tn(()=>n,()=>`hr`);return N(X,t({as:`hr`,ref(e){let t=ft(e=>n=e,i.ref);typeof t==`function`&&t(e)},get role(){return o()===`hr`?void 0:`separator`},get"aria-orientation"(){return i.orientation===`vertical`?`vertical`:void 0},get"data-orientation"(){return i.orientation}},a))}var Zs=Xs,Z={};On(Z,{Arrow:()=>Da,CheckboxItem:()=>bs,Content:()=>Qs,DropdownMenu:()=>ec,Group:()=>Os,GroupLabel:()=>ks,Icon:()=>As,Item:()=>js,ItemDescription:()=>Ms,ItemIndicator:()=>Ns,ItemLabel:()=>Ps,Portal:()=>Fs,RadioGroup:()=>Rs,RadioItem:()=>zs,Root:()=>$s,Separator:()=>Xs,Sub:()=>Us,SubContent:()=>Gs,SubTrigger:()=>Js,Trigger:()=>Cs});function Qs(e){let n=vs(),r=ms(),[i,a]=z(e,[`onCloseAutoFocus`,`onInteractOutside`]),o=!1;return N(Ts,t({onCloseAutoFocus:e=>{i.onCloseAutoFocus?.(e),o||J(r.triggerRef()),o=!1,e.preventDefault()},onInteractOutside:e=>{i.onInteractOutside?.(e),(!n.isModal()||e.detail.isContextMenu)&&(o=!0)}},a))}function $s(e){let t=Y({id:`dropdownmenu-${C()}`},e);return N(Ys,t)}var ec=Object.assign($s,{Arrow:Da,CheckboxItem:bs,Content:Qs,Group:Os,GroupLabel:ks,Icon:As,Item:js,ItemDescription:Ms,ItemIndicator:Ns,ItemLabel:Ps,Portal:Fs,RadioGroup:Rs,RadioItem:zs,Separator:Xs,Sub:Us,SubContent:Gs,SubTrigger:Js,Trigger:Cs}),Q={colors:{inherit:`inherit`,current:`currentColor`,transparent:`transparent`,black:`#000000`,white:`#ffffff`,neutral:{50:`#f9fafb`,100:`#f2f4f7`,200:`#eaecf0`,300:`#d0d5dd`,400:`#98a2b3`,500:`#667085`,600:`#475467`,700:`#344054`,800:`#1d2939`,900:`#101828`},darkGray:{50:`#525c7a`,100:`#49536e`,200:`#414962`,300:`#394056`,400:`#313749`,500:`#292e3d`,600:`#212530`,700:`#191c24`,800:`#111318`,900:`#0b0d10`},gray:{50:`#f9fafb`,100:`#f2f4f7`,200:`#eaecf0`,300:`#d0d5dd`,400:`#98a2b3`,500:`#667085`,600:`#475467`,700:`#344054`,800:`#1d2939`,900:`#101828`},blue:{25:`#F5FAFF`,50:`#EFF8FF`,100:`#D1E9FF`,200:`#B2DDFF`,300:`#84CAFF`,400:`#53B1FD`,500:`#2E90FA`,600:`#1570EF`,700:`#175CD3`,800:`#1849A9`,900:`#194185`},green:{25:`#F6FEF9`,50:`#ECFDF3`,100:`#D1FADF`,200:`#A6F4C5`,300:`#6CE9A6`,400:`#32D583`,500:`#12B76A`,600:`#039855`,700:`#027A48`,800:`#05603A`,900:`#054F31`},red:{50:`#fef2f2`,100:`#fee2e2`,200:`#fecaca`,300:`#fca5a5`,400:`#f87171`,500:`#ef4444`,600:`#dc2626`,700:`#b91c1c`,800:`#991b1b`,900:`#7f1d1d`,950:`#450a0a`},yellow:{25:`#FFFCF5`,50:`#FFFAEB`,100:`#FEF0C7`,200:`#FEDF89`,300:`#FEC84B`,400:`#FDB022`,500:`#F79009`,600:`#DC6803`,700:`#B54708`,800:`#93370D`,900:`#7A2E0E`},purple:{25:`#FAFAFF`,50:`#F4F3FF`,100:`#EBE9FE`,200:`#D9D6FE`,300:`#BDB4FE`,400:`#9B8AFB`,500:`#7A5AF8`,600:`#6938EF`,700:`#5925DC`,800:`#4A1FB8`,900:`#3E1C96`},teal:{25:`#F6FEFC`,50:`#F0FDF9`,100:`#CCFBEF`,200:`#99F6E0`,300:`#5FE9D0`,400:`#2ED3B7`,500:`#15B79E`,600:`#0E9384`,700:`#107569`,800:`#125D56`,900:`#134E48`},pink:{25:`#fdf2f8`,50:`#fce7f3`,100:`#fbcfe8`,200:`#f9a8d4`,300:`#f472b6`,400:`#ec4899`,500:`#db2777`,600:`#be185d`,700:`#9d174d`,800:`#831843`,900:`#500724`},cyan:{25:`#ecfeff`,50:`#cffafe`,100:`#a5f3fc`,200:`#67e8f9`,300:`#22d3ee`,400:`#06b6d4`,500:`#0891b2`,600:`#0e7490`,700:`#155e75`,800:`#164e63`,900:`#083344`}},alpha:{100:`ff`,90:`e5`,80:`cc`,70:`b3`,60:`99`,50:`80`,40:`66`,30:`4d`,20:`33`,10:`1a`,0:`00`},font:{size:{"2xs":`calc(var(--tsqd-font-size) * 0.625)`,xs:`calc(var(--tsqd-font-size) * 0.75)`,sm:`calc(var(--tsqd-font-size) * 0.875)`,md:`var(--tsqd-font-size)`,lg:`calc(var(--tsqd-font-size) * 1.125)`,xl:`calc(var(--tsqd-font-size) * 1.25)`,"2xl":`calc(var(--tsqd-font-size) * 1.5)`,"3xl":`calc(var(--tsqd-font-size) * 1.875)`,"4xl":`calc(var(--tsqd-font-size) * 2.25)`,"5xl":`calc(var(--tsqd-font-size) * 3)`,"6xl":`calc(var(--tsqd-font-size) * 3.75)`,"7xl":`calc(var(--tsqd-font-size) * 4.5)`,"8xl":`calc(var(--tsqd-font-size) * 6)`,"9xl":`calc(var(--tsqd-font-size) * 8)`},lineHeight:{xs:`calc(var(--tsqd-font-size) * 1)`,sm:`calc(var(--tsqd-font-size) * 1.25)`,md:`calc(var(--tsqd-font-size) * 1.5)`,lg:`calc(var(--tsqd-font-size) * 1.75)`,xl:`calc(var(--tsqd-font-size) * 2)`,"2xl":`calc(var(--tsqd-font-size) * 2.25)`,"3xl":`calc(var(--tsqd-font-size) * 2.5)`,"4xl":`calc(var(--tsqd-font-size) * 2.75)`,"5xl":`calc(var(--tsqd-font-size) * 3)`,"6xl":`calc(var(--tsqd-font-size) * 3.25)`,"7xl":`calc(var(--tsqd-font-size) * 3.5)`,"8xl":`calc(var(--tsqd-font-size) * 3.75)`,"9xl":`calc(var(--tsqd-font-size) * 4)`},weight:{thin:`100`,extralight:`200`,light:`300`,normal:`400`,medium:`500`,semibold:`600`,bold:`700`,extrabold:`800`,black:`900`}},breakpoints:{xs:`320px`,sm:`640px`,md:`768px`,lg:`1024px`,xl:`1280px`,"2xl":`1536px`},border:{radius:{none:`0px`,xs:`calc(var(--tsqd-font-size) * 0.125)`,sm:`calc(var(--tsqd-font-size) * 0.25)`,md:`calc(var(--tsqd-font-size) * 0.375)`,lg:`calc(var(--tsqd-font-size) * 0.5)`,xl:`calc(var(--tsqd-font-size) * 0.75)`,"2xl":`calc(var(--tsqd-font-size) * 1)`,"3xl":`calc(var(--tsqd-font-size) * 1.5)`,full:`9999px`}},size:{0:`0px`,.25:`calc(var(--tsqd-font-size) * 0.0625)`,.5:`calc(var(--tsqd-font-size) * 0.125)`,1:`calc(var(--tsqd-font-size) * 0.25)`,1.5:`calc(var(--tsqd-font-size) * 0.375)`,2:`calc(var(--tsqd-font-size) * 0.5)`,2.5:`calc(var(--tsqd-font-size) * 0.625)`,3:`calc(var(--tsqd-font-size) * 0.75)`,3.5:`calc(var(--tsqd-font-size) * 0.875)`,4:`calc(var(--tsqd-font-size) * 1)`,4.5:`calc(var(--tsqd-font-size) * 1.125)`,5:`calc(var(--tsqd-font-size) * 1.25)`,5.5:`calc(var(--tsqd-font-size) * 1.375)`,6:`calc(var(--tsqd-font-size) * 1.5)`,6.5:`calc(var(--tsqd-font-size) * 1.625)`,7:`calc(var(--tsqd-font-size) * 1.75)`,8:`calc(var(--tsqd-font-size) * 2)`,9:`calc(var(--tsqd-font-size) * 2.25)`,10:`calc(var(--tsqd-font-size) * 2.5)`,11:`calc(var(--tsqd-font-size) * 2.75)`,12:`calc(var(--tsqd-font-size) * 3)`,14:`calc(var(--tsqd-font-size) * 3.5)`,16:`calc(var(--tsqd-font-size) * 4)`,20:`calc(var(--tsqd-font-size) * 5)`,24:`calc(var(--tsqd-font-size) * 6)`,28:`calc(var(--tsqd-font-size) * 7)`,32:`calc(var(--tsqd-font-size) * 8)`,36:`calc(var(--tsqd-font-size) * 9)`,40:`calc(var(--tsqd-font-size) * 10)`,44:`calc(var(--tsqd-font-size) * 11)`,48:`calc(var(--tsqd-font-size) * 12)`,52:`calc(var(--tsqd-font-size) * 13)`,56:`calc(var(--tsqd-font-size) * 14)`,60:`calc(var(--tsqd-font-size) * 15)`,64:`calc(var(--tsqd-font-size) * 16)`,72:`calc(var(--tsqd-font-size) * 18)`,80:`calc(var(--tsqd-font-size) * 20)`,96:`calc(var(--tsqd-font-size) * 24)`},shadow:{xs:(e=`rgb(0 0 0 / 0.1)`)=>`0 1px 2px 0 rgb(0 0 0 / 0.05)`,sm:(e=`rgb(0 0 0 / 0.1)`)=>`0 1px 3px 0 ${e}, 0 1px 2px -1px ${e}`,md:(e=`rgb(0 0 0 / 0.1)`)=>`0 4px 6px -1px ${e}, 0 2px 4px -2px ${e}`,lg:(e=`rgb(0 0 0 / 0.1)`)=>`0 10px 15px -3px ${e}, 0 4px 6px -4px ${e}`,xl:(e=`rgb(0 0 0 / 0.1)`)=>`0 20px 25px -5px ${e}, 0 8px 10px -6px ${e}`,"2xl":(e=`rgb(0 0 0 / 0.25)`)=>`0 25px 50px -12px ${e}`,inner:(e=`rgb(0 0 0 / 0.05)`)=>`inset 0 2px 4px 0 ${e}`,none:()=>`none`},zIndices:{hide:-1,auto:`auto`,base:0,docked:10,dropdown:1e3,sticky:1100,banner:1200,overlay:1300,modal:1400,popover:1500,skipLink:1600,toast:1700,tooltip:1800}},tc=s(`<svg width=14 height=14 viewBox="0 0 14 14"fill=none xmlns=http://www.w3.org/2000/svg><path d="M13 13L9.00007 9M10.3333 5.66667C10.3333 8.244 8.244 10.3333 5.66667 10.3333C3.08934 10.3333 1 8.244 1 5.66667C1 3.08934 3.08934 1 5.66667 1C8.244 1 10.3333 3.08934 10.3333 5.66667Z"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),nc=s(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 3H15M3 6H21M19 6L18.2987 16.5193C18.1935 18.0975 18.1409 18.8867 17.8 19.485C17.4999 20.0118 17.0472 20.4353 16.5017 20.6997C15.882 21 15.0911 21 13.5093 21H10.4907C8.90891 21 8.11803 21 7.49834 20.6997C6.95276 20.4353 6.50009 20.0118 6.19998 19.485C5.85911 18.8867 5.8065 18.0975 5.70129 16.5193L5 6M10 10.5V15.5M14 10.5V15.5"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),rc=s(`<svg width=10 height=6 viewBox="0 0 10 6"fill=none xmlns=http://www.w3.org/2000/svg><path d="M1 1L5 5L9 1"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),ic=s(`<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 13.3333V2.66667M8 2.66667L4 6.66667M8 2.66667L12 6.66667"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),ac=s(`<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 2.66667V13.3333M8 13.3333L4 9.33333M8 13.3333L12 9.33333"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),oc=s(`<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg style=transform:rotate(90deg)><path d="M8 2.66667V13.3333M8 13.3333L4 9.33333M8 13.3333L12 9.33333"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),sc=s(`<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg style=transform:rotate(-90deg)><path d="M8 2.66667V13.3333M8 13.3333L4 9.33333M8 13.3333L12 9.33333"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>`),cc=s(`<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.69 4.9 19.104m12.786-1.414 1.414 1.414M22 12h-2m-3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),lc=s(`<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M22 15.844a10.424 10.424 0 0 1-4.306.925c-5.779 0-10.463-4.684-10.463-10.462 0-1.536.33-2.994.925-4.307A10.464 10.464 0 0 0 2 11.538C2 17.316 6.684 22 12.462 22c4.243 0 7.896-2.526 9.538-6.156Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),uc=s(`<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 21h8m-4-4v4m-5.2-4h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 14.72 22 13.88 22 12.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 3 18.88 3 17.2 3H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 5.28 2 6.12 2 7.8v4.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 17 5.12 17 6.8 17Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),dc=s(`<svg stroke=currentColor fill=currentColor stroke-width=0 viewBox="0 0 24 24"height=1em width=1em xmlns=http://www.w3.org/2000/svg><path fill=none d="M0 0h24v24H0z"></path><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z">`),fc=s(`<svg stroke-width=0 viewBox="0 0 24 24"height=1em width=1em xmlns=http://www.w3.org/2000/svg><path fill=none d="M24 .01c0-.01 0-.01 0 0L0 0v24h24V.01zM0 0h24v24H0V0zm0 0h24v24H0V0z"></path><path d="M22.99 9C19.15 5.16 13.8 3.76 8.84 4.78l2.52 2.52c3.47-.17 6.99 1.05 9.63 3.7l2-2zm-4 4a9.793 9.793 0 00-4.49-2.56l3.53 3.53.96-.97zM2 3.05L5.07 6.1C3.6 6.82 2.22 7.78 1 9l1.99 2c1.24-1.24 2.67-2.16 4.2-2.77l2.24 2.24A9.684 9.684 0 005 13v.01L6.99 15a7.042 7.042 0 014.92-2.06L18.98 20l1.27-1.26L3.29 1.79 2 3.05zM9 17l3 3 3-3a4.237 4.237 0 00-6 0z">`),pc=s(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.3951 19.3711L9.97955 20.6856C10.1533 21.0768 10.4368 21.4093 10.7958 21.6426C11.1547 21.8759 11.5737 22.0001 12.0018 22C12.4299 22.0001 12.8488 21.8759 13.2078 21.6426C13.5667 21.4093 13.8503 21.0768 14.024 20.6856L14.6084 19.3711C14.8165 18.9047 15.1664 18.5159 15.6084 18.26C16.0532 18.0034 16.5678 17.8941 17.0784 17.9478L18.5084 18.1C18.9341 18.145 19.3637 18.0656 19.7451 17.8713C20.1265 17.6771 20.4434 17.3763 20.6573 17.0056C20.8715 16.635 20.9735 16.2103 20.9511 15.7829C20.9286 15.3555 20.7825 14.9438 20.5307 14.5978L19.684 13.4344C19.3825 13.0171 19.2214 12.5148 19.224 12C19.2239 11.4866 19.3865 10.9864 19.6884 10.5711L20.5351 9.40778C20.787 9.06175 20.933 8.65007 20.9555 8.22267C20.978 7.79528 20.8759 7.37054 20.6618 7C20.4479 6.62923 20.131 6.32849 19.7496 6.13423C19.3681 5.93997 18.9386 5.86053 18.5129 5.90556L17.0829 6.05778C16.5722 6.11141 16.0577 6.00212 15.6129 5.74556C15.17 5.48825 14.82 5.09736 14.6129 4.62889L14.024 3.31444C13.8503 2.92317 13.5667 2.59072 13.2078 2.3574C12.8488 2.12408 12.4299 1.99993 12.0018 2C11.5737 1.99993 11.1547 2.12408 10.7958 2.3574C10.4368 2.59072 10.1533 2.92317 9.97955 3.31444L9.3951 4.62889C9.18803 5.09736 8.83798 5.48825 8.3951 5.74556C7.95032 6.00212 7.43577 6.11141 6.9251 6.05778L5.49066 5.90556C5.06499 5.86053 4.6354 5.93997 4.25397 6.13423C3.87255 6.32849 3.55567 6.62923 3.34177 7C3.12759 7.37054 3.02555 7.79528 3.04804 8.22267C3.07052 8.65007 3.21656 9.06175 3.46844 9.40778L4.3151 10.5711C4.61704 10.9864 4.77964 11.4866 4.77955 12C4.77964 12.5134 4.61704 13.0137 4.3151 13.4289L3.46844 14.5922C3.21656 14.9382 3.07052 15.3499 3.04804 15.7773C3.02555 16.2047 3.12759 16.6295 3.34177 17C3.55589 17.3706 3.8728 17.6712 4.25417 17.8654C4.63554 18.0596 5.06502 18.1392 5.49066 18.0944L6.92066 17.9422C7.43133 17.8886 7.94587 17.9979 8.39066 18.2544C8.83519 18.511 9.18687 18.902 9.3951 19.3711Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><path d="M12 15C13.6568 15 15 13.6569 15 12C15 10.3431 13.6568 9 12 9C10.3431 9 8.99998 10.3431 8.99998 12C8.99998 13.6569 10.3431 15 12 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),mc=s(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M16 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M11.5 12.5L17 7M17 7H12M17 7V12M6.2 21H8.8C9.9201 21 10.4802 21 10.908 20.782C11.2843 20.5903 11.5903 20.2843 11.782 19.908C12 19.4802 12 18.9201 12 17.8V15.2C12 14.0799 12 13.5198 11.782 13.092C11.5903 12.7157 11.2843 12.4097 10.908 12.218C10.4802 12 9.92011 12 8.8 12H6.2C5.0799 12 4.51984 12 4.09202 12.218C3.71569 12.4097 3.40973 12.7157 3.21799 13.092C3 13.5198 3 14.0799 3 15.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),hc=s(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path class=copier d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round stroke=currentColor>`),gc=s(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M2.5 21.4998L8.04927 19.3655C8.40421 19.229 8.58168 19.1607 8.74772 19.0716C8.8952 18.9924 9.0358 18.901 9.16804 18.7984C9.31692 18.6829 9.45137 18.5484 9.72028 18.2795L21 6.99982C22.1046 5.89525 22.1046 4.10438 21 2.99981C19.8955 1.89525 18.1046 1.89524 17 2.99981L5.72028 14.2795C5.45138 14.5484 5.31692 14.6829 5.20139 14.8318C5.09877 14.964 5.0074 15.1046 4.92823 15.2521C4.83911 15.4181 4.77085 15.5956 4.63433 15.9506L2.5 21.4998ZM2.5 21.4998L4.55812 16.1488C4.7054 15.7659 4.77903 15.5744 4.90534 15.4867C5.01572 15.4101 5.1523 15.3811 5.2843 15.4063C5.43533 15.4351 5.58038 15.5802 5.87048 15.8703L8.12957 18.1294C8.41967 18.4195 8.56472 18.5645 8.59356 18.7155C8.61877 18.8475 8.58979 18.9841 8.51314 19.0945C8.42545 19.2208 8.23399 19.2944 7.85107 19.4417L2.5 21.4998Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),_c=s(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),vc=s(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 9L15 15M15 9L9 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke=#F04438 stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),yc=s(`<svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 xmlns=http://www.w3.org/2000/svg><rect class=list width=20 height=20 y=2 x=2 rx=2></rect><line class=list-item y1=7 y2=7 x1=6 x2=18></line><line class=list-item y2=12 y1=12 x1=6 x2=18></line><line class=list-item y1=17 y2=17 x1=6 x2=18>`),bc=s(`<svg viewBox="0 0 24 24"height=20 width=20 fill=none xmlns=http://www.w3.org/2000/svg><path d="M3 7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 5.28 21 6.12 21 7.8v8.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V7.8Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),xc=s(`<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),Sc=s(`<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><animateTransform attributeName=transform attributeType=XML type=rotate from=0 to=360 dur=2s repeatCount=indefinite>`),Cc=s(`<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),wc=s(`<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.5 15V9M14.5 15V9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),Tc=s(`<svg version=1.0 viewBox="0 0 633 633"><linearGradient x1=-666.45 x2=-666.45 y1=163.28 y2=163.99 gradientTransform="matrix(633 0 0 633 422177 -103358)"gradientUnits=userSpaceOnUse><stop stop-color=#6BDAFF offset=0></stop><stop stop-color=#F9FFB5 offset=.32></stop><stop stop-color=#FFA770 offset=.71></stop><stop stop-color=#FF7373 offset=1></stop></linearGradient><circle cx=316.5 cy=316.5 r=316.5></circle><defs><filter x=-137.5 y=412 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=412 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=610.5 rx=214.5 ry=186 fill=#015064 stroke=#00CFE2 stroke-width=25></ellipse></g><defs><filter x=316.5 y=412 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=412 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=610.5 rx=214.5 ry=186 fill=#015064 stroke=#00CFE2 stroke-width=25></ellipse></g><defs><filter x=-137.5 y=450 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=450 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=648.5 rx=214.5 ry=186 fill=#015064 stroke=#00A8B8 stroke-width=25></ellipse></g><defs><filter x=316.5 y=450 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=450 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=648.5 rx=214.5 ry=186 fill=#015064 stroke=#00A8B8 stroke-width=25></ellipse></g><defs><filter x=-137.5 y=486 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=486 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=684.5 rx=214.5 ry=186 fill=#015064 stroke=#007782 stroke-width=25></ellipse></g><defs><filter x=316.5 y=486 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=486 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=684.5 rx=214.5 ry=186 fill=#015064 stroke=#007782 stroke-width=25></ellipse></g><defs><filter x=272.2 y=308 width=176.9 height=129.3 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=272.2 y=308 width=176.9 height=129.3 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><line x1=436 x2=431 y1=403.2 y2=431.8 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><line x1=291 x2=280 y1=341.5 y2=403.5 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><line x1=332.9 x2=328.6 y1=384.1 y2=411.2 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><linearGradient x1=-670.75 x2=-671.59 y1=164.4 y2=164.49 gradientTransform="matrix(-184.16 -32.472 -11.461 64.997 -121359 -32126)"gradientUnits=userSpaceOnUse><stop stop-color=#EE2700 offset=0></stop><stop stop-color=#FF008E offset=1></stop></linearGradient><path d="m344.1 363 97.7 17.2c5.8 2.1 8.2 6.1 7.1 12.1s-4.7 9.2-11 9.9l-106-18.7-57.5-59.2c-3.2-4.8-2.9-9.1 0.8-12.8s8.3-4.4 13.7-2.1l55.2 53.6z"clip-rule=evenodd fill-rule=evenodd></path><line x1=428.2 x2=429.1 y1=384.5 y2=378 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=395.2 x2=396.1 y1=379.5 y2=373 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=362.2 x2=363.1 y1=373.5 y2=367.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=324.2 x2=328.4 y1=351.3 y2=347.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=303.2 x2=307.4 y1=331.3 y2=327.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line></g><defs><filter x=73.2 y=113.8 width=280.6 height=317.4 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=73.2 y=113.8 width=280.6 height=317.4 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-672.16 x2=-672.16 y1=165.03 y2=166.03 gradientTransform="matrix(-100.18 48.861 97.976 200.88 -83342 -93.059)"gradientUnits=userSpaceOnUse><stop stop-color=#A17500 offset=0></stop><stop stop-color=#5D2100 offset=1></stop></linearGradient><path d="m192.3 203c8.1 37.3 14 73.6 17.8 109.1 3.8 35.4 2.8 75.1-3 119.2l61.2-16.7c-15.6-59-25.2-97.9-28.6-116.6s-10.8-51.9-22.1-99.6l-25.3 4.6"clip-rule=evenodd fill-rule=evenodd></path><g stroke=#2F8A00><linearGradient x1=-660.23 x2=-660.23 y1=166.72 y2=167.72 gradientTransform="matrix(92.683 4.8573 -2.0259 38.657 61680 -3088.6)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m195 183.9s-12.6-22.1-36.5-29.9c-15.9-5.2-34.4-1.5-55.5 11.1 15.9 14.3 29.5 22.6 40.7 24.9 16.8 3.6 51.3-6.1 51.3-6.1z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-661.36 x2=-661.36 y1=164.18 y2=165.18 gradientTransform="matrix(110 5.7648 -6.3599 121.35 73933 -15933)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5s-47.5-8.5-83.2 15.7c-23.8 16.2-34.3 49.3-31.6 99.4 30.3-27.8 52.1-48.5 65.2-61.9 19.8-20.2 49.6-53.2 49.6-53.2z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-656.79 x2=-656.79 y1=165.15 y2=166.15 gradientTransform="matrix(62.954 3.2993 -3.5023 66.828 42156 -8754.1)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m195 183.9c-0.8-21.9 6-38 20.6-48.2s29.8-15.4 45.5-15.3c-6.1 21.4-14.5 35.8-25.2 43.4s-24.4 14.2-40.9 20.1z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-663.07 x2=-663.07 y1=165.44 y2=166.44 gradientTransform="matrix(152.47 7.9907 -3.0936 59.029 101884 -4318.7)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c31.9-30 64.1-39.7 96.7-29s50.8 30.4 54.6 59.1c-35.2-5.5-60.4-9.6-75.8-12.1-15.3-2.6-40.5-8.6-75.5-18z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-662.57 x2=-662.57 y1=164.44 y2=165.44 gradientTransform="matrix(136.46 7.1517 -5.2163 99.533 91536 -11442)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c35.8-7.6 65.6-0.2 89.2 22s37.7 49 42.3 80.3c-39.8-9.7-68.3-23.8-85.5-42.4s-32.5-38.5-46-59.9z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-656.43 x2=-656.43 y1=163.86 y2=164.86 gradientTransform="matrix(60.866 3.1899 -8.7773 167.48 41560 -25168)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c-33.6 13.8-53.6 35.7-60.1 65.6s-3.6 63.1 8.7 99.6c27.4-40.3 43.2-69.6 47.4-88s5.6-44.1 4-77.2z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><path d="m196.5 182.3c-14.8 21.6-25.1 41.4-30.8 59.4s-9.5 33-11.1 45.1"fill=none stroke-linecap=round stroke-width=8></path><path d="m194.9 185.7c-24.4 1.7-43.8 9-58.1 21.8s-24.7 25.4-31.3 37.8"fill=none stroke-linecap=round stroke-width=8></path><path d="m204.5 176.4c29.7-6.7 52-8.4 67-5.1s26.9 8.6 35.8 15.9"fill=none stroke-linecap=round stroke-width=8></path><path d="m196.5 181.4c20.3 9.9 38.2 20.5 53.9 31.9s27.4 22.1 35.1 32"fill=none stroke-linecap=round stroke-width=8></path></g></g><defs><filter x=50.5 y=399 width=532 height=633 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=50.5 y=399 width=532 height=633 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-666.06 x2=-666.23 y1=163.36 y2=163.75 gradientTransform="matrix(532 0 0 633 354760 -102959)"gradientUnits=userSpaceOnUse><stop stop-color=#FFF400 offset=0></stop><stop stop-color=#3C8700 offset=1></stop></linearGradient><ellipse cx=316.5 cy=715.5 rx=266 ry=316.5></ellipse></g><defs><filter x=391 y=-24 width=288 height=283 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=391 y=-24 width=288 height=283 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-664.56 x2=-664.56 y1=163.79 y2=164.79 gradientTransform="matrix(227 0 0 227 151421 -37204)"gradientUnits=userSpaceOnUse><stop stop-color=#FFDF00 offset=0></stop><stop stop-color=#FF9D00 offset=1></stop></linearGradient><circle cx=565.5 cy=89.5 r=113.5></circle><linearGradient x1=-644.5 x2=-645.77 y1=342 y2=342 gradientTransform="matrix(30 0 0 1 19770 -253)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=427 x2=397 y1=89 y2=89 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-641.56 x2=-642.83 y1=196.02 y2=196.07 gradientTransform="matrix(26.5 0 0 5.5 17439 -1025.5)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=430.5 x2=404 y1=55.5 y2=50 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-643.73 x2=-645 y1=185.83 y2=185.9 gradientTransform="matrix(29 0 0 8 19107 -1361)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=431 x2=402 y1=122 y2=130 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-638.94 x2=-640.22 y1=177.09 y2=177.39 gradientTransform="matrix(24 0 0 13 15783 -2145)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=442 x2=418 y1=153 y2=166 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-633.42 x2=-634.7 y1=172.41 y2=173.31 gradientTransform="matrix(20 0 0 19 13137 -3096)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=464 x2=444 y1=180 y2=199 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-619.05 x2=-619.52 y1=170.82 y2=171.82 gradientTransform="matrix(13.83 0 0 22.85 9050 -3703.4)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=491.4 x2=477.5 y1=203 y2=225.9 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-578.5 x2=-578.63 y1=170.31 y2=171.31 gradientTransform="matrix(7.5 0 0 24.5 4860 -3953)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=524.5 x2=517 y1=219.5 y2=244 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=666.5 x2=666.5 y1=170.31 y2=171.31 gradientTransform="matrix(.5 0 0 24.5 231.5 -3944)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=564.5 x2=565 y1=228.5 y2=253 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12>`);function Ec(){return tc()}function Dc(){return nc()}function Oc(){return rc()}function kc(){return ic()}function Ac(){return ac()}function jc(){return oc()}function Mc(){return sc()}function Nc(){return cc()}function Pc(){return lc()}function Fc(){return uc()}function Ic(){return dc()}function Lc(){return fc()}function Rc(){return pc()}function zc(){return mc()}function Bc(){return hc()}function Vc(){return gc()}function Hc(e){return(()=>{var t=_c(),n=t.firstChild;return P(()=>c(n,`stroke`,e.theme===`dark`?`#12B76A`:`#027A48`)),t})()}function Uc(){return vc()}function Wc(){return yc()}function Gc(e){return[N(F,{get when(){return e.checked},get children(){var t=_c(),n=t.firstChild;return P(()=>c(n,`stroke`,e.theme===`dark`?`#9B8AFB`:`#6938EF`)),t}}),N(F,{get when(){return!e.checked},get children(){var t=bc(),n=t.firstChild;return P(()=>c(n,`stroke`,e.theme===`dark`?`#9B8AFB`:`#6938EF`)),t}})]}function Kc(){return xc()}function qc(){return Sc()}function Jc(){return Cc()}function Yc(){return wc()}function Xc(){let e=C();return(()=>{var t=Tc(),n=t.firstChild,r=n.nextSibling,i=r.nextSibling,a=i.firstChild,o=i.nextSibling,s=o.firstChild,l=o.nextSibling,u=l.nextSibling,d=u.firstChild,f=u.nextSibling,p=f.firstChild,m=f.nextSibling,h=m.nextSibling,g=h.firstChild,_=h.nextSibling,v=_.firstChild,y=_.nextSibling,b=y.nextSibling,x=b.firstChild,S=b.nextSibling,C=S.firstChild,w=S.nextSibling,T=w.nextSibling,E=T.firstChild,D=T.nextSibling,O=D.firstChild,k=D.nextSibling,A=k.nextSibling,ee=A.firstChild,te=A.nextSibling,j=te.firstChild,M=te.nextSibling,N=M.nextSibling,P=N.firstChild,F=N.nextSibling,I=F.firstChild,L=F.nextSibling,ne=L.firstChild.nextSibling.nextSibling.nextSibling,re=ne.nextSibling,ie=L.nextSibling,R=ie.firstChild,ae=ie.nextSibling,oe=ae.firstChild,se=ae.nextSibling,ce=se.firstChild,le=ce.nextSibling,z=le.nextSibling.firstChild,ue=z.nextSibling,de=ue.nextSibling,fe=de.nextSibling,B=fe.nextSibling,pe=B.nextSibling,me=pe.nextSibling,he=me.nextSibling,ge=he.nextSibling,_e=ge.nextSibling,ve=_e.nextSibling,ye=ve.nextSibling,be=se.nextSibling,xe=be.firstChild,Se=be.nextSibling,Ce=Se.firstChild,we=Se.nextSibling,Te=we.firstChild,Ee=Te.nextSibling,De=we.nextSibling,Oe=De.firstChild,ke=De.nextSibling,Ae=ke.firstChild,je=ke.nextSibling,Me=je.firstChild,Ne=Me.nextSibling,Pe=Ne.nextSibling,Fe=Pe.nextSibling,V=Fe.nextSibling,Ie=V.nextSibling,Le=Ie.nextSibling,Re=Le.nextSibling,ze=Re.nextSibling,Be=ze.nextSibling,H=Be.nextSibling,Ve=H.nextSibling,He=Ve.nextSibling,Ue=He.nextSibling,We=Ue.nextSibling,U=We.nextSibling,Ge=U.nextSibling,Ke=Ge.nextSibling;return c(n,`id`,`a-${e}`),c(r,`fill`,`url(#a-${e})`),c(a,`id`,`am-${e}`),c(o,`id`,`b-${e}`),c(s,`filter`,`url(#am-${e})`),c(l,`mask`,`url(#b-${e})`),c(d,`id`,`ah-${e}`),c(f,`id`,`k-${e}`),c(p,`filter`,`url(#ah-${e})`),c(m,`mask`,`url(#k-${e})`),c(g,`id`,`ae-${e}`),c(_,`id`,`j-${e}`),c(v,`filter`,`url(#ae-${e})`),c(y,`mask`,`url(#j-${e})`),c(x,`id`,`ai-${e}`),c(S,`id`,`i-${e}`),c(C,`filter`,`url(#ai-${e})`),c(w,`mask`,`url(#i-${e})`),c(E,`id`,`aj-${e}`),c(D,`id`,`h-${e}`),c(O,`filter`,`url(#aj-${e})`),c(k,`mask`,`url(#h-${e})`),c(ee,`id`,`ag-${e}`),c(te,`id`,`g-${e}`),c(j,`filter`,`url(#ag-${e})`),c(M,`mask`,`url(#g-${e})`),c(P,`id`,`af-${e}`),c(F,`id`,`f-${e}`),c(I,`filter`,`url(#af-${e})`),c(L,`mask`,`url(#f-${e})`),c(ne,`id`,`m-${e}`),c(re,`fill`,`url(#m-${e})`),c(R,`id`,`ak-${e}`),c(ae,`id`,`e-${e}`),c(oe,`filter`,`url(#ak-${e})`),c(se,`mask`,`url(#e-${e})`),c(ce,`id`,`n-${e}`),c(le,`fill`,`url(#n-${e})`),c(z,`id`,`r-${e}`),c(ue,`fill`,`url(#r-${e})`),c(de,`id`,`s-${e}`),c(fe,`fill`,`url(#s-${e})`),c(B,`id`,`q-${e}`),c(pe,`fill`,`url(#q-${e})`),c(me,`id`,`p-${e}`),c(he,`fill`,`url(#p-${e})`),c(ge,`id`,`o-${e}`),c(_e,`fill`,`url(#o-${e})`),c(ve,`id`,`l-${e}`),c(ye,`fill`,`url(#l-${e})`),c(xe,`id`,`al-${e}`),c(Se,`id`,`d-${e}`),c(Ce,`filter`,`url(#al-${e})`),c(we,`mask`,`url(#d-${e})`),c(Te,`id`,`u-${e}`),c(Ee,`fill`,`url(#u-${e})`),c(Oe,`id`,`ad-${e}`),c(ke,`id`,`c-${e}`),c(Ae,`filter`,`url(#ad-${e})`),c(je,`mask`,`url(#c-${e})`),c(Me,`id`,`t-${e}`),c(Ne,`fill`,`url(#t-${e})`),c(Pe,`id`,`v-${e}`),c(Fe,`stroke`,`url(#v-${e})`),c(V,`id`,`aa-${e}`),c(Ie,`stroke`,`url(#aa-${e})`),c(Le,`id`,`w-${e}`),c(Re,`stroke`,`url(#w-${e})`),c(ze,`id`,`ac-${e}`),c(Be,`stroke`,`url(#ac-${e})`),c(H,`id`,`ab-${e}`),c(Ve,`stroke`,`url(#ab-${e})`),c(He,`id`,`y-${e}`),c(Ue,`stroke`,`url(#y-${e})`),c(We,`id`,`x-${e}`),c(U,`stroke`,`url(#x-${e})`),c(Ge,`id`,`z-${e}`),c(Ke,`stroke`,`url(#z-${e})`),t})()}var Zc=s(`<span><svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 12L10 8L6 4"stroke-width=2 stroke-linecap=round stroke-linejoin=round>`),Qc=s(`<button title="Copy object to clipboard">`),$c=s(`<button title="Remove all items"aria-label="Remove all items">`),el=s(`<button title="Delete item"aria-label="Delete item">`),tl=s(`<button title="Toggle value"aria-label="Toggle value">`),nl=s(`<button title="Bulk Edit Data"aria-label="Bulk Edit Data">`),rl=s(`<div>`),il=s(`<div><button> <span></span> <span> `),al=s(`<input>`),ol=s(`<span>`),sl=s(`<div><label>:`),cl=s(`<div><div><button> [<!>...<!>]`);function ll(e,t){let n=0,r=[];for(;n<e.length;)r.push(e.slice(n,n+t)),n+=t;return r}var ul=e=>{let t=H(),n=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,r=L(()=>t()===`dark`?yl(n):vl(n));return(()=>{var t=Zc();return P(()=>I(t,G(r().expander,n`
          transform: rotate(${e.expanded?90:0}deg);
        `,e.expanded&&n`
            & svg {
              top: -1px;
            }
          `))),t})()},dl=e=>{let t=H(),n=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,r=L(()=>t()===`dark`?yl(n):vl(n)),[i,a]=A(`NoCopy`);return(()=>{var n=Qc();return te(n,`click`,i()===`NoCopy`?()=>{navigator.clipboard.writeText(y(e.value)).then(()=>{a(`SuccessCopy`),setTimeout(()=>{a(`NoCopy`)},1500)},e=>{a(`ErrorCopy`),setTimeout(()=>{a(`NoCopy`)},1500)})}:void 0,!0),p(n,N(re,{get children(){return[N(O,{get when(){return i()===`NoCopy`},get children(){return N(Bc,{})}}),N(O,{get when(){return i()===`SuccessCopy`},get children(){return N(Hc,{get theme(){return t()}})}}),N(O,{get when(){return i()===`ErrorCopy`},get children(){return N(Uc,{})}})]}})),P(e=>{var t=r().actionButton,a=`${i()===`NoCopy`?`Copy object to clipboard`:i()===`SuccessCopy`?`Object copied to clipboard`:`Error copying object to clipboard`}`;return t!==e.e&&I(n,e.e=t),a!==e.t&&c(n,`aria-label`,e.t=a),e},{e:void 0,t:void 0}),n})()},fl=e=>{let t=H(),n=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,r=L(()=>t()===`dark`?yl(n):vl(n)),i=V().client;return(()=>{var t=$c();return t.$$click=()=>{let t=e.activeQuery.state.data,n=b(t,e.dataPath,[]);i.setQueryData(e.activeQuery.queryKey,n)},p(t,N(Wc,{})),P(()=>I(t,r().actionButton)),t})()},pl=e=>{let t=H(),n=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,r=L(()=>t()===`dark`?yl(n):vl(n)),i=V().client;return(()=>{var t=el();return t.$$click=()=>{let t=e.activeQuery.state.data,n=le(t,e.dataPath);i.setQueryData(e.activeQuery.queryKey,n)},p(t,N(Dc,{})),P(()=>I(t,G(r().actionButton))),t})()},ml=e=>{let t=H(),n=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,r=L(()=>t()===`dark`?yl(n):vl(n)),i=V().client;return(()=>{var a=tl();return a.$$click=()=>{let t=e.activeQuery.state.data,n=b(t,e.dataPath,!e.value);i.setQueryData(e.activeQuery.queryKey,n)},p(a,N(Gc,{get theme(){return t()},get checked(){return e.value}})),P(()=>I(a,G(r().actionButton,n`
          width: ${Q.size[3.5]};
          height: ${Q.size[3.5]};
        `))),a})()};function hl(e){return Symbol.iterator in e}function gl(t){let n=H(),r=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,i=L(()=>n()===`dark`?yl(r):vl(r)),o=V().client,[s,l]=A((t.defaultExpanded||[]).includes(t.label)),u=()=>l(e=>!e),[d,f]=A([]),m=L(()=>Array.isArray(t.value)?t.value.map((e,t)=>({label:t.toString(),value:e})):t.value!==null&&typeof t.value==`object`&&hl(t.value)&&typeof t.value[Symbol.iterator]==`function`?t.value instanceof Map?Array.from(t.value,([e,t])=>({label:e,value:t})):Array.from(t.value,(e,t)=>({label:t.toString(),value:e})):typeof t.value==`object`&&t.value!==null?Object.entries(t.value).map(([e,t])=>({label:e,value:t})):[]),h=L(()=>Array.isArray(t.value)?`array`:t.value!==null&&typeof t.value==`object`&&hl(t.value)&&typeof t.value[Symbol.iterator]==`function`?`Iterable`:typeof t.value==`object`&&t.value!==null?`object`:typeof t.value),g=L(()=>ll(m(),100)),_=t.dataPath??[],v=C();return(()=>{var n=rl();return p(n,N(F,{get when(){return g().length},get children(){return[(()=>{var e=il(),n=e.firstChild,r=n.firstChild,o=r.nextSibling,l=o.nextSibling.nextSibling,d=l.firstChild;return n.$$click=()=>u(),p(n,N(ul,{get expanded(){return s()}}),r),p(o,()=>t.label),p(l,()=>String(h()).toLowerCase()===`iterable`?`(Iterable) `:``,d),p(l,()=>m().length,d),p(l,()=>m().length>1?`items`:`item`,null),p(e,N(F,{get when(){return t.editable},get children(){var e=rl();return p(e,N(dl,{get value(){return t.value}}),null),p(e,N(F,{get when(){return M(()=>!!t.itemsDeletable)()&&t.activeQuery!==void 0},get children(){return N(pl,{get activeQuery(){return t.activeQuery},dataPath:_})}}),null),p(e,N(F,{get when(){return M(()=>h()===`array`)()&&t.activeQuery!==void 0},get children(){return N(fl,{get activeQuery(){return t.activeQuery},dataPath:_})}}),null),p(e,N(F,{get when(){return M(()=>!!t.onEdit)()&&!a(t.value).meta},get children(){var e=nl();return e.$$click=()=>{t.onEdit?.()},p(e,N(Vc,{})),P(()=>I(e,i().actionButton)),e}}),null),P(()=>I(e,i().actions)),e}}),null),P(t=>{var r=i().expanderButtonContainer,a=i().expanderButton,o=s()?`true`:`false`,u=i().info;return r!==t.e&&I(e,t.e=r),a!==t.t&&I(n,t.t=a),o!==t.a&&c(n,`aria-expanded`,t.a=o),u!==t.o&&I(l,t.o=u),t},{e:void 0,t:void 0,a:void 0,o:void 0}),e})(),N(F,{get when(){return s()},get children(){return[N(F,{get when(){return g().length===1},get children(){var e=rl();return p(e,N(wt,{get each(){return m()},by:e=>e.label,children:e=>N(gl,{get defaultExpanded(){return t.defaultExpanded},get label(){return e().label},get value(){return e().value},get editable(){return t.editable},get dataPath(){return[..._,e().label]},get activeQuery(){return t.activeQuery},get itemsDeletable(){return h()===`array`||h()===`Iterable`||h()===`object`}})})),P(()=>I(e,i().subEntry)),e}}),N(F,{get when(){return g().length>1},get children(){var n=rl();return p(n,N(e,{get each(){return g()},children:(e,n)=>(()=>{var r=cl(),a=r.firstChild,o=a.firstChild,s=o.firstChild,c=s.nextSibling,l=c.nextSibling.nextSibling;return l.nextSibling,o.$$click=()=>f(e=>e.includes(n)?e.filter(e=>e!==n):[...e,n]),p(o,N(ul,{get expanded(){return d().includes(n)}}),s),p(o,n*100,c),p(o,n*100+100-1,l),p(a,N(F,{get when(){return d().includes(n)},get children(){var n=rl();return p(n,N(wt,{get each(){return e()},by:e=>e.label,children:e=>N(gl,{get defaultExpanded(){return t.defaultExpanded},get label(){return e().label},get value(){return e().value},get editable(){return t.editable},get dataPath(){return[..._,e().label]},get activeQuery(){return t.activeQuery}})})),P(()=>I(n,i().subEntry)),n}}),null),P(e=>{var t=i().entry,n=i().expanderButton;return t!==e.e&&I(a,e.e=t),n!==e.t&&I(o,e.t=n),e},{e:void 0,t:void 0}),r})()})),P(()=>I(n,i().subEntry)),n}})]}})]}}),null),p(n,N(F,{get when(){return g().length===0},get children(){var e=sl(),n=e.firstChild,r=n.firstChild;return c(n,`for`,v),p(n,()=>t.label,r),p(e,N(F,{get when(){return M(()=>!!(t.editable&&t.activeQuery!==void 0))()&&(h()===`string`||h()===`number`||h()===`boolean`)},get fallback(){return(()=>{var e=ol();return p(e,()=>T(t.value)),P(()=>I(e,i().value)),e})()},get children(){return[N(F,{get when(){return M(()=>!!(t.editable&&t.activeQuery!==void 0))()&&(h()===`string`||h()===`number`)},get children(){var e=al();return e.addEventListener(`change`,e=>{let n=t.activeQuery.state.data,r=b(n,_,h()===`number`?e.target.valueAsNumber:e.target.value);o.setQueryData(t.activeQuery.queryKey,r)}),c(e,`id`,v),P(t=>{var n=h()===`number`?`number`:`text`,r=G(i().value,i().editableInput);return n!==t.e&&c(e,`type`,t.e=n),r!==t.t&&I(e,t.t=r),t},{e:void 0,t:void 0}),P(()=>e.value=t.value),e}}),N(F,{get when(){return h()===`boolean`},get children(){var e=ol();return p(e,N(ml,{get activeQuery(){return t.activeQuery},dataPath:_,get value(){return t.value}}),null),p(e,()=>T(t.value),null),P(()=>I(e,G(i().value,i().actions,i().editableInput))),e}})]}}),null),p(e,N(F,{get when(){return M(()=>!!(t.editable&&t.itemsDeletable))()&&t.activeQuery!==void 0},get children(){return N(pl,{get activeQuery(){return t.activeQuery},dataPath:_})}}),null),P(t=>{var r=i().row,a=i().label;return r!==t.e&&I(e,t.e=r),a!==t.t&&I(n,t.t=a),t},{e:void 0,t:void 0}),e}}),null),P(()=>I(n,i().entry)),n})()}var _l=(e,t)=>{let{colors:n,font:r,size:i,border:a}=Q,o=(t,n)=>e===`light`?t:n;return{entry:t`
      & * {
        font-size: ${r.size.xs};
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
      }
      position: relative;
      outline: none;
      word-break: break-word;
    `,subEntry:t`
      margin: 0 0 0 0.5em;
      padding-left: 0.75em;
      border-left: 2px solid ${o(n.gray[300],n.darkGray[400])};
      /* outline: 1px solid ${n.teal[400]}; */
    `,expander:t`
      & path {
        stroke: ${n.gray[400]};
      }
      & svg {
        width: ${i[3]};
        height: ${i[3]};
      }
      display: inline-flex;
      align-items: center;
      transition: all 0.1s ease;
      /* outline: 1px solid ${n.blue[400]}; */
    `,expanderButtonContainer:t`
      display: flex;
      align-items: center;
      line-height: ${i[4]};
      min-height: ${i[4]};
      gap: ${i[2]};
    `,expanderButton:t`
      cursor: pointer;
      color: inherit;
      font: inherit;
      outline: inherit;
      height: ${i[5]};
      background: transparent;
      border: none;
      padding: 0;
      display: inline-flex;
      align-items: center;
      gap: ${i[1]};
      position: relative;
      /* outline: 1px solid ${n.green[400]}; */

      &:focus-visible {
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }

      & svg {
        position: relative;
        left: 1px;
      }
    `,info:t`
      color: ${o(n.gray[500],n.gray[500])};
      font-size: ${r.size.xs};
      margin-left: ${i[1]};
      /* outline: 1px solid ${n.yellow[400]}; */
    `,label:t`
      color: ${o(n.gray[700],n.gray[300])};
      white-space: nowrap;
    `,value:t`
      color: ${o(n.purple[600],n.purple[400])};
      flex-grow: 1;
    `,actions:t`
      display: inline-flex;
      gap: ${i[2]};
      align-items: center;
    `,row:t`
      display: inline-flex;
      gap: ${i[2]};
      width: 100%;
      margin: ${i[.25]} 0px;
      line-height: ${i[4.5]};
      align-items: center;
    `,editableInput:t`
      border: none;
      padding: ${i[.5]} ${i[1]} ${i[.5]} ${i[1.5]};
      flex-grow: 1;
      border-radius: ${a.radius.xs};
      background-color: ${o(n.gray[200],n.darkGray[500])};

      &:hover {
        background-color: ${o(n.gray[300],n.darkGray[600])};
      }
    `,actionButton:t`
      background-color: transparent;
      color: ${o(n.gray[500],n.gray[500])};
      border: none;
      display: inline-flex;
      padding: 0px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: ${i[3]};
      height: ${i[3]};
      position: relative;
      z-index: 1;

      &:hover svg {
        color: ${o(n.gray[600],n.gray[400])};
      }

      &:focus-visible {
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
        outline-offset: 2px;
      }
    `}},vl=e=>_l(`light`,e),yl=e=>_l(`dark`,e);oe([`click`]);var bl=s(`<div><div aria-hidden=true></div><button type=button aria-label="Open Tanstack query devtools"class=tsqd-open-btn>`),xl=s(`<div>`),Sl=s(`<div style=--tsqd-font-size:16px;max-height:100vh;height:100vh;width:100vw>`),Cl=s(`<div style=--tsqd-font-size:16px>`),wl=s(`<aside aria-label="Tanstack query devtools"><div role=separator aria-label="Resize devtools panel"tabindex=0></div><button aria-label="Close tanstack query devtools">`),Tl=s(`<select name=tsqd-queries-filter-sort aria-label="Sort queries by">`),El=s(`<select name=tsqd-mutations-filter-sort aria-label="Sort mutations by">`),Dl=s(`<span>Asc`),Ol=s(`<span>Desc`),kl=s(`<button aria-label="Open in picture-in-picture mode"title="Open in picture-in-picture mode">`),Al=s(`<div>Settings`),jl=s(`<span>Position`),Ml=s(`<span>Top`),Nl=s(`<span>Bottom`),Pl=s(`<span>Left`),Fl=s(`<span>Right`),Il=s(`<span>Theme`),Ll=s(`<span>Light`),Rl=s(`<span>Dark`),zl=s(`<span>System`),Bl=s(`<span>Disabled Queries`),Vl=s(`<span>Show`),Hl=s(`<span>Hide`),Ul=s(`<div><div class=tsqd-queries-container>`),Wl=s(`<div><div class=tsqd-mutations-container>`),Gl=s(`<div><div><div><button aria-label="Close Tanstack query devtools"><span>TANSTACK</span><span> v</span></button></div></div><div><div><div><input aria-label="Filter queries by query key"type=text placeholder=Filter name=tsqd-query-filter-input></div><div></div><button class=tsqd-query-filter-sort-order-btn></button></div><div><button aria-label="Clear query cache"></button><button>`),Kl=s(`<option>Sort by `),ql=s(`<div class=tsqd-query-disabled-indicator aria-hidden=true>disabled`),Jl=s(`<div class=tsqd-query-static-indicator aria-hidden=true>static`),Yl=s(`<button><div></div><code class=tsqd-query-hash>`),Xl=s(`<div role=tooltip id=tsqd-status-tooltip>`),Zl=s(`<span>`),Ql=s(`<button><span aria-hidden=true></span><span>`),$l=s(`<button><span aria-hidden=true></span> Error`),eu=s(`<div><span aria-hidden=true></span>Trigger Error<select aria-label="Select error type to trigger"><option value disabled selected>`),tu=s(`<div class="tsqd-query-details-explorer-container tsqd-query-details-data-explorer">`),nu=s(`<form><textarea name=data aria-label="Edit query data as JSON"></textarea><div><span></span><div><button type=button>Cancel</button><button>Save`),ru=s(`<div><div role=heading aria-level=2>Query Details</div><div><div class=tsqd-query-details-summary><pre><code></code></pre><span role=status aria-live=polite></span></div><div class=tsqd-query-details-observers-count><span>Observers:</span><span></span></div><div class=tsqd-query-details-last-updated><span>Last Updated:</span><span></span></div></div><div role=heading aria-level=2>Actions</div><div><button><span aria-hidden=true></span>Refetch</button><button><span aria-hidden=true></span>Invalidate</button><button><span aria-hidden=true></span>Reset</button><button><span aria-hidden=true></span>Remove</button><button><span aria-hidden=true></span> Loading</button></div><div role=heading aria-level=2>Data </div><div role=heading aria-level=2>Query Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer">`),iu=s(`<option>`),au=s(`<div><div role=heading aria-level=2>Mutation Details</div><div><div class=tsqd-query-details-summary><pre><code></code></pre><span role=status aria-live=polite></span></div><div class=tsqd-query-details-last-updated><span>Submitted At:</span><span></span></div></div><div role=heading aria-level=2>Variables Details</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div role=heading aria-level=2>Context Details</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div role=heading aria-level=2>Data Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div role=heading aria-level=2>Mutations Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer">`),[ou,su]=A(null),[cu,lu]=A(null),[uu,du]=A(0),[fu,pu]=A(!1),mu=e=>{let t=H(),n=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,r=L(()=>t()===`dark`?Fu(n):Pu(n)),i=L(()=>V().onlineManager);m(()=>{let e=i().subscribe(e=>{pu(!e)});f(()=>{e()})});let a=ze(),s=L(()=>V().buttonPosition||Te),c=L(()=>e.localStore.open===`true`?!0:e.localStore.open===`false`?!1:V().initialIsOpen||Oe),l=L(()=>e.localStore.position||V().position||Ee),u;k(()=>{let t=u.parentElement,n=e.localStore.height||ke,r=e.localStore.width||je,i=l();t.style.setProperty(`--tsqd-panel-height`,`${i===`top`?`-`:``}${n}px`),t.style.setProperty(`--tsqd-panel-width`,`${i===`left`?`-`:``}${r}px`)}),m(()=>{let e=()=>{let e=u.parentElement,t=getComputedStyle(e).fontSize;e.style.setProperty(`--tsqd-font-size`,t)};e(),window.addEventListener(`focus`,e),f(()=>{window.removeEventListener(`focus`,e)})});let d=L(()=>e.localStore.pip_open??`false`);return[N(F,{get when(){return M(()=>!!a().pipWindow)()&&d()==`true`},get children(){return N(R,{get mount(){return a().pipWindow?.document.body},get children(){return N(hu,{get children(){return N(vu,e)}})}})}}),(()=>{var t=xl(),i=u;return typeof i==`function`?o(i,t):u=t,p(t,N(bt,{name:`tsqd-panel-transition`,get children(){return N(F,{get when(){return M(()=>!(!c()||a().pipWindow))()&&d()==`false`},get children(){return N(_u,{get localStore(){return e.localStore},get setLocalStore(){return e.setLocalStore}})}})}}),null),p(t,N(bt,{name:`tsqd-button-transition`,get children(){return N(F,{get when(){return!c()},get children(){var t=bl(),n=t.firstChild,i=n.nextSibling;return p(n,N(Xc,{})),i.$$click=()=>e.setLocalStore(`open`,`true`),p(i,N(Xc,{})),P(()=>I(t,G(r().devtoolsBtn,r()[`devtoolsBtn-position-${s()}`],`tsqd-open-btn-container`))),t}})}}),null),P(()=>I(t,G(n`
            & .tsqd-panel-transition-exit-active,
            & .tsqd-panel-transition-enter-active {
              transition:
                opacity 0.3s,
                transform 0.3s;
            }

            & .tsqd-panel-transition-exit-to,
            & .tsqd-panel-transition-enter {
              ${l()===`top`||l()===`bottom`?`transform: translateY(var(--tsqd-panel-height));`:`transform: translateX(var(--tsqd-panel-width));`}
            }

            & .tsqd-button-transition-exit-active,
            & .tsqd-button-transition-enter-active {
              transition:
                opacity 0.3s,
                transform 0.3s;
              opacity: 1;
            }

            & .tsqd-button-transition-exit-to,
            & .tsqd-button-transition-enter {
              transform: ${s()===`relative`?`none;`:s()===`top-left`?`translateX(-72px);`:s()===`top-right`?`translateX(72px);`:`translateY(72px);`};
              opacity: 0;
            }
          `,`tsqd-transitions-container`))),t})()]},hu=e=>{let t=ze(),n=H(),r=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,i=L(()=>n()===`dark`?Fu(r):Pu(r)),a=()=>{let{colors:e}=Q,t=(e,t)=>n()===`dark`?t:e;return uu()<Ce?r`
        flex-direction: column;
        background-color: ${t(e.gray[300],e.gray[600])};
      `:r`
      flex-direction: row;
      background-color: ${t(e.gray[200],e.darkGray[900])};
    `};return k(()=>{let e=t().pipWindow,n=()=>{e&&du(e.innerWidth)};e&&(e.addEventListener(`resize`,n),n()),f(()=>{e&&e.removeEventListener(`resize`,n)})}),(()=>{var t=Sl();return p(t,()=>e.children),P(()=>I(t,G(i().panel,a(),{[r`
            min-width: min-content;
          `]:uu()<we},`tsqd-main-panel`))),t})()},gu=e=>{let t=H(),n=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,r=L(()=>t()===`dark`?Fu(n):Pu(n)),i;m(()=>{Ot(i,({width:e},t)=>{t===i&&du(e)})});let a=()=>{let{colors:e}=Q,r=(e,n)=>t()===`dark`?n:e;return uu()<Ce?n`
        flex-direction: column;
        background-color: ${r(e.gray[300],e.gray[600])};
      `:n`
      flex-direction: row;
      background-color: ${r(e.gray[200],e.darkGray[900])};
    `};return(()=>{var t=Cl(),s=i;return typeof s==`function`?o(s,t):i=t,p(t,()=>e.children),P(()=>I(t,G(r().parentPanel,a(),{[n`
            min-width: min-content;
          `]:uu()<we},`tsqd-main-panel`))),t})()},_u=e=>{let t=H(),n=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,i=L(()=>t()===`dark`?Fu(n):Pu(n)),a;m(()=>{a.focus()});let[s,l]=A(!1),d=L(()=>e.localStore.position||V().position||Ee),h=t=>{let n=t.currentTarget.parentElement;if(!n)return;l(!0);let{height:r,width:i}=n.getBoundingClientRect(),a=t.clientX,o=t.clientY,c=0,u=E(3.5),f=E(12),p=t=>{if(t.preventDefault(),d()===`left`||d()===`right`){let r=d()===`right`?a-t.clientX:t.clientX-a;c=Math.round(i+r),c<f&&(c=f),e.setLocalStore(`width`,String(Math.round(c)));let o=n.getBoundingClientRect().width;Number(e.localStore.width)<o&&e.setLocalStore(`width`,String(o))}else{let n=d()===`bottom`?o-t.clientY:t.clientY-o;c=Math.round(r+n),c<u&&(c=u,su(null)),e.setLocalStore(`height`,String(Math.round(c)))}},m=()=>{s()&&l(!1),document.removeEventListener(`mousemove`,p,!1),document.removeEventListener(`mouseup`,m,!1)};document.addEventListener(`mousemove`,p,!1),document.addEventListener(`mouseup`,m,!1)},g;m(()=>{Ot(g,({width:e},t)=>{t===g&&du(e)})}),k(()=>{let t=g.parentElement?.parentElement?.parentElement;if(!t)return;let n=e.localStore.position||Ee,i=r(`padding`,n),a=e.localStore.position===`left`||e.localStore.position===`right`,o=(({padding:e,paddingTop:t,paddingBottom:n,paddingLeft:r,paddingRight:i})=>({padding:e,paddingTop:t,paddingBottom:n,paddingLeft:r,paddingRight:i}))(t.style);t.style[i]=`${a?e.localStore.width:e.localStore.height}px`,f(()=>{Object.entries(o).forEach(([e,n])=>{t.style[e]=n})})});let _=()=>{let{colors:e}=Q,r=(e,n)=>t()===`dark`?n:e;return uu()<Ce?n`
        flex-direction: column;
        background-color: ${r(e.gray[300],e.gray[600])};
      `:n`
      flex-direction: row;
      background-color: ${r(e.gray[200],e.darkGray[900])};
    `};return(()=>{var t=wl(),r=t.firstChild,s=r.nextSibling,l=g;typeof l==`function`?o(l,t):g=t,r.$$keydown=t=>{let n=E(3.5),r=E(12);if(d()===`top`||d()===`bottom`){if(t.key===`ArrowUp`||t.key===`ArrowDown`){t.preventDefault();let r=Number(e.localStore.height||ke),i=d()===`bottom`?t.key===`ArrowUp`?10:-10:t.key===`ArrowDown`?10:-10,a=Math.max(n,r+i);e.setLocalStore(`height`,String(a))}}else if(t.key===`ArrowLeft`||t.key===`ArrowRight`){t.preventDefault();let n=Number(e.localStore.width||je),i=d()===`right`?t.key===`ArrowLeft`?10:-10:t.key===`ArrowRight`?10:-10,a=Math.max(r,n+i);e.setLocalStore(`width`,String(a))}},r.$$mousedown=h,s.$$click=()=>e.setLocalStore(`open`,`false`);var f=a;return typeof f==`function`?o(f,s):a=s,p(s,N(Oc,{})),p(t,N(vu,e),null),P(a=>{var o=G(i().panel,i()[`panel-position-${d()}`],_(),{[n`
            min-width: min-content;
          `]:uu()<we&&(d()===`right`||d()===`left`)},`tsqd-main-panel`),l=d()===`bottom`||d()===`top`?`${e.localStore.height||ke}px`:`auto`,f=d()===`right`||d()===`left`?`${e.localStore.width||je}px`:`auto`,p=d()===`top`||d()===`bottom`?`horizontal`:`vertical`,m=d()===`top`||d()===`bottom`?E(3.5):E(12),h=d()===`top`||d()===`bottom`?Number(e.localStore.height||ke):Number(e.localStore.width||je),g=G(i().dragHandle,i()[`dragHandle-position-${d()}`],`tsqd-drag-handle`),v=G(i().closeBtn,i()[`closeBtn-position-${d()}`],`tsqd-minimize-btn`);return o!==a.e&&I(t,a.e=o),l!==a.t&&u(t,`height`,a.t=l),f!==a.a&&u(t,`width`,a.a=f),p!==a.o&&c(r,`aria-orientation`,a.o=p),m!==a.i&&c(r,`aria-valuemin`,a.i=m),h!==a.n&&c(r,`aria-valuenow`,a.n=h),g!==a.s&&I(r,a.s=g),v!==a.h&&I(s,a.h=v),a},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),t})()},vu=e=>{Du(),ku();let t,n=H(),r=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,i=L(()=>n()===`dark`?Fu(r):Pu(r)),a=ze(),[s,l]=A(`queries`),u=L(()=>e.localStore.sort||Me),f=L(()=>Number(e.localStore.sortOrder)||Ne),m=L(()=>e.localStore.mutationSort||Pe),h=L(()=>Number(e.localStore.mutationSortOrder)||Ne),_=L(()=>g[u()]),v=L(()=>j[m()]),y=L(()=>V().onlineManager),b=L(()=>V().client.getQueryCache()),x=L(()=>V().client.getMutationCache()),S=$(e=>e().getAll().length,!1),C=L(d(()=>[S(),e.localStore.filter,u(),f(),e.localStore.hideDisabledQueries],()=>{let t=b().getAll(),n=e.localStore.filter?t.filter(t=>Ge(t.queryHash,e.localStore.filter||``).passed):[...t];return e.localStore.hideDisabledQueries===`true`&&(n=n.filter(e=>!e.isDisabled())),_()?n.sort((e,t)=>_()(e,t)*f()):n})),w=Au(e=>e().getAll().length,!1),T=L(d(()=>[w(),e.localStore.mutationFilter,m(),h()],()=>{let t=x().getAll(),n=e.localStore.mutationFilter?t.filter(t=>Ge(`${t.options.mutationKey?JSON.stringify(t.options.mutationKey)+` - `:``}${new Date(t.state.submittedAt).toLocaleString()}`,e.localStore.mutationFilter||``).passed):[...t];return v()?n.sort((e,t)=>v()(e,t)*h()):n})),E=t=>{e.setLocalStore(`position`,t)},D=e=>{let n=getComputedStyle(t).getPropertyValue(`--tsqd-font-size`);e.style.setProperty(`--tsqd-font-size`,n)};return[(()=>{var n=Gl(),d=n.firstChild,_=d.firstChild,v=_.firstChild,S=v.firstChild,w=S.nextSibling,O=w.firstChild,k=d.nextSibling,A=k.firstChild,ee=A.firstChild,te=ee.firstChild,L=ee.nextSibling,ne=L.nextSibling,re=A.nextSibling,ie=re.firstChild,R=ie.nextSibling,ae=t;return typeof ae==`function`?o(ae,n):t=n,v.$$click=()=>{if(!a().pipWindow&&!e.showPanelViewOnly){e.setLocalStore(`open`,`false`);return}e.onClose&&e.onClose()},p(w,()=>V().queryFlavor,O),p(w,()=>V().version,null),p(_,N(Ko.Root,{get class(){return G(i().viewToggle)},get value(){return s()},"aria-label":`Toggle between queries and mutations view`,onChange:e=>{l(e),su(null),lu(null)},get children(){return[N(Ko.Item,{value:`queries`,class:`tsqd-radio-toggle`,get children(){return[N(Ko.ItemInput,{}),N(Ko.ItemControl,{get children(){return N(Ko.ItemIndicator,{})}}),N(Ko.ItemLabel,{title:`Toggle Queries View`,children:`Queries`})]}}),N(Ko.Item,{value:`mutations`,class:`tsqd-radio-toggle`,get children(){return[N(Ko.ItemInput,{}),N(Ko.ItemControl,{get children(){return N(Ko.ItemIndicator,{})}}),N(Ko.ItemLabel,{title:`Toggle Mutations View`,children:`Mutations`})]}})]}}),null),p(d,N(F,{get when(){return s()===`queries`},get children(){return N(xu,{})}}),null),p(d,N(F,{get when(){return s()===`mutations`},get children(){return N(Su,{})}}),null),p(ee,N(Ec,{}),te),te.$$input=t=>{s()===`queries`?e.setLocalStore(`filter`,t.currentTarget.value):e.setLocalStore(`mutationFilter`,t.currentTarget.value)},p(L,N(F,{get when(){return s()===`queries`},get children(){var t=Tl();return t.addEventListener(`change`,t=>{e.setLocalStore(`sort`,t.currentTarget.value)}),p(t,()=>Object.keys(g).map(e=>(()=>{var t=Kl();return t.firstChild,t.value=e,p(t,e,null),t})())),P(()=>t.value=u()),t}}),null),p(L,N(F,{get when(){return s()===`mutations`},get children(){var t=El();return t.addEventListener(`change`,t=>{e.setLocalStore(`mutationSort`,t.currentTarget.value)}),p(t,()=>Object.keys(j).map(e=>(()=>{var t=Kl();return t.firstChild,t.value=e,p(t,e,null),t})())),P(()=>t.value=m()),t}}),null),p(L,N(Oc,{}),null),ne.$$click=()=>{s()===`queries`?e.setLocalStore(`sortOrder`,String(f()*-1)):e.setLocalStore(`mutationSortOrder`,String(h()*-1))},p(ne,N(F,{get when(){return(s()===`queries`?f():h())===1},get children(){return[Dl(),N(kc,{})]}}),null),p(ne,N(F,{get when(){return(s()===`queries`?f():h())===-1},get children(){return[Ol(),N(Ac,{})]}}),null),ie.$$click=()=>{s()===`queries`?(Mu({type:`CLEAR_QUERY_CACHE`}),b().clear()):(Mu({type:`CLEAR_MUTATION_CACHE`}),x().clear())},p(ie,N(Dc,{})),R.$$click=()=>{y().setOnline(!y().isOnline())},p(R,(()=>{var e=M(()=>!!fu());return()=>e()?N(Lc,{}):N(Ic,{})})()),p(re,N(F,{get when(){return M(()=>!a().pipWindow)()&&!a().disabled},get children(){var t=kl();return t.$$click=()=>{a().requestPipWindow(Number(window.innerWidth),Number(e.localStore.height??500))},p(t,N(zc,{})),P(()=>I(t,G(i().actionsBtn,`tsqd-actions-btn`,`tsqd-action-open-pip`))),t}}),null),p(re,N(Z.Root,{gutter:4,get children(){return[N(Z.Trigger,{get class(){return G(i().actionsBtn,`tsqd-actions-btn`,`tsqd-action-settings`)},"aria-label":`Open settings menu`,title:`Open settings menu`,get children(){return N(Rc,{})}}),N(Z.Portal,{ref:e=>D(e),get mount(){return M(()=>!!a().pipWindow)()?a().pipWindow.document.body:document.body},get children(){return N(Z.Content,{get class(){return G(i().settingsMenu,`tsqd-settings-menu`)},get children(){return[(()=>{var e=Al();return P(()=>I(e,G(i().settingsMenuHeader,`tsqd-settings-menu-header`))),e})(),N(F,{get when(){return!e.showPanelViewOnly},get children(){return N(Z.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[N(Z.SubTrigger,{get class(){return G(i().settingsSubTrigger,`tsqd-settings-menu-sub-trigger`,`tsqd-settings-menu-sub-trigger-position`)},get children(){return[jl(),N(Oc,{})]}}),N(Z.Portal,{ref:e=>D(e),get mount(){return M(()=>!!a().pipWindow)()?a().pipWindow.document.body:document.body},get children(){return N(Z.SubContent,{get class(){return G(i().settingsMenu,`tsqd-settings-submenu`)},get children(){return N(Z.RadioGroup,{"aria-label":`Position settings`,get value(){return e.localStore.position},onChange:e=>E(e),get children(){return[N(Z.RadioItem,{value:`top`,get class(){return G(i().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-top`)},get children(){return[Ml(),N(kc,{})]}}),N(Z.RadioItem,{value:`bottom`,get class(){return G(i().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-bottom`)},get children(){return[Nl(),N(Ac,{})]}}),N(Z.RadioItem,{value:`left`,get class(){return G(i().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-left`)},get children(){return[Pl(),N(jc,{})]}}),N(Z.RadioItem,{value:`right`,get class(){return G(i().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-right`)},get children(){return[Fl(),N(Mc,{})]}})]}})}})}})]}})}}),N(Z.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[N(Z.SubTrigger,{get class(){return G(i().settingsSubTrigger,`tsqd-settings-menu-sub-trigger`,`tsqd-settings-menu-sub-trigger-position`)},get children(){return[Il(),N(Oc,{})]}}),N(Z.Portal,{ref:e=>D(e),get mount(){return M(()=>!!a().pipWindow)()?a().pipWindow.document.body:document.body},get children(){return N(Z.SubContent,{get class(){return G(i().settingsMenu,`tsqd-settings-submenu`)},get children(){return N(Z.RadioGroup,{get value(){return e.localStore.theme_preference},onChange:t=>{e.setLocalStore(`theme_preference`,t)},"aria-label":`Theme preference`,get children(){return[N(Z.RadioItem,{value:`light`,get class(){return G(i().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-top`)},get children(){return[Ll(),N(Nc,{})]}}),N(Z.RadioItem,{value:`dark`,get class(){return G(i().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-bottom`)},get children(){return[Rl(),N(Pc,{})]}}),N(Z.RadioItem,{value:`system`,get class(){return G(i().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-left`)},get children(){return[zl(),N(Fc,{})]}})]}})}})}})]}}),N(Z.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[N(Z.SubTrigger,{get class(){return G(i().settingsSubTrigger,`tsqd-settings-menu-sub-trigger`,`tsqd-settings-menu-sub-trigger-disabled-queries`)},get children(){return[Bl(),N(Oc,{})]}}),N(Z.Portal,{ref:e=>D(e),get mount(){return M(()=>!!a().pipWindow)()?a().pipWindow.document.body:document.body},get children(){return N(Z.SubContent,{get class(){return G(i().settingsMenu,`tsqd-settings-submenu`)},get children(){return N(Z.RadioGroup,{get value(){return e.localStore.hideDisabledQueries},"aria-label":`Hide disabled queries setting`,onChange:t=>e.setLocalStore(`hideDisabledQueries`,t),get children(){return[N(Z.RadioItem,{value:`false`,get class(){return G(i().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-show`)},get children(){return[Vl(),N(F,{get when(){return e.localStore.hideDisabledQueries!==`true`},get children(){return N(Kc,{})}})]}}),N(Z.RadioItem,{value:`true`,get class(){return G(i().settingsSubButton,`tsqd-settings-menu-position-btn`,`tsqd-settings-menu-position-btn-hide`)},get children(){return[Hl(),N(F,{get when(){return e.localStore.hideDisabledQueries===`true`},get children(){return N(Kc,{})}})]}})]}})}})}})]}})]}})}})]}}),null),p(n,N(F,{get when(){return s()===`queries`},get children(){var e=Ul(),t=e.firstChild;return p(t,N(wt,{by:e=>e.queryHash,get each(){return C()},children:e=>N(yu,{get query(){return e()}})})),P(()=>I(e,G(i().overflowQueryContainer,`tsqd-queries-overflow-container`))),e}}),null),p(n,N(F,{get when(){return s()===`mutations`},get children(){var e=Wl(),t=e.firstChild;return p(t,N(wt,{by:e=>e.mutationId,get each(){return T()},children:e=>N(bu,{get mutation(){return e()}})})),P(()=>I(e,G(i().overflowQueryContainer,`tsqd-mutations-overflow-container`))),e}}),null),P(e=>{var t=G(i().queriesContainer,uu()<Ce&&(ou()||cu())&&r`
              height: 50%;
              max-height: 50%;
            `,uu()<Ce&&!(ou()||cu())&&r`
              height: 100%;
              max-height: 100%;
            `,`tsqd-queries-container`),a=G(i().row,`tsqd-header`),o=i().logoAndToggleContainer,l=G(i().logo,`tsqd-text-logo-container`),u=G(i().tanstackLogo,`tsqd-text-logo-tanstack`),p=G(i().queryFlavorLogo,`tsqd-text-logo-query-flavor`),m=G(i().row,`tsqd-filters-actions-container`),g=G(i().filtersContainer,`tsqd-filters-container`),y=G(i().filterInput,`tsqd-query-filter-textfield-container`),b=G(`tsqd-query-filter-textfield`),x=G(i().filterSelect,`tsqd-query-filter-sort-container`),C=`Sort order ${(s()===`queries`?f():h())===-1?`descending`:`ascending`}`,T=(s()===`queries`?f():h())===-1,E=G(i().actionsContainer,`tsqd-actions-container`),D=G(i().actionsBtn,`tsqd-actions-btn`,`tsqd-action-clear-cache`),O=`Clear ${s()} cache`,j=G(i().actionsBtn,fu()&&i().actionsBtnOffline,`tsqd-actions-btn`,`tsqd-action-mock-offline-behavior`),M=`${fu()?`Unset offline mocking behavior`:`Mock offline behavior`}`,N=fu(),P=`${fu()?`Unset offline mocking behavior`:`Mock offline behavior`}`;return t!==e.e&&I(n,e.e=t),a!==e.t&&I(d,e.t=a),o!==e.a&&I(_,e.a=o),l!==e.o&&I(v,e.o=l),u!==e.i&&I(S,e.i=u),p!==e.n&&I(w,e.n=p),m!==e.s&&I(k,e.s=m),g!==e.h&&I(A,e.h=g),y!==e.r&&I(ee,e.r=y),b!==e.d&&I(te,e.d=b),x!==e.l&&I(L,e.l=x),C!==e.u&&c(ne,`aria-label`,e.u=C),T!==e.c&&c(ne,`aria-pressed`,e.c=T),E!==e.w&&I(re,e.w=E),D!==e.m&&I(ie,e.m=D),O!==e.f&&c(ie,`title`,e.f=O),j!==e.y&&I(R,e.y=j),M!==e.g&&c(R,`aria-label`,e.g=M),N!==e.p&&c(R,`aria-pressed`,e.p=N),P!==e.b&&c(R,`title`,e.b=P),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0}),P(()=>te.value=s()===`queries`?e.localStore.filter||``:e.localStore.mutationFilter||``),n})(),N(F,{get when(){return M(()=>s()===`queries`)()&&ou()},get children(){return N(wu,{})}}),N(F,{get when(){return M(()=>s()===`mutations`)()&&cu()},get children(){return N(Tu,{})}})]},yu=e=>{let t=H(),n=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,r=L(()=>t()===`dark`?Fu(n):Pu(n)),{colors:i,alpha:a}=Q,o=(e,n)=>t()===`dark`?n:e,s=$(t=>t().find({queryKey:e.query.queryKey})?.state,!0,t=>t.query.queryHash===e.query.queryHash),l=$(t=>t().find({queryKey:e.query.queryKey})?.isDisabled()??!1,!0,t=>t.query.queryHash===e.query.queryHash),u=$(t=>t().find({queryKey:e.query.queryKey})?.isStatic()??!1,!0,t=>t.query.queryHash===e.query.queryHash),d=$(t=>t().find({queryKey:e.query.queryKey})?.isStale()??!1,!0,t=>t.query.queryHash===e.query.queryHash),f=$(t=>t().find({queryKey:e.query.queryKey})?.getObserversCount()??0,!0,t=>t.query.queryHash===e.query.queryHash),m=L(()=>se({queryState:s(),observerCount:f(),isStale:d()})),h=()=>m()===`gray`?n`
        background-color: ${o(i[m()][200],i[m()][700])};
        color: ${o(i[m()][700],i[m()][300])};
      `:n`
      background-color: ${o(i[m()][200]+a[80],i[m()][900])};
      color: ${o(i[m()][800],i[m()][300])};
    `;return N(F,{get when(){return s()},get children(){var t=Yl(),n=t.firstChild,i=n.nextSibling;return t.$$click=()=>su(e.query.queryHash===ou()?null:e.query.queryHash),p(n,f),p(i,()=>e.query.queryHash),p(t,N(F,{get when(){return l()},get children(){return ql()}}),null),p(t,N(F,{get when(){return u()},get children(){return Jl()}}),null),P(i=>{var a=G(r().queryRow,ou()===e.query.queryHash&&r().selectedQueryRow,`tsqd-query-row`),o=`Query key ${e.query.queryHash}${l()?`, disabled`:``}${u()?`, static`:``}`,s=G(h(),`tsqd-query-observer-count`);return a!==i.e&&I(t,i.e=a),o!==i.t&&c(t,`aria-label`,i.t=o),s!==i.a&&I(n,i.a=s),i},{e:void 0,t:void 0,a:void 0}),t}})},bu=e=>{let t=H(),n=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,r=L(()=>t()===`dark`?Fu(n):Pu(n)),{colors:i,alpha:a}=Q,o=(e,n)=>t()===`dark`?n:e,s=Au(t=>t().getAll().find(t=>t.mutationId===e.mutation.mutationId)?.state),l=Au(t=>{let n=t().getAll().find(t=>t.mutationId===e.mutation.mutationId);return n?n.state.isPaused:!1}),u=Au(t=>{let n=t().getAll().find(t=>t.mutationId===e.mutation.mutationId);return n?n.state.status:`idle`}),d=L(()=>ce({isPaused:l(),status:u()})),f=()=>d()===`gray`?n`
        background-color: ${o(i[d()][200],i[d()][700])};
        color: ${o(i[d()][700],i[d()][300])};
      `:n`
      background-color: ${o(i[d()][200]+a[80],i[d()][900])};
      color: ${o(i[d()][800],i[d()][300])};
    `;return N(F,{get when(){return s()},get children(){var t=Yl(),n=t.firstChild,i=n.nextSibling;return t.$$click=()=>{lu(e.mutation.mutationId===cu()?null:e.mutation.mutationId)},p(n,N(F,{get when(){return d()===`purple`},get children(){return N(Yc,{})}}),null),p(n,N(F,{get when(){return d()===`green`},get children(){return N(Kc,{})}}),null),p(n,N(F,{get when(){return d()===`red`},get children(){return N(Jc,{})}}),null),p(n,N(F,{get when(){return d()===`yellow`},get children(){return N(qc,{})}}),null),p(i,N(F,{get when(){return e.mutation.options.mutationKey},get children(){return[M(()=>JSON.stringify(e.mutation.options.mutationKey)),` -`,` `]}}),null),p(i,()=>new Date(e.mutation.state.submittedAt).toLocaleString(),null),P(i=>{var a=G(r().queryRow,cu()===e.mutation.mutationId&&r().selectedQueryRow,`tsqd-query-row`),o=`Mutation submitted at ${new Date(e.mutation.state.submittedAt).toLocaleString()}`,s=G(f(),`tsqd-query-observer-count`);return a!==i.e&&I(t,i.e=a),o!==i.t&&c(t,`aria-label`,i.t=o),s!==i.a&&I(n,i.a=s),i},{e:void 0,t:void 0,a:void 0}),t}})},xu=()=>{let e=$(e=>e().getAll().filter(e=>i(e)===`stale`).length),t=$(e=>e().getAll().filter(e=>i(e)===`fresh`).length),n=$(e=>e().getAll().filter(e=>i(e)===`fetching`).length),r=$(e=>e().getAll().filter(e=>i(e)===`paused`).length),a=$(e=>e().getAll().filter(e=>i(e)===`inactive`).length),o=H(),s=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,c=L(()=>o()===`dark`?Fu(s):Pu(s));return(()=>{var i=xl();return p(i,N(Cu,{label:`Fresh`,color:`green`,get count(){return t()}}),null),p(i,N(Cu,{label:`Fetching`,color:`blue`,get count(){return n()}}),null),p(i,N(Cu,{label:`Paused`,color:`purple`,get count(){return r()}}),null),p(i,N(Cu,{label:`Stale`,color:`yellow`,get count(){return e()}}),null),p(i,N(Cu,{label:`Inactive`,color:`gray`,get count(){return a()}}),null),P(()=>I(i,G(c().queryStatusContainer,`tsqd-query-status-container`))),i})()},Su=()=>{let e=Au(e=>e().getAll().filter(e=>ce({isPaused:e.state.isPaused,status:e.state.status})===`green`).length),t=Au(e=>e().getAll().filter(e=>ce({isPaused:e.state.isPaused,status:e.state.status})===`yellow`).length),n=Au(e=>e().getAll().filter(e=>ce({isPaused:e.state.isPaused,status:e.state.status})===`purple`).length),r=Au(e=>e().getAll().filter(e=>ce({isPaused:e.state.isPaused,status:e.state.status})===`red`).length),i=H(),a=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,o=L(()=>i()===`dark`?Fu(a):Pu(a));return(()=>{var i=xl();return p(i,N(Cu,{label:`Paused`,color:`purple`,get count(){return n()}}),null),p(i,N(Cu,{label:`Pending`,color:`yellow`,get count(){return t()}}),null),p(i,N(Cu,{label:`Success`,color:`green`,get count(){return e()}}),null),p(i,N(Cu,{label:`Error`,color:`red`,get count(){return r()}}),null),P(()=>I(i,G(o().queryStatusContainer,`tsqd-query-status-container`))),i})()},Cu=e=>{let r=H(),i=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,a=L(()=>r()===`dark`?Fu(i):Pu(i)),{colors:s,alpha:c}=Q,l=(e,t)=>r()===`dark`?t:e,u,[d,f]=A(!1),[m,h]=A(!1),g=L(()=>!(ou()&&uu()<Se&&uu()>Ce||uu()<Ce));return(()=>{var r=Ql(),_=r.firstChild,v=_.nextSibling,y=u;return typeof y==`function`?o(y,r):u=r,r.addEventListener(`mouseleave`,()=>{f(!1),h(!1)}),r.addEventListener(`mouseenter`,()=>f(!0)),r.addEventListener(`blur`,()=>h(!1)),r.addEventListener(`focus`,()=>h(!0)),n(r,t({get disabled(){return g()},get"aria-label"(){return`${e.label}: ${e.count}`},get class(){return G(a().queryStatusTag,!g()&&i`
            cursor: pointer;
            &:hover {
              background: ${l(s.gray[200],s.darkGray[400])}${c[80]};
            }
          `,`tsqd-query-status-tag`,`tsqd-query-status-tag-${e.label.toLowerCase()}`)}},()=>d()||m()?{"aria-describedby":`tsqd-status-tooltip`}:{}),!1,!0),p(r,N(F,{get when(){return M(()=>!g())()&&(d()||m())},get children(){var t=Xl();return p(t,()=>e.label),P(()=>I(t,G(a().statusTooltip,`tsqd-query-status-tooltip`))),t}}),_),p(r,N(F,{get when(){return g()},get children(){var t=Zl();return p(t,()=>e.label),P(()=>I(t,G(a().queryStatusTagLabel,`tsqd-query-status-tag-label`))),t}}),v),p(v,()=>e.count),P(t=>{var n=G(i`
            width: ${Q.size[1.5]};
            height: ${Q.size[1.5]};
            border-radius: ${Q.border.radius.full};
            background-color: ${Q.colors[e.color][500]};
          `,`tsqd-query-status-tag-dot`),r=G(a().queryStatusCount,e.count>0&&e.color!==`gray`&&i`
              background-color: ${l(s[e.color][100],s[e.color][900])};
              color: ${l(s[e.color][700],s[e.color][300])};
            `,`tsqd-query-status-tag-count`);return n!==t.e&&I(_,t.e=n),r!==t.t&&I(v,t.t=r),t},{e:void 0,t:void 0}),r})()},wu=()=>{let e=H(),t=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,n=L(()=>e()===`dark`?Fu(t):Pu(t)),{colors:r}=Q,a=(t,n)=>e()===`dark`?n:t,o=V().client,[s,l]=A(!1),[d,f]=A(`view`),[m,g]=A(!1),v=L(()=>V().errorTypes||[]),y=$(e=>e().getAll().find(e=>e.queryHash===ou()),!1),b=$(e=>e().getAll().find(e=>e.queryHash===ou()),!1),x=$(e=>e().getAll().find(e=>e.queryHash===ou())?.state,!1),S=$(e=>e().getAll().find(e=>e.queryHash===ou())?.state.data,!1),C=$(e=>{let t=e().getAll().find(e=>e.queryHash===ou());return t?i(t):`inactive`}),w=$(e=>{let t=e().getAll().find(e=>e.queryHash===ou());return t?t.state.status:`pending`}),E=$(e=>e().getAll().find(e=>e.queryHash===ou())?.getObserversCount()??0),D=L(()=>_(C())),O=()=>{Mu({type:`REFETCH`,queryHash:y()?.queryHash}),(y()?.fetch())?.catch(()=>{})},ee=e=>{let t=y();if(!t)return;Mu({type:`TRIGGER_ERROR`,queryHash:t.queryHash,metadata:{error:e?.name}});let n=e?.initializer(t)??Error(`Unknown error from devtools`),r=t.options;t.setState({data:void 0,status:`error`,error:n,fetchMeta:{...t.state.fetchMeta,__previousQueryOptions:r}})},te=()=>{let e=y();if(!e)return;Mu({type:`RESTORE_LOADING`,queryHash:e.queryHash});let t=e.state,n=e.state.fetchMeta?e.state.fetchMeta.__previousQueryOptions:null;e.cancel({silent:!0}),e.setState({...t,fetchStatus:`idle`,fetchMeta:null}),n&&e.fetch(n)};k(()=>{C()!==`fetching`&&l(!1)});let j=()=>D()===`gray`?t`
        background-color: ${a(r[D()][200],r[D()][700])};
        color: ${a(r[D()][700],r[D()][300])};
        border-color: ${a(r[D()][400],r[D()][600])};
      `:t`
      background-color: ${a(r[D()][100],r[D()][900])};
      color: ${a(r[D()][700],r[D()][300])};
      border-color: ${a(r[D()][400],r[D()][600])};
    `;return N(F,{get when(){return M(()=>!!y())()&&x()},get children(){var e=ru(),i=e.firstChild,_=i.nextSibling,D=_.firstChild,k=D.firstChild,A=k.firstChild,M=k.nextSibling,L=D.nextSibling,ne=L.firstChild.nextSibling,re=L.nextSibling.firstChild.nextSibling,ie=_.nextSibling,R=ie.nextSibling,ae=R.firstChild,oe=ae.firstChild,se=ae.nextSibling,ce=se.firstChild,le=se.nextSibling,z=le.firstChild,ue=le.nextSibling,de=ue.firstChild,fe=ue.nextSibling,B=fe.firstChild,pe=B.nextSibling,me=R.nextSibling;me.firstChild;var he=me.nextSibling,ge=he.nextSibling;return p(A,()=>T(y().queryKey,!0)),p(M,C),p(ne,E),p(re,()=>new Date(x().dataUpdatedAt).toLocaleTimeString()),ae.$$click=O,se.$$click=()=>{Mu({type:`INVALIDATE`,queryHash:y()?.queryHash}),o.invalidateQueries({queryKey:y()?.queryKey,exact:!0})},le.$$click=()=>{Mu({type:`RESET`,queryHash:y()?.queryHash}),o.resetQueries({queryKey:y()?.queryKey,exact:!0})},ue.$$click=()=>{Mu({type:`REMOVE`,queryHash:y()?.queryHash}),o.removeQueries({queryKey:y()?.queryKey,exact:!0}),su(null)},fe.$$click=()=>{if(y()?.state.data===void 0)l(!0),te();else{let e=y();if(!e)return;Mu({type:`TRIGGER_LOADING`,queryHash:e.queryHash});let t=e.options;e.fetch({...t,queryFn:()=>new Promise(()=>{}),gcTime:-1}),e.setState({data:void 0,status:`pending`,fetchMeta:{...e.state.fetchMeta,__previousQueryOptions:t}})}},p(fe,()=>w()===`pending`?`Restore`:`Trigger`,pe),p(R,N(F,{get when(){return v().length===0||w()===`error`},get children(){var e=$l(),n=e.firstChild,i=n.nextSibling;return e.$$click=()=>{y().state.error?(Mu({type:`RESTORE_ERROR`,queryHash:y()?.queryHash}),o.resetQueries({queryKey:y()?.queryKey})):ee()},p(e,()=>w()===`error`?`Restore`:`Trigger`,i),P(i=>{var o=G(t`
                  color: ${a(r.red[500],r.red[400])};
                `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-error`),s=w()===`pending`,c=t`
                  background-color: ${a(r.red[500],r.red[400])};
                `;return o!==i.e&&I(e,i.e=o),s!==i.t&&(e.disabled=i.t=s),c!==i.a&&I(n,i.a=c),i},{e:void 0,t:void 0,a:void 0}),e}}),null),p(R,N(F,{get when(){return v().length!==0&&w()!==`error`},get children(){var e=eu(),r=e.firstChild,i=r.nextSibling.nextSibling;return i.firstChild,i.addEventListener(`change`,e=>{let t=v().find(t=>t.name===e.currentTarget.value);ee(t)}),p(i,N(h,{get each(){return v()},children:e=>(()=>{var t=iu();return p(t,()=>e.name),P(()=>t.value=e.name),t})()}),null),p(e,N(Oc,{}),null),P(a=>{var o=G(n().actionsSelect,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-error-multiple`),s=t`
                  background-color: ${Q.colors.red[400]};
                `,c=w()===`pending`;return o!==a.e&&I(e,a.e=o),s!==a.t&&I(r,a.t=s),c!==a.a&&(i.disabled=a.a=c),a},{e:void 0,t:void 0,a:void 0}),e}}),null),p(me,()=>d()===`view`?`Explorer`:`Editor`,null),p(e,N(F,{get when(){return d()===`view`},get children(){var e=tu();return p(e,N(gl,{label:`Data`,defaultExpanded:[`Data`],get value(){return S()},editable:!0,onEdit:()=>f(`edit`),get activeQuery(){return y()}})),P(t=>u(e,`padding`,Q.size[2])),e}}),he),p(e,N(F,{get when(){return d()===`edit`},get children(){var e=nu(),i=e.firstChild,o=i.nextSibling,s=o.firstChild,l=s.nextSibling,u=l.firstChild,d=u.nextSibling;return e.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(e.currentTarget).get(`data`);try{let e=JSON.parse(t);y().setState({...y().state,data:e}),f(`view`)}catch{g(!0)}}),i.addEventListener(`focus`,()=>g(!1)),p(s,()=>m()?`Invalid Value`:``),u.$$click=()=>f(`view`),P(f=>{var p=G(n().devtoolsEditForm,`tsqd-query-details-data-editor`),h=n().devtoolsEditTextarea,g=m(),_=n().devtoolsEditFormActions,v=n().devtoolsEditFormError,y=n().devtoolsEditFormActionContainer,b=G(n().devtoolsEditFormAction,t`
                      color: ${a(r.gray[600],r.gray[300])};
                    `),x=G(n().devtoolsEditFormAction,t`
                      color: ${a(r.blue[600],r.blue[400])};
                    `);return p!==f.e&&I(e,f.e=p),h!==f.t&&I(i,f.t=h),g!==f.a&&c(i,`data-error`,f.a=g),_!==f.o&&I(o,f.o=_),v!==f.i&&I(s,f.i=v),y!==f.n&&I(l,f.n=y),b!==f.s&&I(u,f.s=b),x!==f.h&&I(d,f.h=x),f},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),P(()=>i.value=JSON.stringify(S(),null,2)),e}}),he),p(ge,N(gl,{label:`Query`,defaultExpanded:[`Query`,`queryKey`],get value(){return b()}})),P(o=>{var c=G(n().detailsContainer,`tsqd-query-details-container`),l=G(n().detailsHeader,`tsqd-query-details-header`),d=G(n().detailsBody,`tsqd-query-details-summary-container`),f=G(n().queryDetailsStatus,j()),p=G(n().detailsHeader,`tsqd-query-details-header`),m=G(n().actionsBody,`tsqd-query-details-actions-container`),h=G(t`
                color: ${a(r.blue[600],r.blue[400])};
              `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-refetch`),g=C()===`fetching`,v=t`
                background-color: ${a(r.blue[600],r.blue[400])};
              `,y=G(t`
                color: ${a(r.yellow[600],r.yellow[400])};
              `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-invalidate`),b=w()===`pending`,x=t`
                background-color: ${a(r.yellow[600],r.yellow[400])};
              `,S=G(t`
                color: ${a(r.gray[600],r.gray[300])};
              `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-reset`),T=w()===`pending`,E=t`
                background-color: ${a(r.gray[600],r.gray[400])};
              `,D=G(t`
                color: ${a(r.pink[500],r.pink[400])};
              `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-remove`),O=C()===`fetching`,k=t`
                background-color: ${a(r.pink[500],r.pink[400])};
              `,A=G(t`
                color: ${a(r.cyan[500],r.cyan[400])};
              `,`tsqd-query-details-actions-btn`,`tsqd-query-details-action-loading`),ee=s(),te=t`
                background-color: ${a(r.cyan[500],r.cyan[400])};
              `,N=G(n().detailsHeader,`tsqd-query-details-header`),P=G(n().detailsHeader,`tsqd-query-details-header`),F=Q.size[2];return c!==o.e&&I(e,o.e=c),l!==o.t&&I(i,o.t=l),d!==o.a&&I(_,o.a=d),f!==o.o&&I(M,o.o=f),p!==o.i&&I(ie,o.i=p),m!==o.n&&I(R,o.n=m),h!==o.s&&I(ae,o.s=h),g!==o.h&&(ae.disabled=o.h=g),v!==o.r&&I(oe,o.r=v),y!==o.d&&I(se,o.d=y),b!==o.l&&(se.disabled=o.l=b),x!==o.u&&I(ce,o.u=x),S!==o.c&&I(le,o.c=S),T!==o.w&&(le.disabled=o.w=T),E!==o.m&&I(z,o.m=E),D!==o.f&&I(ue,o.f=D),O!==o.y&&(ue.disabled=o.y=O),k!==o.g&&I(de,o.g=k),A!==o.p&&I(fe,o.p=A),ee!==o.b&&(fe.disabled=o.b=ee),te!==o.T&&I(B,o.T=te),N!==o.A&&I(me,o.A=N),P!==o.O&&I(he,o.O=P),F!==o.I&&u(ge,`padding`,o.I=F),o},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0,T:void 0,A:void 0,O:void 0,I:void 0}),e}})},Tu=()=>{let e=H(),t=V().shadowDOMTarget?W.bind({target:V().shadowDOMTarget}):W,n=L(()=>e()===`dark`?Fu(t):Pu(t)),{colors:r}=Q,i=(t,n)=>e()===`dark`?n:t,a=Au(e=>{let t=e().getAll().find(e=>e.mutationId===cu());return t?t.state.isPaused:!1}),o=Au(e=>{let t=e().getAll().find(e=>e.mutationId===cu());return t?t.state.status:`idle`}),s=L(()=>ce({isPaused:a(),status:o()})),c=Au(e=>e().getAll().find(e=>e.mutationId===cu()),!1),l=()=>s()===`gray`?t`
        background-color: ${i(r[s()][200],r[s()][700])};
        color: ${i(r[s()][700],r[s()][300])};
        border-color: ${i(r[s()][400],r[s()][600])};
      `:t`
      background-color: ${i(r[s()][100],r[s()][900])};
      color: ${i(r[s()][700],r[s()][300])};
      border-color: ${i(r[s()][400],r[s()][600])};
    `;return N(F,{get when(){return c()},get children(){var e=au(),t=e.firstChild,r=t.nextSibling,i=r.firstChild,a=i.firstChild,d=a.firstChild,f=a.nextSibling,m=i.nextSibling.firstChild.nextSibling,h=r.nextSibling,g=h.nextSibling,_=g.nextSibling,v=_.nextSibling,y=v.nextSibling,b=y.nextSibling,x=b.nextSibling,S=x.nextSibling;return p(d,N(F,{get when(){return c().options.mutationKey},fallback:`No mutationKey found`,get children(){return T(c().options.mutationKey,!0)}})),p(f,N(F,{get when(){return s()===`purple`},children:`pending`}),null),p(f,N(F,{get when(){return s()!==`purple`},get children(){return o()}}),null),p(m,()=>new Date(c().state.submittedAt).toLocaleTimeString()),p(g,N(gl,{label:`Variables`,defaultExpanded:[`Variables`],get value(){return c().state.variables}})),p(v,N(gl,{label:`Context`,defaultExpanded:[`Context`],get value(){return c().state.context}})),p(b,N(gl,{label:`Data`,defaultExpanded:[`Data`],get value(){return c().state.data}})),p(S,N(gl,{label:`Mutation`,defaultExpanded:[`Mutation`],get value(){return c()}})),P(i=>{var a=G(n().detailsContainer,`tsqd-query-details-container`),o=G(n().detailsHeader,`tsqd-query-details-header`),s=G(n().detailsBody,`tsqd-query-details-summary-container`),c=G(n().queryDetailsStatus,l()),d=G(n().detailsHeader,`tsqd-query-details-header`),p=Q.size[2],m=G(n().detailsHeader,`tsqd-query-details-header`),C=Q.size[2],w=G(n().detailsHeader,`tsqd-query-details-header`),T=Q.size[2],E=G(n().detailsHeader,`tsqd-query-details-header`),D=Q.size[2];return a!==i.e&&I(e,i.e=a),o!==i.t&&I(t,i.t=o),s!==i.a&&I(r,i.a=s),c!==i.o&&I(f,i.o=c),d!==i.i&&I(h,i.i=d),p!==i.n&&u(g,`padding`,i.n=p),m!==i.s&&I(_,i.s=m),C!==i.h&&u(v,`padding`,i.h=C),w!==i.r&&I(y,i.r=w),T!==i.d&&u(b,`padding`,i.d=T),E!==i.l&&I(x,i.l=E),D!==i.u&&u(S,`padding`,i.u=D),i},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0}),e}})},Eu=new Map,Du=()=>{let e=L(()=>V().client.getQueryCache()),t=e().subscribe(t=>{w(()=>{for(let[n,r]of Eu.entries())r.shouldUpdate(t)&&r.setter(n(e))})});return f(()=>{Eu.clear(),t()}),t},$=(e,t=!0,n=()=>!0)=>{let r=L(()=>V().client.getQueryCache()),[i,a]=A(e(r),t?void 0:{equals:!1});return k(()=>{a(e(r))}),Eu.set(e,{setter:a,shouldUpdate:n}),f(()=>{Eu.delete(e)}),i},Ou=new Map,ku=()=>{let e=L(()=>V().client.getMutationCache()),t=e().subscribe(()=>{for(let[t,n]of Ou.entries())queueMicrotask(()=>{n(t(e))})});return f(()=>{Ou.clear(),t()}),t},Au=(e,t=!0)=>{let n=L(()=>V().client.getMutationCache()),[r,i]=A(e(n),t?void 0:{equals:!1});return k(()=>{i(e(n))}),Ou.set(e,i),f(()=>{Ou.delete(e)}),r},ju=`@tanstack/query-devtools-event`,Mu=({type:e,queryHash:t,metadata:n})=>{let r=new CustomEvent(ju,{detail:{type:e,queryHash:t,metadata:n},bubbles:!0,cancelable:!0});window.dispatchEvent(r)},Nu=(e,t)=>{let{colors:n,font:r,size:i,alpha:a,shadow:o,border:s}=Q,c=(t,n)=>e===`light`?t:n;return{devtoolsBtn:t`
      z-index: 100000;
      position: fixed;
      padding: 4px;
      text-align: left;

      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      box-shadow: ${o.md()};
      overflow: hidden;

      & div {
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        border-radius: 9999px;

        & svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        filter: blur(6px) saturate(1.2) contrast(1.1);
      }

      &:focus-within {
        outline-offset: 2px;
        outline: 3px solid ${n.green[600]};
      }

      & button {
        position: relative;
        z-index: 1;
        padding: 0;
        border-radius: 9999px;
        background-color: transparent;
        border: none;
        height: 40px;
        display: flex;
        width: 40px;
        overflow: hidden;
        cursor: pointer;
        outline: none;
        & svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }
    `,panel:t`
      position: fixed;
      z-index: 9999;
      display: flex;
      gap: ${Q.size[.5]};
      & * {
        box-sizing: border-box;
        text-transform: none;
      }

      & *::-webkit-scrollbar {
        width: 7px;
      }

      & *::-webkit-scrollbar-track {
        background: transparent;
      }

      & *::-webkit-scrollbar-thumb {
        background: ${c(n.gray[300],n.darkGray[200])};
      }

      & *::-webkit-scrollbar-thumb:hover {
        background: ${c(n.gray[400],n.darkGray[300])};
      }
    `,parentPanel:t`
      z-index: 9999;
      display: flex;
      height: 100%;
      gap: ${Q.size[.5]};
      & * {
        box-sizing: border-box;
        text-transform: none;
      }

      & *::-webkit-scrollbar {
        width: 7px;
      }

      & *::-webkit-scrollbar-track {
        background: transparent;
      }

      & *::-webkit-scrollbar-thumb {
        background: ${c(n.gray[300],n.darkGray[200])};
      }

      & *::-webkit-scrollbar-thumb:hover {
        background: ${c(n.gray[400],n.darkGray[300])};
      }
    `,"devtoolsBtn-position-bottom-right":t`
      bottom: 12px;
      right: 12px;
    `,"devtoolsBtn-position-bottom-left":t`
      bottom: 12px;
      left: 12px;
    `,"devtoolsBtn-position-top-left":t`
      top: 12px;
      left: 12px;
    `,"devtoolsBtn-position-top-right":t`
      top: 12px;
      right: 12px;
    `,"devtoolsBtn-position-relative":t`
      position: relative;
    `,"panel-position-top":t`
      top: 0;
      right: 0;
      left: 0;
      max-height: 90%;
      min-height: ${i[14]};
      border-bottom: ${c(n.gray[400],n.darkGray[300])} 1px solid;
    `,"panel-position-bottom":t`
      bottom: 0;
      right: 0;
      left: 0;
      max-height: 90%;
      min-height: ${i[14]};
      border-top: ${c(n.gray[400],n.darkGray[300])} 1px solid;
    `,"panel-position-right":t`
      bottom: 0;
      right: 0;
      top: 0;
      border-left: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      max-width: 90%;
    `,"panel-position-left":t`
      bottom: 0;
      left: 0;
      top: 0;
      border-right: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      max-width: 90%;
    `,closeBtn:t`
      position: absolute;
      cursor: pointer;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      background-color: ${c(n.gray[50],n.darkGray[700])};
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }
      &:focus-visible {
        outline: 2px solid ${n.blue[600]};
      }
      & svg {
        color: ${c(n.gray[600],n.gray[400])};
        width: ${i[2]};
        height: ${i[2]};
      }
    `,"closeBtn-position-top":t`
      bottom: 0;
      right: ${i[2]};
      transform: translate(0, 100%);
      border-right: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-left: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: none;
      border-bottom: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-radius: 0px 0px ${s.radius.sm} ${s.radius.sm};
      padding: ${i[.5]} ${i[1.5]} ${i[1]} ${i[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        bottom: 100%;
        left: -${i[2.5]};
        height: ${i[1.5]};
        width: calc(100% + ${i[5]});
      }

      & svg {
        transform: rotate(180deg);
      }
    `,"closeBtn-position-bottom":t`
      top: 0;
      right: ${i[2]};
      transform: translate(0, -100%);
      border-right: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-left: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-bottom: none;
      border-radius: ${s.radius.sm} ${s.radius.sm} 0px 0px;
      padding: ${i[1]} ${i[1.5]} ${i[.5]} ${i[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        top: 100%;
        left: -${i[2.5]};
        height: ${i[1.5]};
        width: calc(100% + ${i[5]});
      }
    `,"closeBtn-position-right":t`
      bottom: ${i[2]};
      left: 0;
      transform: translate(-100%, 0);
      border-right: none;
      border-left: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-bottom: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-radius: ${s.radius.sm} 0px 0px ${s.radius.sm};
      padding: ${i[1.5]} ${i[.5]} ${i[1.5]} ${i[1]};

      &::after {
        content: ' ';
        position: absolute;
        left: 100%;
        height: calc(100% + ${i[5]});
        width: ${i[1.5]};
      }

      & svg {
        transform: rotate(-90deg);
      }
    `,"closeBtn-position-left":t`
      bottom: ${i[2]};
      right: 0;
      transform: translate(100%, 0);
      border-left: none;
      border-right: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-bottom: ${c(n.gray[400],n.darkGray[300])} 1px solid;
      border-radius: 0px ${s.radius.sm} ${s.radius.sm} 0px;
      padding: ${i[1.5]} ${i[1]} ${i[1.5]} ${i[.5]};

      &::after {
        content: ' ';
        position: absolute;
        right: 100%;
        height: calc(100% + ${i[5]});
        width: ${i[1.5]};
      }

      & svg {
        transform: rotate(90deg);
      }
    `,queriesContainer:t`
      flex: 1 1 700px;
      background-color: ${c(n.gray[50],n.darkGray[700])};
      display: flex;
      flex-direction: column;
      & * {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      }
    `,dragHandle:t`
      position: absolute;
      transition: background-color 0.125s ease;
      &:hover {
        background-color: ${n.purple[400]}${c(``,a[90])};
      }
      &:focus {
        outline: none;
        background-color: ${n.purple[400]}${c(``,a[90])};
      }
      &:focus-visible {
        outline: 2px solid ${n.blue[800]};
        outline-offset: -2px;
        background-color: ${n.purple[400]}${c(``,a[90])};
      }
      z-index: 4;
    `,"dragHandle-position-top":t`
      bottom: 0;
      width: 100%;
      height: 3px;
      cursor: ns-resize;
    `,"dragHandle-position-bottom":t`
      top: 0;
      width: 100%;
      height: 3px;
      cursor: ns-resize;
    `,"dragHandle-position-right":t`
      left: 0;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
    `,"dragHandle-position-left":t`
      right: 0;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
    `,row:t`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${Q.size[2]} ${Q.size[2.5]};
      gap: ${Q.size[2.5]};
      border-bottom: ${c(n.gray[300],n.darkGray[500])} 1px solid;
      align-items: center;
      & > button {
        padding: 0;
        background: transparent;
        border: none;
        display: flex;
        gap: ${i[.5]};
        flex-direction: column;
      }
    `,logoAndToggleContainer:t`
      display: flex;
      gap: ${Q.size[3]};
      align-items: center;
    `,logo:t`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      gap: ${Q.size[.5]};
      padding: 0px;
      &:hover {
        opacity: 0.7;
      }
      &:focus-visible {
        outline-offset: 4px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,tanstackLogo:t`
      font-size: ${r.size.md};
      font-weight: ${r.weight.bold};
      line-height: ${r.lineHeight.xs};
      white-space: nowrap;
      color: ${c(n.gray[600],n.gray[300])};
    `,queryFlavorLogo:t`
      font-weight: ${r.weight.semibold};
      font-size: ${r.size.xs};
      background: linear-gradient(
        to right,
        ${c(`#ea4037, #ff9b11`,`#dd524b, #e9a03b`)}
      );
      background-clip: text;
      -webkit-background-clip: text;
      line-height: 1;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    `,queryStatusContainer:t`
      display: flex;
      gap: ${Q.size[2]};
      height: min-content;
    `,queryStatusTag:t`
      display: flex;
      gap: ${Q.size[1.5]};
      box-sizing: border-box;
      height: ${Q.size[6.5]};
      background: ${c(n.gray[50],n.darkGray[500])};
      color: ${c(n.gray[700],n.gray[300])};
      border-radius: ${Q.border.radius.sm};
      font-size: ${r.size.sm};
      padding: ${Q.size[1]};
      padding-left: ${Q.size[1.5]};
      align-items: center;
      font-weight: ${r.weight.medium};
      border: ${c(`1px solid `+n.gray[300],`1px solid transparent`)};
      user-select: none;
      position: relative;
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${n.blue[800]};
      }
    `,queryStatusTagLabel:t`
      font-size: ${r.size.xs};
    `,queryStatusCount:t`
      font-size: ${r.size.xs};
      padding: 0 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${c(n.gray[500],n.gray[400])};
      background-color: ${c(n.gray[200],n.darkGray[300])};
      border-radius: 2px;
      font-variant-numeric: tabular-nums;
      height: ${Q.size[4.5]};
    `,statusTooltip:t`
      position: absolute;
      z-index: 1;
      background-color: ${c(n.gray[50],n.darkGray[500])};
      top: 100%;
      left: 50%;
      transform: translate(-50%, calc(${Q.size[2]}));
      padding: ${Q.size[.5]} ${Q.size[2]};
      border-radius: ${Q.border.radius.sm};
      font-size: ${r.size.xs};
      border: 1px solid ${c(n.gray[400],n.gray[600])};
      color: ${c(n.gray[600],n.gray[300])};

      &::before {
        top: 0px;
        content: ' ';
        display: block;
        left: 50%;
        transform: translate(-50%, -100%);
        position: absolute;
        border-color: transparent transparent
          ${c(n.gray[400],n.gray[600])} transparent;
        border-style: solid;
        border-width: 7px;
        /* transform: rotate(180deg); */
      }

      &::after {
        top: 0px;
        content: ' ';
        display: block;
        left: 50%;
        transform: translate(-50%, calc(-100% + 2px));
        position: absolute;
        border-color: transparent transparent
          ${c(n.gray[100],n.darkGray[500])} transparent;
        border-style: solid;
        border-width: 7px;
      }
    `,filtersContainer:t`
      display: flex;
      gap: ${Q.size[2]};
      & > button {
        cursor: pointer;
        padding: ${Q.size[.5]} ${Q.size[1.5]} ${Q.size[.5]}
          ${Q.size[2]};
        border-radius: ${Q.border.radius.sm};
        background-color: ${c(n.gray[100],n.darkGray[400])};
        border: 1px solid ${c(n.gray[300],n.darkGray[200])};
        color: ${c(n.gray[700],n.gray[300])};
        font-size: ${r.size.xs};
        display: flex;
        align-items: center;
        line-height: ${r.lineHeight.sm};
        gap: ${Q.size[1.5]};
        max-width: 160px;
        &:focus-visible {
          outline-offset: 2px;
          border-radius: ${s.radius.xs};
          outline: 2px solid ${n.blue[800]};
        }
        & svg {
          width: ${Q.size[3]};
          height: ${Q.size[3]};
          color: ${c(n.gray[500],n.gray[400])};
        }
      }
    `,filterInput:t`
      padding: ${i[.5]} ${i[2]};
      border-radius: ${Q.border.radius.sm};
      background-color: ${c(n.gray[100],n.darkGray[400])};
      display: flex;
      box-sizing: content-box;
      align-items: center;
      gap: ${Q.size[1.5]};
      max-width: 160px;
      min-width: 100px;
      border: 1px solid ${c(n.gray[300],n.darkGray[200])};
      height: min-content;
      color: ${c(n.gray[600],n.gray[400])};
      & > svg {
        width: ${i[3]};
        height: ${i[3]};
      }
      & input {
        font-size: ${r.size.xs};
        width: 100%;
        background-color: ${c(n.gray[100],n.darkGray[400])};
        border: none;
        padding: 0;
        line-height: ${r.lineHeight.sm};
        color: ${c(n.gray[700],n.gray[300])};
        &::placeholder {
          color: ${c(n.gray[700],n.gray[300])};
        }
        &:focus {
          outline: none;
        }
      }

      &:focus-within {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,filterSelect:t`
      padding: ${Q.size[.5]} ${Q.size[2]};
      border-radius: ${Q.border.radius.sm};
      background-color: ${c(n.gray[100],n.darkGray[400])};
      display: flex;
      align-items: center;
      gap: ${Q.size[1.5]};
      box-sizing: content-box;
      max-width: 160px;
      border: 1px solid ${c(n.gray[300],n.darkGray[200])};
      height: min-content;
      & > svg {
        color: ${c(n.gray[600],n.gray[400])};
        width: ${Q.size[2]};
        height: ${Q.size[2]};
      }
      & > select {
        appearance: none;
        color: ${c(n.gray[700],n.gray[300])};
        min-width: 100px;
        line-height: ${r.lineHeight.sm};
        font-size: ${r.size.xs};
        background-color: ${c(n.gray[100],n.darkGray[400])};
        border: none;
        &:focus {
          outline: none;
        }
      }
      &:focus-within {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,actionsContainer:t`
      display: flex;
      gap: ${Q.size[2]};
    `,actionsBtn:t`
      border-radius: ${Q.border.radius.sm};
      background-color: ${c(n.gray[100],n.darkGray[400])};
      border: 1px solid ${c(n.gray[300],n.darkGray[200])};
      width: ${Q.size[6.5]};
      height: ${Q.size[6.5]};
      justify-content: center;
      display: flex;
      align-items: center;
      gap: ${Q.size[1.5]};
      max-width: 160px;
      cursor: pointer;
      padding: 0;
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }
      & svg {
        color: ${c(n.gray[700],n.gray[300])};
        width: ${Q.size[3]};
        height: ${Q.size[3]};
      }
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,actionsBtnOffline:t`
      & svg {
        stroke: ${c(n.yellow[700],n.yellow[500])};
        fill: ${c(n.yellow[700],n.yellow[500])};
      }
    `,overflowQueryContainer:t`
      flex: 1;
      overflow-y: auto;
      & > div {
        display: flex;
        flex-direction: column;
      }
    `,queryRow:t`
      display: flex;
      align-items: center;
      padding: 0;
      border: none;
      cursor: pointer;
      color: ${c(n.gray[700],n.gray[300])};
      background-color: ${c(n.gray[50],n.darkGray[700])};
      line-height: 1;
      &:focus {
        outline: none;
      }
      &:focus-visible {
        outline-offset: -2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
      &:hover .tsqd-query-hash {
        background-color: ${c(n.gray[200],n.darkGray[600])};
      }

      & .tsqd-query-observer-count {
        padding: 0 ${Q.size[1]};
        user-select: none;
        min-width: ${Q.size[6.5]};
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${r.size.xs};
        font-weight: ${r.weight.medium};
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom: 1px solid ${c(n.gray[300],n.darkGray[700])};
      }
      & .tsqd-query-hash {
        user-select: text;
        font-size: ${r.size.xs};
        display: flex;
        align-items: center;
        min-height: ${Q.size[6]};
        flex: 1;
        padding: ${Q.size[1]} ${Q.size[2]};
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        border-bottom: 1px solid ${c(n.gray[300],n.darkGray[400])};
        text-align: left;
        text-overflow: clip;
        word-break: break-word;
      }

      & .tsqd-query-disabled-indicator {
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0 ${Q.size[2]};
        color: ${c(n.gray[800],n.gray[300])};
        background-color: ${c(n.gray[300],n.darkGray[600])};
        border-bottom: 1px solid ${c(n.gray[300],n.darkGray[400])};
        font-size: ${r.size.xs};
      }

      & .tsqd-query-static-indicator {
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0 ${Q.size[2]};
        color: ${c(n.teal[800],n.teal[300])};
        background-color: ${c(n.teal[100],n.teal[900])};
        border-bottom: 1px solid ${c(n.teal[300],n.teal[700])};
        font-size: ${r.size.xs};
      }
    `,selectedQueryRow:t`
      background-color: ${c(n.gray[200],n.darkGray[500])};
    `,detailsContainer:t`
      flex: 1 1 700px;
      background-color: ${c(n.gray[50],n.darkGray[700])};
      color: ${c(n.gray[700],n.gray[300])};
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      display: flex;
      text-align: left;
    `,detailsHeader:t`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: ${c(n.gray[200],n.darkGray[600])};
      padding: ${Q.size[1.5]} ${Q.size[2]};
      font-weight: ${r.weight.medium};
      font-size: ${r.size.xs};
      line-height: ${r.lineHeight.xs};
      text-align: left;
    `,detailsBody:t`
      margin: ${Q.size[1.5]} 0px ${Q.size[2]} 0px;
      & > div {
        display: flex;
        align-items: stretch;
        padding: 0 ${Q.size[2]};
        line-height: ${r.lineHeight.sm};
        justify-content: space-between;
        & > span {
          font-size: ${r.size.xs};
        }
        & > span:nth-child(2) {
          font-variant-numeric: tabular-nums;
        }
      }

      & > div:first-child {
        margin-bottom: ${Q.size[1.5]};
      }

      & code {
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        margin: 0;
        font-size: ${r.size.xs};
        line-height: ${r.lineHeight.xs};
        max-width: 100%;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      & pre {
        margin: 0;
        display: flex;
        align-items: center;
      }
    `,queryDetailsStatus:t`
      border: 1px solid ${n.darkGray[200]};
      border-radius: ${Q.border.radius.sm};
      font-weight: ${r.weight.medium};
      padding: ${Q.size[1]} ${Q.size[2.5]};
    `,actionsBody:t`
      flex-wrap: wrap;
      margin: ${Q.size[2]} 0px ${Q.size[2]} 0px;
      display: flex;
      gap: ${Q.size[2]};
      padding: 0px ${Q.size[2]};
      & > button {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
        font-size: ${r.size.xs};
        padding: ${Q.size[1]} ${Q.size[2]};
        display: flex;
        border-radius: ${Q.border.radius.sm};
        background-color: ${c(n.gray[100],n.darkGray[600])};
        border: 1px solid ${c(n.gray[300],n.darkGray[400])};
        align-items: center;
        gap: ${Q.size[2]};
        font-weight: ${r.weight.medium};
        line-height: ${r.lineHeight.xs};
        cursor: pointer;
        &:focus-visible {
          outline-offset: 2px;
          border-radius: ${s.radius.xs};
          outline: 2px solid ${n.blue[800]};
        }
        &:hover {
          background-color: ${c(n.gray[200],n.darkGray[500])};
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        & > span {
          width: ${i[1.5]};
          height: ${i[1.5]};
          border-radius: ${Q.border.radius.full};
        }
      }
    `,actionsSelect:t`
      font-size: ${r.size.xs};
      padding: ${Q.size[.5]} ${Q.size[2]};
      display: flex;
      border-radius: ${Q.border.radius.sm};
      overflow: hidden;
      background-color: ${c(n.gray[100],n.darkGray[600])};
      border: 1px solid ${c(n.gray[300],n.darkGray[400])};
      align-items: center;
      gap: ${Q.size[2]};
      font-weight: ${r.weight.medium};
      line-height: ${r.lineHeight.sm};
      color: ${c(n.red[500],n.red[400])};
      cursor: pointer;
      position: relative;
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }
      & > span {
        width: ${i[1.5]};
        height: ${i[1.5]};
        border-radius: ${Q.border.radius.full};
      }
      &:focus-within {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
      & select {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        appearance: none;
        background-color: transparent;
        border: none;
        color: transparent;
        outline: none;
      }

      & svg path {
        stroke: ${Q.colors.red[400]};
      }
      & svg {
        width: ${Q.size[2]};
        height: ${Q.size[2]};
      }
    `,settingsMenu:t`
      display: flex;
      & * {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      }
      flex-direction: column;
      gap: ${i[.5]};
      border-radius: ${Q.border.radius.sm};
      border: 1px solid ${c(n.gray[300],n.gray[700])};
      background-color: ${c(n.gray[50],n.darkGray[600])};
      font-size: ${r.size.xs};
      color: ${c(n.gray[700],n.gray[300])};
      z-index: 99999;
      min-width: 120px;
      padding: ${i[.5]};
    `,settingsSubTrigger:t`
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: ${Q.border.radius.xs};
      padding: ${Q.size[1]} ${Q.size[1]};
      cursor: pointer;
      background-color: transparent;
      border: none;
      color: ${c(n.gray[700],n.gray[300])};
      & svg {
        color: ${c(n.gray[600],n.gray[400])};
        transform: rotate(-90deg);
        width: ${Q.size[2]};
        height: ${Q.size[2]};
      }
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${n.blue[800]};
      }
      &.data-disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,settingsMenuHeader:t`
      padding: ${Q.size[1]} ${Q.size[1]};
      font-weight: ${r.weight.medium};
      border-bottom: 1px solid ${c(n.gray[300],n.darkGray[400])};
      color: ${c(n.gray[500],n.gray[400])};
      font-size: ${r.size.xs};
    `,settingsSubButton:t`
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: ${c(n.gray[700],n.gray[300])};
      font-size: ${r.size.xs};
      border-radius: ${Q.border.radius.xs};
      padding: ${Q.size[1]} ${Q.size[1]};
      cursor: pointer;
      background-color: transparent;
      border: none;
      & svg {
        color: ${c(n.gray[600],n.gray[400])};
      }
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${n.blue[800]};
      }
      &[data-checked] {
        background-color: ${c(n.purple[100],n.purple[900])};
        color: ${c(n.purple[700],n.purple[300])};
        & svg {
          color: ${c(n.purple[700],n.purple[300])};
        }
        &:hover {
          background-color: ${c(n.purple[100],n.purple[900])};
        }
      }
    `,viewToggle:t`
      border-radius: ${Q.border.radius.sm};
      background-color: ${c(n.gray[200],n.darkGray[600])};
      border: 1px solid ${c(n.gray[300],n.darkGray[200])};
      display: flex;
      padding: 0;
      font-size: ${r.size.xs};
      color: ${c(n.gray[700],n.gray[300])};
      overflow: hidden;

      &:has(:focus-visible) {
        outline: 2px solid ${n.blue[800]};
      }

      & .tsqd-radio-toggle {
        opacity: 0.5;
        display: flex;
        & label {
          display: flex;
          align-items: center;
          cursor: pointer;
          line-height: ${r.lineHeight.md};
        }

        & label:hover {
          background-color: ${c(n.gray[100],n.darkGray[500])};
        }
      }

      & > [data-checked] {
        opacity: 1;
        background-color: ${c(n.gray[100],n.darkGray[400])};
        & label:hover {
          background-color: ${c(n.gray[100],n.darkGray[400])};
        }
      }

      & .tsqd-radio-toggle:first-child {
        & label {
          padding: 0 ${Q.size[1.5]} 0 ${Q.size[2]};
        }
        border-right: 1px solid ${c(n.gray[300],n.darkGray[200])};
      }

      & .tsqd-radio-toggle:nth-child(2) {
        & label {
          padding: 0 ${Q.size[2]} 0 ${Q.size[1.5]};
        }
      }
    `,devtoolsEditForm:t`
      padding: ${i[2]};
      & > [data-error='true'] {
        outline: 2px solid ${c(n.red[200],n.red[800])};
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
      }
    `,devtoolsEditTextarea:t`
      width: 100%;
      max-height: 500px;
      font-family: 'Fira Code', monospace;
      font-size: ${r.size.xs};
      border-radius: ${s.radius.sm};
      field-sizing: content;
      padding: ${i[2]};
      background-color: ${c(n.gray[100],n.darkGray[800])};
      color: ${c(n.gray[900],n.gray[100])};
      border: 1px solid ${c(n.gray[200],n.gray[700])};
      resize: none;
      &:focus {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${c(n.blue[200],n.blue[800])};
      }
    `,devtoolsEditFormActions:t`
      display: flex;
      justify-content: space-between;
      gap: ${i[2]};
      align-items: center;
      padding-top: ${i[1]};
      font-size: ${r.size.xs};
    `,devtoolsEditFormError:t`
      color: ${c(n.red[700],n.red[500])};
    `,devtoolsEditFormActionContainer:t`
      display: flex;
      gap: ${i[2]};
    `,devtoolsEditFormAction:t`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      font-size: ${r.size.xs};
      padding: ${i[1]} ${Q.size[2]};
      display: flex;
      border-radius: ${s.radius.sm};
      background-color: ${c(n.gray[100],n.darkGray[600])};
      border: 1px solid ${c(n.gray[300],n.darkGray[400])};
      align-items: center;
      gap: ${i[2]};
      font-weight: ${r.weight.medium};
      line-height: ${r.lineHeight.xs};
      cursor: pointer;
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${s.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
      &:hover {
        background-color: ${c(n.gray[200],n.darkGray[500])};
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `}},Pu=e=>Nu(`light`,e),Fu=e=>Nu(`dark`,e);oe([`click`,`mousedown`,`keydown`,`input`]);export{Fe as a,ve as c,Re as i,mu as n,De as o,gu as r,Be as s,vu as t};