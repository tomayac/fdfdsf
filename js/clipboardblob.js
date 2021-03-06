
//var p;
var canvas = document.createElement("canvas");
//var img1=document.createElement("img"); 
/*
function getBase64Image(){     
    p=document.getElementById("fileUpload").value;
    img1.setAttribute('src', p); 
    canvas.width = img1.width; 
    canvas.height = img1.height; 
    var ctx = canvas.getContext("2d"); 
    ctx.drawImage(img1, 0, 0); 
    var dataURL = canvas.toDataURL("image/png");
    alert("from getbase64 function"+dataURL );    
    return dataURL;
} */

const
  activeClass = { copy: 'copyblobactive', paste: 'pasteblobactive' },
  doneMessage = { copyblob: 'copied', pasteblob: 'pasted', downloadblob: 'downloaded' },
  doneClass = 'done';

window && window.addEventListener('DOMContentLoaded', init);

export function init() {

  const body = document && document.body;

  if (!body || !navigator.clipboard) return;

  if (navigator.clipboard.write) body.classList.add(activeClass.copy);

  if (navigator.clipboard.read) body.classList.add(activeClass.paste);

  body.addEventListener('click', clipboardHandler);

}

async function clipboardHandler(e) {

  const target = e.target;
  let type;
  if(undefined !== target.dataset.pasteblob){
    type = 'pasteblob';
  } else  if(undefined !== target.dataset.copyblob){
    type = 'copyblob';
  } else  if(undefined !== target.dataset.downloadblob){
    type = 'downloadblob';
  } 
  
  const content = target.dataset[type];

  if (undefined === content) return;

  let select;
  try {
    select = content && document.querySelector(content);
  }
  catch (error) { }

  const handler = { copyblob, pasteblob, downloadblob };
  if (!await handler[type](select)) return;

  if (!target.dataset.done) target.dataset.done = doneMessage[type];

  target.addEventListener('animationend', () => target.classList.remove(doneClass), { once: true });
  target.classList.add(doneClass);

}

async function copyblob(select) {

  const url = select && (select.src || select.href);
  if (!url) return;

  try {

    const
      src = await fetch(url),
      blob = await src.blob();

    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);

    return true;

  }
  catch (error) {
    console.log('copy error', error);
  }

}

async function downloadblob() {
  let blob;
  const clipboardItems = await navigator.clipboard.read();

    for (const clipboardItem of clipboardItems) {

      for (const type of clipboardItem.types) {

        blob = await clipboardItem.getType(type);

        if (type.startsWith('image')) {
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          var fileName = "test.png";
          link.download = fileName;
          link.click();
        }

      }

    }
}

async function pasteblob(select) {

  let blob;

  try {

    const clipboardItems = await navigator.clipboard.read();

    for (const clipboardItem of clipboardItems) {

      for (const type of clipboardItem.types) {

        blob = await clipboardItem.getType(type);

        if (select && type.startsWith('image')) {

          const img = document.createElement('img');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          console.log("DataURL = ", dataURL);
          console.log("Width = " + canvas.width + " Height = " + canvas.height);
          img.onload = () => {
            URL.revokeObjectURL(this.src);
          }
          img.src = URL.createObjectURL(blob);
          select.appendChild(img);


          //var img1=document.createElement("img"); 
          /*
          function getBase64Image(){     
              p=document.getElementById("fileUpload").value;
              img1.setAttribute('src', p); 
              canvas.width = img1.width; 
              canvas.height = img1.height; 
              var ctx = canvas.getContext("2d"); 
              ctx.drawImage(img1, 0, 0); 
              var dataURL = canvas.toDataURL("image/png");
              alert("from getbase64 function"+dataURL );    
              return dataURL;
          } */

        }

      }

    }

    return dataURL;
  }
  catch (error) {
    console.log('paste error', error);
  }

}
