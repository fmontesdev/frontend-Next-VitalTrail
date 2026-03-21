'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMapEvents, useMap } from 'react-leaflet';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

// ─── Sub-componentes reutilizables (para usar dentro de MapContainer) ──────────

/**
 * Persiste el center y zoom actuales del mapa para transferirlos entre
 * la instancia colapsada y la expandida (portal).
 * Debe montarse dentro de un <MapContainer>.
 */
export function MapStateTracker({
    onCenter,
    onZoom,
}: {
    onCenter: (c: [number, number]) => void;
    onZoom: (z: number) => void;
}) {
    useMapEvents({
        moveend(e) {
            const c = e.target.getCenter();
            onCenter([c.lat, c.lng]);
        },
        zoomend(e) {
            onZoom(e.target.getZoom());
        },
    });
    return null;
}

/**
 * Notifica a Leaflet que el contenedor cambió de tamaño tras montar el portal.
 * Debe montarse dentro del <MapContainer> expandido.
 */
export function MapResizer() {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 50);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
}

// ─── Interfaz pública de ExpandableMap ───────────────────────────────────────

export interface IExpandableMapProps {
    /** MapContainer (u otro nodo) para la vista colapsada */
    collapsed: React.ReactNode;
    /** MapContainer (u otro nodo) para la vista expandida, height/width 100% */
    expanded: React.ReactNode;
    /**
     * Offset en px desde el top de la ventana para el overlay expandido.
     * Por defecto: 52 (altura visual del Header).
     */
    headerOffset?: number;
    /**
     * Render prop para personalizar el botón de expandir.
     * Recibe `onExpand` como callback.
     * Si no se provee, se usa el botón por defecto (ArrowsPointingOutIcon).
     */
    expandTrigger?: (onExpand: () => void) => React.ReactNode;
    /**
     * Render prop para personalizar el botón de contraer.
     * Recibe `onShrink` como callback.
     * Si no se provee, se usa el botón por defecto (ArrowsPointingInIcon).
     */
    shrinkTrigger?: (onShrink: () => void) => React.ReactNode;
    /**
     * Clases CSS para el wrapper externo (por defecto: 'relative w-full h-full').
     * Útil para definir altura fija, bordes, etc. (p.ej. Step4Map).
     */
    className?: string;
}

// ─── Botones por defecto ──────────────────────────────────────────────────────

function DefaultExpandButton({ onExpand }: { onExpand: () => void }) {
    return (
        <div className="absolute top-3 right-3 z-[9999] pointer-events-none">
            <button
                type="button"
                onClick={onExpand}
                title="Ampliar mapa"
                className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition-colors pointer-events-auto"
            >
                <ArrowsPointingOutIcon className="w-4 h-4" />
            </button>
        </div>
    );
}

function DefaultShrinkButton({ onShrink }: { onShrink: () => void }) {
    return (
        <div className="absolute top-3 right-3 z-[9999] pointer-events-none">
            <button
                type="button"
                onClick={onShrink}
                title="Contraer mapa"
                className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition-colors pointer-events-auto"
            >
                <ArrowsPointingInIcon className="w-4 h-4" />
            </button>
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * Encapsula el patrón expand/shrink de mapas:
 * - Estado `isExpanded` con scroll lock y Escape key
 * - Portal en `document.body` para escapar containing blocks de transforms
 * - Botones de expand/shrink por defecto, sobreescribibles via render props
 *
 * El collapsed map **siempre permanece en el DOM** (display gestionado por CSS),
 * lo que preserva el estado interno de Leaflet sin re-mounts.
 *
 * Uso básico:
 * ```tsx
 * <ExpandableMap
 *   collapsed={<MapContainer ...><MapStateTracker .../></MapContainer>}
 *   expanded={<MapContainer ...><MapResizer /><MapStateTracker .../></MapContainer>}
 * />
 * ```
 */
export default function ExpandableMap({
    collapsed,
    expanded,
    headerOffset = 52,
    expandTrigger,
    shrinkTrigger,
    className,
}: IExpandableMapProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

    // SSR-safe: createPortal solo puede llamarse en el cliente
    useEffect(() => { setMounted(true); }, []);

    // Bloquea el scroll del body mientras el mapa está en overlay
    useEffect(() => {
        document.body.style.overflow = isExpanded ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isExpanded]);

    // Escape key para cerrar el overlay
    useEffect(() => {
        if (!isExpanded) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsExpanded(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isExpanded]);

    const handleExpand = () => setIsExpanded(true);
    const handleShrink = () => setIsExpanded(false);

    // Botón de expandir: render prop o por defecto
    const expandButton = expandTrigger
        ? expandTrigger(handleExpand)
        : <DefaultExpandButton onExpand={handleExpand} />;

    // Botón de contraer: render prop o por defecto
    const shrinkButton = shrinkTrigger
        ? shrinkTrigger(handleShrink)
        : <DefaultShrinkButton onShrink={handleShrink} />;

    // Overlay expandido — portal en document.body
    const expandedOverlay = (
        <div
            style={{
                position: 'fixed',
                top: headerOffset,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9998,
                backgroundColor: 'white',
            }}
        >
            {shrinkButton}
            {expanded}
        </div>
    );

    return (
        <div className={className ?? 'relative w-full h-full'}>
            {/* Botón expandir — oculto mientras el overlay está activo */}
            {!isExpanded && expandButton}

            {/* Mapa colapsado — siempre en el DOM para preservar el estado de Leaflet */}
            {collapsed}

            {/* Portal del overlay expandido — renderizado directamente en document.body */}
            {isExpanded && mounted && createPortal(expandedOverlay, document.body)}
        </div>
    );
}
