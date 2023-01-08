(function(){"use strict";function u(s,e,t,n,r){return{studentNumber:s,subjectName:e,times:t,headers:n,answers:r}}const i=/^(1|true)$/,l=s=>i.test(s.toLowerCase());function p(s){return new TextDecoder().decode(s).replace(/\r\n/g,`
`).split(`
`).map(e=>e.split(","))}self.onmessage=s=>{const{title:e,arrBuf:t}=s.data,[n,r]=e.split("_"),o=p(t),f=o[0],d=o.slice(1),a=[];d.forEach(c=>{if(c[0]!==""){const m=parseInt(c[0],10),g=c.slice(1).map(v=>l(v)),h=u(m,n,parseInt(r,10),f,g);a.push(h)}}),self.postMessage(a)}})();
