let e=null;self.onmessage=t=>{if("start"===t.data.type){if(e)return;e=setInterval(()=>{self.postMessage({type:"gain"})},1e3)}else"stop"===t.data.type&&e&&(clearInterval(e),e=null)};
