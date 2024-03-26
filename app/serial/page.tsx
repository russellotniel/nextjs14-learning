'use client';

import React, { useState } from 'react';

export default function SerialPage() {
  const [device, setDevice] = useState<SerialPort | null>(null);
  const [data, setData] = useState<string>('');

  console.log(device);
  console.log(data);

  const connectSerial = async () => {
    if ('serial' in navigator) {
      try {
        const port: SerialPort = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 }); // Adjust baudRate as needed

        setDevice(port);
        readData(port);
      } catch (err) {
        console.error('There was an error opening the serial port:', err);
      }
    } else {
      alert('Web Serial API not supported in this browser.');
    }
  };

  const readData = async (port: SerialPort) => {
    const reader = port.readable!.getReader();

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        // Assuming text data. For binary data, process the `value` as needed.
        const textDecoder = new TextDecoder();
        const text = textDecoder.decode(value);
        setData((prev) => prev + text);
      }
    } catch (err) {
      console.error('Error reading from serial port:', err);
    }
  };

  return (
    <div>
      <button onClick={connectSerial}>Connect to Serial Device</button>
      <div>
        <p>Data from device:</p>
        <pre>{data}</pre>
      </div>
    </div>
  );
}
