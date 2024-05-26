import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS3DRenderer } from 'three/examples/jsm/Addons.js'
import Model from './model'

export default function Scene(element) {
  const scene = new THREE.Scene()
  scene.background = null

  const camera = new THREE.PerspectiveCamera(75, app.clientWidth / app.clientHeight, 0.1, 1000)
  camera.position.set(0,2,6)

  const renderer = new THREE.WebGLRenderer({ alpha: true })
  //renderer.setSize(element.clientWidth, element.clientHeight)
  renderer.setSize(element.clientWidth, element.clientHeight)
  renderer.shadowMap.enabled = true

  function resizeRenderer() {
    const width = element.clientWidth
    const height = element.clientHeight
    renderer.setSize(width, height)
  }
  resizeRenderer()
  window.addEventListener("resize", resizeRenderer)

  if (element) element.appendChild(renderer.domElement)
  else document.body.appendChild(renderer.domElement)

  // For rendering HTML
  const css3DRenderer = new CSS3DRenderer();
  css3DRenderer.setSize(window.innerWidth, window.innerHeight);
  css3DRenderer.domElement.style.position = 'absolute';
  css3DRenderer.domElement.style.top = 0;
  css3DRenderer.domElement.style.left = 0;
  css3DRenderer.domElement.style.pointerEvents = 'none';
  css3DRenderer.domElement.style.userSelect = 'none';

  if (element) element.appendChild(css3DRenderer.domElement)
  else document.body.appendChild(css3DRenderer.domElement)

  // View Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 2, 5.9)
  controls.update()
  controls.minPolarAngle = Math.PI / 2
  controls.maxPolarAngle = Math.PI / 2

  const clock = new THREE.Clock(true)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.2)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.99)
  directionalLight.position.set(2, 3, 4)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // Click raycasters
  renderer.domElement.addEventListener('click', (event) => {
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const canvasBounds = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1
    mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object    
      console.log(intersectedObject.name)

      if (intersectedObject.name == "doorway") {
        if (!moving) setNewArea()
      }
      else if (intersectedObject.name == "cube0") intersectedObject.spinning = !intersectedObject.spinning
      else if (intersectedObject.name == "cube1") intersectedObject.spinning = !intersectedObject.spinning
    }
  })

  const cubes = [
    Cube(THREE, scene, 0, 0x339933, [-2,1,-2]),
    Cube(THREE, scene, 1, 0xFF1133, [-2,1.5,-2]),
  ]

  function spinCubes() {
    if (!cubes) return
    
    cubes.forEach(cube => {
      cube.spin(0.01,0,0)
    })
  }

  function setNewArea() {
    if (area == 0) {
      targetPosition.set(0,2,1)
      controls.target.set(0, 2, 0.9)
      area = 1
      moving = true

      if (gallery) {
        setTimeout(()=>{
          gallery.picturesVisibility(true)
          gallery.seanBodyVisible()
          gallery.playAnimationByName("Angry", "sean")
        }, 1000)
      }
      
    } else if (area == 1) {
      //targetPosition.set(0,2,6)
      //controls.target.set(0, 2, 5.9)
      area = 2

      const bgm = document.querySelector('#bgm')
      console.log(bgm)
      bgm.play()
      dancing = true

      if (gallery) {
        setTimeout(()=>{
          gallery.seanVisibility(true)
          //gallery.picturesVisibility(false)
          gallery.playAnimationByName("mumStare", "mum")
          gallery.playAnimationByName("ravenDance", "raven")
        }, 1000)
      }
    }
  }

  function moveCamera() {
    camera.position.lerp(targetPosition, 0.05)

    if (camera.position.distanceTo(targetPosition) < 0.05) moving = false
  }

  const gallery = Model(scene)

  let area = 0
  let moving = false
  let targetPosition = new THREE.Vector3(0,2,2)

  let dancing = false

  // Render loop
  function animate() {
    requestAnimationFrame(animate)

    var delta = clock.getDelta()

    controls.update()

    if (gallery) {
      gallery.updateMixer(delta)
      if (dancing) gallery.dancingPictures(delta)
    }

    spinCubes()

    if (moving) moveCamera()

    renderer.render(scene, camera)
    css3DRenderer.render(scene, camera);
  }

  animate()
}

const Cube = (THREE, scene, index, color = 0x999999, position) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(...position)
  cube.scale.setScalar(0.25)
  cube.name = "cube" + index
  cube.spinning = true

  scene.add(cube)

  const spin = (x,y,z) => {
    if (!cube.spinning) return

    cube.rotation.x += x;
    cube.rotation.y += y;
    cube.rotation.z += z;
  }

  return { cube, spin }
}