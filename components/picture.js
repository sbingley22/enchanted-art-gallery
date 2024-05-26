import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/Addons.js";
import pic1 from '../assets/leeseansumo.png'

export function TexturePicture(scene) {
  const textureLoader = new THREE.TextureLoader()
  textureLoader.load(pic1, function(texture) {
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.MeshBasicMaterial({ map: texture })
    const plane = new THREE.Mesh(geometry, material)
    plane.position.y = 1.6
    plane.position.z = -2
    scene.add(plane)
  })
}

export function HtmlPicture(object, source) {
  // Create an HTML element
  const element = document.createElement('div');
  element.style.width = '200px';
  element.style.height = '100px';
  element.style.background = 'rgba(0,255,255,0.1)';
  element.style.pointerEvents = 'none';
  element.style.userSelect = 'none';
  
  // Text Element
  // const textElement = document.createElement('p')
  // textElement.textContent = "Hello WOrld!!"
  // textElement.style.pointerEvents = 'none';
  // textElement.style.userSelect = 'none';
  // element.appendChild(textElement)

  // Image Element
  const imageElement = document.createElement('img')
  imageElement.src = source
  imageElement.style.pointerEvents = 'none';
  imageElement.style.userSelect = 'none';
  imageElement.style.width = '200px';
  element.appendChild(imageElement)

  // Convert the HTML element into a CSS3DObject
  const cssObject = new CSS3DObject(element);
  cssObject.position.set(0, 0, 0);
  cssObject.rotation.x = -Math.PI/2
  cssObject.scale.set(0.01, 0.01, 0.01);

  // Add the CSS3DObject to the scene
  object.add(cssObject);

  return cssObject
}