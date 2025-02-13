declare module 'redux-persist/lib/storage' {
    import { WebStorage } from 'redux-persist';
    const storage: WebStorage;
    export default storage;
  }
  declare module 'redux-persist/es/persistReducer' {
    import { Reducer } from 'redux';
    import { PersistConfig } from 'redux-persist';
    export default function persistReducer<S, A>(config: PersistConfig<S>, baseReducer: Reducer<S, A>): Reducer<S, A>;
  }
  
  declare module 'redux-persist/es/persistStore' {
    import { Store } from 'redux';
    import { Persistor } from 'redux-persist';
    export default function persistStore(store: Store): Persistor;
  }