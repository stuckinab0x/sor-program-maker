interface GridCell {
  row: number;
  value?: string | number;
  willRemove?: boolean;
}

export default interface GridColumn {
  col: string;
  cells: GridCell[];
}
