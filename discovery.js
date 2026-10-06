const assets={foot:'foot',leaf:'leaf',shell:'shell',glyph1:'glyph1',glyph2:'glyph2',glyph3:'glyph3',egg:'egg',nest:'egg',lookout:'Diplodocus',fossil:'fossil',diplodocus:'Diplodocus',longneck:'Diplodocus',horns:'Triceratops',plates:'Stegosaurus',club:'Ankylosaurus',iguanodon:'Iguanodon'};
const pictures=new Map();
export function setDiscoveryPicture(id,url){if(url)pictures.set(assets[id],url);}
export function discoveryArt(id){return assets[id]||null;}
export function discoveryPicture(id){return pictures.get(assets[id])||null;}
export function discoveryMarkup(id,text){const src=discoveryPicture(id);if(!src)return text;return `<figure class="discoveryHero"><img src="${src}" alt="Hình cận cảnh khám phá của Chu" width="640" height="480"><figcaption>✦ Một dấu ấn trong hành trình của Chu</figcaption></figure><div class="discoveryDescription">${text}</div><p class="discoveryNote">Quan sát và ghi lại trong nhật ký. Giữ nguyên dấu vết tại nơi khám phá.</p>`;}
