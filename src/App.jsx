import './App.css'
import { Canvas, useFrame, useThree, } from '@react-three/fiber'
import * as THREE from 'three'
import { PointerLockControls, useKeyboardControls, KeyboardControls } from '@react-three/drei'
import React, { Suspense, useRef, useEffect } from 'react'
import { Physics, RigidBody, RapierRigidBody, CapsuleCollider, Debug } from '@react-three/rapier'
import { PerspectiveCamera } from 'three'


function Orb() {
    return (
        <RigidBody>
            <mesh position={[5, 3, 0]}>
                <sphereGeometry />
                <meshBasicMaterial color='turquoise' />
            </mesh >
        </RigidBody >
    )
}

function Floor() {
    return (
        <RigidBody>
            <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[300, 300]} />
            </mesh >
        </RigidBody >
    )
}

function Player() {
    const rigidBody = useRef()

    const SPEED = 5
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3()
    const sideVector = new THREE.Vector3()

    const [, get] = useKeyboardControls()

    useFrame((state) => {
        const { forward, backward, left, right } = get()
        const velocity = rigidBody.current.linvel()

        if (rigidBody.current) {
            let playerPosition = rigidBody.current.translation()
            state.camera.position.set(playerPosition.x, playerPosition.y, playerPosition.z)
            frontVector.set(0, 0, backward - forward)
            sideVector.set(left - right, 0, 0)
            direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
            rigidBody.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z })
        }
    })

    return (
        <RigidBody ref={rigidBody} >
            <CapsuleCollider args={[.75, .5]} />
        </RigidBody>
    )
}

function App() {
    return (
        <div id="canvas-container">
            <KeyboardControls map={[
                { name: "forward", keys: ["ArrowUp", "w", "W"] },
                { name: "backward", keys: ["ArrowDown", "s", "S"] },
                { name: "left", keys: ["ArrowLeft", "a", "A"] },
                { name: "right", keys: ["ArrowRight", "d", "D"] },
            ]}>
                <Canvas >
                    <PointerLockControls />
                    <Suspense>
                        <Physics gravity={[0, -9.8, 0]}>
                            <Debug />
                            <ambientLight color='white' intensity={0.3} />
                            <Player />
                            <Orb />
                            <Floor />
                        </Physics>
                    </Suspense>
                </Canvas>
            </KeyboardControls>
        </div >
    )
}

export default App
