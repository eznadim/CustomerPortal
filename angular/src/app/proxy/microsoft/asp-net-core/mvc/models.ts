
export interface ActionResult {
}

export interface ActionResult<TValue> {
  result: ActionResult;
  value: TValue;
}
