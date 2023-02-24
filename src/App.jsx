import './App.css'
import { Canvas, } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Physics, RigidBody } from '@react-three/rapier'


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

    return (
        <RigidBody>
            <mesh >
                <sphereGeometry />
                <meshStandardMaterial color='orange' />
            </mesh>
        </RigidBody>
    )

}

function App() {

    return (
        <div id="canvas-container">
            <Canvas >
                <Suspense>
                    <Physics gravity={[0, -9.8, 0]}>
                        <PointerLockControls />
                        <ambientLight color='white' intensity={0.3} />
                        <Player />
                        <Floor />
                    </Physics>
                </Suspense>
            </Canvas>
        </div>
    )
}

export default App
