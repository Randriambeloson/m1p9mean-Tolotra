const imageUrl = 'http://localhost:8000/1.tif';

// handlers for before and after image elements
const before = document.querySelector('#before img');
const afterCrop = document.querySelector('#afterCrop img');

let selections = [];
let polygonselection = [];
let shapes = [];
// load image for original container element

let shiftkey = false;
let ctrlkey = false;
let altkey = false;
document.addEventListener('keydown', e => {
  shiftkey = e.shiftKey;
  ctrlkey = e.ctrlKey;
  altkey = e.altKey;
});
document.addEventListener('keyup', e => {
  shiftkey = e.shiftKey;
  ctrlkey = e.ctrlKey;
  altkey = e.altKey;
});

let canvas = new RaphaelCanvas(500, 800);
let outcanvas = new RaphaelCanvas(700, 500);
Jimp.read({
    url: imageUrl,
  })
    .then((image) => {
      let jimpImage = new Jimp(image.bitmap.width, image.bitmap.height, '#FFFFFF');
      canvas.initImage('canvas', image, image.bitmap.width, image.bitmap.height);
      outcanvas.initImage('outcanvas', jimpImage, image.bitmap.width, image.bitmap.height);
      
      let crop_btn = document.querySelector('#crop-link');
      let selection_btn = document.querySelector('#select-link');
      let unselection_btn = document.querySelector('#unselect-link');
      let buffer_btn = document.querySelector('#buffer-link');
      let copy_btn = document.querySelector('#copy-link');
      let rotate_btn = document.querySelector('#rotate-link');
      let detach_btn = document.querySelector('#detach-link');
      let delete_btn = document.querySelector('#delete-link');
      crop_btn.addEventListener('click', e => {
        e.preventDefault();
        let areas = canvas.getAreas();

        for(let area of areas) {
          canvas.crop(area).getBase64('image/png', (err, res) => {
            if(!err) {
                outcanvas.addBmp(res, area, canvas.scaleFactor);
            }
          });
        }
      });

      let divraph = Raphael('croparea');
      let clipImage = image => {
        image.getBase64('image/png', (err, src) => {
          if(!err) {
            let img = divraph.image(src, 100, 100, 800, 500);
            let rect = divraph.rect(100, 100, 800, 500);
            rect.attr({
              stroke: '#000',
              'stroke-dasharray': '--'
            });
            rect.hover(e => {
              console.log(e);
            }, e => {
              console.log(e);
            });
  
            rotate_btn.addEventListener('click', e => {
              e.preventDefault();
              img.rotate(5, 100, 100);
              rect.rotate(5, 100, 100);
            });
          }
        });
      }
      selection_btn.addEventListener('click', e => {
        e.preventDefault();
        outcanvas.setChildrenImageOutline();
      });
      unselection_btn.addEventListener('click', e => {
        e.preventDefault();
        outcanvas.unsetChildrenImageOutline();
      });
      buffer_btn.addEventListener('click', e => {
        e.preventDefault();
        outcanvas.bufferize();
      });
      copy_btn.addEventListener('click', e => {
        e.preventDefault();
        outcanvas.duplicate();
      });
      detach_btn.addEventListener('click', e => {
        e.preventDefault();
        outcanvas.detach();
      });
      delete_btn.addEventListener('click', e => {
        e.preventDefault();
        outcanvas.delete();
      });
      
    })
    .catch((error) => {
      console.log(`Error loading image -> ${error}`)
    });
