import './App.css'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'

function App() {

    return (
        <div id="canvas-container">
            <Canvas>
                <perspectiveCamera makeDefault />
                <PointerLockControls fov />
                <ambientLight color='turquoise' intensity={0.2} />
                <mesh>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial />
                </mesh>
            </Canvas>
        </div>
    )
}

export default App
