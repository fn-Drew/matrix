import './App.css'
import { Canvas, useFrame, useThree, } from '@react-three/fiber'
import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import React, { Suspense, useRef, useEffect } from 'react'
import { Physics, RigidBody, RapierRigidBody, CapsuleCollider, Debug } from '@react-three/rapier'
import { PerspectiveCamera } from 'three'


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

    useFrame((state) => {

        if (rigidBody.current) {
            let playerPosition = rigidBody.current.translation()
            state.camera.position.set(playerPosition.x, playerPosition.y, playerPosition.z)
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
            <Canvas >
                <PointerLockControls />
                <Suspense>
                    <Physics gravity={[0, -9.8, 0]}>
                        <Debug />
                        <ambientLight color='white' intensity={0.3} />
                        <Player />
                        <Floor />
                    </Physics>
                </Suspense>
            </Canvas>
        </div >
    )
}

export default App
