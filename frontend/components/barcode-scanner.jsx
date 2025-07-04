"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, X, Scan } from "lucide-react"

export default function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)
  const [quagga, setQuagga] = useState(null)

  useEffect(() => {
    // Dynamically import Quagga
    const loadQuagga = async () => {
      try {
        const QuaggaModule = await import("quagga")
        setQuagga(QuaggaModule.default)
      } catch (err) {
        console.error("Failed to load Quagga:", err)
        setError("Failed to load barcode scanner. Please try again.")
      }
    }

    loadQuagga()
  }, [])

  useEffect(() => {
    if (quagga && isScanning && scannerRef.current) {
      startScanner()
    }

    return () => {
      if (quagga && quagga.initialized) {
        quagga.stop()
      }
    }
  }, [quagga, isScanning])

  const startScanner = () => {
    if (!quagga) return

    quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment",
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: 2,
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
          ],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Quagga initialization failed:", err)
          setError("Camera access denied or not available. Please check your camera permissions.")
          return
        }

        quagga.start()

        quagga.onDetected((data) => {
          const code = data.codeResult.code
          console.log("Barcode detected:", code)
          onScan(code)
          stopScanner()
        })
      },
    )
  }

  const stopScanner = () => {
    if (quagga && quagga.initialized) {
      quagga.stop()
    }
    setIsScanning(false)
  }

  const handleStartScan = () => {
    setError(null)
    setIsScanning(true)
  }

  const handleStopScan = () => {
    stopScanner()
    onClose()
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <X className="h-5 w-5" />
            Scanner Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2">
            <Button onClick={() => setError(null)} variant="outline">
              Try Again
            </Button>
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          Barcode Scanner
        </CardTitle>
        <CardDescription className="text-blue-100">Point your camera at a barcode to scan it</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {!isScanning ? (
            <div className="text-center">
              <div className="mb-4">
                <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Ready to scan barcodes</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleStartScan} className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div
                ref={scannerRef}
                className="w-full h-64 bg-black rounded-lg overflow-hidden mb-4"
                style={{ position: "relative" }}
              />
              <div className="flex gap-2 justify-center">
                <Button onClick={handleStopScan} variant="destructive">
                  <X className="h-4 w-4 mr-2" />
                  Stop Scanning
                </Button>
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">Position the barcode within the camera view</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
