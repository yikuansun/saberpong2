import{j as _,k as y}from"./DQrLd-bU.js";function $(s){const t=s-1;return t*t*t+1}function h(s,{delay:t=0,duration:n=400,easing:a=_}={}){const e=+getComputedStyle(s).opacity;return{delay:t,duration:n,easing:a,css:r=>`opacity: ${r*e}`}}function E(s,{delay:t=0,duration:n=400,easing:a=$,x:e=0,y:r=0,opacity:c=0}={}){const o=getComputedStyle(s),i=+o.opacity,l=o.transform==="none"?"":o.transform,u=i*(1-c),[p,f]=y(e),[d,g]=y(r);return{delay:t,duration:n,easing:a,css:(m,x)=>`
			transform: ${l} translate(${(1-m)*p}${f}, ${(1-m)*d}${g});
			opacity: ${i-u*x}`}}function S(s,{delay:t=0,duration:n=400,easing:a=$,start:e=0,opacity:r=0}={}){const c=getComputedStyle(s),o=+c.opacity,i=c.transform==="none"?"":c.transform,l=1-e,u=o*(1-r);return{delay:t,duration:n,easing:a,css:(p,f)=>`
			transform: ${i} scale(${1-l*f});
			opacity: ${o-u*f}
		`}}const b=""+new URL("../assets/ExpletusSans-VariableFont_wght.Bg4kjLOB.ttf",import.meta.url).href,w=""+new URL("../assets/Exo2-VariableFont_wght.lLV6DVhW.ttf",import.meta.url).href;export{b as E,w as a,E as b,h as f,S as s};
