import { InputSwitch } from "primereact/inputswitch";
import { useState } from "react";

export default function App() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="h-screen w-full bg-black">
      <p className="text-center font-bold text-white">Test tailwind CSS</p>
      <InputSwitch
        color="green-500"
        checked={checked}
        onChange={(e) => setChecked(e.value)}
      />
    </div>
  );
}
