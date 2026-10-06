// Shared desktop/mobile navigation. Guest exit always uses the save/exit chooser.
export function setupGameShell({stopMovement,goHome,giveHint,notify}){
 const button=document.getElementById('moreTools'),panel=document.getElementById('gameTools'),fullscreen=document.getElementById('fullscreen');let open=false;
 function setOpen(value,restoreFocus=false){open=value;panel.hidden=!open;button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Đóng menu chức năng':'Mở menu chức năng');document.body.classList.toggle('toolsOpen',open);stopMovement();if(restoreFocus)button.focus();}
 button.onclick=()=>setOpen(!open);
 document.getElementById('homeChapters').onclick=()=>{setOpen(false);goHome();};
 document.getElementById('menuHint').onclick=()=>{setOpen(false);giveHint();};
 panel.addEventListener('click',e=>{if(e.target.closest('button'))setOpen(false);});
 document.addEventListener('pointerdown',e=>{if(open&&!panel.contains(e.target)&&!button.contains(e.target))setOpen(false);});
 document.addEventListener('keydown',e=>{if(open&&e.key==='Escape'){e.preventDefault();e.stopPropagation();setOpen(false,true);}},true);
 const root=document.documentElement;
 fullscreen.hidden=!(document.fullscreenEnabled&&root.requestFullscreen);
 function syncFullscreen(){fullscreen.innerHTML=document.fullscreenElement?'⛶ <span>Thu màn hình</span>':'⛶ <span>Toàn màn hình</span>';fullscreen.setAttribute('aria-pressed',String(!!document.fullscreenElement));}
 fullscreen.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await root.requestFullscreen({navigationUI:'hide'});}catch{notify('Thiết bị chưa cho phép toàn màn hình. Bạn vẫn có thể tiếp tục chơi.',5);}syncFullscreen();};
 document.addEventListener('fullscreenchange',syncFullscreen);syncFullscreen();
 return {close:()=>setOpen(false),get isOpen(){return open;}};
}
