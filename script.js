fetch('data/notes.json').then(r=>r.json()).then(data=>{
const tabs=document.getElementById('tabs');
const content=document.getElementById('content');
let current=null;
Object.keys(data).forEach(k=>{
 let t=document.createElement('div');
 t.textContent=k;
 t.onclick=()=>{current=k;render()};
 tabs.appendChild(t);
});
function render(){
 content.innerHTML='';
 Object.entries(data[current]).forEach(([sec,items])=>{
  let s=document.createElement('div');
  s.className='section';
  let h=document.createElement('h2');
  h.textContent=sec;
  let inner=document.createElement('div');
  inner.className='inner';
  h.onclick=()=>inner.style.display=inner.style.display==='block'?'none':'block';
  items.forEach(d=>{
    let div=document.createElement('div');
    div.className='drug';
    div.innerHTML=`<img src="images/${d.image}"><h3>${d.name}</h3><p>${d.desc}</p>`;
    inner.appendChild(div);
  });
  s.appendChild(h);s.appendChild(inner);
  content.appendChild(s);
 });
}
});