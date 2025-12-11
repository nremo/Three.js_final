import * as THREE from 'three'

export const addDefaultMeshes = ({xPos, yPos, zPos}) => {

    const geometry = new THREE.BoxGeometry(1,1,1)
    const material = new THREE.MeshBasicMaterial({color: 0xfff000})
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(xPos, yPos, zPos)
    return mesh
}

export const addStandardMeshes = ({xPos, yPos, zPos}) => {

    const geometry = new THREE.BoxGeometry(1,1,1)
    const material = new THREE.MeshStandardMaterial({color: 0xfff000})
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(xPos, yPos, zPos)
    return mesh
}

