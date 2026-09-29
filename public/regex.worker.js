function escapeText(text) { return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
self.onmessage = ({data:{pattern,flags,text}}) => {
  try {
    if(text.length>200000 || pattern.length>4000)throw new Error('Use up to 200,000 text characters and a 4,000 character pattern.');
    if(!pattern){self.postMessage({error:'',matches:[],html:escapeText(text)});return;}
    const re=new RegExp(pattern,flags.includes('g')?flags:flags+'g');const found=[];let html='';let last=0;let match;
    while((match=re.exec(text))!==null){
      if(found.length>=1000)break;
      found.push({match:match[0],groups:match.slice(1)});
      html+=escapeText(text.slice(last,match.index))+`<mark style="background:#FFE9A8;border-radius:3px">${escapeText(match[0])||'∅'}</mark>`;
      last=match.index+match[0].length;
      if(match[0]==='')re.lastIndex+=(re.unicode&&text.codePointAt(re.lastIndex)>0xffff)?2:1;
    }
    html+=escapeText(text.slice(last));self.postMessage({error:found.length===1000?'Showing the first 1,000 matches.':'',matches:found,html});
  }catch(error){self.postMessage({error:error.message||'Invalid regex',matches:[],html:escapeText(text)});}
};
