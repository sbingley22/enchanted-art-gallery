import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { AnimationMixer, AnimationClip } from 'three'
import glb from '../assets/gallery.glb?url'
import Picture from './picture'

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

  //Load GLB
  const loader = new GLTFLoader()
  loader.load(glb, function (gltf) {
    //console.log(gltf)
    model = gltf.scene
    scene.add(model)

    animations = gltf.animations
    mixer = new AnimationMixer(model)
    playAnimationByName("mumIdle")
    playAnimationByName("ravenIdle")

    initializeAnimations()

    Picture(scene)
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

  return {getModel, updateMixer, playAnimationByName}
}