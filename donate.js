import qrcode from './vendor/qrcode.mjs';
export const recipient={bank:'Vietcombank',bin:'970436',account:'0111000182684',name:'NGUYEN HOANG VINH',message:'Ung ho game Chu'};
const field=(tag,value)=>tag+String(value.length).padStart(2,'0')+value;
export function crc16(text){let crc=0xffff;for(const ch of text){crc^=ch.charCodeAt(0)<<8;for(let i=0;i<8;i++)crc=crc&0x8000?(crc<<1)^0x1021:crc<<1;crc&=0xffff;}return crc.toString(16).toUpperCase().padStart(4,'0');}
export function payload(amount){if(!Number.isSafeInteger(amount)||amount<1000||amount>999999999)throw new Error('Nhập số tiền từ 1.000 đến 999.999.999 đồng.');const bank=field('00',recipient.bin)+field('01',recipient.account);const merchant=field('00','A000000727')+field('01',bank)+field('02','QRIBFTTA');const body=field('00','01')+field('01','12')+field('38',merchant)+field('53','704')+field('54',String(amount))+field('58','VN')+field('62',field('08',recipient.message))+'6304';return body+crc16(body);}
export function qrMatrix(amount){const qr=qrcode(0,'M');qr.addData(payload(amount),'Byte');qr.make();return qr;}
export function setupDonation({onOpen,onClose}){
 const $=id=>document.getElementById(id),dialog=$('donation'),canvas=$('donationQr'),input=$('donationAmount'),buttons=[...dialog.querySelectorAll('[data-amount]')];let previousFocus;
 const format=n=>new Intl.NumberFormat('vi-VN').format(n)+'đ';
 function update(){const raw=input.value.trim();const amount=/^\d+$/.test(raw)?Number(raw):NaN;buttons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.amount)===amount)));try{const qr=qrMatrix(amount),count=qr.getModuleCount(),scale=6;canvas.width=canvas.height=(count+8)*scale;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#000';for(let y=0;y<count;y++)for(let x=0;x<count;x++)if(qr.isDark(y,x))ctx.fillRect((x+4)*scale,(y+4)*scale,scale,scale);canvas.hidden=false;$('donationError').textContent='';$('donationTotal').textContent=format(amount);canvas.setAttribute('aria-label',`QR chuyển ${format(amount)} đến ${recipient.name}, nội dung ${recipient.message}`);}catch(error){canvas.hidden=true;canvas.width=canvas.height=0;$('donationTotal').textContent='Chưa có số tiền hợp lệ';$('donationError').textContent=error.message;}}
 buttons.forEach(b=>b.onclick=()=>{input.value=b.dataset.amount;update();});input.addEventListener('input',update);
 const trigger=$('donate');
 function position(){const r=trigger.getBoundingClientRect();dialog.style.top=Math.round(r.bottom+8)+'px';dialog.style.maxHeight=`${Math.max(120,innerHeight-r.bottom-20)}px`;}
 trigger.onclick=()=>{if(dialog.open){dialog.close();return;}previousFocus=document.activeElement;onOpen();update();position();dialog.show();trigger.setAttribute('aria-expanded','true');$('donationClose').focus();};
 $('donationClose').onclick=()=>dialog.close();
 document.addEventListener('keydown',e=>{if(dialog.open&&e.key==='Escape'){e.preventDefault();dialog.close();}});
 document.addEventListener('click',e=>{if(dialog.open&&!dialog.contains(e.target)&&!trigger.contains(e.target)){e.preventDefault();e.stopPropagation();dialog.close();}},true);
 window.addEventListener('resize',()=>{if(dialog.open)position();});
 dialog.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');onClose();previousFocus?.focus();});
}
