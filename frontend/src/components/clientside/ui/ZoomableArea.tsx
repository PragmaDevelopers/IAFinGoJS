import React, { ReactElement, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';

interface ZoomableAreaProps {
    isDragging: boolean,
    children: React.ReactNode
}

const ZoomableArea: React.FC<ZoomableAreaProps> = ({ isDragging,children }) => {
    return (
        <TransformWrapper 
            disabled={isDragging}
            alignmentAnimation={{ disabled: true }}
            limitToBounds={true}
            centerZoomedOut={false}
            minScale={0.8}
            maxScale={3}
        >
            {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                    <div className="mb-4 flex space-x-4">
                        <Button onClick={() => zoomIn()}>Zoom In</Button>
                        <Button onClick={() => zoomOut()}>Zoom Out</Button>
                        <Button onClick={() => resetTransform()}>Reset</Button>
                    </div>
                    <TransformComponent wrapperStyle={{ width: "100%", height: 600, backgroundColor: "lightgrey" }}>
                        <div className="w-full p-4 border border-gray-300">
                            {children}
                        </div>
                    </TransformComponent>
                </>
            )}
        </TransformWrapper>
    );
};

export default ZoomableArea;