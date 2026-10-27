declare module 'easystarjs' {
  export interface EasyStarInstance {
    setGrid(grid: number[][]): void;
    setAcceptableTiles(tiles: number[]): void;
    setIterationsPerCalculation(iterations: number): void;
    enableSync(): void;
    findPath(
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      callback: (path: { x: number; y: number }[] | null) => void,
    ): void;
    calculate(): void;
  }
  const EasyStar: { js: new () => EasyStarInstance };
  export default EasyStar;
}
