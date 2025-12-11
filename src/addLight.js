import * as THREE from 'three'

export const addLight = ({xPos, yPos, zPos}) => {
    const light = new THREE.DirectionalLight
    (0xffffff, 1)
    light.position.set(xPos, yPos, zPos)
    return light
}