import * as THREE from "three";
import pic1 from '../assets/leeseansumo.png'

export default function Picture(scene) {
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