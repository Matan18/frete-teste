import React, { useEffect, useState } from 'react';

interface IInputProps {
  saveValue: (value: string) => void;
}

const Input: React.FC<IInputProps> = ({ saveValue }) => {
  const [value, setValue] = useState('Caixa lacrada com Bicycle Preto');
  useEffect(() => {
    saveValue(value)
  }, [value])
  return (
    <div>
      <input value={value} onChange={(e) => { setValue(e.target.value) }} />
    </div>
  )
}

export default Input;