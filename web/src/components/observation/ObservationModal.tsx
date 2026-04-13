"use client";

import React, { useState } from "react";
import { BigButton } from "@/components/ui/BigButton";
import { Card } from "@/components/ui/Card";
import { Camera, ThumbsUp, ThumbsDown, X } from "lucide-react";
import { useRedMode } from "@/context/RedModeContext";

interface ObservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    predictedVisibility: string;
}

export function ObservationModal({ isOpen, onClose, predictedVisibility }: ObservationModalProps) {
    const { isRedMode } = useRedMode();
    const [step, setStep] = useState<"SELECT" | "DETAILS" | "THANKS">("SELECT");
    const [observation, setObservation] = useState<"SEEN" | "NOT_SEEN" | null>(null);

    if (!isOpen) return null;

    const handleSelect = (choice: "SEEN" | "NOT_SEEN") => {
        setObservation(choice);
        setStep("DETAILS");
    };

    const handleSubmit = () => {
        // Here we would send data to backend:
        // { 
        //   timestamp: new Date(),
        //   location: currentLoc,
        //   predicted: predictedVisibility,
        //   observed: observation,
        //   ...
        // }
        setStep("THANKS");
        setTimeout(() => {
            onClose();
            setStep("SELECT");
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-700 relative flex flex-col gap-6 animate-in slide-in-from-bottom-10 red-mode:border-aurora-red">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                {step === "SELECT" && (
                    <>
                        <h3 className="text-2xl font-bold text-center">Do you see Aurora?</h3>
                        <p className="text-center text-zinc-400 -mt-4">
                            Help us calibrate the prediction.
                            <br />
                            <span className="text-xs opacity-50">Current prediction: {predictedVisibility}</span>
                        </p>

                        <div className="flex flex-col gap-4">
                            <BigButton
                                variant="primary"
                                onClick={() => handleSelect("SEEN")}
                                className="col-span-1 h-20 text-xl flex gap-3"
                            >
                                <ThumbsUp className="w-6 h-6" /> YES, I SEE IT
                            </BigButton>
                            <BigButton
                                variant="secondary"
                                onClick={() => handleSelect("NOT_SEEN")}
                                className="col-span-1 h-20 text-xl flex gap-3"
                            >
                                <ThumbsDown className="w-6 h-6" /> NO, ONLY DARKNESS
                            </BigButton>
                        </div>
                    </>
                )}

                {step === "DETAILS" && (
                    <>
                        <h3 className="text-2xl font-bold text-center">
                            {observation === "SEEN" ? "Awesome!" : "Got it."}
                        </h3>

                        {observation === "SEEN" && (
                            <div className="bg-zinc-800 p-4 rounded-xl flex flex-col items-center gap-2 border border-dashed border-zinc-600">
                                <Camera className="w-8 h-8 opacity-50" />
                                <span className="text-sm opacity-50">Add Photo (Optional)</span>
                            </div>
                        )}

                        <BigButton variant="primary" onClick={handleSubmit} fullWidth>
                            SUBMIT REPORT
                        </BigButton>
                    </>
                )}

                {step === "THANKS" && (
                    <div className="py-8 text-center flex flex-col items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isRedMode ? 'bg-aurora-red text-black' : 'bg-green-500 text-white'}`}>
                            <ThumbsUp className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold">Thanks!</h3>
                        <p className="text-zinc-400">Your report helps 200+ hunters nearby.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
