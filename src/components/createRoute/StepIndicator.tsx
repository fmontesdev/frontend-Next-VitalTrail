'use client';

import { Fragment } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface IStepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepLabels: string[];
    onStepClick: (step: number) => void;
    completedSteps: number[];
}

export default function StepIndicator({
    currentStep,
    totalSteps,
    stepLabels,
    onStepClick,
    completedSteps,
}: IStepIndicatorProps) {
    // Pre-computar estilos para no duplicar lógica entre las dos filas
    const steps = Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isCompleted = completedSteps.includes(stepNumber);
        const isActive = stepNumber === currentStep;

        const circleClass = isCompleted
            ? 'bg-teal-600 text-white cursor-pointer hover:bg-teal-700 transition-colors'
            : isActive
                ? 'bg-lime-500 text-white cursor-default'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed';

        const lineClass = isCompleted ? 'bg-teal-400' : 'bg-gray-200';

        const labelClass = isCompleted
            ? 'text-teal-600 font-medium'
            : isActive
                ? 'text-lime-600 font-semibold'
                : 'text-gray-400';

        return { stepNumber, isCompleted, isActive, circleClass, lineClass, labelClass };
    });

    return (
        <div className="flex flex-col items-center w-full px-4 mb-5">

            {/*
             * Fila 1 — solo círculos + conectores.
             * items-center alinea perfectamente los conectores (h-0.5)
             * con el centro de los botones (h-9) sin interferencia de etiquetas.
             */}
            <div className="flex items-center justify-center">
                {steps.map(({ stepNumber, isCompleted, isActive, circleClass, lineClass }) => (
                    <Fragment key={stepNumber}>
                        <button
                            type="button"
                            onClick={() => isCompleted && onStepClick(stepNumber)}
                            disabled={!isCompleted}
                            className={`
                                w-9 h-9 rounded-full flex items-center justify-center
                                text-base font-bold select-none transition-colors flex-shrink-0
                                ${circleClass}
                            `}
                            aria-current={isActive ? 'step' : undefined}
                        >
                            {isCompleted ? (
                                <CheckIcon className="w-4 h-4 stroke-2" />
                            ) : (
                                stepNumber
                            )}
                        </button>

                        {/* Conector: mismo gap a izquierda y derecha gracias a mx-2 */}
                        {stepNumber < totalSteps && (
                            <div className={`h-0.5 w-10 sm:w-14 mx-2.5 flex-shrink-0 transition-colors ${lineClass}`} />
                        )}
                    </Fragment>
                ))}
            </div>

            {/*
             * Fila 2 — solo etiquetas.
             * Cada wrapper tiene w-9 (= ancho del círculo) y h-4 (= line-height de text-xs).
             * El span usa left-1/2 + -translate-x-1/2 para centrar cualquier texto
             * bajo su círculo, independientemente de la longitud de la etiqueta.
             * text-align:center con whitespace-nowrap NO funciona cuando el texto desborda
             * el contenedor (el overflow va solo hacia la derecha, no simétricamente).
             */}
            <div className="flex items-start justify-center mt-1">
                {steps.map(({ stepNumber, labelClass }) => (
                    <Fragment key={stepNumber}>
                        <div className="relative w-9 h-4 flex-shrink-0">
                            <span className={`absolute left-1/2 -translate-x-1/2 text-xs whitespace-nowrap ${labelClass}`}>
                                {stepLabels[stepNumber - 1] ?? `Paso ${stepNumber}`}
                            </span>
                        </div>

                        {/* Spacer: replica exactamente el ancho del conector para mantener alineación */}
                        {stepNumber < totalSteps && (
                            <div className="w-10 sm:w-14 mx-2.5 flex-shrink-0" />
                        )}
                    </Fragment>
                ))}
            </div>

        </div>
    );
}
