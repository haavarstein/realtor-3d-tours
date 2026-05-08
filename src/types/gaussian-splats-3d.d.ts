declare module "@mkkellogg/gaussian-splats-3d" {
  export const SceneFormat: {
    Splat: 0;
    KSplat: 1;
    Ply: 2;
    Spz: 3;
  };

  export interface ViewerOptions {
    rootElement?: HTMLElement;
    cameraUp?: [number, number, number];
    initialCameraPosition?: [number, number, number];
    initialCameraLookAt?: [number, number, number];
    selfDrivenMode?: boolean;
    useBuiltInControls?: boolean;
    sharedMemoryForWorkers?: boolean;
    gpuAcceleratedSort?: boolean;
    integerBasedSort?: boolean;
    halfPrecisionCovariancesOnGPU?: boolean;
    dynamicScene?: boolean;
    antialiased?: boolean;
    sphericalHarmonicsDegree?: 0 | 1 | 2;
    focalAdjustment?: number;
    logLevel?: number;
    sceneRevealMode?: number;
    renderMode?: number;
    webXRMode?: number;
    ignoreDevicePixelRatio?: boolean;
    [key: string]: unknown;
  }

  export interface AddSplatSceneOptions {
    format?: 0 | 1 | 2 | 3;
    splatAlphaRemovalThreshold?: number;
    showLoadingUI?: boolean;
    progressiveLoad?: boolean;
    position?: [number, number, number];
    rotation?: [number, number, number, number];
    scale?: [number, number, number];
    [key: string]: unknown;
  }

  export class Viewer {
    constructor(options?: ViewerOptions);
    addSplatScene(path: string, options?: AddSplatSceneOptions): Promise<void>;
    start(): void;
    stop(): void;
    dispose(): Promise<void>;
  }
}
