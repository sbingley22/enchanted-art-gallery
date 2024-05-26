import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { AnimationMixer, AnimationClip } from 'three'
import glb from '../assets/gallery.glb?url'
import { HtmlPicture, TexturePicture } from './picture'

const getNodebyName = (node, name) => {
  if (node.name == name) return node

  for (const child of node.children) {
    const foundNode = getNodebyName(child, name)
    if (foundNode) return foundNode
  }

  return null
}

export default function Model(scene) {
  let mixer
  let model
  let animations
  let lastAnimMum
  let lastAnimRaven
  let lastAnimSean
  let forwards = true

  const sean = []

  const pictures = []

  //Load GLB
  const loader = new GLTFLoader()
  loader.load(glb, function (gltf) {
    //console.log(gltf)
    model = gltf.scene
    scene.add(model)

    animations = gltf.animations
    mixer = new AnimationMixer(model)
    playAnimationByName("mumIdle", "mum")
    playAnimationByName("ravenIdle", "raven")
    playAnimationByName("Idle", "sean")

    initializeAnimations()

    const seanHead = getNodebyName(scene, "Head")
    const seanArmL = getNodebyName(scene, "Arm_L")
    const seanArmR = getNodebyName(scene, "Arm_R")
    const seanTorso = getNodebyName(scene, "Torso")
    sean.push(seanHead)
    sean.push(seanArmL)
    sean.push(seanArmR)
    sean.push(seanTorso)
    seanHead.frustumCulled = false
    seanArmL.frustumCulled = false
    seanArmR.frustumCulled = false
    seanTorso.frustumCulled = false

    seanVisibility(false)

    
    const ravenHead = getNodebyName(scene, "ravenhead")
    const ravenSuit = getNodebyName(scene, "ravensuit")
    const ravenHands = getNodebyName(scene, "handsfeet")
    ravenHead.frustumCulled = false
    ravenSuit.frustumCulled = false
    ravenHands.frustumCulled = false

    //TexturePicture(scene)

    const sources = ["./leeseansumo.png", "./leeseansumo (3).png", "./apemen.png"]
    const pics = []
    pics.push(getNodebyName(scene, "picture"))
    pics.push(getNodebyName(scene, "picture001"))
    pics.push(getNodebyName(scene, "picture002"))

    pics.forEach( (pic, index) => {
      if (!pic) return
      pictures.push(HtmlPicture(pic, sources[index]))
      pic.visible = false
    })

    picturesVisibility(false)
  })

  const initializeAnimations = () => {
    //const action = mixer.clipAction(THREE.AnimationClip.findByName(animations, "mumWave"))
    //action.loop = THREE.LoopOnce
    //action.clampWhenFinished = true
    
    mixer.addEventListener('finished', () => {
      //console.log("Animation finished", lastAnim)
      if (lastAnim._clip.name == "mumWave") playAnimationByName("Idle");
  });
  }

  const playAnimationByName = (animationName, character) => {
    if (!mixer) return
    if (!animations) return
  
    const action = mixer.clipAction(AnimationClip.findByName(animations, animationName))
    if (action) {
      action.reset().fadeIn(0.2).play()
      if (character == "mum") {
        if (lastAnimMum) lastAnimMum.fadeOut(0.2)
        lastAnimMum = action
      } else if (character == "raven") {
        if (lastAnimRaven) lastAnimRaven.fadeOut(0.2)
        lastAnimRaven = action
      } else if (character == "sean") {
        if (lastAnimSean) lastAnimSean.fadeOut(0.2)
        lastAnimSean = action
      }
    }
    else {
      console.log("cannot find action")
      return
    }
  }

  const updateMixer = (delta) => {
    if (!mixer) return
    mixer.update(delta)
  }

  const getModel = () => {
    return model
  }

  const picturesVisibility = (visible) => {
    pictures.forEach( pic => {
      if (!pic) return
      pic.visible = visible
    })
  }

  const seanVisibility = (visible) => {
    sean.forEach( s => {
      if (!s) return
      s.visible = visible
    })
  }

  const seanBodyVisible = () => {
    sean[3].visible = true
  }

  const dancingPictures = (delta) => {
    if (pictures.length < 1) return
    
    if (forwards) {
      pictures[0].position.x -= delta
      pictures[0].rotation.x += delta
      if (pictures[0].position.x < -0.25) forwards = false

      pictures[1].position.z += delta * 3
      pictures[2].position.y -= delta * 3

    } else {
      pictures[0].position.x += delta
      pictures[0].rotation.x -= delta
      if (pictures[0].position.x > 0) forwards = true

      pictures[1].position.z -= delta * 3
      pictures[2].position.y += delta * 3
    }

  }

  return {getModel, updateMixer, playAnimationByName, picturesVisibility, seanVisibility, seanBodyVisible, dancingPictures}
}