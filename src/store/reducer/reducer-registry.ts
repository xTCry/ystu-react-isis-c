import { Action, AnyAction, ReducersMapObject } from 'redux';

export class ReducerRegistry<S, A extends Action = AnyAction> {
    private reducers: ReducersMapObject<S, A>;
    private emitChange: any;

    constructor(initialReducers: ReducersMapObject<S, A>) {
        this.reducers = { ...initialReducers };
        this.emitChange = null;
    }

    register(newReducers: any) {
        this.reducers = { ...this.reducers, ...newReducers };
        if (this.emitChange != null) {
            this.emitChange(this.getReducers());
        }
    }

    public getReducers() {
        return { ...this.reducers };
    }

    public setChangeListener(listener: (r: any) => void) {
        if (this.emitChange != null) {
            throw new Error('Can only set the listener for a ReducerRegistry once.');
        }
        this.emitChange = listener;
    }
}
