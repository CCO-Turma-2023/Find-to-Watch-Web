import { InputSwitch } from 'primereact/inputswitch';
import { useState } from 'react';

export default function App() {

  const [checked, setChecked] = useState(false)

  return (
    <div className="h-full bg-black">
      <p className="text-white font-bold text-center">Test tailwind CSS</p>
      <InputSwitch color='green-500' checked={checked} onChange={(e) => setChecked(e.value)} />
    </div>
  )
}
