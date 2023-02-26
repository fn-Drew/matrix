import './App.css'
import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d-compat'
import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, } from '@react-three/fiber'
import { PointerLockControls, useKeyboardControls, KeyboardControls } from '@react-three/drei'
import { Physics, RigidBody, useRapier, CapsuleCollider } from '@react-three/rapier'


function Orb() {
    return (
        <RigidBody restitution={2.5}>
            <mesh position={[5, 3, 0]} >
                <sphereGeometry />
                <meshBasicMaterial color='black' />
            </mesh >
        </RigidBody >
    )
}

function Button() {
    const [buttonClicked, setButtonClicked] = useState()

    return (
        <RigidBody mass={30}>
            <mesh position={[-5, 2, 0]} onClick={() => setButtonClicked(!buttonClicked)}>
                <boxGeometry />
                <meshBasicMaterial color='black' />
            </mesh >
            <mesh position={[-5, 2.5, 0]}>
                <boxGeometry args={[.3, .3, .3]} />
                <meshBasicMaterial color={buttonClicked ? 'green' : 'red'} />
            </mesh >
        </RigidBody >
    )
}

const roomSize = 200
function Room() {
    // TODO refactor into function 
    // floor, south wall, north wall, east wall, west wall 
    return (
        <RigidBody>
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[roomSize, roomSize]} />
                <meshStandardMaterial color='white' />
            </mesh >

            <mesh position={[0, roomSize / 2, roomSize / 2]} rotation={[-Math.PI / 1, 0, 0]}>
                <planeGeometry args={[roomSize, roomSize]} />
                <meshStandardMaterial color='white' />
            </mesh >

            <mesh position={[0, roomSize / 2, -roomSize / 2]} >
                <planeGeometry args={[roomSize, roomSize]} />
                <meshStandardMaterial color='white' />
            </mesh >

            <mesh position={[roomSize / 2, roomSize / 2, 0]} rotation={[0, -Math.PI / 2, 0]} >
                <planeGeometry args={[roomSize, roomSize]} />
                <meshStandardMaterial color='white' />
            </mesh >

            <mesh position={[-roomSize / 2, roomSize / 2, 0]} rotation={[0, Math.PI / 2, 0]} >
                <planeGeometry args={[roomSize, roomSize]} />
                <meshStandardMaterial color='white' />
            </mesh >
        </RigidBody >
    )
}

function Player() {
    const player = useRef()

    const SPEED = 5
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3()
    const sideVector = new THREE.Vector3()

    const rapier = useRapier()

    const [, get] = useKeyboardControls()

    useFrame((state) => {
        const { forward, backward, left, right, jump } = get()
        const velocity = player.current.linvel()

        // check if rigid body has been initialized, will crash otherwise
        if (player.current) {

            // lock camera to player rigid body
            let playerPosition = player.current.translation()
            state.camera.position.set(playerPosition.x, playerPosition.y, playerPosition.z)

            // strafing movement
            frontVector.set(0, 0, backward - forward)
            sideVector.set(left - right, 0, 0)
            direction.subVectors(frontVector, sideVector)
                .normalize()
                .multiplyScalar(SPEED)
                .applyEuler(state.camera.rotation)

            player.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z })


            // jumping
            const world = rapier.world.raw()
            const ray = world.castRay(new RAPIER.Ray(player.current.translation(), { x: 0, y: -1, z: 0 }))
            const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
            if (jump && grounded) player.current.setLinvel({ x: 0, y: 7.5, z: 0 })
        }
    })

    return (
        <RigidBody
            ref={player}
            onSleep={() => player.current.wakeUp()}
            colliders={false}
            mass={1}
            type="dynamic"
            position={[0, 5, 0]}
            enabledRotations={[false, false, false]}
        >
            <CapsuleCollider args={[.75, .5]} />
        </RigidBody>
    )
}

function App() {
    return (
        <div id="canvas-container">
            <KeyboardControls map={[
                { name: "forward", keys: ["ArrowUp", "f", "W"] },
                { name: "backward", keys: ["ArrowDown", "s", "S"] },
                { name: "left", keys: ["ArrowLeft", "r", "A"] },
                { name: "right", keys: ["ArrowRight", "t", "D"] },
                { name: "jump", keys: ["Space"] },
            ]}>
                <Canvas camera={{ fov: 90 }} >
                    <PointerLockControls />
                    <Suspense>
                        <Physics gravity={[0, -9.8, 0]}>
                            <ambientLight color='white' intensity={99} />
                            <Player />
                            <Orb />
                            <Button />
                            <Room />
                        </Physics>
                    </Suspense>
                </Canvas>
            </KeyboardControls>
        </div >
    )
}

export default App
